// backend/controllers/participationController.js
const db = require("../config/db");

/* ============================================================
   REGISTER STUDENT FOR EVENT
============================================================ */
const addParticipation = async (req, res) => {
  try {
    const studentId = req.user.refId;
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: "event_id required" });
    }

    await db.query(
      `
      INSERT INTO PARTICIPATION
        (Student_id, Event_id, Participation_status, Role_in_event, Pts_earned)
      VALUES (?, ?, 'Registered', 'Participant', 0)
      `,
      [studentId, event_id]
    );

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ============================================================
   GET PARTICIPANTS FOR AN EVENT
============================================================ */
const getParticipantsByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.Event_id,
        p.Student_id,
        p.Participation_status,
        p.Role_in_event,
        p.Pts_earned,
        s.Student_name
      FROM PARTICIPATION p
      JOIN STUDENT s ON p.Student_id = s.Student_id
      WHERE p.Event_id = ?
      `,
      [eventId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ============================================================
   GET EVENTS FOR A STUDENT
============================================================ */
const getEventsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.Event_id,
        p.Participation_status,
        p.Role_in_event,
        p.Pts_earned,
        e.Event_name,
        e.Event_date
      FROM PARTICIPATION p
      JOIN CLUB_EVENT e ON p.Event_id = e.Event_id
      WHERE p.Student_id = ?
      `,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching student events:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ============================================================
   BULK UPDATE PARTICIPATION STATUS
   (NO POINTS AWARDED HERE — SAFE)
============================================================ */
const bulkUpdateParticipation = async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;

  try {
    const [[event]] = await db.query(
      `
      SELECT Event_date
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
      return res.status(403).json({ error: "Event editing locked" });
    }

    await db.query(
      `
      UPDATE PARTICIPATION
      SET Participation_status = ?
      WHERE Event_id = ?
      `,
      [status, eventId]
    );

    res.json({ message: "Bulk status update successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateParticipation = async (req, res) => {
  const { eventId, studentId } = req.params;
  const { status, role, pts } = req.body;

  try {
    /* ---------- 1️⃣ Event lock check ---------- */
    const [[event]] = await db.query(
      `
      SELECT Event_date
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
        error: "Event has ended. Editing is locked."
      });
    }

    /* ---------- 2️⃣ Fetch current participation ---------- */
    const [[current]] = await db.query(
      `
      SELECT Participation_status, Pts_earned
      FROM PARTICIPATION
      WHERE Event_id = ? AND Student_id = ?
      `,
      [eventId, studentId]
    );

    if (!current) {
      return res.status(404).json({ error: "Participation not found" });
    }

    const oldPts = Number(current.Pts_earned) || 0;
    const newPts = Number(pts) || 0;

    /* ---------- 3️⃣ Update PARTICIPATION ---------- */
    await db.query(
      `
      UPDATE PARTICIPATION
      SET
        Participation_status = ?,
        Role_in_event = ?,
        Pts_earned = ?
      WHERE Event_id = ? AND Student_id = ?
      `,
      [status, role, newPts, eventId, studentId]
    );

    /* ---------- 4️⃣ Increment STUDENT.Activity_pts if needed ---------- */
    if (status === "Completed") {
      let delta = 0;

      if (current.Participation_status === "Completed") {
        // Edited points after completion → add only the difference
        delta = newPts - oldPts;
      } else {
        // Newly completed → add full points
        delta = newPts;
      }

      if (delta !== 0) {
        await db.query(
          `
          UPDATE STUDENT
          SET Activity_pts = COALESCE(Activity_pts, 0) + ?
          WHERE Student_id = ?
          `,
          [delta, studentId]
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
