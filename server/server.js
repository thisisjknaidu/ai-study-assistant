import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import aiTutorRoutes from "./routes/aiTutorRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import studyPlanRoutes from "./routes/studyPlanRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/study-plan", studyPlanRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Study Assistant API is running 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
