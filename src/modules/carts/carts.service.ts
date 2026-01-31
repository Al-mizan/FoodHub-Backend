import { CartsUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CreateCartData } from "./carts.interface";


// meal theke percentage discount and provider id nite hobe
const createCart = async (user_id: string, data: CreateCartData) => {
    const { meal_id, quantity } = data;

    return await prisma.$transaction(async (ts) => {
        const meal = await ts.meals.findUniqueOrThrow({
            where: { id: meal_id },
            select: {
                provider_id: true,
                discount_percentage: true,
                discount_price: true,
                price: true,
            }
        })
        let unit_price = meal?.price as number;
        if (meal?.discount_percentage && meal.discount_percentage > 0) {
            unit_price -= meal.price * meal.discount_percentage / 100;
        }
        else if (meal?.discount_price && meal.discount_price > 0) {
            unit_price -= meal.discount_price;
        }
        const cartId = await ts.carts.findFirst({
            where: {
                user_id,
                provider_id: meal?.provider_id as string,
            },
            select: {
                id: true,
            }
        })
        const carts = await ts.carts.upsert({
            where: {
                id: cartId?.id as string,
            },
            update: {
                user_id,
                provider_id: meal?.provider_id as string,
                total_price: {
                    increment: unit_price * quantity,
                },
            },
            create: {
                user_id,
                provider_id: meal?.provider_id as string,
                total_price: unit_price * quantity,
            }
        })
        const cartItem = await ts.cartItems.create({
            data: {
                cart_id: carts.id,
                meal_id,
                quantity,
                unit_price,
                sub_total_amount: unit_price * quantity,
            }
        });
        return carts;
    });
}

export const CartsService = {
    createCart,

};