// frontend/src/pages/student/StudentFacultyList.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentFacultyList() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([]);
  const [currentCounsellor, setCurrentCounsellor] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login/student");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facultyRes, counsellorRes] = await Promise.all([
        API.get("/faculty"),
        API.get("/student/counsellor") // 👈 current assignment
      ]);

      setFaculty(facultyRes.data);
      setCurrentCounsellor(counsellorRes.data || null);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load faculty list");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  const sendRequest = async (facId) => {
    setSubmittingId(facId);

    try {
      await API.post("/requests", {
        fac_id: facId,
        type: "Counsellor Join",
        reason: "Requesting counsellor assignment"
      });

      showToast("success", "Counsellor request sent successfully");

      // Optimistically block further requests
      setCurrentCounsellor({ pending: true });
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to send counsellor request");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading faculty list...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            Choose a Counsellor
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            You can be assigned to only one counsellor
          </p>
        </div>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* GLOBAL TOAST */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md text-sm
            ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* CURRENT COUNSELLOR BANNER */}
      {currentCounsellor && !currentCounsellor.pending && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-green-900">
            Counsellor Assigned
          </h2>
          <p className="text-sm text-green-800 mt-1">
            You are currently assigned to{" "}
            <span className="font-semibold">
              {currentCounsellor.Fac_name}
            </span>
          </p>
        </div>
      )}

      {currentCounsellor?.pending && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-yellow-900">
            Request Pending
          </h2>
          <p className="text-sm text-yellow-800 mt-1">
            Your counsellor request is awaiting approval
          </p>
        </div>
      )}

      {/* FACULTY GRID */}
      {faculty.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-gray-600 shadow-sm">
          No faculty available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((f) => {
            const isAssigned =
              currentCounsellor &&
              currentCounsellor.Fac_id === f.Fac_id;

            const isDisabled =
              currentCounsellor &&
              currentCounsellor.Fac_id !== f.Fac_id;

            return (
              <div
                key={f.Fac_id}
                className={`bg-white border rounded-2xl p-6 shadow-sm
                  flex flex-col justify-between transition
                  ${isDisabled ? "opacity-60" : "hover:shadow-md"}
                `}
              >
                {/* INFO */}
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

                {/* ACTION */}
                {isAssigned ? (
                  <span className="mt-6 inline-block text-center px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✔ Assigned Counsellor
                  </span>
                ) : (
                  <button
                    disabled={isDisabled || submittingId === f.Fac_id}
                    onClick={() => sendRequest(f.Fac_id)}
                    className={`mt-6 py-2.5 rounded-lg font-medium text-sm transition
                      ${
                        isDisabled
                          ? "bg-gray-300 cursor-not-allowed"
                          : submittingId === f.Fac_id
                          ? "bg-blue-300 cursor-wait"
                          : "bg-blue-700 text-white hover:bg-blue-800"
                      }`}
                  >
                    {submittingId === f.Fac_id
                      ? "Sending..."
                      : "Request Counsellor"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentFacultyList;
