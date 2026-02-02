// frontend/src/pages/student/StudentClubFeed.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Megaphone, ArrowLeft } from "lucide-react";

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
        Loading club updates...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-700" />
            Club Announcements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Latest updates from your club
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* FEED */}
      {feed.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          <p className="text-sm">
            No announcements yet.
          </p>
          <p className="text-xs mt-1">
            Stay tuned for upcoming updates 📢
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
              "
            >
              {/* POST HEADER */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                  C
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Club Announcement
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(post.Created_At).toLocaleString()}
                  </div>
                </div>
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

export default StudentClubFeed;
