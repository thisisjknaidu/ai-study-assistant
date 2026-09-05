import API_URL from "../config";
import { useEffect, useState } from "react";

function StudyPlan() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/study-plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load study plan");
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Study plan error:", error);
      setError(error.message || "Unable to load your study plan.");
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Get subjects error:", error);
      setError(error.message || "Unable to load subjects.");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchSubjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !subject || !dueDate) {
      setError("Please fill in the title, subject and due date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/study-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          subject,
          description: description.trim(),
          dueDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create study task");
      }

      setTasks((previous) =>
        [...previous, data.task].sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
        ),
      );

      setTitle("");
      setSubject("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Create study task error:", error);
      setError(error.message || "Unable to create study task.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/api/study-plan/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      setTasks((previous) =>
        previous.map((task) => (task.id === id ? data.task : task)),
      );
    } catch (error) {
      console.error("Update study task error:", error);
      setError(error.message || "Unable to update the task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/api/study-plan/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks((previous) => previous.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Delete study task error:", error);
      setError(error.message || "Unable to delete the task.");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingTasks = tasks.filter((task) => !task.completed);

  const completedTasks = tasks.filter((task) => task.completed);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Study Plan</h1>

        <p className="text-slate-500 mt-2">
          Organize your study tasks and keep track of your progress.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600 font-bold"
            aria-label="Dismiss error"
          >
            âœ•
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Add Study Task
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Plan what you want to study next.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Task title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Study algebra"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>

                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  disabled={subjects.length === 0}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a subject</option>

                  {subjects.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {subjects.length === 0 && (
                  <p className="text-xs text-slate-400 mt-2">
                    Add a subject from the Subjects page first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What do you need to study?"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={saving || subjects.length === 0}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {saving ? "Adding..." : "Add to Study Plan"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Your Tasks
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {pendingTasks.length} pending Â· {completedTasks.length}{" "}
                    completed
                  </p>
                </div>

                <div className="text-3xl">ðŸ“…</div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  {
                    label: "All",
                    value: "all",
                  },
                  {
                    label: "Pending",
                    value: "pending",
                  },
                  {
                    label: "Completed",
                    value: "completed",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === option.value
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="py-12 text-center">
                <p className="text-slate-500">Loading your study plan...</p>
              </div>
            )}

            {!loading && tasks.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <div className="text-4xl mb-3">ðŸ“š</div>

                <h3 className="font-semibold text-slate-700">
                  No study tasks yet
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Add your first task using the form.
                </p>
              </div>
            )}

            {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <div className="text-4xl mb-3">ðŸŽ‰</div>

                <h3 className="font-semibold text-slate-700">
                  No tasks in this category
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try selecting another filter.
                </p>
              </div>
            )}

            {!loading && filteredTasks.length > 0 && (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border rounded-xl p-5 transition ${
                      task.completed
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={
                          task.completed
                            ? "Mark task as pending"
                            : "Mark task as completed"
                        }
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                          task.completed
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300 hover:border-indigo-500"
                        }`}
                      >
                        {task.completed && "âœ“"}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-semibold ${
                              task.completed
                                ? "text-green-700 line-through"
                                : "text-slate-800"
                            }`}
                          >
                            {task.title}
                          </h3>

                          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                            {task.subject}
                          </span>
                        </div>

                        {task.description && (
                          <p
                            className={`text-sm mt-2 ${
                              task.completed
                                ? "text-green-600"
                                : "text-slate-500"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        <p className="text-xs text-slate-400 mt-3">
                          Due: {formatDate(task.dueDate)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-red-500 transition"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        ðŸ—‘ï¸
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlan;




