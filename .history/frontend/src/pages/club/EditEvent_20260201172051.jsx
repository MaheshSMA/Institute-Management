import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    event_name: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    activity_points: ""
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/clubs/events/${eventId}`);
      setForm(res.data);
    } catch {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await API.put(`/clubs/events/${eventId}`, form);
      navigate("/club/events");
    } catch {
      setError("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-blue-900 mb-2">
          Edit Event
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Update event details
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <Input label="Event Name" name="event_name" value={form.event_name} onChange={handleChange} />
          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Event Date" type="date" name="event_date" value={form.event_date} onChange={handleChange} />
            <Input label="Venue" name="venue" value={form.venue} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" name="start_time" value={form.start_time} onChange={handleChange} />
            <Input label="End Time" type="time" name="end_time" value={form.end_time} onChange={handleChange} />
          </div>

          <Input
            label="Activity Points"
            type="number"
            name="activity_points"
            value={form.activity_points}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/club/events")}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className={`px-6 py-2 rounded-md text-white ${
                saving
                  ? "bg-blue-400"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Small reusable inputs */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
    />
  </div>
);

export default EditEvent;
