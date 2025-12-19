import { useEffect, useState } from "react";
import API from "../../api/axios";

function FacultyClubEvents() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("");

  // club_id should be fetched once from backend based on faculty
  const clubId = 1; // TEMP: replace with actual club_id mapping

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await API.get(`/events/club/${clubId}`);
    setEvents(res.data);
  };

  const createEvent = async () => {
    await API.post("/events", {
      event_name: name,
      description: desc,
      duration,
      club_id: clubId,
    });
    fetchEvents();
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
