import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("Reason stated");
  const [reason, setReason] = useState("");
  const [ptsEarned, setPtsEarned] = useState(0);
  const [document, setDocument] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const sendRequest = async () => {

    if (!type) {
      setError("Request type is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("type", "Activity Point");
      formData.append("reason", reason);
      formData.append("pts_earned", ptsEarned);

      if (document) {
        formData.append("document", document);
      }

      await API.post("/requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReason("");
      setPtsEarned("");
      setDocument(null);

      fetchRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";

    if (status === "Approved") return `${base} bg-green-100 text-green-700`;
    if (status === "Rejected") return `${base} bg-red-100 text-red-700`;
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
        <h1 className="text-3xl font-semibold text-blue-900">My Requests</h1>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Send Request Card */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Send New Request
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Request Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Reason stated">Reason stated</option>
              <option value="Activity Point">Activity Point</option>
            </select>
          </div>

          {/* Points (only for Activity Point) */}
          {type === "Activity Point" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Points Requested
              </label>
              <input
                type="number"
                value={ptsEarned}
                onChange={(e) => setPtsEarned(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Reason */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            rows={3}
            placeholder="Explain your request..."
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Upload Document (optional)
          </label>

          <input
            type="file"
            onChange={(e) => setDocument(e.target.files[0])}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          onClick={sendRequest}
          disabled={submitting}
          className="mt-4 px-4 py-2 rounded-md text-white text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Send Request"}
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
        <div className="text-gray-600">No requests raised yet.</div>
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
                <tr key={req.Request_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{req.Type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {req.Reason || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={statusBadge(req.Status)}>
                      {req.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{req.Pts_earned || "—"}</td>
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
