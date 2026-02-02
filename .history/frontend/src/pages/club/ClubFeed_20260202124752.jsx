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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Club Feed
        </h1>
        <button
          onClick={() => navigate("/club/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back
        </button>
      </div>

      {/* New Post */}
      <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Write an announcement..."
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={post}
            disabled={posting}
            className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-60"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {feed.map((post) => (
            <div
              key={post.Feed_id}
              className="bg-white border rounded-xl shadow-sm p-5"
            >
              <div className="flex justify-between items-start gap-4">
            <p className="text-gray-800 whitespace-pre-line flex-1">
                {post.Content}
            </p>

            <button
                onClick={() =>
                API.delete(`/clubs/feed/${post.Feed_id}`)
                    .then(fetchFeed)
                }
                className="text-xs text-red-600 hover:underline"
            >
                Delete
            </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
            {new Date(post.Created_At).toLocaleString()}
            </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubFeed;
