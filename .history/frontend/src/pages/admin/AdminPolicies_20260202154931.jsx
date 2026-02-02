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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
    {/* ================= HEADER ================= */}
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-semibold text-blue-900">
          Institutional Policy Engine
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-xl">
          Define governance rules, monitor institutional constraints,
          and automatically detect compliance violations.
        </p>
      </div>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="text-sm text-blue-700 hover:underline"
      >
        Back to Dashboard
      </button>
    </div>

    {/* ================= MESSAGE ================= */}
    {msg && (
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        {msg}
      </div>
    )}

    {/* ================= CREATE POLICY ================= */}
    <div className="bg-white border rounded-2xl shadow-sm p-6 mb-10">
      <h2 className="text-lg font-semibold text-blue-800 mb-1">
        Create Policy Rule
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Policies define system-wide constraints that are enforced
        automatically by the policy engine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Policy name"
          value={form.policy_name}
          onChange={(e) =>
            setForm({ ...form, policy_name: e.target.value })
          }
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <select
          value={form.policy_type}
          onChange={(e) =>
            setForm({ ...form, policy_type: e.target.value })
          }
          className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
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
          className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
        >
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
        </select>

        <input
          type="number"
          placeholder="Threshold"
          value={form.threshold_value}
          onChange={(e) =>
            setForm({
              ...form,
              threshold_value: Number(e.target.value),
            })
          }
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      <button
        onClick={createPolicy}
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Policy
      </button>
    </div>

    {/* ================= POLICIES LIST ================= */}
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-10">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Active Policies
        </h2>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Target</th>
            <th className="px-4 py-3 text-left">Threshold</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {policies.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-8 text-center text-gray-500"
              >
                No policies defined yet.
              </td>
            </tr>
          ) : (
            policies.map((p) => (
              <tr
                key={p.Policy_id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {p.Policy_name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.Policy_type}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.Target_role}
                </td>
                <td className="px-4 py-3">
                  {p.Threshold_value}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.Is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.Is_active ? "Active" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* ================= VIOLATIONS ================= */}
    <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-red-700 mb-1">
        🚨 Active Policy Violations
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        These entities currently breach defined institutional
        constraints.
      </p>

      {violations.length === 0 ? (
        <p className="text-sm text-gray-500">
          No violations detected.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-red-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Policy</th>
              <th className="px-3 py-2 text-left">Target</th>
              <th className="px-3 py-2 text-left">Current</th>
              <th className="px-3 py-2 text-left">Threshold</th>
              <th className="px-3 py-2 text-left">Detected</th>
            </tr>
          </thead>

          <tbody>
            {violations.map((v) => (
              <tr
                key={v.Violation_id}
                className="border-t hover:bg-red-50/40"
              >
                <td className="px-3 py-2">
                  {v.Policy_name}
                </td>

                <td className="px-3 py-2">
                  {v.Target_role === "Student" ? (
                    <>
                      <div className="font-medium">
                        {v.Student_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({v.USN})
                      </div>
                    </>
                  ) : (
                    <span>Faculty #{v.Target_id}</span>
                  )}
                </td>

                <td className="px-3 py-2 font-semibold text-red-700">
                  {v.Current_value}
                </td>

                <td className="px-3 py-2">
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

    {/* ================= RUN ENGINE ================= */}
    <div className="flex justify-end">
      <button
        onClick={runEngine}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        🚨 Run Policy Engine
      </button>
    </div>
  </div>
);

}

export default AdminPolicies;
