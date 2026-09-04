import express from "express";

import {
  createStudyTask,
  getStudyTasks,
  updateStudyTask,
  deleteStudyTask,
} from "../controllers/studyPlanController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createStudyTask);
router.get("/", getStudyTasks);
router.patch("/:id", updateStudyTask);
router.delete("/:id", deleteStudyTask);

export default router;
