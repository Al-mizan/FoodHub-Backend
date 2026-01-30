import { NextFunction, Request, Response } from "express";
import { MealsService } from "./meals.service";

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if(!user) {
            throw new Error("You are Unauthorized!");
        }
        if(user.role !== "PROVIDER") {
            throw new Error("Forbidden! You don't have access to create a meal.");
        }
        const result = await MealsService.createMeal(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};


export const MealsController = {
    createMeal,
};