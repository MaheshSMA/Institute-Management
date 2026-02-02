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
    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
          className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
        >
          ← Back
        </button>

        <button
          onClick={() =>
            API.put(`/participation/event/${eventId}/bulk`, {
              status: "Attended",
            }).then(fetchParticipants)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Mark All Attended
        </button>

        <button
          onClick={() =>
            API.put(`/participation/event/${eventId}/bulk`, {
              status: "Completed",
            }).then(fetchParticipants)
          }
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
        >
          Mark All Completed
        </button>
      </div>
    </div>

    {/* CONTENT */}
    {participants.length === 0 ? (
      <div className="bg-white border rounded-xl p-8 text-center text-gray-600">
        No students registered yet.
      </div>
    ) : (
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">Action</th>
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
                  <td className="px-4 py-3 font-medium">
                    {p.Student_name}
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={edited?.Participation_status ?? p.Participation_status}
                      onChange={(e) =>
                        updateLocal(
                          p.Student_id,
                          "Participation_status",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-2 py-1 bg-white"
                    >
                      <option>Registered</option>
                      <option>Attended</option>
                      <option>Completed</option>
                      <option>Absent</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={edited?.Role_in_event ?? p.Role_in_event}
                      onChange={(e) =>
                        updateLocal(
                          p.Student_id,
                          "Role_in_event",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-2 py-1 bg-white"
                    >
                      <option>Participant</option>
                      <option>Volunteer</option>
                      <option>Organizer</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
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
                      className="w-20 border rounded-md px-2 py-1"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => save(p)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        edited
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!edited}
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
