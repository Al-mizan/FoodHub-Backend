import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { ReviewsController } from "./reviews.controller";

const router = Router();

router.post("/", logger, auth(UserRole.CUSTOMER, UserRole.PROVIDER), ReviewsController.createReview);
router.get("/meal/:mealId", logger, ReviewsController.getReviewsByMeal);
router.get("/order/:orderId", logger, auth(UserRole.CUSTOMER, UserRole.PROVIDER), ReviewsController.getReviewsByOrder);

export const reviewsRoutes: Router = router;
