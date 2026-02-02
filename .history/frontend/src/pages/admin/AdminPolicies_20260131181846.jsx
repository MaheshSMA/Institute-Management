import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function AdminPolicies() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [violations, setViolations] = useState([]);

  const [form, setForm] = useState({
    policy_name: "",
    policy_type: "MAX_ACTIVITY_POINTS",
    target_role: "Student",
    threshold_value: 0,
  });

 useEffect(() => {
  fetchPolicies();
  fetchViolations();
}, []);


  const fetchPolicies = async () => {
    try {
      const res = await API.get("/admin/policies");
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchViolations = async () => {
    try {
        const res = await API.get("/admin/policies/violations");
        setViolations(res.data);
    } catch (err) {
        console.error(err);
    }
    };


  const createPolicy = async () => {
    try {
      await API.post("/admin/policies", form);
      setMsg("Policy created successfully");
      setForm({
        policy_name: "",
        policy_type: "MAX_ACTIVITY_POINTS",
        target_role: "Student",
        threshold_value: 0,
      });
      fetchPolicies();
    } catch (err) {
      console.error(err);
      setMsg("Failed to create policy");
    }
  };

  const runEngine = async () => {
  try {
    setMsg("Running policy engine...");
    const res = await API.post("/admin/policies/run");
    setMsg(`Policy engine complete — ${res.data.violations_detected} violations detected`);
    fetchViolations(); // 🔥 THIS WAS MISSING
  } catch (err) {
    console.error(err);
    setMsg("Failed to run policy engine");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading policies...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            Institutional Policies
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Define and enforce system-wide rules
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* MESSAGE */}
      {msg && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded p-2">
          {msg}
        </div>
      )}

      {/* CREATE POLICY */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">
          Create New Policy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Policy name"
            value={form.policy_name}
            onChange={(e) =>
              setForm({ ...form, policy_name: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <select
            value={form.policy_type}
            onChange={(e) =>
              setForm({ ...form, policy_type: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="MAX_ACTIVITY_POINTS">
              Max Activity Points
            </option>
            <option value="MAX_COUNSELLOR_LOAD">
              Max Counsellor Load
            </option>
          </select>

          <select
            value={form.target_role}
            onChange={(e) =>
              setForm({ ...form, target_role: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
          </select>

          <input
            type="number"
            placeholder="Threshold"
            value={form.threshold_value}
            onChange={(e) =>
              setForm({ ...form, threshold_value: Number(e.target.value) })
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={createPolicy}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Policy
        </button>
      </div>

      {/* POLICIES TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Target</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Threshold</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {policies.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No policies defined yet.
                </td>
              </tr>
            ) : (
              policies.map((p) => (
                <tr key={p.Policy_id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {p.Policy_name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {p.Policy_type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {p.Target_role}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {p.Threshold_value}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {p.Is_active ? "Active" : "Disabled"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIOLATIONS */}
<div className="bg-white border rounded-xl shadow-sm p-6 mt-8">
  <h2 className="text-lg font-semibold text-red-700 mb-4">
    🚨 Policy Violations
  </h2>

  {violations.length === 0 ? (
    <p className="text-sm text-gray-500">
      No violations detected.
    </p>
  ) : (
    <table className="w-full border-collapse">
      <thead className="bg-red-50">
        <tr>
          <th className="px-3 py-2 text-left text-sm font-semibold">Policy</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Target</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Current</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Threshold</th>
          <th className="px-3 py-2 text-left text-sm font-semibold">Detected</th>
        </tr>
      </thead>

      <tbody>
        {violations.map((v) => (
          <tr key={v.Violation_id} className="border-t">
            <td className="px-3 py-2 text-sm">
              {v.Policy_name}
            </td>
            <td className="px-3 py-2 text-sm">
            {v.Target_role === "Student" ? (
                <>
                <div className="font-medium">{v.Student_name}</div>
                <div className="text-xs text-gray-500">{v.USN}</div>
                </>
            ) : (
                <span>Faculty #{v.Target_id}</span>
            )}
            </td>

            <td className="px-3 py-2 text-sm font-semibold text-red-700">
              {v.Current_value}
            </td>
            <td className="px-3 py-2 text-sm">
              {v.Threshold_value}
            </td>
            <td className="px-3 py-2 text-xs text-gray-500">
              {new Date(v.Detected_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


      {/* RUN ENGINE */}
      <div className="mt-8">
        <button
          onClick={runEngine}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          🚨 Run Policy Engine
        </button>
      </div>
    </div>
  );
}

export default AdminPolicies;
