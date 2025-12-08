const db = require('../config/db');

// ✅ Add participation
const addParticipation = async (req, res) => {
  try {
    const {
      student_id,
      event_id,
      participation_status,
      role_in_event,
      pts_earned,
    } = req.body;

    if (!student_id || !event_id) {
      return res.status(400).json({
        error: 'student_id and event_id are required',
      });
    }

    await db.query(
      `INSERT INTO PARTICIPATION
       (Student_id, Event_id, Participation_status, Role_in_event, Pts_earned)
       VALUES (?, ?, ?, ?, ?)`,
      [
        student_id,
        event_id,
        participation_status || 'Registered',
        role_in_event || 'Participant',
        pts_earned || 0,
      ]
    );

    res.status(201).json({
      message: 'Participation added successfully',
    });
  } catch (err) {
    console.error('Error adding participation:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ error: 'Student already registered for this event' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get all participants of an event
const getParticipantsByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.*, s.Student_name
       FROM PARTICIPATION p
       JOIN STUDENT s ON p.Student_id = s.Student_id
       WHERE p.Event_id = ?`,
      [eventId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get all events of a student
const getEventsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.*, e.Event_name
       FROM PARTICIPATION p
       JOIN EVENT e ON p.Event_id = e.Event_id
       WHERE p.Student_id = ?`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching student events:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addParticipation,
  getParticipantsByEvent,
  getEventsByStudent,
};
