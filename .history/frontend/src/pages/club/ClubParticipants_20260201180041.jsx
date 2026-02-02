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
      <div className="min-h-screen flex items-center justify-center">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold text-blue-900 mb-6">
        Event Participants
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-600">No events created yet.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((e) => (
            <div
              key={e.Event_id}
              onClick={() =>
                navigate(`/club/participants/${e.Event_id}`)
              }
              className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg text-blue-800">
                {e.Event_name}
              </h2>
              <p className="text-sm text-gray-600">
                {e.Event_date} • {e.Venue}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubParticipants;
