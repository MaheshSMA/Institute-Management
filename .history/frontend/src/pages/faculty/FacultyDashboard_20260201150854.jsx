//frontend/src/pages/faculty/FacultyDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function FacultyDashboard() {
  const navigate = useNavigate();
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
  const facId = Number(localStorage.getItem("ref_id"));

  // Fetch faculty profile
  API.get(`/faculty/${facId}`)
    .then(res => {
      setFacultyName(res.data.Fac_name);
    })
    .catch(console.error);

  // Check if coordinator
  API.get("/clubs")
    .then(res => {
      const hasClub = res.data.some(
        club => club.Coordinator_id === facId
      );
      setIsCoordinator(hasClub);
    })
    .catch(console.error);
}, []);


  return (
    <div className="min-h-screen bg-slate-50 p-6">
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


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Students */}
        <DashboardCard
          title="Assigned Students"
          desc="View and manage students assigned to you"
          onClick={() => navigate("/faculty/students")}
        />
        <DashboardCard
          title="AI Student Insights"
          desc="View AI-generated engagement and risk analysis"
          onClick={() => navigate("/faculty/ai-insights")}
        />
        {/* Requests */}
        <DashboardCard
          title="Student Requests"
          desc="Approve or reject requests"
          onClick={() => navigate("/faculty/requests")}
        />

        {/* Club Dashboard (only if coordinator) */}
        {isCoordinator && (
          <DashboardCard
            title="Club Dashboard"
            desc="Manage your club and its events"
            onClick={() => navigate("/faculty/club")}
          />
        )}

        {/* Disabled cards
        <DisabledCard
          title="Messaging"
          desc="Direct communication with students (Coming Soon)"
        /> */}

        <DisabledCard
          title="Document Viewer"
          desc="View uploaded proofs (Coming Soon)"
        />
      </div>
    </div>
  );
}

const DashboardCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
  >
    <h2 className="text-xl font-semibold text-blue-800 mb-2">{title}</h2>
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
