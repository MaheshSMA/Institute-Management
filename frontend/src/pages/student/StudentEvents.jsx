import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const studentId = localStorage.getItem("ref_id");

  useEffect(() => {
    if (!studentId) {
      navigate("/login/student");
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const participate = async (eventId) => {
    setMessage("");

    try {
      await API.post("/participation", {
        student_id: studentId,
        event_id: eventId,
      });

      setMessage("Successfully registered for the event");
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Failed to register for event"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">
          Available Events
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

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-gray-600">No events available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div
              key={e.Event_id}
              className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">
                  {e.Event_name}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {e.Description || "No description provided"}
                </p>

                <p className="text-sm text-gray-700">
                  <span className="font-medium">Duration:</span>{" "}
                  {e.Duration || "—"}
                </p>
              </div>

              <button
                onClick={() => participate(e.Event_id)}
                className="
                  mt-4 py-2 rounded-md font-medium transition
                  bg-blue-700 text-white hover:bg-blue-800
                "
              >
                Participate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentEvents;
