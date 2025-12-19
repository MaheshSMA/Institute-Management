const db = require('../config/db');

const createEvent = async (req, res) => {
  try {
    const { event_name, description, duration } = req.body;
    const facId = req.user.refId; // faculty id from JWT

    if (!event_name) {
      return res.status(400).json({ error: "event_name is required" });
    }

    // 🔐 Get club owned by this faculty
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

    const [result] = await db.query(
      `INSERT INTO EVENT (Event_name, Description, Duration, Club_id)
       VALUES (?, ?, ?, ?)`,
      [event_name, description || null, duration || null, clubId]
    );

    res.status(201).json({
      message: "Event created successfully",
      event_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating event:", err);
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
  getEventsByClub,
};