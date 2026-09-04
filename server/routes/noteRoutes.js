import express from "express";

import {
  createNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

// Create note
router.post("/", createNote);

// Get current user's notes
router.get("/", getNotes);

// Delete note
router.delete("/:id", deleteNote);

export default router;
