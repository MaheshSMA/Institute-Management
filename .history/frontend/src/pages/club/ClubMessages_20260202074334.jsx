import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ClubMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/messages/club/conversations")
      .then(res => setConversations(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading messages…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Messages
        </h1>

        <button
          onClick={() => navigate("/club/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* CONVERSATIONS */}
      {conversations.length === 0 ? (
        <div className="text-gray-600">
          No conversations yet.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm divide-y">
          {conversations.map((c) => (
            <div
              key={c.Student_id}
              onClick={() =>
                navigate(`/club/messages/${c.Student_id}`)
              }
              className="p-4 flex justify-between items-center cursor-pointer
                         hover:bg-blue-50 transition"
            >
              <div>
                <p className="font-medium text-blue-900">
                  {c.Student_name}
                </p>
                <p className="text-xs text-gray-500">
                  Click to open chat
                </p>
              </div>

              <span className="text-xs text-gray-400">
                →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubMessages;
