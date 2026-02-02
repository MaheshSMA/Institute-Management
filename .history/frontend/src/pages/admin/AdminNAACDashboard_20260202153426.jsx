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
  const [evidence, setEvidence] = useState([]);
const [file, setFile] = useState(null);
const [title, setTitle] = useState("");

  const openEvidenceModal = async (metricCode) => {
  setSelectedMetric(metricCode);
  setShowEvidence(true);

  const res = await API.get(
    `/naac/evidence/${metricCode}`
  );
  setEvidence(res.data);
};

const uploadEvidence = async () => {
  if (!file || !title) {
    alert("File and title required");
    return;
  }

  const form = new FormData();
  form.append("file", file);
  form.append("title", title);

  await API.post(
    `/naac/evidence/${selectedMetric}`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  // refresh evidence list
  openEvidenceModal(selectedMetric);

  // reset
  setFile(null);
  setTitle("");
};



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
    {/* HEADER */}
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

    {/* ================= CGPA SUMMARY ================= */}
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
              Last updated:{" "}
              {new Date(cgpa.Calculated_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ================= HEALTH SUMMARY ================= */}
    <div className="bg-white border rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-blue-900 mb-2">
        Institutional Health Summary
      </h2>

      {(() => {
        const compliant = metrics.filter(
          m => m.Compliance === "COMPLIANT"
        ).length;
        const partial = metrics.filter(
          m => m.Compliance === "PARTIAL"
        ).length;
        const non = metrics.filter(
          m => m.Compliance === "NON_COMPLIANT"
        ).length;

        let statusText = "partially compliant";
        let statusColor = "text-yellow-700";

        if (non === 0 && partial === 0) {
          statusText = "fully compliant";
          statusColor = "text-green-700";
        } else if (non > 0) {
          statusText = "at risk";
          statusColor = "text-red-700";
        }

        return (
          <>
            <p className="text-sm text-gray-700">
              Based on the latest NAAC evaluation, the institution is
              currently{" "}
              <span className={`font-semibold ${statusColor}`}>
                {statusText}
              </span>{" "}
              under Criterion 2.
            </p>

            <p className="text-sm text-gray-700 mt-2">
              {compliant} metric(s) meet NAAC benchmarks,{" "}
              {partial} require improvement, and{" "}
              {non} fall below expected standards.
            </p>
          </>
        );
      })()}
    </div>

    {/* ================= PRIMARY RISK ================= */}
    {metrics.some(m => m.Compliance === "NON_COMPLIANT") && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-red-900 mb-2">
          ⚠️ Primary Risk Areas
        </h2>

        <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">
          {metrics
            .filter(m => m.Compliance === "NON_COMPLIANT")
            .map(m => (
              <li key={m.Metric_code}>
                <span className="font-semibold">
                  {m.Metric_name}
                </span>{" "}
                is below NAAC expectations (Current value:{" "}
                {m.Current_value})
              </li>
            ))}
        </ul>
      </div>
    )}

    {/* ================= ACTIONABLE INSIGHTS ================= */}
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-indigo-900 mb-2">
        Recommended Actions
      </h2>

      <ul className="list-disc pl-5 text-sm text-indigo-800 space-y-1">
        {metrics.some(m => m.Metric_code === "2.3.1" && m.Compliance !== "COMPLIANT") && (
          <li>
            Increase faculty mentoring coverage by assigning counsellors
            to unmentored students.
          </li>
        )}

        {metrics.some(m => m.Metric_code === "2.2.1" && m.Compliance !== "COMPLIANT") && (
          <li>
            Review student intake or faculty strength to improve
            student–teacher ratio.
          </li>
        )}

        <li>
          Upload documentary evidence supporting mentoring, teaching
          methods, and academic initiatives.
        </li>
      </ul>
    </div>

    {/* ================= ACTION BUTTON ================= */}
    <button
      onClick={runEvaluation}
      className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      🔄 Re-evaluate Criterion 2
    </button>

    {msg && (
      <div className="mb-4 text-sm text-blue-700">
        {msg}
      </div>
    )}

    {/* ================= METRICS TABLE ================= */}
    <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Metric
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Value
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Compliance
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Last Checked
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Evidence
            </th>
          </tr>
        </thead>

        <tbody>
          {metrics.map(m => (
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

    {/* ================= EVIDENCE MODAL (UNCHANGED) ================= */}
    {showEvidence && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        {/* (keep your existing modal code here exactly as-is) */}
      </div>
    )}
  </div>
);

}

export default AdminNAACDashboard;
