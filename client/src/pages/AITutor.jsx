import API_URL from "../config";
import { useState } from "react";

function AITutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const currentQuestion = question.trim();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/ai-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            type: "error",
            text: data.message || "Unable to get a response from AI Tutor.",
          },
        ]);

        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          type: "ai",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error("AI Tutor request error:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          type: "error",
          text: "Unable to connect to the AI Tutor server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">
          🤖 AI Tutor
        </h1>

        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          Ask questions and get help understanding your studies.
        </p>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-lg sm:text-xl">
              🤖
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-sm sm:text-base">
                StudyAI Tutor
              </h2>

              <p className="text-xs text-slate-400">
                Your personal study assistant
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-[360px] sm:min-h-[420px] max-h-[520px] overflow-y-auto p-3 sm:p-6 bg-slate-50">
          {messages.length === 0 ? (
            <div className="min-h-[330px] sm:h-[360px] flex items-center justify-center">
              <div className="text-center w-full max-w-md">
                <div className="text-4xl sm:text-5xl mb-4">📚</div>

                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  What would you like to learn?
                </h3>

                <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed px-2">
                  Ask me about mathematics, science, programming, history, or
                  any other subject you're studying.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 sm:mt-6">
                  <button
                    onClick={() =>
                      setQuestion("Explain photosynthesis in simple terms.")
                    }
                    className="w-full text-left bg-white border rounded-lg p-3 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition break-words"
                  >
                    🌱 Explain photosynthesis
                  </button>

                  <button
                    onClick={() =>
                      setQuestion("Explain Newton's laws of motion.")
                    }
                    className="w-full text-left bg-white border rounded-lg p-3 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition break-words"
                  >
                    ⚙️ Explain Newton's laws
                  </button>

                  <button
                    onClick={() =>
                      setQuestion("Help me understand quadratic equations.")
                    }
                    className="w-full text-left bg-white border rounded-lg p-3 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition break-words"
                  >
                    📐 Help with quadratics
                  </button>

                  <button
                    onClick={() => setQuestion("Explain what an algorithm is.")}
                    className="w-full text-left bg-white border rounded-lg p-3 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition break-words"
                  >
                    💻 What is an algorithm?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : message.type === "error"
                          ? "bg-red-50 border border-red-200 text-red-700"
                          : "bg-white border text-slate-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-white p-3 sm:p-5">
          <form
            onSubmit={handleAsk}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your study question..."
              disabled={loading}
              className="w-full flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 text-sm sm:text-base"
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 sm:py-0 rounded-xl transition"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            AI responses are for learning assistance. Always review important
            information with your teacher or trusted study materials.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AITutor;
