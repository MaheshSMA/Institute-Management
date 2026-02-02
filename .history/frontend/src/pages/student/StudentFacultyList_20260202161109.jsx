// frontend/src/pages/student/StudentFacultyList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentFacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login/student");
      return;
    }
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await API.get("/faculty");
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (facId) => {
    setMessage("");

    try {
      await API.post("/requests", {
        fac_id: facId,
        type: "Counsellor Join",
        reason: "Requesting counsellor assignment",
      });

      setMessage("Counsellor request sent successfully");
    } catch (err) {
      setMessage("Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Choose a Counsellor
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a faculty member to request counsellor assignment
          </p>
        </div>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* FACULTY LIST */}
      {faculty.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-600 shadow-sm">
          No faculty available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((f) => (
            <div
              key={f.Fac_id}
              className="
                bg-white border rounded-2xl shadow-sm p-6
                flex flex-col justify-between
                hover:shadow-md transition
              "
            >
              {/* Faculty Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {f.Fac_name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Department
                </p>
                <p className="text-sm font-medium text-blue-800">
                  {f.Dept_code}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => sendRequest(f.Fac_id)}
                className="
                  mt-6 py-2.5 rounded-lg font-medium text-sm
                  bg-blue-700 text-white
                  hover:bg-blue-800 transition
                "
              >
                Request Counsellor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentFacultyList;
