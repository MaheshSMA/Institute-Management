//frontend/src/pages/admin/AdminFaculty.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    API.get("/admin/faculty").then(res => setFaculty(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          All Faculty
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          List of faculty members and their assigned roles
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">
                Name
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Email
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Department
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((f) => (
              <tr
                key={f.Fac_id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {f.Fac_name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {f.Fac_email}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {f.Dept_code}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  <span className="inline-flex items-center gap-1">
                    {f.Is_Counsellor ? "Counsellor" : "Faculty"}
                    {f.Is_Club_Coordinator && (
                      <span className="text-gray-400">/</span>
                    )}
                    {f.Is_Club_Coordinator && "Club Coordinator"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFaculty;
