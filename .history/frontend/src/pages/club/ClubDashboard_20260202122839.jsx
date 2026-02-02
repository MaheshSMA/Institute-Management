// frontend/src/pages/club/ClubDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";

function ClubDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalPoints: 0
  });

  useEffect(() => {
    API.get("/clubs/stats")
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("Failed to load club stats", err);
      });
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
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
        />

        <StatCard
          label="Participants"
          value={stats.totalParticipants}
        />

        <StatCard
          label="Activity Points Issued"
          value={stats.totalPoints}
        />
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Create Event"
          desc="Create and publish new club events"
          onClick={() => navigate("/club/events/create")}
        />

        <DashboardCard
          title="Manage Events"
          desc="View, edit, or complete your events"
          onClick={() => navigate("/club/events")}
        />

        <DashboardCard
          title="Participants"
          desc="View registered students and attendance"
          onClick={() => navigate("/club/participants")}
        />

        {/* <DashboardCard
          title="Messages"
          desc="Communicate with students"
          onClick={() => navigate("/club/messages")}
        /> */}


        <DashboardCard
          title="Members"
          desc="Approve or manage club members"
          onClick={() => navigate("/club/members")}
        />

        <DashboardCard
          title="Club Feed"
          desc="Post announcements for members"
          onClick={() => navigate("/club/feed")}
        />

      </div>
    </div>
  );
}

/* ===== Reusable components ===== */

const StatCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl shadow-sm p-6">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <h2 className="text-3xl font-bold text-blue-900">
      {value}
    </h2>
  </div>
);

const DashboardCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border rounded-xl shadow-sm p-6 cursor-pointer
               hover:shadow-md hover:-translate-y-1 transition-all"
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
