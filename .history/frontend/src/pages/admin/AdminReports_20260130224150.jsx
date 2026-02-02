import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function AdminReports() {
  const [points, setPoints] = useState([]);
  const [events, setEvents] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/admin/reports/student-points"),
      API.get("/admin/reports/event-participation"),
      API.get("/admin/reports/dept-students"),
    ])
      .then(([p, e, d]) => {
        setPoints(p.data);
        setEvents(e.data);
        setDepts(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-blue-900">
          Administrative Reports
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Institutional analytics and summaries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Activity Points */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Student Activity Points
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={points}>
              <XAxis dataKey="Student_name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Activity_pts" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Event Participation */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Event Participation
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={events}>
              <XAxis dataKey="Event_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="participants" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Students */}
        <div className="bg-white border rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Department-wise Student Distribution
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={depts}
                dataKey="total_students"
                nameKey="Dept_code"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {depts.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
