// frontend/src/pages/club/ClubParticipants.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Users, CalendarDays, ArrowRight } from "lucide-react";

function ClubParticipants() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/clubs/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load club events");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading events…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* GLOBAL TOAST */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md text-sm
            ${
              toast.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-green-50 border border-green-200 text-green-800"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 rounded-2xl bg-white border shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            Event Participants
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select an event to view and manage participants
          </p>
        </div>

        <button
          onClick={() => navigate("/club/dashboard")}
          className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 transition"
        >
          ← Back
        </button>
      </div>

      {/* CONTENT */}
      {events.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center text-gray-500 shadow-sm">
          <p className="text-sm">
            No events created yet.
          </p>
          <p className="text-xs mt-1">
            Create an event to start tracking participants 👥
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div
              key={e.Event_id}
              className="
                bg-white border rounded-2xl p-6 shadow-sm
                hover:shadow-lg hover:-translate-y-0.5
                transition-all duration-200
                flex flex-col justify-between
              "
            >
              {/* EVENT INFO */}
              <div>
                <h2 className="font-semibold text-lg text-blue-900">
                  {e.Event_name}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  {e.Event_date || "Date not specified"}
                </div>

                {e.Venue && (
                  <p className="text-sm text-gray-500 mt-1">
                    {e.Venue}
                  </p>
                )}
              </div>

              {/* ACTION */}
              <button
                onClick={() =>
                  navigate(`/club/participants/${e.Event_id}`)
                }
                className="
                  mt-6 w-full flex items-center justify-center gap-2
                  px-4 py-2 rounded-lg text-sm font-medium
                  bg-blue-700 text-white
                  hover:bg-blue-800 transition
                "
              >
                View Participants
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubParticipants;
