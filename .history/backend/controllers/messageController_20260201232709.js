//backend/controllers/messageController.js
const db = require("../config/db");

/**
 * GET messages between faculty and student
 * Faculty: only for assigned students
 * Student: only for their counsellor
 */
const getMessages = async (req, res) => {
  try {
    const user = req.user;
    let studentId;
    let facultyId;

    if (user.role === "Student") {
      studentId = user.refId;

      const [[student]] = await db.query(
        `SELECT Supervised_by FROM STUDENT WHERE Student_id = ?`,
        [studentId]
      );

      if (!student || !student.Supervised_by) return res.json([]);

      facultyId = student.Supervised_by;
    }

    else if (user.role === "Faculty") {
      facultyId = user.refId;
      studentId = req.params.studentId;

      const [[allowed]] = await db.query(
        `SELECT 1 FROM STUDENT 
         WHERE Student_id = ? AND Supervised_by = ?`,
        [studentId, facultyId]
      );

      if (!allowed) {
        return res.status(403).json({ error: "Unauthorized access" });
      }
    }

    else {
      return res.status(403).json({ error: "Invalid role" });
    }

    const [messages] = await db.query(
      `SELECT *
       FROM MESSAGE
       WHERE Student_id = ? AND Faculty_id = ?
       ORDER BY Created_At ASC`,
      [studentId, facultyId]
    );

    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// controllers/messageController.js
const getClubConversations = async (req, res) => {
  const clubId = req.user.refId;

  const [rows] = await db.query(`
    SELECT DISTINCT
      CASE
        WHEN Sender = 'Student' THEN Sender_id
        ELSE Receiver_id
      END AS Student_id,
      s.Student_name
    FROM MESSAGE m
    JOIN STUDENT s
      ON s.Student_id =
        CASE
          WHEN Sender = 'Student' THEN Sender_id
          ELSE Receiver_id
        END
    WHERE
      (Sender = 'Student' AND Receiver_id = ?)
      OR
      (Sender = 'Club' AND Sender_id = ?)
    ORDER BY MAX(m.Created_At) DESC
  `, [clubId, clubId]);

  res.json(rows);
};


/**
 * Send message
 */
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content required" });
    }

    let studentId;
    let facultyId;
    let sender;

    // 🟢 STUDENT SENDING
    if (user.role === "Student") {
      sender = "Student";
      studentId = user.refId;

      const [[student]] = await db.query(
        `SELECT Supervised_by FROM STUDENT WHERE Student_id = ?`,
        [studentId]
      );

      if (!student || !student.Supervised_by) {
        return res.status(400).json({ error: "No counsellor assigned" });
      }

      facultyId = student.Supervised_by;
    }

    // 🟢 FACULTY SENDING
    else if (user.role === "Faculty") {
      sender = "Faculty";
      facultyId = user.refId;
      studentId = req.params.studentId;

      // 🔒 CRITICAL CHECK (missing earlier)
      const [[allowed]] = await db.query(
        `SELECT 1 FROM STUDENT
         WHERE Student_id = ? AND Supervised_by = ?`,
        [studentId, facultyId]
      );

      if (!allowed) {
        return res.status(403).json({ error: "Unauthorized access" });
      }
    }

    else {
      return res.status(403).json({ error: "Invalid role" });
    }

    await db.query(
      `INSERT INTO MESSAGE
       (Student_id, Faculty_id, Sender, Content)
       VALUES (?, ?, ?, ?)`,
      [studentId, facultyId, sender, content.trim()]
    );

    res.status(201).json({ message: "Message sent" });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
