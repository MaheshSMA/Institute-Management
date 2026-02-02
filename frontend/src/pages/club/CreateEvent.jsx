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
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            Create Event
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish a new event for your club members
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            {/* EVENT NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                name="event_name"
                onChange={handleChange}
                placeholder="Tech Talk on AI"
                className="
                  w-full px-4 py-2.5 rounded-lg border
                  focus:ring-2 focus:ring-blue-600 focus:outline-none
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                onChange={handleChange}
                placeholder="Brief description of the event"
                className="
                  w-full px-4 py-2.5 rounded-lg border resize-none
                  focus:ring-2 focus:ring-blue-600 focus:outline-none
                "
              />
            </div>

            {/* DATE & VENUE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="event_date"
                  onChange={handleChange}
                  className="
                    w-full px-4 py-2.5 rounded-lg border
                    focus:ring-2 focus:ring-blue-600 focus:outline-none
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  name="venue"
                  onChange={handleChange}
                  placeholder="Main Auditorium"
                  className="
                    w-full px-4 py-2.5 rounded-lg border
                    focus:ring-2 focus:ring-blue-600 focus:outline-none
                  "
                />
              </div>
            </div>

            {/* TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="start_time"
                  onChange={handleChange}
                  className="
                    w-full px-4 py-2.5 rounded-lg border
                    focus:ring-2 focus:ring-blue-600 focus:outline-none
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="end_time"
                  onChange={handleChange}
                  className="
                    w-full px-4 py-2.5 rounded-lg border
                    focus:ring-2 focus:ring-blue-600 focus:outline-none
                  "
                />
              </div>
            </div>

            {/* ACTIVITY POINTS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Points
              </label>
              <input
                type="number"
                name="activity_points"
                onChange={handleChange}
                placeholder="e.g. 10"
                className="
                  w-full px-4 py-2.5 rounded-lg border
                  focus:ring-2 focus:ring-blue-600 focus:outline-none
                "
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/club/dashboard")}
                className="
                  px-5 py-2.5 rounded-lg border text-gray-600
                  hover:bg-gray-50 transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-2.5 rounded-lg font-medium text-white transition
                  ${loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"}
                `}
              >
                {loading ? "Creating…" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
