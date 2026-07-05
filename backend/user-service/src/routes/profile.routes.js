import express from "express";

import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfiles,
  searchProfiles,
  textSearchProfiles,
  filterProfiles,
} from "../controllers/profile.controller.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protect, createProfile);

router.get("/", getProfiles);

router.get("/search", textSearchProfiles);

router.get("/search/skills", searchProfiles);

router.get("/filter", filterProfiles);

router.get("/:userId", getProfile);

router.put("/:userId", updateProfile);

router.delete("/:userId", deleteProfile);

export default router;
