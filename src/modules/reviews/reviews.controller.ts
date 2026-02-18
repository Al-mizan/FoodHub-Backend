import { NextFunction, Request, Response } from "express";
import { ReviewsService } from "./reviews.service";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        const { meal_id, order_id, rating, comment } = req.body;
        if (!meal_id || !order_id || rating === undefined) {
            throw new Error("meal_id, order_id, and rating are required.");
        }
        if (Number(rating) < 1 || Number(rating) > 5) {
            throw new Error("Rating must be between 1 and 5.");
        }

        const result = await ReviewsService.createReview(user.id, {
            meal_id,
            order_id,
            rating: Number(rating),
            comment,
        });
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const getReviewsByMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mealId } = req.params;
        if (!mealId) throw new Error("Meal ID is required");
        const result = await ReviewsService.getReviewsByMeal(mealId as string);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const getReviewsByOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        if (!orderId) throw new Error("Order ID is required");
        const result = await ReviewsService.getReviewsByOrder(orderId as string);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const ReviewsController = {
    createReview,
    getReviewsByMeal,
    getReviewsByOrder,
};
