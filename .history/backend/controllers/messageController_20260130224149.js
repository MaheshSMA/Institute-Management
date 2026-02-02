const db = require("../config/db");

/**
 * GET messages between faculty and student
 * Faculty: only for assigned students
 * Student: only for their counsellor
 */
const getMessages = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const user = req.user; // { role, refId }

    let facultyId;

    if (user.role === "Faculty") {
      facultyId = user.refId;
    } else if (user.role === "Student") {
      // fetch faculty from STUDENT table
      const [[student]] = await db.query(
        `SELECT Supervised_by FROM STUDENT WHERE Student_id = ?`,
        [user.refId]
      );

      if (!student || !student.Supervised_by) {
        return res.json([]); // no counsellor yet
      }

      facultyId = student.Supervised_by;
    } else {
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
const sendMessage = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { content } = req.body;
    const user = req.user;

    let facultyId;
    let sender;

    if (user.role === "Faculty") {
      facultyId = user.refId;
      sender = "Faculty";
    } else {
      // student
      sender = "Student";

      const [[student]] = await db.query(
        `SELECT Supervised_by FROM STUDENT WHERE Student_id = ?`,
        [user.refId]
      );

      if (!student || !student.Supervised_by) {
        return res.status(400).json({
          error: "No counsellor assigned",
        });
      }

      facultyId = student.Supervised_by;
    }

    await db.query(
      `INSERT INTO MESSAGE
       (Student_id, Faculty_id, Sender, Content)
       VALUES (?, ?, ?, ?)`,
      [studentId, facultyId, sender, content]
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
