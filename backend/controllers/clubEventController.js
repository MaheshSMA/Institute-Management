// backend/controllers/clubEventController.js
const db = require("../config/db");

const getClubEvents = async (req, res) => {
  console.log("🔥 GET CLUB EVENTS HIT");
  console.log("Club ID:", req.user.refId);

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

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [[event]] = await db.query(
      `SELECT * FROM CLUB_EVENT WHERE Event_id = ?`,
      [eventId]
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ NORMALIZE FIELD NAMES
    res.json({
      event_name: event.Event_name,
      description: event.Description,
      event_date: event.Event_date
        .toISOString()
        .split("T")[0], // required for <input type="date">
      start_time: event.Start_time.slice(0, 5), // HH:MM
      end_time: event.End_time.slice(0, 5),
      venue: event.Venue,
      activity_points: event.Activity_points
    });
  } catch (err) {
    console.error("Fetch event error:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};


const updateEvent = async (req, res) => {
  try {
    const clubId = req.user.refId;
    const { eventId } = req.params;

    const {
      event_name,
      description,
      event_date,
      start_time,
      end_time,
      venue,
      activity_points
    } = req.body;

    await db.query(
      `UPDATE CLUB_EVENT
       SET Event_name = ?, Description = ?, Event_date = ?,
           Start_time = ?, End_time = ?, Venue = ?, Activity_points = ?
       WHERE Event_id = ? AND Club_id = ?`,
      [
        event_name,
        description,
        event_date,
        start_time,
        end_time,
        venue,
        activity_points,
        eventId,
        clubId
      ]
    );

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
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
  getEventById,
  updateEvent,
  deleteEvent
};

