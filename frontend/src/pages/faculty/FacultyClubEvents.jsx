import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyClubEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    event_name: "",
    description: "",
    duration: "",
  });

  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const res = await API.get("/events/my-club");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async () => {
    if (!form.event_name) return;

    await API.post("/events", form);
    resetForm();
    fetchEvents();
  };

  const startEdit = (event) => {
    setEditingId(event.Event_id);
    setForm({
      event_name: event.Event_name,
      description: event.Description,
      duration: event.Duration,
    });
  };

  const updateEvent = async () => {
    await API.put(`/events/${editingId}`, form);
    resetForm();
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await API.delete(`/events/${id}`);
    fetchEvents();
  };

  const resetForm = () => {
    setForm({ event_name: "", description: "", duration: "" });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-semibold mb-6">
        {editingId ? "Edit Event" : "Create Event"}
      </h1>

      {/* Create / Edit Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input
          placeholder="Event name"
          className="border p-2 w-full mb-2"
          value={form.event_name}
          onChange={(e) => setForm({ ...form, event_name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Duration"
          className="border p-2 w-full mb-4"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <div className="flex gap-3">
          {editingId ? (
            <>
              <button
                onClick={updateEvent}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>

              <button onClick={resetForm} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={createEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create Event
            </button>
          )}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold w-1/4">Name</th>
              <th className="px-4 py-3 text-left font-semibold w-2/5">
                Description
              </th>
              <th className="px-4 py-3 text-left font-semibold w-1/6">
                Duration
              </th>
              <th className="px-4 py-3 text-center font-semibold w-1/6">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((e) => (
              <tr key={e.Event_id} className="border-t">
                <td className="px-4 py-3">{e.Event_name}</td>

                <td className="px-4 py-3 text-gray-700">{e.Description}</td>

                <td className="px-4 py-3">{e.Duration}</td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => startEdit(e)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteEvent(e.Event_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/faculty/club")}
        className="mt-6 underline text-sm"
      >
        Back to Club Dashboard
      </button>
    </div>
  );
}

export default FacultyClubEvents;
