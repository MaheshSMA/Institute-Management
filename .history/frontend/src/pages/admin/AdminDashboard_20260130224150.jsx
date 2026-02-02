import {
  Users,
  GraduationCap,
  CalendarDays,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Students",
      desc: "Manage student records & activity points",
      icon: <Users size={22} />,
      path: "/admin/students",
    },
    {
      title: "Faculty",
      desc: "Counsellors, coordinators & assignments",
      icon: <GraduationCap size={22} />,
      path: "/admin/faculty",
    },
    {
      title: "Events",
      desc: "Clubs, events & participation",
      icon: <CalendarDays size={22} />,
      path: "/admin/events",
    },
    {
      title: "Reports",
      desc: "Analytics & institutional summaries",
      icon: <BarChart3 size={22} />,
      path: "/admin/reports",
    },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            Admin Overview
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Institutional control panel
          </p>
        </div>

        <button
          onClick={logout}
          className="
            flex items-center gap-2
            text-sm text-red-600 hover:text-red-700
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            onClick={() => navigate(c.path)}
            className="
              cursor-pointer
              bg-white
              rounded-xl
              p-6
              border
              shadow-sm
              hover:shadow-md
              hover:border-blue-300
              transition
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                {c.icon}
              </div>
              <h2 className="text-lg font-semibold text-blue-900">
                {c.title}
              </h2>
            </div>

            <p className="text-sm text-gray-600">
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
