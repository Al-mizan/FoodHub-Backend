import { Router } from "express";
import logger from "../../middleware/logger";
import { ProvidersController } from "./providers.controller";

const router = Router();

router.get("/", logger, ProvidersController.getAllProviders);


export const providersRoutes: Router = router;