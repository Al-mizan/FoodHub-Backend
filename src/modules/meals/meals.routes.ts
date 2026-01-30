import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { MealsController } from "./meals.controller";

const router = Router();


router.post("/", logger, auth(UserRole.PROVIDER), MealsController.createMeal);
// router.get("/", logger, );


export const mealsRoutes: Router = router;