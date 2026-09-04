import express from "express";

import {
  generateQuiz,
  saveQuizResult,
  getQuizResults,
  getQuizStats,
  getSubjectQuizStats,
} from "../controllers/quizController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// AI quiz generation
router.post("/generate", generateQuiz);

// Quiz results
router.post("/results", saveQuizResult);
router.get("/results", getQuizResults);
router.get("/stats", getQuizStats);
router.get("/stats/subjects", getSubjectQuizStats);

export default router;
