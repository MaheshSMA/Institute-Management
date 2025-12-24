import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login/student");
      return;
    }

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/student");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const base =
      "px-2 py-1 rounded-full text-xs font-semibold";

    if (status === "Approved")
      return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected")
      return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          My Requests
        </h1>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Table */}
      {requests.length === 0 ? (
        <div className="text-gray-600">
          No requests raised yet.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Points
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.Request_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm">
                    {req.Type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {req.Reason || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={statusBadge(req.Status)}>
                      {req.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {req.Pts_earned || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(req.Created_At).toLocaleDateString()}
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

export default StudentRequests;
