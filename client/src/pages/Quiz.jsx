import API_URL from "../config";
import { useEffect, useState } from "react";

function Quiz() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_URL}/api/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load subjects");
        }

        setSubjects(data.subjects || []);
      } catch (error) {
        console.error("Subjects error:", error);
        setQuizError("Unable to load your subjects.");
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Generate AI quiz
  const startQuiz = async () => {
    if (!selectedSubject) return;

    try {
      setQuestionsLoading(true);
      setQuizError("");
      setQuestions([]);
      setCurrentQuestion(0);
      setSelectedAnswer("");
      setScore(0);
      setShowResult(false);
      setSaveError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/quiz/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: selectedSubject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate quiz");
      }

      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error("No questions were generated.");
      }

      setQuestions(data.questions);
      setQuizStarted(true);
    } catch (error) {
      console.error("Generate quiz error:", error);

      setQuizError(error.message || "Unable to generate the quiz.");
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Select an answer
  const handleAnswer = (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);
  };

  // Move to next question
  const handleNext = async () => {
    if (!selectedAnswer) return;

    const question = questions[currentQuestion];

    const isCorrect = selectedAnswer === question.answer;

    const newScore = score + (isCorrect ? 1 : 0);

    // More questions remaining
    if (currentQuestion < questions.length - 1) {
      setScore(newScore);
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer("");
      return;
    }

    // Final question
    setScore(newScore);
    setShowResult(true);

    await saveQuizResult(newScore);
  };

  // Save quiz result
  const saveQuizResult = async (finalScore) => {
    try {
      setSaving(true);
      setSaveError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/quiz/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: finalScore,
          totalQuestions: questions.length,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save quiz result");
      }

      console.log("Quiz result saved successfully:", data);
    } catch (error) {
      console.error("Save quiz result error:", error);

      setSaveError("Quiz completed, but the result could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setSaving(false);
    setSaveError("");
    setQuizError("");
  };

  // Subject selection screen
  if (!quizStarted) {
    return (
      <div className="w-full max-w-3xl mx-auto overflow-hidden">
        <div className="mb-5 sm:mb-6">
          <p className="text-sm text-indigo-600 font-semibold">
            AI Quiz Generator
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 break-words">
            Choose a Subject
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
            The AI will generate questions based on your selected subject.
          </p>
        </div>

        {quizError && (
          <div className="mb-5 sm:mb-6 bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
            <p className="text-red-600 text-sm sm:text-base break-words">
              {quizError}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subject
          </label>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={subjectsLoading || questionsLoading}
            className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="">
              {subjectsLoading ? "Loading subjects..." : "Choose a subject"}
            </option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>

          {!subjectsLoading && subjects.length === 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
              <p className="text-sm text-amber-700">
                You don't have any subjects yet.
              </p>

              <a
                href="/subjects"
                className="inline-block mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Go to Subjects →
              </a>
            </div>
          )}

          <button
            onClick={startQuiz}
            disabled={
              !selectedSubject ||
              subjectsLoading ||
              questionsLoading ||
              subjects.length === 0
            }
            className="mt-5 sm:mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
          >
            {questionsLoading ? "Generating Quiz..." : "Generate Quiz"}
          </button>

          {questionsLoading && (
            <p className="text-center text-sm text-slate-500 mt-4 leading-relaxed break-words">
              AI is preparing questions for{" "}
              <span className="font-semibold">{selectedSubject}</span>
              ...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Safety check
  if (questions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            No Quiz Questions
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            We couldn't load questions for this subject.
          </p>

          <button
            onClick={restartQuiz}
            className="mt-5 sm:mt-6 w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="w-full max-w-3xl mx-auto overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 text-center">
          <p className="text-sm text-indigo-600 font-semibold break-words">
            {selectedSubject}
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
            Quiz Complete 🎉
          </h1>

          <p className="mt-4 text-slate-500">Your score</p>

          <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mt-2">
            {score}/{questions.length}
          </div>

          <p className="text-lg sm:text-xl font-semibold text-slate-700 mt-3">
            {percentage}%
          </p>

          {saving && (
            <p className="mt-4 text-sm text-slate-500">Saving your result...</p>
          )}

          {!saving && !saveError && (
            <p className="mt-4 text-sm text-green-600">
              Your result has been saved successfully.
            </p>
          )}

          {saveError && (
            <p className="mt-4 text-sm text-red-500 break-words">{saveError}</p>
          )}

          <button
            onClick={restartQuiz}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz screen
  const question = questions[currentQuestion];

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-indigo-600 font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </p>

          <p className="text-sm font-medium text-slate-500 break-words">
            {selectedSubject}
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
          AI Quiz
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 leading-relaxed break-words">
          {question.question}
        </h2>

        <div className="mt-5 sm:mt-6 space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;

            const isCorrect = option === question.answer;

            let buttonClass =
              "w-full text-left p-3 sm:p-4 rounded-xl border transition break-words leading-relaxed ";

            if (!selectedAnswer) {
              buttonClass +=
                "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
            } else if (isCorrect) {
              buttonClass += "border-green-500 bg-green-50 text-green-700";
            } else if (isSelected) {
              buttonClass += "border-red-500 bg-red-50 text-red-700";
            } else {
              buttonClass += "border-slate-200 bg-slate-50 text-slate-400";
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={buttonClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer || saving}
          className="mt-5 sm:mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
        >
          {currentQuestion === questions.length - 1
            ? saving
              ? "Saving Result..."
              : "Finish Quiz"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
