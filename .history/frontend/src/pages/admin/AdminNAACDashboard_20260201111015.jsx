//frontend/src/pages/admin/AdminNAACDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const badge = (status) => {
  if (status === "COMPLIANT")
    return "bg-green-100 text-green-700";
  if (status === "PARTIAL") 
    return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

function AdminNAACDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [cgpa, setCgpa] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    fetchStatus();
    fetchCGPA();
  }, []);

  const fetchCGPA = async () => {
    try {
      const res = await API.get("/naac/cgpa/latest");
      setCgpa(res.data);
    } catch (err) {
      console.error("Failed to fetch CGPA", err);
    }
  };



  const fetchStatus = async () => {
    try {
      const res = await API.get("/naac/status");
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runEvaluation = async () => {
  setMsg("Evaluating NAAC Criterion 2...");
  await API.post("/naac/evaluate/criterion-2");

  setMsg("Recomputing NAAC CGPA...");
  await API.post("/naac/cgpa/compute");

  setMsg("NAAC evaluation completed");
  fetchStatus();
  fetchCGPA();
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading NAAC dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            NAAC Accreditation Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time institutional compliance tracking
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Action */}
      {/* CGPA SUMMARY */}
{cgpa && (
  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-indigo-900">
          Overall NAAC CGPA
        </h2>
        <p className="text-sm text-indigo-700 mt-1">
          Computed as per NAAC weighted criteria model
        </p>
      </div>

      <div className="text-right">
        <div className="text-3xl font-bold text-indigo-900">
          {cgpa.CGPA}
        </div>
        <div className="text-sm font-semibold text-indigo-700">
          Grade: {cgpa.Grade}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Last updated: {new Date(cgpa.Calculated_at).toLocaleString()}
        </div>
      </div>
    </div>
  </div>
)}

      <button
        onClick={runEvaluation}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🔄 Re-evaluate Criterion 2
      </button>

      {msg && (
        <div className="mb-4 text-sm text-blue-700">
          {msg}
        </div>
      )}

      {/* Metrics Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50">
  <tr>
    <th className="px-4 py-3 text-left text-sm font-semibold">Metric</th>
    <th className="px-4 py-3 text-left text-sm font-semibold">Value</th>
    <th className="px-4 py-3 text-left text-sm font-semibold">Compliance</th>
    <th className="px-4 py-3 text-left text-sm font-semibold">Last Checked</th>
    <th className="px-4 py-3 text-left text-sm font-semibold">Evidence</th>
  </tr>
</thead>


          <tbody>
  {metrics.map((m) => (
    <tr key={m.Metric_code} className="border-t">
      <td className="px-4 py-3 font-medium">
        {m.Metric_name}
      </td>

      <td className="px-4 py-3 text-sm">
        {m.Current_value}
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${badge(
            m.Compliance
          )}`}
        >
          {m.Compliance}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(m.Last_checked).toLocaleString()}
      </td>

      {/* ✅ EVIDENCE BUTTON */}
      <td className="px-4 py-3">
        <button
          onClick={() => openEvidenceModal(m.Metric_code)}
          className="text-sm text-blue-600 hover:underline"
        >
          📎 Evidence
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default AdminNAACDashboard;
