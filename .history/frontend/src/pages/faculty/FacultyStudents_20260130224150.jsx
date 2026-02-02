import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const facId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!facId) {
      navigate("/login/faculty");
      return;
    }

    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/faculty/my-students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading students...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Assigned Students
        </h1>

        <button
          onClick={() => navigate("/faculty/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Content */}
      {students.length === 0 ? (
        <div className="text-gray-600">No students assigned yet.</div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  USN
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                  Activity Points
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((stu) => (
                <tr
                  key={stu.Student_id}
                  onClick={async () => {
                    await API.patch(`/requests/mark-read/${stu.Student_id}`);
                    navigate(`/faculty/students/${stu.Student_id}`);
                  }}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span>{stu.Student_name}</span>

                      {stu.unread_count > 0 && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm">{stu.USN}</td>
                  <td className="px-4 py-3 text-sm">{stu.Dept_code}</td>
                  <td className="px-4 py-3 text-sm">{stu.Year}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-800">
                    {stu.Activity_pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FacultyStudents;
