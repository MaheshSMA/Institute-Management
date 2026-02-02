// backend/controllers/participationController.js
const db = require('../config/db');

const addParticipation = async (req, res) => {
  try {
    const student_id = req.user.refId; // ✅ from token
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: "event_id required" });
    }

    await db.query(
      `INSERT INTO PARTICIPATION
       (Student_id, Event_id, Participation_status, Role_in_event, Pts_earned)
       VALUES (?, ?, 'Registered', 'Participant', 0)`,
      [student_id, event_id]
    );

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Already registered" });
    }
    res.status(500).json({ error: "Server error" });
  }
};


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

const getEventsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.*, e.Event_name, e.Event_date
      FROM PARTICIPATION p
      JOIN CLUB_EVENT e ON p.Event_id = e.Event_id
      WHERE p.Student_id = ?
      `,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching student events:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateParticipation = async (req, res) => {
  const { eventId, studentId } = req.params;
  const { status, role, pts } = req.body;

  try {
    // 1️⃣ Update participation row
    await db.query(
      `
      UPDATE PARTICIPATION
      SET
        Participation_status = ?,
        Role_in_event = ?,
        Pts_earned = ?
      WHERE Student_id = ? AND Event_id = ?
      `,
      [status, role, pts, studentId, eventId]
    );

    // 2️⃣ Add points to student (only if Completed)
    if (status === "Completed" && pts > 0) {
      await db.query(
        `
        UPDATE STUDENT
        SET Activity_pts = Activity_pts + ?
        WHERE Student_id = ?
        `,
        [pts, studentId]
      );
    }

    res.json({ message: "Participation updated" });
  } catch (err) {
    console.error("updateParticipation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  addParticipation,
  getParticipantsByEvent,
  getEventsByStudent,
  updateParticipation
};
