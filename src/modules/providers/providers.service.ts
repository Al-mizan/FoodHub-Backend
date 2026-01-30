import { prisma } from "../../lib/prisma";

const getAllProviders = async () => {
    return await prisma.user.findMany();
}

export const ProvidersService = {
    getAllProviders,
};