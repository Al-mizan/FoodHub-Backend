import { CartsUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";


const createCart = async (data: CartsUncheckedCreateInput)=> {
    return await prisma.carts.create({
        data,
    });
}

export const CartsService = {
    createCart,
    
};