// frontend/src/pages/admin/AdminFaculty.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/admin/students").then(res => setStudents(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-white border shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          All Students
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of registered students and their activity points
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
                USN
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Department
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Activity Points
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr
                key={s.Student_id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {s.Student_name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {s.USN}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {s.Dept_code}
                </td>

                <td className="px-6 py-4 font-semibold text-blue-700">
                  {s.Activity_pts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStudents;
