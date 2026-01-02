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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Choose a Counsellor
        </h1>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-md p-2">
          {message}
        </div>
      )}

      {/* Faculty List */}
      {faculty.length === 0 ? (
        <div className="text-gray-600">
          No faculty available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((f) => (
            <div
              key={f.Fac_id}
              className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  {f.Fac_name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Department: {f.Dept_code}
                </p>
              </div>

              <button
                onClick={() => sendRequest(f.Fac_id)}
                className="
                  mt-4 py-2 rounded-md font-medium transition
                  bg-blue-700 text-white hover:bg-blue-800
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