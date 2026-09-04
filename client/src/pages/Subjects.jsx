import API_URL from "../config";
import { useEffect, useState } from "react";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter a subject name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subject");
      }

      setSubjects((previous) =>
        [...previous, data.subject].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );

      setName("");
    } catch (error) {
      console.error("Create subject error:", error);
      setError(error.message || "Unable to create subject.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSubject = async (id) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/api/subjects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete subject");
      }

      setSubjects((previous) =>
        previous.filter((subject) => subject.id !== id),
      );
    } catch (error) {
      console.error("Delete subject error:", error);
      setError(error.message || "Unable to delete subject.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Subjects</h1>

        <p className="text-slate-500 mt-2">
          Manage the subjects you are studying.
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
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Add Subject
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Add a subject to your study list.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {saving ? "Adding..." : "Add Subject"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Your Subjects
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {subjects.length} subject
                  {subjects.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="text-3xl">📚</div>
            </div>

            {loading && (
              <div className="py-12 text-center">
                <p className="text-slate-500">Loading subjects...</p>
              </div>
            )}

            {!loading && subjects.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <div className="text-4xl mb-3">📚</div>

                <h3 className="font-semibold text-slate-700">
                  No subjects yet
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Add your first subject using the form.
                </p>
              </div>
            )}

            {!loading && subjects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-xl flex-shrink-0">
                        📖
                      </div>

                      <h3 className="font-semibold text-slate-800 truncate">
                        {subject.name}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteSubject(subject.id)}
                      className="text-slate-400 hover:text-red-500 transition flex-shrink-0"
                      title="Delete subject"
                      aria-label={`Delete ${subject.name}`}
                    >
                      🗑️
                    </button>
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

export default Subjects;



