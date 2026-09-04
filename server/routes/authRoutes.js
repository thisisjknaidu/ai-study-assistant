import express from "express";

import { register, login } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../utils/prisma.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Current logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
