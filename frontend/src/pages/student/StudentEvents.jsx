import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentEvents() {
  const [events, setEvents] = useState([]);
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
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const participate = async (eventId) => {
    try {
      await API.post("/participation", {
        student_id: studentId,
        event_id: eventId
        // other fields are OPTIONAL (your backend sets defaults)
      });

      alert("Participation successful");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to participate");
    }
  };

  return (
    <div>
      <h2>Available Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.Event_id}>
              <p>{e.Event_name}</p>
              <p>{e.Description}</p>
              <p>{e.Duration}</p>

              <button onClick={() => participate(e.Event_id)}>
                Participate
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/student/dashboard")}>
        Back
      </button>
    </div>
  );
}

export default StudentEvents;
