// frontend/src/pages/club/EventParticipants.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function EventParticipants() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await API.get(
        `/participation/event/${eventId}`
      );
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateLocal = (studentId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const save = async (p) => {
    const data = editData[p.Student_id] || {};

    try {
      await API.put(
        `/participation/event/${eventId}/student/${p.Student_id}`,
        {
          status: data.Participation_status ?? p.Participation_status,
          role: data.Role_in_event ?? p.Role_in_event,
          pts: data.Pts_earned ?? p.Pts_earned,
        }
      );

      // Refresh table
      fetchParticipants();
      setEditData({});
    } catch (err) {
      console.error("Failed to save participation", err);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading participants...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Participants
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-700 hover:underline"
        >
          Back
        </button>
      </div>

      {participants.length === 0 ? (
        <p className="text-gray-600">
          No students registered yet.
        </p>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Points</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={`${p.Student_id}-${p.Event_id}`} className="border-t">
  <td className="px-4 py-3">{p.Student_name}</td>

  <td className="px-4 py-3">
    <select
      value={
        editData[p.Student_id]?.Participation_status ??
        p.Participation_status
      }
      onChange={(e) =>
        updateLocal(
          p.Student_id,
          "Participation_status",
          e.target.value
        )
      }
      className="border rounded px-2 py-1"
    >
      <option>Registered</option>
      <option>Attended</option>
      <option>Completed</option>
      <option>Absent</option>
    </select>
  </td>

  <td className="px-4 py-3">
    <select
      value={
        editData[p.Student_id]?.Role_in_event ??
        p.Role_in_event
      }
      onChange={(e) =>
        updateLocal(
          p.Student_id,
          "Role_in_event",
          e.target.value
        )
      }
      className="border rounded px-2 py-1"
    >
      <option>Participant</option>
      <option>Volunteer</option>
      <option>Organizer</option>
    </select>
  </td>

  <td className="px-4 py-3">
    <input
      type="number"
      value={
        editData[p.Student_id]?.Pts_earned ??
        p.Pts_earned
      }
      onChange={(e) =>
        updateLocal(
          p.Student_id,
          "Pts_earned",
          e.target.value
        )
      }
      className="w-20 border rounded px-2 py-1"
    />
  </td>

  <td className="px-4 py-3">
    <button
      onClick={() => save(p)}
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
    >
      Save
    </button>
  </td>
</tr>

              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventParticipants;
