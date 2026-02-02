// frontend/src/pages/club/ClubMembers.jsx
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ClubMembers() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/clubs/members/requests");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (studentId, status) => {
    try {
      await API.put(`/clubs/members/${studentId}`, { status });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const badge = (status) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "Approved")
      return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected")
      return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
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
              {members.map((m) => (
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
                    {m.Status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateStatus(
                              m.Student_id,
                              "Approved"
                            )
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              m.Student_id,
                              "Rejected"
                            )
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        —
                      </span>
                    )}
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

export default ClubMembers;
