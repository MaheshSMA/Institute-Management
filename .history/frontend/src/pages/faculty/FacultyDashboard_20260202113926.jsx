// frontend/src/pages/faculty/FacultyDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function FacultyDashboard() {
  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [stats, setStats] = useState({
    students: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    clubs: 0,
  });

  useEffect(() => {
    const facId = Number(localStorage.getItem("ref_id"));
    if (!facId) {
      navigate("/login/faculty");
      return;
    }

    // Faculty profile
    API.get(`/faculty/${facId}`)
      .then((res) => {
        setFacultyName(res.data.Fac_name);
      })
      .catch(console.error);

    // Dashboard stats (SINGLE source of truth)
    API.get("/faculty/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats", err);
      });
  }, [navigate]);

  const isCoordinator = stats.clubs > 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Welcome{facultyName ? `, ${facultyName}` : ""} 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage students, requests, and club activities
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login/faculty");
          }}
          className="mt-4 sm:mt-0 text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Assigned Students" value={stats.students} />
        <StatCard label="Pending Requests" value={stats.pendingRequests} />
        <StatCard label="Approved Requests" value={stats.approvedRequests} />
        <StatCard label="Clubs Coordinated" value={stats.clubs} />
      </div>

      {/* TODAY'S ACTIONS */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-10">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Today’s Actions
        </h2>

        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex justify-between">
            <span>Review student requests</span>
            <button
              onClick={() => navigate("/faculty/requests")}
              className="text-blue-700 hover:underline"
            >
              Review →
            </button>
          </li>

          <li className="flex justify-between">
            <span>Check AI risk insights</span>
            <button
              onClick={() => navigate("/faculty/ai-insights")}
              className="text-blue-700 hover:underline"
            >
              View →
            </button>
          </li>

          {isCoordinator && (
            <li className="flex justify-between">
              <span>Manage club activities</span>
              <button
                onClick={() => navigate("/faculty/club")}
                className="text-blue-700 hover:underline"
              >
                Open →
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* MAIN ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Assigned Students"
          desc="View and manage students assigned to you"
          onClick={() => navigate("/faculty/students")}
        />

        <DashboardCard
          title="AI Student Insights"
          desc="Early warnings, engagement & risk analysis"
          highlight
          onClick={() => navigate("/faculty/ai-insights")}
        />

        <DashboardCard
          title="Student Requests"
          desc="Approve or reject requests"
          onClick={() => navigate("/faculty/requests")}
        />

        {/* {isCoordinator && (
          <DashboardCard
            title="Club Dashboard"
            desc="Manage your club and its events"
            onClick={() => navigate("/faculty/club")}
          />
        )}

        <DisabledCard
          title="Document Viewer"
          desc="View uploaded proofs (Coming Soon)"
        /> */}
      </div>
    </div>
  );
}

/* ===== Reusable Components ===== */

const StatCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl shadow-sm p-6">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <h2 className="text-3xl font-bold text-blue-900">{value}</h2>
  </div>
);

const DashboardCard = ({ title, desc, onClick, highlight }) => (
  <div
    onClick={onClick}
    className={`border rounded-xl p-6 cursor-pointer transition
      ${
        highlight
          ? "bg-blue-50 border-blue-200 hover:shadow-md"
          : "bg-white hover:shadow-sm"
      }`}
  >
    <h2 className="text-xl font-semibold text-blue-800 mb-2">
      {title}
    </h2>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

const DisabledCard = ({ title, desc }) => (
  <div className="bg-gray-100 border border-dashed rounded-xl p-6 text-gray-500 cursor-not-allowed">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-sm">{desc}</p>
  </div>
);

export default FacultyDashboard;
