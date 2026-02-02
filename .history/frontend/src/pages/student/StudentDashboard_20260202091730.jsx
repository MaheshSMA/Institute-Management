// frontend/src/pages/student/StudentDashboard.jsx
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
  <div className="min-h-screen bg-slate-100 p-6">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Student Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {student.Student_name}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>

    {/* TOP GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-3">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">
          Profile Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
          <p>
            <span className="font-medium text-gray-500">Name</span><br />
            {student.Student_name}
          </p>

          <p>
            <span className="font-medium text-gray-500">USN</span><br />
            {student.USN}
          </p>

          <p>
            <span className="font-medium text-gray-500">Department</span><br />
            {student.Dept_code}
          </p>

          <p>
            <span className="font-medium text-gray-500">Year</span><br />
            {student.Year}
          </p>

          <p className="sm:col-span-2">
            <span className="font-medium text-gray-500">Counsellor</span><br />
            {student.Supervised_by || "Not Assigned"}
          </p>
        </div>
      </div>

      {/* ACTIVITY POINTS */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
        <p className="text-sm opacity-80 mb-1">Activity Points</p>
        <h1 className="text-5xl font-bold">
          {student.Activity_pts}
        </h1>
      </div>
    </div>

    {/* QUICK ACTIONS */}
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <button
          onClick={() => navigate("/student/events")}
          className="bg-white border rounded-xl p-5 text-left hover:shadow-md transition"
        >
          <h3 className="font-semibold text-blue-800 mb-1">
            Events
          </h3>
          <p className="text-sm text-gray-500">
            Browse & participate in events
          </p>
        </button>

        <button
          onClick={() => navigate("/student/requests")}
          className="bg-white border rounded-xl p-5 text-left hover:shadow-md transition"
        >
          <h3 className="font-semibold text-blue-800 mb-1">
            My Requests
          </h3>
          <p className="text-sm text-gray-500">
            Track approvals & submissions
          </p>
        </button>

        <button
          onClick={() => navigate("/student/faculty")}
          className="bg-white border rounded-xl p-5 text-left hover:shadow-md transition"
        >
          <h3 className="font-semibold text-blue-800 mb-1">
            Counsellor
          </h3>
          <p className="text-sm text-gray-500">
            Request or view counsellor
          </p>
        </button>

        <button
  onClick={() => navigate("/student/clubs")}
  className="bg-white border rounded-xl p-5 text-left hover:shadow-md transition"
>
  <h3 className="font-semibold text-blue-800 mb-1">
    Clubs
  </h3>
  <p className="text-sm text-gray-500">
    Join and participate in clubs
  </p>
</button>


        <button
          onClick={() => navigate("/student/messages")}
          className="bg-white border rounded-xl p-5 text-left hover:shadow-md transition"
        >
          <h3 className="font-semibold text-blue-800 mb-1">
            Messages
          </h3>
          <p className="text-sm text-gray-500">
            View faculty communications
          </p>
        </button>
      </div>
    </div>
  </div>
);

}

export default StudentDashboard;
