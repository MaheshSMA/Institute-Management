//frontend/src/pages/admin/AdminReports.jsx
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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading reports…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Administrative Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Institutional analytics and summaries
        </p>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STUDENT ACTIVITY POINTS */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Student Activity Points
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={points} barGap={6}>
                <XAxis hide axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(37,99,235,0.08)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="Activity_pts"
                  fill="#2563eb"
                  radius={[10, 10, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EVENT PARTICIPATION */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Event Participation
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={events} barGap={8}>
                <XAxis
                  dataKey="Event_name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(34,197,94,0.1)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="participants"
                  fill="#22c55e"
                  radius={[10, 10, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEPARTMENT-WISE STUDENTS */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Department-wise Student Distribution
          </h2>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={depts}
                  dataKey="total_students"
                  nameKey="Dept_code"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                >
                  {depts.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
