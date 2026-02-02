// frontend/src/pages/club/ClubFeed.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Megaphone, Trash2, Send } from "lucide-react";

function ClubFeed() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [feed, setFeed] = useState([]);
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchFeed();
  }, []);

  /* ---------------- FETCH FEED ---------------- */
  const fetchFeed = async () => {
    try {
      const res = await API.get("/clubs/feed");
      setFeed(res.data);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load club feed");
    }
  };

  /* ---------------- TOAST ---------------- */
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  /* ---------------- POST ---------------- */
  const post = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);
      await API.post("/clubs/feed", { content });
      setContent("");
      showToast("success", "Announcement posted");
      fetchFeed();
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to post update");
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await API.delete(`/clubs/feed/${id}`);
      showToast("success", "Post deleted");
      fetchFeed();
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-700" />
            Club Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Share announcements, updates, and reminders
          </p>
        </div>

        <button
          onClick={() => navigate("/club/dashboard")}
          className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 transition"
        >
          ← Back
        </button>
      </div>

      {/* GLOBAL TOAST */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md text-sm
            ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* NEW POST */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 mb-10">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
            C
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="What’s new in the club?"
            className="
              flex-1 resize-none border rounded-xl px-4 py-3 text-sm
              focus:ring-2 focus:ring-blue-600 focus:outline-none
            "
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400">
            Visible to approved club members only
          </span>

          <button
            onClick={post}
            disabled={posting || !content.trim()}
            className="
              flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
              bg-blue-700 text-white
              hover:bg-blue-800
              disabled:opacity-50 disabled:cursor-not-allowed
              transition
            "
          >
            <Send className="w-4 h-4" />
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      {/* FEED */}
      {feed.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          <p className="text-sm">
            No announcements yet.
          </p>
          <p className="text-xs mt-1">
            Be the first to post an update 🚀
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {feed.map((post) => (
            <div
              key={post.Feed_id}
              className="
                bg-white border rounded-2xl shadow-sm p-6
                hover:shadow-md transition
                relative
              "
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    C
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Club Admin
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(post.Created_At).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deletePost(post.Feed_id)}
                  className="
                    flex items-center gap-1 text-xs text-red-600
                    hover:text-red-700
                  "
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>

              {/* CONTENT */}
              <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">
                {post.Content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubFeed;
