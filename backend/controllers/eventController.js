const db = require('../config/db');

const createEvent = async (req, res) => {
  try {
    const facId = req.user.refId;
    const { event_name, description, duration } = req.body;

    const [club] = await db.query(
      "SELECT Club_id FROM CLUB WHERE Coordinator_id = ?",
      [facId]
    );

    if (!club || club.length === 0) {
      return res.status(403).json({
        error: "You are not assigned as a club coordinator",
      });
    }

    await db.query(
      `INSERT INTO EVENT (Event_name, Description, Duration, Club_id)
       VALUES (?, ?, ?, ?)`,
      [event_name, description, duration, club[0].Club_id]
    );

    res.status(201).json({ message: "Event created successfully" });
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
  


const getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM EVENT');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyClubEvents = async (req, res) => {
  try {
    const facId = req.user.refId;

    const [club] = await db.query(
      "SELECT Club_id FROM CLUB WHERE Coordinator_id = ?",
      [facId]
    );

    // ✅ GUARD CONDITION (THIS WAS MISSING)
    if (!club || club.length === 0) {
      return res.status(403).json({
        error: "You are not assigned as a club coordinator",
      });
    }

    const clubId = club[0].Club_id;

    const [events] = await db.query(
      "SELECT * FROM EVENT WHERE Club_id = ?",
      [clubId]
    );

    res.json(events);
  } catch (err) {
    console.error("getMyClubEvents error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const getEventsByClub = async (req, res) => {
  const facId = req.user.refId;

  try {
    const [clubRows] = await db.query(
      "SELECT Club_id FROM CLUB WHERE Coordinator_id = ?",
      [facId]
    );

    if (clubRows.length === 0) {
      return res.status(403).json({
        error: "You are not a club coordinator",
      });
    }

    const clubId = clubRows[0].Club_id;

    const [rows] = await db.query(
      "SELECT * FROM EVENT WHERE Club_id = ?",
      [clubId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching club events:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { event_name, description, duration } = req.body;
  const facId = req.user.refId;

  try {
    const [clubRows] = await db.query(
      "SELECT Club_id FROM CLUB WHERE Coordinator_id = ?",
      [facId]
    );

    if (clubRows.length === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const clubId = clubRows[0].Club_id;

    const [result] = await db.query(
      `UPDATE EVENT
       SET Event_name = ?, Description = ?, Duration = ?
       WHERE Event_id = ? AND Club_id = ?`,
      [event_name, description, duration, eventId, clubId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        error: "You cannot edit this event",
      });
    }

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  getMyClubEvents,
  getEventsByClub,
};