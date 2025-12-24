import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!studentId) {
      navigate("/login/student");
      return;
    }

    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const res = await API.get(`/students/${studentId}`);
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/student");
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Student Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Profile
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {student.Student_name}
            </p>
            <p>
              <span className="font-medium">USN:</span>{" "}
              {student.USN}
            </p>
            <p>
              <span className="font-medium">Department:</span>{" "}
              {student.Dept_code}
            </p>
            <p>
              <span className="font-medium">Year:</span>{" "}
              {student.Year}
            </p>
            <p>
              <span className="font-medium">Counsellor:</span>{" "}
              {student.Supervised_by
                ? student.Supervised_by
                : "Not Assigned"}
            </p>
          </div>
        </div>

        {/* ACTIVITY POINTS */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600 mb-2">
            Activity Points
          </p>
          <h1 className="text-5xl font-bold text-blue-900">
            {student.Activity_pts}
          </h1>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <button
          onClick={() => navigate("/student/events")}
          className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
        >
          View Events
        </button>

        <button
          onClick={() => navigate("/student/requests")}
          className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
        >
          My Requests
        </button>

        <button
          onClick={() => navigate("/student/faculty")}
          className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition"
        >
          Request Counsellor
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
