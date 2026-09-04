import express from "express";

import {
  createSubject,
  getSubjects,
  deleteSubject,
} from "../controllers/subjectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSubject);
router.get("/", getSubjects);
router.delete("/:id", deleteSubject);

export default router;
