import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function StudentClubFeed() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await API.get(`/clubs/${clubId}/feed`);
      setFeed(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load club feed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading feed...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Club Feed
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-700 hover:underline"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {feed.length === 0 ? (
        <p className="text-gray-600">
          No announcements yet.
        </p>
      ) : (
        <div className="space-y-4">
          {feed.map((post) => (
            <div
              key={post.Feed_id}
              className="bg-white border rounded-xl shadow-sm p-5"
            >
              <p className="text-gray-800 whitespace-pre-line">
                {post.Content}
              </p>
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

export default StudentClubFeed;
