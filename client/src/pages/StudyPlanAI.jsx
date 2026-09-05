import API_URL from "../config";
import { useState } from "react";

function StudyPlanAI() {
  const [studyPlan, setStudyPlan] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingPlan, setAddingPlan] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const generateStudyPlan = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setStudyPlan(null);

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/api/recommendations/study-plan`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate study plan");
      }

      setStudyPlan(data.studyPlan);
      setPerformance(data.performance || []);
    } catch (error) {
      console.error("Study plan error:", error);

      setError(error.message || "Unable to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  const addPlanToStudyPlan = async () => {
    try {
      setAddingPlan(true);
      setError("");
      setSuccessMessage("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      if (!studyPlan?.days?.length) {
        throw new Error("No study plan available.");
      }

      const tasks = studyPlan.days.map((day) => ({
        title: `Day ${day.day}: ${day.focus}`,
        subject: day.subject,
        dueDate: new Date(
          Date.now() + (day.day - 1) * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      for (const task of tasks) {
        const response = await fetch(`${API_URL}/api/study-plan`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add study task.");
        }
      }

      setSuccessMessage(
        "Your 7-day AI study plan has been added to your Study Plan!",
      );
    } catch (error) {
      console.error("Add study plan error:", error);

      setError(error.message || "Unable to add the study plan.");
    } finally {
      setAddingPlan(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">ðŸ¤– AI Study Plan</h1>

        <p className="text-slate-500 mt-2">
          Get a personalized 7-day study plan based on your quiz performance.
        </p>
      </div>

      {/* Generate Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Create Your Study Plan
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              The AI will analyze your quiz results and identify the subjects
              that need more attention.
            </p>
          </div>

          <button
            onClick={generateStudyPlan}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "âœ¨ Generate Study Plan"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="font-semibold text-green-700">âœ… Study Plan Added</h3>

          <p className="text-sm text-green-600 mt-1">{successMessage}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 className="font-semibold text-red-700">
            Unable to generate plan
          </h3>

          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Performance */}
      {performance.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            ðŸ“Š Your Performance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {performance.map((item) => (
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

                <p className="text-3xl font-bold text-slate-800 mt-4">
                  {item.averageScore}%
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Average score Â· {item.attempts}{" "}
                  {item.attempts === 1 ? "attempt" : "attempts"}
                </p>

                <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(item.averageScore, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Plan */}
      {studyPlan && (
        <div>
          {/* Plan Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                ðŸ§ 
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">
                  {studyPlan.title}
                </h2>

                <p className="text-slate-500 mt-2">{studyPlan.summary}</p>

                {/* Add to Study Plan */}
                <div className="mt-5">
                  <button
                    onClick={addPlanToStudyPlan}
                    disabled={addingPlan}
                    className="px-5 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingPlan
                      ? "Adding to Study Plan..."
                      : "ðŸ“… Add Plan to My Study Plan"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="space-y-5">
            {studyPlan.days?.map((day) => (
              <div
                key={day.day}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Day Number */}
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {day.day}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Day {day.day} â€” {day.subject}
                      </h3>

                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                        Study Focus
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      <span className="font-medium">Focus:</span> {day.focus}
                    </p>

                    {/* Activities */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Activities
                      </h4>

                      <div className="space-y-2">
                        {day.activities?.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="mt-0.5 text-blue-600">âœ“</span>

                            <p className="text-sm text-slate-600">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!studyPlan && !loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">ðŸ“š</div>

          <h2 className="text-xl font-semibold text-slate-800">
            Your personalized plan is waiting
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Complete some subject quizzes first, then click the button above to
            generate a personalized 7-day study plan.
          </p>
        </div>
      )}
    </div>
  );
}

export default StudyPlanAI;



