import { MealsUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createMeal = async (data: MealsUncheckedCreateInput) => {
    return await prisma.meals.create({
        data,
    })
}

export const MealsService = {
    createMeal,
};