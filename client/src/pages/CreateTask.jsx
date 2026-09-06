import API_URL from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required.");
        }

        const response = await fetch(`${API_URL}/api/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load subjects.");
        }

        if (Array.isArray(data)) {
          setSubjects(data);
        } else if (Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
        } else {
          setSubjects([]);
          console.error("Unexpected subjects response:", data);
        }
      } catch (err) {
        console.error("Fetch subjects error:", err);
        setError(err.message || "Unable to load subjects.");
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!subject) {
      setError("Please select a subject.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    try {
      setCreating(true);

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required.");
      }

      const response = await fetch(`${API_URL}/api/study-plan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject,
          dueDate: new Date(dueDate).toISOString(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task.");
      }

      setSuccess("Task created successfully!");

      setTitle("");
      setSubject("");
      setDueDate("");
      setDescription("");

      setTimeout(() => {
        navigate("/study-plan");
      }, 1000);
    } catch (err) {
      console.error("Create task error:", err);

      setError(err.message || "Unable to create task.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Create Task
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Add a new task to your study plan.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
        {error && (
          <div className="mb-5 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base break-words">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base break-words">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Practice algebra equations"
              className="w-full border border-slate-300 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loadingSubjects}
              className="w-full border border-slate-300 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            >
              <option value="">
                {loadingSubjects ? "Loading subjects..." : "Select a subject"}
              </option>

              {subjects.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            {!loadingSubjects && subjects.length === 0 && (
              <p className="text-xs sm:text-sm text-amber-600 mt-2">
                No subjects found. Please create a subject first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Due Date
            </label>

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details about this task..."
              rows="5"
              className="w-full border border-slate-300 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2">
            <button
              type="submit"
              disabled={creating || subjects.length === 0}
              className="w-full sm:flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {creating ? "Creating..." : "➕ Create Task"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/study-plan")}
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
