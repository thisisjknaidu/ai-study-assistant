import API_URL from "../config";
import { useEffect, useState } from "react";

function QuizStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_URL}/api/quiz/stats/subjects`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load statistics");
        }

        setStats(data.stats || []);
      } catch (error) {
        console.error("Quiz stats error:", error);
        setError(error.message || "Unable to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-indigo-600 font-semibold">
          Performance Analytics
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          Subject Statistics
        </h1>

        <p className="text-slate-500 mt-2">
          Track your quiz performance across different subjects.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">Loading statistics...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && stats.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No statistics yet
          </h2>

          <p className="text-slate-500 mt-2">
            Complete some quizzes to see your subject performance.
          </p>
        </div>
      )}

      {/* Statistics */}
      {!loading && !error && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div
              key={item.subject}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-slate-800">
                {item.subject}
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Attempts</span>

                  <span className="font-semibold text-slate-800">
                    {item.attempts}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Best Score</span>

                  <span className="font-semibold text-green-600">
                    {item.bestScore}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Average Score</span>

                  <span className="font-semibold text-indigo-600">
                    {item.averageScore}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Average performance</span>
                  <span>{item.averageScore}%</span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${Math.min(item.averageScore, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizStats;



