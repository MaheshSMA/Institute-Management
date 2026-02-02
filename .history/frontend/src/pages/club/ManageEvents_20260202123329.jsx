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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Manage Events
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit, review, or remove events created by your club
        </p>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 ? (
        <div className="bg-white border rounded-xl shadow-sm p-6 text-gray-600">
          No events created yet.
        </div>
      ) : (
        <div className="grid gap-5">
          {events.map((e) => (
            <div
              key={e.Event_id}
              className="
                bg-white border rounded-2xl shadow-sm p-6
                flex flex-col md:flex-row md:items-center md:justify-between
                hover:shadow-md transition
              "
            >
              {/* EVENT INFO */}
              <div>
                <h2 className="text-lg font-semibold text-blue-800">
                  {e.Event_name}
                </h2>

                <div className="mt-1 text-sm text-gray-600">
                  {e.Event_date} • {e.Start_time} – {e.End_time}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Venue: <span className="font-medium">{e.Venue}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button
                  onClick={() =>
                    navigate(`/club/events/edit/${e.Event_id}`)
                  }
                  className="
                    px-4 py-2 rounded-lg text-sm font-medium
                    text-blue-700 bg-blue-50
                    hover:bg-blue-100 transition
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() => setConfirmId(e.Event_id)}
                  className="
                    px-4 py-2 rounded-lg text-sm font-medium
                    text-red-600 bg-red-50
                    hover:bg-red-100 transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Event?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The event and its data
              will be permanently removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="
                  px-4 py-2 rounded-lg border text-sm
                  hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                onClick={deleteEvent}
                className="
                  px-4 py-2 rounded-lg text-sm
                  bg-red-600 text-white
                  hover:bg-red-700
                "
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
