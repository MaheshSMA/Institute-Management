import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function FacultyClubEvents() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events/my-club");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load events");
    }
  };

  const createEvent = async () => {
    if (!name.trim()) {
      setMessage("Event name is required");
      return;
    }

    try {
      await API.post("/events", {
        event_name: name,
        description: desc,
        duration,
      });

      setName("");
      setDesc("");
      setDuration("");
      setMessage("Event created successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-blue-900 mb-6">
        My Club Events
      </h1>

      {/* Message */}
      {message && (
        <div className="mb-4 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-md p-2">
          {message}
        </div>
      )}

      {/* Create Event */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Create New Event
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={createEvent}
          className="
            mt-4 px-6 py-2 rounded-md font-medium
            bg-blue-700 text-white hover:bg-blue-800 transition
          "
        >
          Create Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-gray-600">
          No events created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div
              key={e.Event_id}
              className="bg-white border rounded-xl shadow-sm p-5"
            >
              <h3 className="text-lg font-semibold text-blue-800">
                {e.Event_name}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                {e.Description || "No description"}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Duration:</span>{" "}
                {e.Duration || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FacultyClubEvents;
