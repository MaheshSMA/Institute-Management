const db = require("../config/db");

const to24Hour = (time) => {
  const [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":");

  if (modifier === "PM" && hours !== "12") hours = +hours + 12;
  if (modifier === "AM" && hours === "12") hours = "00";

  return `${hours}:${minutes}:00`;
};


const createEvent = async (req, res) => {
  try {
    const clubId = req.user.refId; // from JWT
    const {
      event_name,
      description,
      event_date,
      start_time,
      end_time,
      venue,
      activity_points
    } = req.body;

    if (!event_name || !event_date || !start_time || !end_time || !venue) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.query(
      `INSERT INTO CLUB_EVENT
       (Club_id, Event_name, Description, Event_date,
        Start_time, End_time, Venue, Activity_points)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clubId,
        event_name,
        description,
        event_date,
        to24Hour(startTime),
        to24Hour(endTime),
        venue,
        activity_points || 0
      ]
    );

    res.json({ message: "Event created successfully" });

  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

module.exports = {
  createEvent
};
