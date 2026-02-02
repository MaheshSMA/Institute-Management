// frontend/src/pages/club/ClubDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function ClubDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    API.get("/clubs/stats").then(res => setStats(res.data));
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-blue-900">
          Club Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage events, participants, and club activities
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Total Events</p>
          <h2 className="text-3xl font-bold text-blue-900">0</h2>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Participants</p>
          <h2 className="text-3xl font-bold text-blue-900">0</h2>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Activity Points Issued</p>
          <h2 className="text-3xl font-bold text-blue-900">0</h2>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CREATE EVENT */}
        <DashboardCard
          title="Create Event"
          desc="Create and publish new club events"
          onClick={() => navigate("/club/events/create")}
        />

        {/* MANAGE EVENTS */}
        <DashboardCard
          title="Manage Events"
          desc="View, edit, or complete your events"
          onClick={() => navigate("/club/events")}
        />

        {/* PARTICIPANTS */}
        <DashboardCard
          title="Participants"
          desc="View registered students and attendance"
          onClick={() => navigate("/club/participants")}
        />

        {/* MESSAGES (FUTURE) */}
        <DisabledCard
          title="Messages"
          desc="Communicate with participants (Coming Soon)"
        />

        {/* ANALYTICS (FUTURE) */}
        <DisabledCard
          title="Analytics"
          desc="Participation & engagement insights (Coming Soon)"
        />
      </div>
    </div>
  );
}

const DashboardCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
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

export default ClubDashboard;
