import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

/* ============================================================
   REUSABLE TABLE COMPONENT
============================================================ */
function ParticipantsTable({
  participants,
  editData,
  updateLocal,
  onSave,
  onUndo,
}) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-gray-700 sticky top-0 z-10">
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
            const status =
              edited?.Participation_status ?? p.Participation_status;

            return (
              <tr
                key={`${p.Student_id}-${p.Event_id}`}
                className={`border-t transition ${
                  edited ? "bg-blue-50/40" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {p.Student_name}
                </td>

                <td className="px-6 py-4">
                  <select
                    value={status}
                    onChange={(e) =>
                      updateLocal(
                        p.Student_id,
                        "Participation_status",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 transition"
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
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 transition"
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
                    className="w-24 rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 transition"
                  />
                </td>

                <td className="px-6 py-4 space-y-1">
                  {edited && (
                    <p className="text-xs text-blue-600">Unsaved changes</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSave(p)}
                      disabled={!edited}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        edited
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>

                    {edited && (
                      <button
                        onClick={() => onUndo(p.Student_id)}
                        className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
function EventParticipants() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);

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

  const undoChanges = (studentId) => {
    setEditData((prev) => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
  };

  const save = async (p) => {
    const data = editData[p.Student_id];

    await API.put(
      `/participation/event/${eventId}/student/${p.Student_id}`,
      {
        status: data.Participation_status ?? p.Participation_status,
        role: data.Role_in_event ?? p.Role_in_event,
        pts: data.Pts_earned ?? p.Pts_earned,
      }
    );

    setToast(
      `${data.Pts_earned ?? p.Pts_earned} activity points added to ${p.Student_name}`
    );

    setTimeout(() => setToast(null), 3000);
    fetchParticipants();
    undoChanges(p.Student_id);
  };

  /* ---------------- CSV EXPORT ---------------- */
  const exportCSV = () => {
    const headers = [
      "Student Name",
      "Status",
      "Role",
      "Points",
    ];

    const rows = participants.map((p) => [
      p.Student_name,
      p.Participation_status,
      p.Role_in_event,
      p.Pts_earned,
    ]);

    const csv =
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `event_${eventId}_participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6 flex flex-col md:flex-row md:justify-between gap-4">
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
            className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50"
          >
            ← Back
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-800"
          >
            Export CSV
          </button>
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
          No students registered yet.
        </div>
      ) : (
        <ParticipantsTable
          participants={participants}
          editData={editData}
          updateLocal={updateLocal}
          onSave={save}
          onUndo={undoChanges}
        />
      )}
    </div>
  );
}

export default EventParticipants;
