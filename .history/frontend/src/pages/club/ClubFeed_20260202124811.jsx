// frontend/src/pages/club/ClubFeed.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ClubFeed() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [feed, setFeed] = useState([]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await API.get("/clubs/feed");
      setFeed(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const post = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);
      await API.post("/clubs/feed", { content });
      setContent("");
      fetchFeed();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Club Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Post announcements and updates for club members
          </p>
        </div>

        <button
          onClick={() => navigate("/club/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* NEW POST */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Share an announcement, update, or reminder..."
          className="
            w-full resize-none border rounded-xl px-4 py-3 text-sm
            focus:ring-2 focus:ring-blue-600 focus:outline-none
          "
        />

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400">
            Visible to all approved club members
          </span>

          <button
            onClick={post}
            disabled={posting}
            className="
              px-5 py-2 rounded-lg text-sm font-medium
              bg-blue-700 text-white
              hover:bg-blue-800
              disabled:opacity-60
              transition
            "
          >
            {posting ? "Posting…" : "Post Update"}
          </button>
        </div>
      </div>

      {/* FEED */}
      {feed.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-600 text-sm">
          No announcements yet. Be the first to post an update 🚀
        </div>
      ) : (
        <div className="space-y-6">
          {feed.map((post) => (
            <div
              key={post.Feed_id}
              className="
                bg-white border rounded-2xl shadow-sm p-6
                hover:shadow-md transition
              "
            >
              {/* POST HEADER */}
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-gray-500">
                  Posted on{" "}
                  {new Date(post.Created_At).toLocaleString()}
                </div>

                <button
                  onClick={() =>
                    API.delete(`/clubs/feed/${post.Feed_id}`)
                      .then(fetchFeed)
                  }
                  className="
                    text-xs text-red-600
                    hover:text-red-700 hover:underline
                  "
                >
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
