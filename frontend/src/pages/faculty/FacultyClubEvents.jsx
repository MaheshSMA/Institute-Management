import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function FacultyClubEvents() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events/my-club");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    }
  };

  const createEvent = async () => {
    try {
      await API.post("/events", {
        event_name: name,
        description: desc,
        duration,
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <div>
      <h2>My Club Events</h2>

      <input placeholder="Event name" onChange={e => setName(e.target.value)} />
      <input placeholder="Description" onChange={e => setDesc(e.target.value)} />
      <input placeholder="Duration" onChange={e => setDuration(e.target.value)} />

      <button onClick={createEvent}>Create Event</button>

      <ul>
        {events.map(e => (
          <li key={e.Event_id}>
            {e.Event_name} | {e.Duration}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FacultyClubEvents;
