import { UserUncheckedUpdateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getUser = async () => {
    return await prisma.user.findMany({
        where: {
            role: {
                not: 'ADMIN',
            }
        },
    });
}

const updateUser = async (id: string, data: Partial<UserUncheckedUpdateInput>) => {
    return await prisma.user.update({
        where: { id },
        data,
    });
}

const getOrders = async () => {
    return await prisma.orders.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true, phone: true },
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    providerProfile: { select: { restaurant_name: true } },
                },
            },
            orderItems: {
                include: {
                    meal: {
                        select: { id: true, name: true, image_url: true },
                    },
                },
            },
        },
        orderBy: { created_at: "desc" },
    });
}

export const AdminService = {
    getUser,
    updateUser,
    getOrders,
};