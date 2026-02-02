// frontend/src/pages/club/ClubParticipants.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ClubParticipants() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/clubs/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Event Participants
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select an event to manage participants
        </p>
      </div>

      {/* CONTENT */}
      {events.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          No events created yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div
              key={e.Event_id}
              onClick={() =>
                navigate(`/club/participants/${e.Event_id}`)
              }
              className="group bg-white border rounded-2xl p-6 shadow-sm cursor-pointer
                         hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <h2 className="font-semibold text-lg text-blue-800 group-hover:text-blue-900">
                {e.Event_name}
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                {e.Event_date}
              </p>

              <p className="text-sm text-gray-500">
                {e.Venue}
              </p>

              <div className="mt-4 text-sm font-medium text-blue-600">
                View participants →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubParticipants;
