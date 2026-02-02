// frontend/src/pages/faculty/FacultyStudents.jsx
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

  const attentionBadge = (level) => {
    if (level === "urgent")
      return (
        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
          Urgent
        </span>
      );
    if (level === "needs_attention")
      return (
        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
          Needs Attention
        </span>
      );
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading students…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Assigned Students
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Students under your supervision
          </p>
        </div>

        <button
          onClick={() => navigate("/faculty/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* CONTENT */}
      {students.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-600 shadow-sm">
          No students assigned yet.
        </div>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  USN
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Department
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Year
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Activity Points
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Digital Twin
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
                  className="border-t hover:bg-blue-50/40 transition cursor-pointer"
                >
                  {/* STUDENT */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {stu.Student_name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          {attentionBadge(stu.attention_level)}
                          {stu.unread_count > 0 && (
                            <span className="flex items-center gap-1 text-xs text-red-600">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {stu.USN}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {stu.Dept_code}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {stu.Year}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-blue-800">
                    {stu.Activity_pts}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 🚨 VERY IMPORTANT
                        navigate(`/faculty/students/${stu.Student_id}/twin`);
                      }}
                      className="text-sm text-blue-700 hover:underline font-medium"
                    >
                      View Twin →
                    </button>
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
