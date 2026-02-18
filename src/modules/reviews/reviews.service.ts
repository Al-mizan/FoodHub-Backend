import { prisma } from "../../lib/prisma";

const createReview = async (
    userId: string,
    data: { meal_id: string; order_id: string; rating: number; comment?: string },
) => {
    return await prisma.$transaction(async (ts) => {
        // 1. Verify order belongs to user and is DELIVERED
        const order = await ts.orders.findFirstOrThrow({
            where: { id: data.order_id, user_id: userId },
        });
        if (order.status !== "DELIVERED") {
            throw new Error("You can only review meals from delivered orders.");
        }

        // 2. Verify meal is part of the order
        const orderItem = await ts.orderItems.findFirst({
            where: { order_id: data.order_id, meal_id: data.meal_id },
        });
        if (!orderItem) {
            throw new Error("This meal is not part of this order.");
        }

        // 3. Prevent duplicate reviews
        const existing = await ts.reviews.findFirst({
            where: {
                user_id: userId,
                meal_id: data.meal_id,
                order_id: data.order_id,
            },
        });
        if (existing) {
            throw new Error("You have already reviewed this meal for this order.");
        }

        // 4. Create review
        const review = await ts.reviews.create({
            data: {
                user_id: userId,
                meal_id: data.meal_id,
                order_id: data.order_id,
                rating: data.rating,
                comment: data.comment ?? null,
            },
        });

        // 5. Update meal rating aggregates
        await ts.meals.update({
            where: { id: data.meal_id },
            data: {
                rating_sum: { increment: data.rating },
                rating_count: { increment: 1 },
            },
        });

        return review;
    });
};

const getReviewsByMeal = async (mealId: string) => {
    return await prisma.reviews.findMany({
        where: { meal_id: mealId },
        include: {
            user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { created_at: "desc" },
    });
};

const getReviewsByOrder = async (orderId: string) => {
    return await prisma.reviews.findMany({
        where: { order_id: orderId },
        include: {
            user: { select: { id: true, name: true, image: true } },
            meal: { select: { id: true, name: true, image_url: true } },
        },
        orderBy: { created_at: "desc" },
    });
};

export const ReviewsService = {
    createReview,
    getReviewsByMeal,
    getReviewsByOrder,
};
