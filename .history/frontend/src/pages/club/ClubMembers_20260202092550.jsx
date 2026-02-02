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
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Approved") return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected") return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Club Members
        </h1>

        <button
          onClick={() => navigate("/club/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back
        </button>
      </div>

      {members.length === 0 ? (
        <p className="text-gray-600">
          No membership requests.
        </p>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">USN</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.Student_id} className="border-t">
                  <td className="px-4 py-3">
                    {m.Student_name}
                  </td>
                  <td className="px-4 py-3">
                    {m.USN}
                  </td>
                  <td className="px-4 py-3">
                    <span className={badge(m.Status)}>
                      {m.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {m.Status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(m.Student_id, "Approved")
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(m.Student_id, "Rejected")
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                        >
                          Reject
                        </button>
                      </>
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
