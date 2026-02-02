// frontend/src/pages/club/CreateEvent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    event_name: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    activity_points: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.event_name ||
      !form.event_date ||
      !form.start_time ||
      !form.end_time ||
      !form.venue
    ) {
      return setError("Please fill all required fields");
    }

    try {
      setLoading(true);
      await API.post("/clubs/events", form);
      navigate("/club/dashboard");
    } catch (err) {
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-blue-900 mb-2">
          Create Event
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Add a new event for your club
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Name
            </label>
            <input
              name="event_name"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
              placeholder="Tech Talk on AI"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
              placeholder="Brief description of the event"
            />
          </div>

          {/* Date & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="event_date"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Venue
              </label>
              <input
                name="venue"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                placeholder="Main Auditorium"
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                End Time
              </label>
              <input
                type="time"
                name="end_time"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Activity Points */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Activity Points
            </label>
            <input
              type="number"
              name="activity_points"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
              placeholder="e.g. 10"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/club/dashboard")}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md font-medium text-white ${
                loading
                  ? "bg-blue-400"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
