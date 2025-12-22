import {
  Users,
  GraduationCap,
  CalendarDays,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Students",
      desc: "Manage student records & activity points",
      icon: <Users size={28} />,
      path: "/admin/students",
    },
    {
      title: "Faculty",
      desc: "Counsellors, coordinators & assignments",
      icon: <GraduationCap size={28} />,
      path: "/admin/faculty",
    },
    {
      title: "Events",
      desc: "Clubs, events & participation",
      icon: <CalendarDays size={28} />,
      path: "/admin/events",
    },
    {
      title: "Reports",
      desc: "Analytics & institutional summaries",
      icon: <BarChart3 size={28} />,
      path: "/admin/reports",
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-blue-900 mb-6">
        Admin Overview
      </h1>

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
              shadow-sm
              hover:shadow-md
              transition
              border
            "
          >
            <div className="flex items-center gap-4 mb-4 text-blue-800">
              {c.icon}
              <h2 className="text-lg font-semibold">
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
