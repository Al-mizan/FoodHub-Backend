import { CategoriesUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createCategories = (data: CategoriesUncheckedCreateInput) => {
    return prisma.categories.create({
        data,
    });
}

export const CategoriesService = {
    createCategories,
    
};