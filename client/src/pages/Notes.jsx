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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">ðŸ“ My Notes</h1>

        <p className="text-slate-500 mt-2">
          Create, save, and manage your study notes.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-5">
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
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Your Notes</h2>

          <span className="text-sm text-slate-500">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border p-8 text-center text-slate-500">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="text-4xl mb-3">ðŸ“š</div>

            <h3 className="font-semibold text-slate-900">No notes yet</h3>

            <p className="text-slate-500 mt-1">
              Create your first study note above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl border shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {note.title}
                  </h3>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-slate-600 mt-4 whitespace-pre-wrap">
                  {note.content}
                </p>

                <p className="text-xs text-slate-400 mt-5">
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




