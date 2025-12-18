const db = require('../config/db');

const createEvent = async (req, res) => {
  try {
    const { event_name, description, duration, club_id } = req.body;

    if (!event_name || !club_id) {
      return res.status(400).json({
        error: 'event_name and club_id are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO EVENT (Event_name, Description, Duration, Club_id)
       VALUES (?, ?, ?, ?)`,
      [event_name, description || null, duration || null, club_id]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event_id: result.insertId,
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Server error' });
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
  const { clubId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM EVENT WHERE Club_id = ?',
      [clubId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events by club:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByClub,
};
