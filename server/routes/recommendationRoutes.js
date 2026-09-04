import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../utils/prisma.js";
import OpenAI from "openai";

const router = express.Router();

router.use(authMiddleware);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =====================================================
// GET /api/recommendations
// =====================================================

router.get("/", async (req, res) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId: req.user.userId,
        subject: {
          not: null,
        },
      },
      select: {
        subject: true,
        percentage: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (results.length === 0) {
      return res.json({
        recommendations: [],
      });
    }

    const subjectMap = {};

    results.forEach((result) => {
      if (!result.subject) {
        return;
      }

      if (!subjectMap[result.subject]) {
        subjectMap[result.subject] = [];
      }

      subjectMap[result.subject].push(result.percentage);
    });

    const recommendations = Object.entries(subjectMap).map(
      ([subject, scores]) => {
        const average = Math.round(
          scores.reduce((total, score) => total + score, 0) / scores.length,
        );

        let priority = "Low";

        if (average < 50) {
          priority = "High";
        } else if (average < 75) {
          priority = "Medium";
        }

        return {
          subject,
          averageScore: average,
          attempts: scores.length,
          priority,
        };
      },
    );

    recommendations.sort((a, b) => a.averageScore - b.averageScore);

    res.json({
      recommendations,
    });
  } catch (error) {
    console.error("Recommendations error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================================
// Fallback Study Plan
// Used when OpenAI is unavailable
// =====================================================

function createFallbackStudyPlan(performance) {
  const sortedSubjects = [...performance].sort(
    (a, b) => a.averageScore - b.averageScore,
  );

  const days = [];

  const activitiesByPriority = {
    high: [
      "Review the basic concepts and definitions",
      "Practice 10 questions from this subject",
      "Review mistakes and write down difficult topics",
    ],

    medium: [
      "Review important concepts",
      "Practice 8 questions from this subject",
      "Revise mistakes from previous quizzes",
    ],

    low: [
      "Quickly review the main concepts",
      "Practice 5 questions from this subject",
      "Take a short revision quiz",
    ],
  };

  for (let i = 0; i < 7; i++) {
    const subject = sortedSubjects[i % sortedSubjects.length];

    let priority = "low";

    if (subject.averageScore < 50) {
      priority = "high";
    } else if (subject.averageScore < 75) {
      priority = "medium";
    }

    const activities = activitiesByPriority[priority];

    let focus = "Revision and practice";

    if (subject.averageScore < 50) {
      focus = "Strengthen weak concepts and improve accuracy";
    } else if (subject.averageScore < 75) {
      focus = "Improve understanding through revision and practice";
    } else {
      focus = "Maintain strong performance through regular practice";
    }

    days.push({
      day: i + 1,
      subject: subject.subject,
      focus,
      activities,
    });
  }

  return {
    title: "7-Day Personalized Study Plan",
    summary:
      "This plan focuses more on subjects with lower quiz scores while maintaining regular revision of stronger subjects.",
    days,
  };
}

// =====================================================
// POST /api/recommendations/study-plan
// =====================================================

router.post("/study-plan", async (req, res) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId: req.user.userId,
        subject: {
          not: null,
        },
      },
      select: {
        subject: true,
        percentage: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (results.length === 0) {
      return res.status(400).json({
        message:
          "Complete at least one subject quiz before generating a study plan.",
      });
    }

    // Group scores by subject
    const subjectMap = {};

    results.forEach((result) => {
      if (!result.subject) {
        return;
      }

      if (!subjectMap[result.subject]) {
        subjectMap[result.subject] = [];
      }

      subjectMap[result.subject].push(result.percentage);
    });

    // Calculate averages
    const performance = Object.entries(subjectMap).map(([subject, scores]) => {
      const average = Math.round(
        scores.reduce((total, score) => total + score, 0) / scores.length,
      );

      return {
        subject,
        averageScore: average,
        attempts: scores.length,
      };
    });

    // Weakest subjects first
    performance.sort((a, b) => a.averageScore - b.averageScore);

    // =================================================
    // Try OpenAI first
    // =================================================

    try {
      const prompt = `
You are an AI study planner.

Create a personalized study plan for a student based on their quiz performance.

Student quiz performance:

${JSON.stringify(performance, null, 2)}

Instructions:
- Focus more time on weaker subjects.
- Give practical and realistic study activities.
- Do not make the plan overwhelming.
- Create a 7-day study plan.
- Include the subject for each day.
- Include 2 or 3 study activities per day.
- Include revision and practice.
- Use simple language suitable for a student.
- Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "7-Day Personalized Study Plan",
  "summary": "Short summary of the student's study priorities",
  "days": [
    {
      "day": 1,
      "subject": "Subject name",
      "focus": "Main topic or goal",
      "activities": [
        "Activity 1",
        "Activity 2",
        "Activity 3"
      ]
    }
  ]
}

Return exactly 7 days.
`;

      const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
      });

      const text = response.output_text?.trim();

      if (!text) {
        throw new Error("AI did not return a study plan.");
      }

      const studyPlan = JSON.parse(text);

      return res.json({
        studyPlan,
        performance,
        source: "ai",
      });
    } catch (aiError) {
      // ===============================================
      // OpenAI failed
      // Use fallback instead
      // ===============================================

      console.warn("OpenAI unavailable. Using fallback study plan.");

      console.warn("OpenAI error:", aiError?.message);

      const fallbackPlan = createFallbackStudyPlan(performance);

      return res.json({
        studyPlan: fallbackPlan,
        performance,
        source: "fallback",
      });
    }
  } catch (error) {
    console.error("Study plan error:", error);

    res.status(500).json({
      message: "Failed to generate study plan.",
    });
  }
});

export default router;
