import OpenAI from "openai";
import prisma from "../utils/prisma.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI quiz
const generateQuiz = async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
You are an educational quiz generator.

Create exactly 5 multiple-choice questions about the requested subject.

Requirements:
- Questions must genuinely relate to the subject.
- Use clear language appropriate for a student.
- Each question must have exactly 4 options.
- There must be exactly one correct answer.
- Do not include explanations.
- Return ONLY valid JSON.

Use this exact format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "answer": "Correct option"
    }
  ]
}
      `,
      input: `Generate a 5-question quiz about: ${subject}`,
    });

    let quiz;

    try {
      quiz = JSON.parse(response.output_text);
    } catch (error) {
      console.error("AI quiz JSON parsing error:", error);

      return res.status(500).json({
        message: "AI returned an invalid quiz format",
      });
    }

    if (
      !quiz.questions ||
      !Array.isArray(quiz.questions) ||
      quiz.questions.length !== 5
    ) {
      return res.status(500).json({
        message: "AI returned an invalid number of questions",
      });
    }

    res.json({
      subject,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("Generate quiz error:", error);

    res.status(500).json({
      message: error?.message || "Unable to generate the quiz",
    });
  }
};

// Save quiz result
const saveQuizResult = async (req, res) => {
  try {
    const { score, totalQuestions, subject } = req.body;

    // Validate required fields
    if (
      typeof score !== "number" ||
      typeof totalQuestions !== "number" ||
      !subject ||
      !subject.trim()
    ) {
      return res.status(400).json({
        message: "Score, total questions and subject are required",
      });
    }

    // Validate score
    if (totalQuestions <= 0 || score < 0 || score > totalQuestions) {
      return res.status(400).json({
        message: "Invalid quiz result",
      });
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    const result = await prisma.quizResult.create({
      data: {
        score,
        totalQuestions,
        percentage,
        subject: subject.trim(),
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Quiz result saved successfully",
      result,
    });
  } catch (error) {
    console.error("Save quiz result error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get quiz results
const getQuizResults = async (req, res) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      results,
    });
  } catch (error) {
    console.error("Get quiz results error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get quiz statistics
const getQuizStats = async (req, res) => {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId: req.user.userId,
      },
      select: {
        percentage: true,
      },
    });

    const attempts = results.length;

    const bestScore =
      attempts > 0
        ? Math.max(...results.map((result) => result.percentage))
        : 0;

    const averageScore =
      attempts > 0
        ? Math.round(
            results.reduce((total, result) => total + result.percentage, 0) /
              attempts,
          )
        : 0;

    res.json({
      attempts,
      bestScore,
      averageScore,
    });
  } catch (error) {
    console.error("Get quiz stats error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
// Get subject-wise quiz statistics
const getSubjectQuizStats = async (req, res) => {
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
    });

    const subjectMap = {};

    results.forEach((result) => {
      const subject = result.subject;

      if (!subject) {
        return;
      }

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          attempts: 0,
          bestScore: 0,
          totalScore: 0,
        };
      }

      subjectMap[subject].attempts += 1;

      subjectMap[subject].bestScore = Math.max(
        subjectMap[subject].bestScore,
        result.percentage,
      );

      subjectMap[subject].totalScore += result.percentage;
    });

    const stats = Object.values(subjectMap).map((item) => ({
      subject: item.subject,
      attempts: item.attempts,
      bestScore: item.bestScore,
      averageScore: Math.round(item.totalScore / item.attempts),
    }));

    res.json({
      stats,
    });
  } catch (error) {
    console.error("Get subject quiz stats error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  generateQuiz,
  saveQuizResult,
  getQuizResults,
  getQuizStats,
  getSubjectQuizStats,
};
