import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { OrdersController } from "./orders.controller";

const router = Router();

router.post("/", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), OrdersController.createOrder);
router.get("/", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), OrdersController.getOrder);
router.get("/provider", logger, auth(UserRole.PROVIDER), OrdersController.getProviderOrders);
router.patch("/:order_id/cancel", logger, auth(UserRole.CUSTOMER, UserRole.PROVIDER), OrdersController.cancelOrder);
router.get("/:order_id", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), OrdersController.getOrderNyId);


export const ordersRoutes: Router = router;