import express from "express";

import { register, login, profile } from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);

router.get("/profile", protect, profile);

export default router;
