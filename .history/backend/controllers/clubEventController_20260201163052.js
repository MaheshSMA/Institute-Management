const db = require("../config/db");

const getClubEvents = async (req, res) => {
  try {
    const clubId = req.user.refId;

    const [events] = await db.query(
      `SELECT *
       FROM CLUB_EVENT
       WHERE Club_id = ?
       ORDER BY Event_date DESC, Start_time DESC`,
      [clubId]
    );

    res.json(events);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const clubId = req.user.refId;
    const { eventId } = req.params;

    const [result] = await db.query(
      `DELETE FROM CLUB_EVENT
       WHERE Event_id = ? AND Club_id = ?`,
      [eventId, clubId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};


const createEvent = async (req, res) => {
  console.log("🔥 CREATE EVENT HIT");
  console.log("User:", req.user);
  console.log("Body:", req.body);

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
        description || null,
        event_date,
        start_time,      // already HH:mm
        end_time,        // already HH:mm
        venue,
        Number(activity_points) || 0
      ]
    );

    res.json({ message: "Event created successfully" });

  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

module.exports = {
  createEvent,
  getClubEvents,
  deleteEvent
};

