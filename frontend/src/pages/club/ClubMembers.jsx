// frontend/src/pages/club/ClubMembers.jsx
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ClubMembers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ---------------- FETCH MEMBERS ---------------- */
  const fetchMembers = async () => {
    try {
      const res = await API.get("/clubs/members/requests");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load membership requests");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOAST ---------------- */
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (studentId, status) => {
    setActionId(studentId);

    try {
      await API.put(`/clubs/members/${studentId}`, { status });

      // Optimistic update
      setMembers(prev =>
        prev.map(m =>
          m.Student_id === studentId
            ? { ...m, Status: status }
            : m
        )
      );

      showToast(
        "success",
        `Member ${status === "Approved" ? "approved" : "rejected"}`
      );
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update member status");
    } finally {
      setActionId(null);
    }
  };

  /* ---------------- BADGE ---------------- */
  const badge = (status) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "Approved")
      return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected")
      return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  const pendingCount = members.filter(m => m.Status === "Pending").length;
  const approvedCount = members.filter(m => m.Status === "Approved").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading member requests…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">
            Club Members
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage membership requests
          </p>
        </div>

        <button
          onClick={() => navigate("/club/dashboard")}
          className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 transition"
        >
          ← Back
        </button>
      </div>

      {/* SUMMARY */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex gap-6 text-sm">
        <div>
          Pending:{" "}
          <span className="font-semibold text-yellow-700">
            {pendingCount}
          </span>
        </div>
        <div>
          Approved:{" "}
          <span className="font-semibold text-green-700">
            {approvedCount}
          </span>
        </div>
      </div>

      {/* GLOBAL TOAST */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md text-sm
            ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* CONTENT */}
      {members.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          No membership requests.
        </div>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Student
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  USN
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {members.map((m) => {
                const isWorking = actionId === m.Student_id;
                const locked = m.Status !== "Pending";

                return (
                  <tr
                    key={m.Student_id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {m.Student_name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {m.USN}
                    </td>

                    <td className="px-6 py-4">
                      <span className={badge(m.Status)}>
                        {m.Status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {locked ? (
                        <span className="text-xs text-gray-400">
                          —
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            disabled={isWorking}
                            onClick={() =>
                              updateStatus(m.Student_id, "Approved")
                            }
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition
                              ${
                                isWorking
                                  ? "bg-green-300 cursor-not-allowed"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                          >
                            {isWorking ? "Saving…" : "Approve"}
                          </button>

                          <button
                            disabled={isWorking}
                            onClick={() =>
                              updateStatus(m.Student_id, "Rejected")
                            }
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition
                              ${
                                isWorking
                                  ? "bg-red-300 cursor-not-allowed"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

export default ClubMembers;
