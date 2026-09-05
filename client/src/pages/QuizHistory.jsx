import API_URL from "../config";
import { useEffect, useState } from "react";

function QuizHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_URL}/api/quiz/results`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load quiz history");
        }

        setResults(data.results || []);
      } catch (error) {
        console.error("Quiz history error:", error);
        setError(error.message || "Unable to load quiz history.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-indigo-600 font-semibold">
          Quiz Performance
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-2">Quiz History</h1>

        <p className="text-slate-500 mt-2">
          Review your previous quiz attempts and scores.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-slate-500">Loading quiz history...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No quiz attempts yet
          </h2>

          <p className="text-slate-500 mt-2">
            Complete an AI quiz to see your results here.
          </p>

          <a
            href="/quiz"
            className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Take a Quiz
          </a>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Subject
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Score
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Percentage
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
                  >
                    {/* Subject */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">
                        {result.subject || "—"}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {result.score}/{result.totalQuestions}
                      </span>
                    </td>

                    {/* Percentage */}
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          result.percentage >= 80
                            ? "text-green-600"
                            : result.percentage >= 50
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {result.percentage}%
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizHistory;


