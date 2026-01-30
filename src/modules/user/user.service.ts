import { ProviderProfilesUncheckedCreateInput, UserUncheckedUpdateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getMe = async (id: string) => {
    return await prisma.user.findFirstOrThrow({
        where: { id },
    })
};

const updateMe = async (data: UserUncheckedUpdateInput) => {
    const id = data.id as string;
    if (!id) throw new Error("User ID is required for update.");
    return await prisma.user.update({
        where: { id },
        data,
    })
};

const createProviderProfile = async (data: ProviderProfilesUncheckedCreateInput) => {
    const id = data.id as string;
    if (!id) throw new Error("User ID is required to create provider profile.");

    return await prisma.providerProfiles.create({
        data: {
            ...data,
            user_id: id,
        },
    });
};

export const UserService = {
    getMe,
    updateMe,
    createProviderProfile,

};