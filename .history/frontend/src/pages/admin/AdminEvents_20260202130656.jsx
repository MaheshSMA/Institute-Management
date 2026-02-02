//frontend/src/pages/admin/AdminEvents.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/admin/events").then(res => setEvents(res.data));
  }, []);
  
  const getDurationMinutes = (start, end) => {
    if (!start || !end) return "—";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return (endMinutes - startMinutes) / 60;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          All Events
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of all events conducted by clubs
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">
                Event Name
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Club
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Duration (hrs)
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((e) => (
              <tr
                key={e.Event_id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {e.Event_name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {e.Club_name || e.Club_id}
                </td>

                <td className="px-6 py-4 font-medium text-blue-700">
                  {getDurationMinutes(e.Start_time, e.End_time)} hrs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEvents;
