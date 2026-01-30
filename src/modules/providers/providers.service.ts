import { ProviderProfilesUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import parseTimeString from "../../helper/parseTimeString";
import { prisma } from "../../lib/prisma";

// pagination, filtering, etc. can be added later
const getAllProviders = async () => {
    return await prisma.user.findMany({
        where: {
            role: 'PROVIDER',
        }
    });
}

const getProviderById = async (providerId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: {
            id: providerId,
        },
        include: {
            providerProfile: true,
        }
    });
}

const createProviderProfile = async (data: ProviderProfilesUncheckedCreateInput) => {
    if (!data.user_id) throw new Error("User ID is required to create provider profile.");

    const opening_time = typeof data.opening_time === 'string'
        ? parseTimeString(data.opening_time)
        : data.opening_time;
    const closing_time = typeof data.closing_time === 'string'
        ? parseTimeString(data.closing_time)
        : data.closing_time;

    return await prisma.providerProfiles.create({
        data: {
            ...data,
            opening_time,
            closing_time,
        },
    });
};


export const ProvidersService = {
    getAllProviders,
    getProviderById,
    createProviderProfile,
};