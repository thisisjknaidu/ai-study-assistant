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

        const response = await fetch(`${API_URL}/api/quiz/stats/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <div className="w-full max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <p className="text-sm text-indigo-600 font-semibold">
          Performance Analytics
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 break-words">
          Subject Statistics
        </h1>

        <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
          Track your quiz performance across different subjects.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
          <p className="text-red-600 text-sm sm:text-base break-words">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 text-center">
          <p className="text-slate-500 text-sm sm:text-base">
            Loading statistics...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && stats.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-10 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            No statistics yet
          </h2>

          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
            Complete some quizzes to see your subject performance.
          </p>
        </div>
      )}

      {/* Statistics */}
      {!loading && !error && stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((item) => (
            <div
              key={item.subject}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-w-0"
            >
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                {item.subject}
              </h2>

              <div className="mt-5 sm:mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 text-sm sm:text-base">
                    Attempts
                  </span>

                  <span className="font-semibold text-slate-800 whitespace-nowrap">
                    {item.attempts}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 text-sm sm:text-base">
                    Best Score
                  </span>

                  <span className="font-semibold text-green-600 whitespace-nowrap">
                    {item.bestScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500 text-sm sm:text-base">
                    Average Score
                  </span>

                  <span className="font-semibold text-indigo-600 whitespace-nowrap">
                    {item.averageScore}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5 sm:mt-6">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-2">
                  <span>Average performance</span>
                  <span className="whitespace-nowrap">
                    {item.averageScore}%
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
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
