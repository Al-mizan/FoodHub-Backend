import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { CategoriesController } from "./categories.controller";

const router = Router();

router.post("/", logger, auth(UserRole.ADMIN, UserRole.PROVIDER), CategoriesController.createCategories);


export const CategoriesRoutes: Router = router;