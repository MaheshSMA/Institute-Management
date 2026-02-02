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
      const res = await API.get(`/participation/event/${eventId}`);
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

      fetchParticipants();
      setEditData({});
    } catch (err) {
      console.error("Failed to save participation", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading participants…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">
            Event Participants
          </h1>
          <p className="text-sm text-gray-500">
            Manage attendance, roles, and points
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 transition"
          >
            ← Back
          </button>

          <button
            onClick={() =>
              API.put(`/participation/event/${eventId}/bulk`, {
                status: "Attended",
              }).then(fetchParticipants)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Mark All Attended
          </button>

          <button
            onClick={() =>
              API.put(`/participation/event/${eventId}/bulk`, {
                status: "Completed",
              }).then(fetchParticipants)
            }
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            Mark All Completed
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {participants.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          No students registered yet.
        </div>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Student</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-left font-semibold">Points</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {participants.map((p) => {
                const edited = editData[p.Student_id];

                return (
                  <tr
                    key={`${p.Student_id}-${p.Event_id}`}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.Student_name}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={
                          edited?.Participation_status ??
                          p.Participation_status
                        }
                        onChange={(e) =>
                          updateLocal(
                            p.Student_id,
                            "Participation_status",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Registered</option>
                        <option>Attended</option>
                        <option>Completed</option>
                        <option>Absent</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={edited?.Role_in_event ?? p.Role_in_event}
                        onChange={(e) =>
                          updateLocal(
                            p.Student_id,
                            "Role_in_event",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Participant</option>
                        <option>Volunteer</option>
                        <option>Organizer</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={edited?.Pts_earned ?? p.Pts_earned}
                        onChange={(e) =>
                          updateLocal(
                            p.Student_id,
                            "Pts_earned",
                            e.target.value
                          )
                        }
                        className="w-24 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => save(p)}
                        disabled={!edited}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          edited
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventParticipants;
