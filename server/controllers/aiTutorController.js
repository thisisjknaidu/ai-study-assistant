import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askAITutor = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "You are a friendly AI study tutor. Explain concepts clearly and at an appropriate level for a student. Help the student learn rather than simply giving answers.",
      input: question,
    });

    res.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("AI Tutor error:", error);

    res.status(500).json({
      message: "Unable to get a response from AI Tutor",
    });
  }
};

export { askAITutor };
