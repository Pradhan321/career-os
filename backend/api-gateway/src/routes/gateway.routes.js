import express from "express";

import { gatewayProxy } from "../controllers/gateway.controller.js";
import { healthCheck } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/health", healthCheck);

router.all("/:service", gatewayProxy);

router.all("/:service/{*path}", gatewayProxy);

export default router;