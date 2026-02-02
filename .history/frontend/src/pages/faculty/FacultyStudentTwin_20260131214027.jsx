// frontend/src/pages/faculty/FacultyStudentTwin.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function FacultyStudentTwin() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [twin, setTwin] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchTwin();
  }, []);

  const fetchTwin = async () => {
    try {
      const [t, l] = await Promise.all([
        API.get(`/faculty/student/${studentId}/twin`),
        API.get(`/faculty/student/${studentId}/twin/logs`),
      ]);

      setTwin(t.data);
      setLogs(l.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runEvaluation = async () => {
  try {
    setMsg("Evaluating digital twin...");
    await API.post(`/faculty/student/${studentId}/twin/evaluate`);
    setMsg("Evaluation completed");
    fetchTwin();
  } catch (err) {
    console.error(err);
    setMsg("Evaluation failed");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading digital twin...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Student Digital Twin
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-700 hover:underline"
        >
          Back
        </button>
      </div>

      {/* Current State */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Current State</h2>

        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            twin?.Current_state === "NORMAL"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {twin?.Current_state || "UNKNOWN"}
        </span>

        <p className="text-xs text-gray-500 mt-2">
          Last updated:{" "}
          {twin?.Last_updated
            ? new Date(twin.Last_updated).toLocaleString()
            : "—"}
        </p>
      </div>

      {/* Run Engine */}
      <button
        onClick={runEvaluation}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🔁 Re-evaluate Twin
      </button>

      {msg && (
        <div className="mb-4 text-sm text-blue-700">
          {msg}
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          State Transition Timeline
        </h2>

        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">
            No transitions recorded yet.
          </p>
        ) : (
          <ol className="border-l-2 border-blue-200 pl-4 space-y-4">
            {logs.map((log) => (
              <li key={log.Log_id}>
                <div className="text-sm font-semibold">
                  {log.Old_state} → {log.New_state}
                </div>
                <div className="text-xs text-gray-600">
                  Rule: {log.Rule_code}
                </div>
                <div className="text-xs text-gray-500">
                  {log.Explanation}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {new Date(log.Created_at).toLocaleString()}

                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default FacultyStudentTwin;
