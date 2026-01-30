import { NextFunction, Request, Response } from "express";
import { ProvidersService } from "./providers.service";

const getAllProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProvidersService.getAllProviders();
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const getProviderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        if(!id) {
            throw new Error("Provider ID is required");
        }
        const result = await ProvidersService.getProviderById(id as string);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const createProviderProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        if(user.role !== "PROVIDER") {
            throw new Error("Forbidden! Only providers can create provider profiles.");
        }
        req.body.user_id = user.id;
        
        const result = await ProvidersService.createProviderProfile(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

export const ProvidersController = {
    getAllProviders,
    getProviderById,
    createProviderProfile,

};