// frontend/src/pages/club/EventParticipants.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function EventParticipants() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

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
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={`${p.Student_id}-${p.Event_id}`} className="border-t">
                  <td className="px-4 py-3">
                    {p.Student_name}
                  </td>
                  <td className="px-4 py-3">
                    {p.Participation_status}
                  </td>
                  <td className="px-4 py-3">
                    {p.Role_in_event}
                  </td>
                  <td className="px-4 py-3">
                    {p.Pts_earned}
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
