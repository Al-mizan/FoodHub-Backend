import { Router } from "express";
import logger from "../../middleware/logger";
import { ProvidersController } from "./providers.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";

const router = Router();

router.get("/", logger, ProvidersController.getAllProviders);
router.get("/:id", logger, ProvidersController.getProviderById);
router.post("/provider-profile", logger, auth(UserRole.PROVIDER), ProvidersController.createProviderProfile);


export const providersRoutes: Router = router;