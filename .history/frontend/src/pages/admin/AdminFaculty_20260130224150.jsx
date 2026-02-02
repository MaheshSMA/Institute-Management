import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    API.get("/admin/faculty").then(res => setFaculty(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-6">
        All Faculty
      </h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((f) => (
              <tr key={f.Fac_id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">
                  {f.Fac_name}
                </td>
                <td className="px-4 py-3 text-sm">
                  {f.Fac_email}
                </td>
                <td className="px-4 py-3 text-sm">
                  {f.Dept_code}
                </td>
                <td className="px-4 py-3 text-sm">
                  {f.Is_Counsellor ? "Counsellor" : "Faculty"}
                  {f.Is_Club_Coordinator && " / Club Coordinator"}
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
