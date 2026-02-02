import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login/faculty");
      return;
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/faculty");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, status) => {
    setMessage("");
    try {
      await API.patch(`/requests/${requestId}/status`, { status });
      setMessage(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update request");
    }
  };

  const statusBadge = (status) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "Approved")
      return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected")
      return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading requests…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Student Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and take action on assigned student requests
          </p>
        </div>

        <button
          onClick={() => navigate("/faculty/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      {/* CONTENT */}
      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
          No requests assigned to you.
        </div>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-6 py-4 border-b bg-slate-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Requests ({requests.length})
            </h2>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white sticky top-0 z-10">
                <tr className="border-b">
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.Request_id}
                    className="border-b last:border-b-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {req.Student_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {req.USN}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {req.Type}
                    </td>

                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      {req.Reason || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {req.Pts_earned || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className={statusBadge(req.Status)}>
                        {req.Status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {req.Document_path ? (
                        <a
                          href={`http://localhost:5000/${req.Document_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {req.Status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateStatus(req.Request_id, "Approved")
                            }
                            className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white hover:bg-green-700"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(req.Request_id, "Rejected")
                            }
                            className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyRequests;
