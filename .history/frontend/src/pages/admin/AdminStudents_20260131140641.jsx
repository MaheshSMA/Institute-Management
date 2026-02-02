//frontend/src/pages/admin/AdminFaculty.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/admin/students").then(res => setStudents(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-6">
        All Students
      </h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                USN
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Activity Points
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.Student_id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">
                  {s.Student_name}
                </td>
                <td className="px-4 py-3 text-sm">
                  {s.USN}
                </td>
                <td className="px-4 py-3 text-sm">
                  {s.Dept_code}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-800">
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
