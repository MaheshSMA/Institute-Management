import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/admin/events").then(res => setEvents(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-6">
        All Events
      </h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Event Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Club
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Duration
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((e) => (
              <tr key={e.Event_id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">
                  {e.Event_name}
                </td>
                <td className="px-4 py-3 text-sm">
                  {e.Club_name || e.Club_id}
                </td>
                <td className="px-4 py-3 text-sm">
                  {e.Duration || "—"}
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
