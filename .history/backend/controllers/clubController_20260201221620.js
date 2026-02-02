const db = require('../config/db');

const getClubStats = async (req, res) => {
  const clubId = req.user.refId;

  try {
    const [[events]] = await db.query(
      `SELECT COUNT(*) AS totalEvents FROM CLUB_EVENT WHERE Club_id = ?`,
      [clubId]
    );

    const [[participants]] = await db.query(
      `
      SELECT COUNT(*) AS totalParticipants
      FROM PARTICIPATION p
      JOIN CLUB_EVENT e ON p.Event_id = e.Event_id
      WHERE e.Club_id = ?
      `,
      [clubId]
    );

    const [[points]] = await db.query(
      `
      SELECT SUM(p.Pts_earned) AS totalPoints
      FROM PARTICIPATION p
      JOIN CLUB_EVENT e ON p.Event_id = e.Event_id
      WHERE e.Club_id = ?
      `,
      [clubId]
    );

    res.json({
      totalEvents: events.totalEvents,
      totalParticipants: participants.totalParticipants,
      totalPoints: points.totalPoints || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const createClub = async (req, res) => {
  try {
    const { club_name, description, announcements, coordinator_id } = req.body;

    if (!club_name || !coordinator_id) {
      return res.status(400).json({
        error: 'club_name and coordinator_id are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO CLUB (Club_name, Description, Announcements, Coordinator_id)
       VALUES (?, ?, ?, ?)`,
      [club_name, description || null, announcements || null, coordinator_id]
    );

    res.status(201).json({
      message: 'Club created successfully',
      club_id: result.insertId,
    });
  } catch (err) {
    console.error('Error creating club:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllClubs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CLUB');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching clubs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getClubById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM CLUB WHERE Club_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching club:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
};
    