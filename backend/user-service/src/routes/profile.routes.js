import express from "express";

import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfiles,
  searchProfiles
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/", createProfile);

router.get("/", getProfiles);

router.get("/search/skills", searchProfiles);

router.get("/:userId", getProfile);

router.put("/:userId", updateProfile);

router.delete("/:userId", deleteProfile);

export default router;
