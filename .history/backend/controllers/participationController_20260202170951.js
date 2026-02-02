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

const bulkUpdateParticipation = async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body; // "Attended" | "Completed"

  try {
    // Lock check (reuse logic)
    const [[event]] = await db.query(
      `SELECT Event_date, Activity_points FROM CLUB_EVENT WHERE Event_id = ?`,
      [eventId]
    );

    const today = new Date().toISOString().split("T")[0];
    if (event.Event_date < today) {
      return res.status(403).json({ error: "Event editing locked" });
    }

    // Update participation
    await db.query(
      `
      UPDATE PARTICIPATION
      SET Participation_status = ?
      WHERE Event_id = ?
      `,
      [status, eventId]
    );

    // If Completed → award points
    if (status === "Completed") {
      await db.query(
        `
        UPDATE STUDENT s
        JOIN PARTICIPATION p ON s.Student_id = p.Student_id
        SET s.Activity_pts = s.Activity_pts + ?
        WHERE p.Event_id = ?
        `,
        [event.Activity_points, eventId]
      );
    }

    res.json({ message: "Bulk update successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const updateParticipation = async (req, res) => {
  const { eventId, studentId } = req.params;
  const { status, role, pts } = req.body;

  try {
    // 1️⃣ Fetch current status
    const [[current]] = await db.query(
      `
      SELECT Participation_status
      FROM PARTICIPATION
      WHERE Event_id = ? AND Student_id = ?
      `,
      [eventId, studentId]
    );

    if (!current) {
      return res.status(404).json({ error: "Participation not found" });
    }

    // 2️⃣ Fetch event details (FIXED)
    const [[event]] = await db.query(
      `
      SELECT Event_date, Activity_points
      FROM CLUB_EVENT
      WHERE Event_id = ?
      `,
      [eventId]
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const today = new Date().toISOString().split("T")[0];

    if (event.Event_date < today) {
      return res.status(403).json({
        error: "Event has already ended. Editing is locked."
      });
    }

    // 3️⃣ Update participation
    await db.query(
      `
      UPDATE PARTICIPATION
      SET
        Participation_status = ?,
        Role_in_event = ?,
        Pts_earned = ?
      WHERE Event_id = ? AND Student_id = ?
      `,
      [status, role, pts, eventId, studentId]
    );

    // 4️⃣ Award points ONLY once
    if (
      current.Participation_status !== "Completed" &&
      status === "Completed"
    ) {
      const points = Number(event.Activity_points) || 0;

      if (points > 0) {
        await db.query(
          `
          UPDATE STUDENT
          SET Activity_pts = COALESCE(Activity_pts, 0) + ?
          WHERE Student_id = ?
          `,
          [points, studentId]
        );
      }
    }

    res.json({ message: "Participation updated successfully" });
  } catch (err) {
    console.error("updateParticipation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  addParticipation,
  getParticipantsByEvent,
  getEventsByStudent,
  updateParticipation,
  bulkUpdateParticipation
};
