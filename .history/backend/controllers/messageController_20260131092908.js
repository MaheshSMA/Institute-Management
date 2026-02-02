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


/**
 * Send message
 */
const getMessagesWithAI = async (req, res) => {
  try {
    const facultyId = req.user.refId;
    const { studentId } = req.params;

    // 🔒 Ensure faculty supervises this student
    const [[allowed]] = await db.query(
      `SELECT 1 FROM STUDENT 
       WHERE Student_id = ? AND Supervised_by = ?`,
      [studentId, facultyId]
    );

    if (!allowed) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const [rows] = await db.query(
      `
      SELECT 
        m.Message_id,
        m.Content,
        m.Sender,
        m.Created_At,
        ai.Emotion,
        ai.Risk_Level,
        r.Suggested_Reply
      FROM MESSAGE m
      LEFT JOIN MESSAGE_AI_META ai
        ON ai.Message_id = m.Message_id
      LEFT JOIN AI_REPLY_SUGGESTION r
        ON r.Message_id = m.Message_id
      WHERE m.Student_id = ? AND m.Fac_id = ?
      ORDER BY m.Created_At ASC
      `,
      [studentId, facultyId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getMessagesWithAI error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const axios = require("axios");

const sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content required" });
    }

    let studentId;
    let facultyId;
    let sender;

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

    else if (user.role === "Faculty") {
      sender = "Faculty";
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

    const [result] = await db.query(
      `INSERT INTO MESSAGE
       (Student_id, Faculty_id, Sender, Content)
       VALUES (?, ?, ?, ?)`,
      [studentId, facultyId, sender, content.trim()]
    );

    // 🔥 ASYNC AI TRIGGER
    axios.post(`http://localhost:8000/analyze/${result.insertId}`, {
      content
    }).catch(() => {});

    res.status(201).json({ message: "Message sent" });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getMessagesWithAI, // 👈 add
};
