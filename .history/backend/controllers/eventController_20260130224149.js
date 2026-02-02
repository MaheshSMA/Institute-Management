const db = require('../config/db');

const createEvent = async (req, res) => {
  const { event_name, description, duration } = req.body;
  const { role, refId } = req.user;

  let clubId;

  if (role === "Club") {
    clubId = refId;
  } 
  else if (role === "Faculty") {
    const [rows] = await db.query(
      "SELECT Club_id FROM CLUB WHERE Coordinator_id = ?",
      [refId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ error: "Not a club coordinator" });
    }
    clubId = rows[0].Club_id;
  } 
  else {
    return res.status(403).json({ error: "Not authorized" });
  }

  await db.query(
    `INSERT INTO EVENT (Event_name, Description, Duration, Club_id)
     VALUES (?, ?, ?, ?)`,
    [event_name, description, duration, clubId]
  );

  res.status(201).json({ message: "Event created successfully" });
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
  const { role, refId } = req.user;

  let clubId;

  if (role === "Club") {
    clubId = refId;
  } else if (role === "Faculty") {
    const [rows] = await db.query(
      "SELECT Club_id FROM CLUB WHERE Coordinator_id = ?",
      [refId]
    );
    if (rows.length === 0) return res.status(403).json({ error: "Not allowed" });
    clubId = rows[0].Club_id;
  }

  const [result] = await db.query(
    `UPDATE EVENT
     SET Event_name=?, Description=?, Duration=?
     WHERE Event_id=? AND Club_id=?`,
    [event_name, description, duration, eventId, clubId]
  );

  if (result.affectedRows === 0) {
    return res.status(403).json({ error: "Cannot edit this event" });
  }

  res.json({ message: "Event updated" });
};

const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const facId = req.user.refId;

  try {
    // 1️⃣ Get faculty's club
    const [clubRows] = await db.query(
      `SELECT Club_id FROM CLUB WHERE Coordinator_id = ?`,
      [facId]
    );

    if (clubRows.length === 0) {
      return res.status(403).json({
        error: "You are not a club coordinator",
      });
    }

    const clubId = clubRows[0].Club_id;

    // 2️⃣ Check event belongs to this club
    const [eventRows] = await db.query(
      `SELECT Event_id FROM EVENT WHERE Event_id = ? AND Club_id = ?`,
      [eventId, clubId]
    );

    if (eventRows.length === 0) {
      return res.status(403).json({
        error: "Event does not belong to your club",
      });
    }

    // 3️⃣ Delete
    await db.query(
      `DELETE FROM EVENT WHERE Event_id = ?`,
      [eventId]
    );

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    res.status(500).json({ error: "Server error" });
  }
};






module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  getMyClubEvents,
  getEventsByClub,
  deleteEvent,
};