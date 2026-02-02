// frontend/src/pages/club/ManageEvents.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function ManageEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

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

  const deleteEvent = async () => {
    try {
      await API.delete(`/clubs/events/${confirmId}`);
      setConfirmId(null);
      fetchEvents();
    } catch {
      alert("Failed to delete event");
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
        Manage Events
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-600">No events created yet.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((e) => (
            <div
              key={e.Event_id}
              className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg text-blue-800">
                  {e.Event_name}
                </h2>
                <p className="text-sm text-gray-600">
                  {e.Event_date} •  {e.Start_time} – {e.End_time}
                </p>
                <p className="text-sm text-gray-500">
                  Venue: {e.Venue}
                </p>
              </div>

              <button
                onClick={() => setConfirmId(e.Event_id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-lg font-semibold mb-3">
              Delete Event?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEvents;
