// frontend/src/pages/student/StudentEvents.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentEvents() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("ref_id");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    if (!studentId) {
      navigate("/login/student");
      return;
    }
    fetchEvents();
  }, []);

  /* ---------------- FETCH DATA ---------------- */
  const fetchEvents = async () => {
    try {
      const [eventsRes, participationRes] = await Promise.all([
        API.get("/events"),
        API.get(`/participation/student/${studentId}`)
      ]);

      const registeredIds = new Set(
        participationRes.data.map(p => p.Event_id)
      );

      const merged = eventsRes.data.map(e => ({
        ...e,
        isRegistered: registeredIds.has(e.Event_id)
      }));

      setEvents(merged);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOAST ---------------- */
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  /* ---------------- PARTICIPATION ---------------- */
  const participate = async (eventId) => {
    if (submittingId) return; // extra safety

    setSubmittingId(eventId);

    try {
      await API.post("/participation", {
        event_id: eventId
      });

      // Optimistic UI update
      setEvents(prev =>
        prev.map(e =>
          e.Event_id === eventId
            ? { ...e, isRegistered: true }
            : e
        )
      );

      showToast("success", "Successfully registered for the event");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.error || "Failed to register for event"
      );
    } finally {
      setSubmittingId(null);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const getDurationHours = (start, end) => {
    if (!start || !end) return "—";
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
  };

  const registeredCount = events.filter(e => e.isRegistered).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading events…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            Events
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse and participate in upcoming activities
          </p>
        </div>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* SUMMARY BAR */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Total Events:{" "}
          <span className="font-semibold text-blue-900">
            {events.length}
          </span>
        </div>
        <div className="text-sm text-gray-700">
          Registered:{" "}
          <span className="font-semibold text-green-700">
            {registeredCount}
          </span>
        </div>
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

      {/* EVENTS GRID */}
      {events.length === 0 ? (
        <p className="text-gray-600">No events available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => {
            const isSubmitting = submittingId === e.Event_id;

            return (
              <div
                key={e.Event_id}
                className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col justify-between
                           hover:shadow-md transition"
              >
                {/* INFO */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {e.Event_name}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    {e.Description || "No description provided"}
                  </p>

                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {getDurationHours(e.Start_time, e.End_time)} hrs
                    </div>
                  </div>
                </div>

                {/* ACTION */}
                {e.isRegistered ? (
                  <span className="mt-4 inline-block text-center px-3 py-2
                                   bg-green-100 text-green-700 rounded-full
                                   text-sm font-medium">
                    ✔ Registered
                  </span>
                ) : (
                  <button
                    disabled={isSubmitting}
                    onClick={() => participate(e.Event_id)}
                    className={`mt-4 py-2 rounded-lg font-medium transition
                      ${
                        isSubmitting
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-700 text-white hover:bg-blue-800"
                      }`}
                  >
                    {isSubmitting ? "Registering…" : "Participate"}
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

export default StudentEvents;
