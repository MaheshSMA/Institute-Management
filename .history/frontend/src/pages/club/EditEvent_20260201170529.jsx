// frontend/src/pages/club/EditEvent.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/clubs/events/${id}`)
      .then(res => setForm(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await API.put(`/clubs/events/${id}`, form);
    navigate("/club/events");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Event</h1>

      {/* same inputs as CreateEvent, just value={form.xxx} */}
      <input
        name="event_name"
        value={form.Event_name}
        onChange={handleChange}
      />

      {/* rest unchanged */}

      <button onClick={submit} className="btn-primary">
        Save Changes
      </button>
    </div>
  );
}

export default EditEvent;
