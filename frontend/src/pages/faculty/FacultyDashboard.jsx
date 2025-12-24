import React from "react";
import { useNavigate } from "react-router-dom";

function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-blue-900">
          Faculty Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage students, requests, and club activities
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Students */}
        <div
          onClick={() => navigate("/faculty/students")}
          className="
            bg-white border rounded-xl shadow-sm p-6 cursor-pointer
            hover:shadow-md transition
          "
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Assigned Students
          </h2>
          <p className="text-sm text-gray-600">
            View and manage students assigned to you as a counsellor
          </p>
        </div>

        {/* Requests */}
        <div
          onClick={() => navigate("/faculty/requests")}
          className="
            bg-white border rounded-xl shadow-sm p-6 cursor-pointer
            hover:shadow-md transition
          "
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Student Requests
          </h2>
          <p className="text-sm text-gray-600">
            Approve or reject counsellor and activity point requests
          </p>
        </div>

        {/* Club Events */}
        <div
          onClick={() => navigate("/faculty/club-events")}
          className="
            bg-white border rounded-xl shadow-sm p-6 cursor-pointer
            hover:shadow-md transition
          "
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Club Events
          </h2>
          <p className="text-sm text-gray-600">
            Create and manage events for your assigned club
          </p>
        </div>

        {/* Messaging (Coming Soon) */}
        <div
          className="
            bg-gray-100 border border-dashed rounded-xl p-6
            text-gray-500 cursor-not-allowed
          "
        >
          <h2 className="text-xl font-semibold mb-2">
            Messaging
          </h2>
          <p className="text-sm">
            Direct communication with students (Coming Soon)
          </p>
        </div>

        {/* File Viewer (Coming Soon) */}
        <div
          className="
            bg-gray-100 border border-dashed rounded-xl p-6
            text-gray-500 cursor-not-allowed
          "
        >
          <h2 className="text-xl font-semibold mb-2">
            Document Viewer
          </h2>
          <p className="text-sm">
            View uploaded proofs and documents (Coming Soon)
          </p>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
