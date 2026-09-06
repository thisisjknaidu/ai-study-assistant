import API_URL from "../config";
import { useEffect, useState } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = sessionStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load notes");
        return;
      }

      setNotes(data.notes || []);
    } catch (error) {
      console.error("Fetch notes error:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage("Please enter a title and content");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create note");
        return;
      }

      setNotes((currentNotes) => [data.note, ...currentNotes]);

      setTitle("");
      setContent("");
      setMessage("Note created successfully!");
    } catch (error) {
      console.error("Create note error:", error);
      setMessage("Unable to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete note");
        return;
      }

      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));

      setMessage("Note deleted successfully!");
    } catch (error) {
      console.error("Delete note error:", error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          📝 My Notes
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Create, save, and manage your study notes.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5">
          Create a New Note
        </h2>

        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full border border-slate-200 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your study note..."
              rows="6"
              className="w-full border border-slate-200 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 sm:px-4 py-3 text-sm break-words">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-lg transition text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </form>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Your Notes
          </h2>

          <span className="text-sm text-slate-500">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center text-sm sm:text-base text-slate-500">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl mb-3">📚</div>

            <h3 className="font-semibold text-slate-900">No notes yet</h3>

            <p className="text-sm text-slate-500 mt-1">
              Create your first study note above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 min-w-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words min-w-0">
                    {note.title}
                  </h3>

                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0 px-1"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-sm sm:text-base text-slate-600 mt-4 whitespace-pre-wrap break-words">
                  {note.content}
                </p>

                <p className="text-xs text-slate-400 mt-5 break-words">
                  Created {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;
