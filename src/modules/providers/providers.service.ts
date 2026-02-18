import {
    MealsUncheckedCreateInput,
    MealsWhereInput,
    ProviderProfilesUncheckedCreateInput,
    ProviderProfilesWhereInput,
} from "../../../prisma/generated/prisma/models";
import { OrderStatus, PaymentStatus } from "../../../prisma/generated/prisma/enums";
import parseTimeString from "../../helper/parseTimeString";
import { prisma } from "../../lib/prisma";
import { GetAllProvidersParams, GetProviderMealsParams, VALID_STATUS_TRANSITIONS } from "./providers.interface";

/*  PROVIDER SERVICES /**

 * Get all provider profiles with pagination, filtering & sorting
 */
const getAllProviders = async (query: GetAllProvidersParams) => {
    const { page, limit, skip, sortBy, sortOrder, searchTerm, isOpen } = query;

    const andConditions: ProviderProfilesWhereInput[] = [];

    // Search by restaurant name or address
    if (searchTerm) {
        andConditions.push({
            OR: [
                { restaurant_name: { contains: searchTerm, mode: "insensitive" } },
                { address: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }

    // Filter by open status
    if (isOpen !== undefined) {
        andConditions.push({ is_open: isOpen });
    }

    const where: ProviderProfilesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const [data, total] = await Promise.all([
        prisma.providerProfiles.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: { user: true },
        }),
        prisma.providerProfiles.count({ where }),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get a provider profile by ID
 */
const getProviderById = async (providerId: string) => {
    return await prisma.providerProfiles.findUniqueOrThrow({
        where: { id: providerId },
        include: {
            user: true,
        },
    });
};

/**
 * Create a new provider profile
 */
const createProviderProfile = async (data: ProviderProfilesUncheckedCreateInput) => {
    if (!data.user_id) {
        throw new Error("User ID is required to create provider profile.");
    }

    const opening_time = typeof data.opening_time === "string"
        ? parseTimeString(data.opening_time)
        : data.opening_time;

    const closing_time = typeof data.closing_time === "string"
        ? parseTimeString(data.closing_time)
        : data.closing_time;

    return await prisma.$transaction(async (ts) => {
        const existingProfile = await ts.providerProfiles.findUnique({
            where: { user_id: data.user_id as string },
        });
        if (existingProfile) {
            throw new Error("Provider profile already exists for this user.");
        }

        const profile = await ts.providerProfiles.create({
            data: { ...data, opening_time, closing_time },
        });

        // Upgrade user role from CUSTOMER to PROVIDER
        await ts.user.update({
            where: { id: data.user_id as string },
            data: { role: "PROVIDER" },
        });

        return profile;
    });
};

/* MEAL SERVICES /**

 * Get all meals for a specific provider with pagination, filtering & sorting
 */
const getMealsByProviderId = async (providerId: string, query: GetProviderMealsParams) => {
    const { page, limit, skip, sortBy, sortOrder, name, cuisine, price } = query;

    const andConditions: MealsWhereInput[] = [{ provider_id: providerId }];

    // Search by meal name
    if (name) {
        andConditions.push({
            name: { contains: name, mode: "insensitive" },
        });
    }

    // Filter by cuisine / category
    if (cuisine) {
        if (Array.isArray(cuisine)) {
            andConditions.push({ category: { name: { in: cuisine } } });
        } else {
            andConditions.push({ category: { name: cuisine } });
        }
    }

    // Filter by max price
    if (price !== undefined) {
        andConditions.push({ price: { lte: price } });
    }

    const where: MealsWhereInput = { AND: andConditions };

    const [meals, total] = await Promise.all([
        prisma.meals.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: true,
                user: {
                    include: {
                        providerProfile: {
                            select: {
                                restaurant_name: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.meals.count({ where }),
    ]);

    const data = meals.map((meal) => ({
        ...meal,
        restaurant_name: meal.user.providerProfile?.restaurant_name ?? null,
    }));

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Create a new meal
 */
const createMeal = async (data: MealsUncheckedCreateInput) => {
    if (!data.provider_id) {
        throw new Error("Provider ID is required to create a meal.");
    }

    return await prisma.meals.create({
        data,
    });
};

/**
 * Get a specific meal by provider and meal ID
 */
const getMealById = async (providerId: string, mealId: string) => {
    return await prisma.meals.findFirstOrThrow({
        where: {
            id: mealId,
            provider_id: providerId,
        },
    });
};

/**
 * Update a meal
 */
const updateMeal = async (
    providerId: string,
    mealId: string,
    data: Partial<MealsUncheckedCreateInput>
) => {
    // Verify meal belongs to provider
    await prisma.meals.findFirstOrThrow({
        where: {
            id: mealId,
            provider_id: providerId,
        },
    });

    return await prisma.meals.update({
        where: { id: mealId },
        data,
    });
};

/**
 * Delete a meal
 */
const deleteMeal = async (providerId: string, mealId: string) => {
    // Verify meal belongs to provider
    await prisma.meals.findFirstOrThrow({
        where: {
            id: mealId,
            provider_id: providerId,
        },
    });

    return await prisma.meals.delete({
        where: { id: mealId },
    });
};




const updateOrderStatus = async (
    orderId: string,
    providerId: string,
    data: { status?: OrderStatus; payment_status?: PaymentStatus }
) => {
    const order = await prisma.orders.findUniqueOrThrow({ where: { id: orderId } });

    // Verify the order belongs to this provider
    if (order.provider_id !== providerId) {
        throw new Error("You can only update orders for your restaurant.");
    }

    // Validate status transition
    if (data.status) {
        const allowed = VALID_STATUS_TRANSITIONS[order.status];
        if (!allowed || !allowed.includes(data.status)) {
            throw new Error(`Cannot transition from ${order.status} to ${data.status}`);
        }
    }

    const updateData: { status?: OrderStatus; payment_status?: PaymentStatus } = {};
    if (data.status) updateData.status = data.status;
    if (data.payment_status) updateData.payment_status = data.payment_status;

    return await prisma.orders.update({
        where: { id: orderId },
        data: updateData,
    });
};


export const ProvidersService = {
    // Provider
    getAllProviders,
    getProviderById,
    createProviderProfile,
    // Meals
    getMealsByProviderId,
    createMeal,
    getMealById,
    updateMeal,
    deleteMeal,
    // Orders
    updateOrderStatus,
};