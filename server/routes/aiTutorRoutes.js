import express from "express";

import { askAITutor } from "../controllers/aiTutorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", askAITutor);

export default router;
