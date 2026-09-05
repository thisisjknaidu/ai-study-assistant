import API_URL from "../config";
import { useEffect, useState } from "react";

function Dashboard() {
  const [notesCount, setNotesCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const [recentActivity, setRecentActivity] = useState([]);

  const [quizStats, setQuizStats] = useState({
    attempts: 0,
    bestScore: 0,
    averageScore: 0,
  });

  const [subjectStats, setSubjectStats] = useState([]);

  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          notesResponse,
          quizResponse,
          studyPlanResponse,
          subjectsResponse,
          subjectStatsResponse,
          recommendationsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/notes`, {
            headers,
          }),

          fetch(`${API_URL}/api/quiz/stats`, {
            headers,
          }),

          fetch(`${API_URL}/api/study-plan`, {
            headers,
          }),

          fetch(`${API_URL}/api/subjects`, {
            headers,
          }),

          fetch(`${API_URL}/api/quiz/stats/subjects`, {
            headers,
          }),

          fetch(`${API_URL}/api/recommendations`, {
            headers,
          }),
        ]);

        const notesData = await notesResponse.json();
        const quizData = await quizResponse.json();
        const studyPlanData = await studyPlanResponse.json();
        const subjectsData = await subjectsResponse.json();
        const subjectStatsData = await subjectStatsResponse.json();
        const recommendationsData = await recommendationsResponse.json();

        if (!notesResponse.ok) {
          throw new Error(notesData.message || "Failed to load notes");
        }

        if (!quizResponse.ok) {
          throw new Error(quizData.message || "Failed to load quiz stats");
        }

        if (!studyPlanResponse.ok) {
          throw new Error(studyPlanData.message || "Failed to load study plan");
        }

        if (!subjectsResponse.ok) {
          throw new Error(subjectsData.message || "Failed to load subjects");
        }

        if (!subjectStatsResponse.ok) {
          throw new Error(
            subjectStatsData.message || "Failed to load subject quiz stats",
          );
        }

        if (!recommendationsResponse.ok) {
          throw new Error(
            recommendationsData.message || "Failed to load recommendations",
          );
        }

        // --------------------------------
        // Notes count
        // --------------------------------

        setNotesCount(notesData.notes?.length || 0);

        // --------------------------------
        // Subjects count
        // --------------------------------

        setSubjectsCount(subjectsData.subjects?.length || 0);

        // --------------------------------
        // Study task progress
        // --------------------------------

        const tasks = studyPlanData.tasks || [];

        const total = tasks.length;

        const completed = tasks.filter((task) => task.completed).length;

        const pending = total - completed;

        setTotalTasks(total);
        setCompletedTasks(completed);
        setPendingTasks(pending);

        // --------------------------------
        // Recent notes
        // --------------------------------

        const recentNotes = (notesData.notes || []).slice(0, 3).map((note) => ({
          type: "note",
          title: note.title,
          date: note.createdAt,
        }));

        // --------------------------------
        // Upcoming study tasks
        // --------------------------------

        const upcomingTasks = tasks
          .filter((task) => !task.completed)
          .slice(0, 3)
          .map((task) => ({
            type: "task",
            title: task.title,
            date: task.dueDate,
          }));

        // --------------------------------
        // Combine recent activity
        // --------------------------------

        setRecentActivity(
          [...recentNotes, ...upcomingTasks]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5),
        );

        // --------------------------------
        // Overall quiz statistics
        // --------------------------------

        setQuizStats({
          attempts: quizData.attempts || 0,
          bestScore: quizData.bestScore || 0,
          averageScore: quizData.averageScore || 0,
        });

        // --------------------------------
        // Subject quiz statistics
        // --------------------------------

        setSubjectStats(subjectStatsData.stats || []);

        // --------------------------------
        // AI Study Recommendations
        // --------------------------------

        setRecommendations(recommendationsData.recommendations || []);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --------------------------------
  // Study completion percentage
  // --------------------------------

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // --------------------------------
  // Dashboard statistics
  // --------------------------------

  const stats = [
    {
      title: "Subjects",
      value: subjectsCount,
      icon: "ðŸ“š",
      description: "Subjects available",
    },
    {
      title: "Notes",
      value: notesCount,
      icon: "ðŸ“",
      description: "Notes created",
    },
    {
      title: "Best Quiz Score",
      value: `${quizStats.bestScore}%`,
      icon: "ðŸ†",
      description: `${quizStats.attempts} quiz attempts`,
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: "ðŸ“…",
      description: "Study tasks remaining",
    },
  ];

  return (
    <div>
      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>

        <p className="text-slate-500 mt-2">
          Welcome back! Here's your study overview.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Error */}
      {/* -------------------------------- */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* -------------------------------- */}
      {/* Stats */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {loading ? "..." : stat.value}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  {stat.description}
                </p>
              </div>

              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* -------------------------------- */}
      {/* Study Progress */}
      {/* -------------------------------- */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Study Progress
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Task Completion
              </p>

              <p className="text-3xl font-bold text-slate-800 mt-1">
                {loading ? "..." : `${completionPercentage}%`}
              </p>
            </div>

            <div className="text-3xl">ðŸ“ˆ</div>
          </div>

          {/* Progress Bar */}

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          {/* Progress Details */}

          <div className="grid grid-cols-3 gap-4 mt-5 text-center">
            <div>
              <p className="text-xl font-bold text-slate-800">
                {loading ? "..." : completedTasks}
              </p>

              <p className="text-xs text-slate-500 mt-1">Completed</p>
            </div>

            <div>
              <p className="text-xl font-bold text-slate-800">
                {loading ? "..." : pendingTasks}
              </p>

              <p className="text-xs text-slate-500 mt-1">Pending</p>
            </div>

            <div>
              <p className="text-xl font-bold text-slate-800">
                {loading ? "..." : totalTasks}
              </p>

              <p className="text-xs text-slate-500 mt-1">Total Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* Subject Performance */}
      {/* -------------------------------- */}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Subject Performance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your quiz performance by subject.
            </p>
          </div>

          <a
            href="/quiz-stats"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All â†’
          </a>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-slate-500">Loading subject performance...</p>
          </div>
        ) : subjectStats.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="text-center py-4">
              <div className="text-4xl mb-3">ðŸ“Š</div>

              <h3 className="font-semibold text-slate-700">
                No subject performance yet
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Complete a quiz to see your performance by subject.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjectStats.slice(0, 3).map((item) => (
              <div
                key={item.subject}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    {item.subject}
                  </h3>

                  <span className="text-xl">ðŸ“š</span>
                </div>

                <div className="mt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-800">
                        {item.averageScore}%
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Average score
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">
                        Best: {item.bestScore}%
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {item.attempts}{" "}
                        {item.attempts === 1 ? "attempt" : "attempts"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
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

      {/* -------------------------------- */}
      {/* AI Study Recommendations */}
      {/* -------------------------------- */}

      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            ðŸ¤– AI Study Recommendations
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Focus on subjects that need the most improvement.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-slate-500">Loading recommendations...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="text-center py-4">
              <div className="text-4xl mb-3">ðŸŽ¯</div>

              <h3 className="font-semibold text-slate-700">
                No recommendations yet
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Complete a subject quiz to get personalized study
                recommendations.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.slice(0, 3).map((recommendation) => (
              <div
                key={recommendation.subject}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                      ðŸ“š
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {recommendation.subject}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {recommendation.attempts}{" "}
                        {recommendation.attempts === 1
                          ? "quiz attempt"
                          : "quiz attempts"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      recommendation.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : recommendation.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {recommendation.priority}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-3xl font-bold text-slate-800">
                    {recommendation.averageScore}%
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Average quiz score
                  </p>
                </div>

                {/* Score bar */}

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      recommendation.priority === "High"
                        ? "bg-red-500"
                        : recommendation.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(recommendation.averageScore, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-slate-600 mt-4">
                  {recommendation.priority === "High"
                    ? "Spend more study time on this subject."
                    : recommendation.priority === "Medium"
                      ? "Review this subject regularly."
                      : "Keep practicing to maintain your performance."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* Quick Actions */}
      {/* -------------------------------- */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/ai-tutor"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">ðŸ¤–</div>

            <h3 className="font-semibold text-slate-800">Ask AI Tutor</h3>

            <p className="text-sm text-slate-500 mt-1">
              Get help with your studies.
            </p>
          </a>

          <a
            href="/notes"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">ðŸ“</div>

            <h3 className="font-semibold text-slate-800">Create a Note</h3>

            <p className="text-sm text-slate-500 mt-1">
              Save important study material.
            </p>
          </a>

          <a
            href="/quiz"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">â“</div>

            <h3 className="font-semibold text-slate-800">Take a Quiz</h3>

            <p className="text-sm text-slate-500 mt-1">Test your knowledge.</p>
          </a>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* Recent Activity */}
      {/* -------------------------------- */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Recent Activity
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-slate-500">Loading recent activity...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">ðŸ“š</div>

              <h3 className="font-semibold text-slate-700">
                No recent activity
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Create a note or add a study task to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity, index) => (
                <div
                  key={`${activity.type}-${activity.title}-${index}`}
                  className="p-5 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    {activity.type === "note" ? "ðŸ“" : "ðŸ“…"}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {activity.title}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {activity.type === "note"
                        ? "Note created"
                        : "Upcoming study task"}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400">
                    {activity.date
                      ? new Date(activity.date).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;



