//backend/controllers/facultyController.js
const db = require('../config/db');

const getAllFaculty = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM FACULTY');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getFacultyById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM FACULTY WHERE Fac_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
// GET current twin
const getStudentTwin = async (req, res) => {
  const { studentId } = req.params;

  const [[row]] = await db.query(
    `SELECT * FROM STUDENT_TWIN WHERE Student_id = ?`,
    [studentId]
  );

  res.json(row || {});
};

// GET twin logs
const getStudentTwinLogs = async (req, res) => {
  const { studentId } = req.params;

  const [rows] = await db.query(
    `SELECT * FROM TWIN_STATE_LOG
     WHERE Student_id = ?
     ORDER BY Changed_at DESC`,
    [studentId]
  );

  res.json(rows);
};

const getAssignedStudents = async (req, res) => {
  const facId = req.user.refId;

  try {
    const [students] = await db.query(
      `
      SELECT 
        s.Student_id,
        s.Student_name,
        s.USN,
        s.Dept_code,
        s.Year,
        s.Activity_pts,

        -- unread requests
        COUNT(CASE WHEN cr.Is_read = FALSE THEN 1 END) AS unread_count,

        -- last message time
        MAX(m.Created_At) AS last_message_at,

        -- who sent last message
        SUBSTRING_INDEX(
          GROUP_CONCAT(m.Sender ORDER BY m.Created_At DESC),
          ',', 1
        ) AS last_sender

      FROM STUDENT s
      LEFT JOIN COUNSELLOR_REQUEST cr
        ON cr.Student_id = s.Student_id
        AND cr.Fac_id = ?

      LEFT JOIN MESSAGE m
        ON m.Student_id = s.Student_id
        AND m.Faculty_id = ?

      WHERE s.Supervised_by = ?
      GROUP BY s.Student_id
      `,
      [facId, facId, facId]
    );

    // 🧠 derive attention level
    const enriched = students.map(stu => {
      let attention = "normal";

      if (stu.last_message_at) {
        const days =
          (Date.now() - new Date(stu.last_message_at)) / (1000 * 60 * 60 * 24);

        if (stu.last_sender === "Student" && days > 0.002) {
          attention = "needs_attention";
        }

        if (days > 10) {
          attention = "urgent";
        }
      }

      return {
        ...stu,
        attention_level: attention,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assigned students" });
  }
};


const createFaculty = async (req, res) => {
  try {
    const {
      fac_name,
      fac_email,
      dept_code,
      is_counsellor = false,
      is_club_coordinator = false,
    } = req.body;

    if (!fac_name || !fac_email || !dept_code) {
      return res.status(400).json({
        error: 'fac_name, fac_email and dept_code are required',
      });
    }

    const [result] = await db.query(
      `INSERT INTO FACULTY 
       (Fac_name, Fac_email, Dept_code, Is_Counsellor, Is_Club_Coordinator)
       VALUES (?, ?, ?, ?, ?)`,
      [fac_name, fac_email, dept_code, is_counsellor, is_club_coordinator]
    );

    res.status(201).json({
      message: 'Faculty created successfully',
      fac_id: result.insertId,
    });
  } catch (err) {
    console.error('Error creating faculty:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ error: 'Faculty email already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};

const getStudentProfile = async (req, res) => {
  const { studentId } = req.params;

  const [rows] = await db.query(
    `SELECT * FROM STUDENT WHERE Student_id = ?`,
    [studentId]
  );

  res.json(rows[0]);
};

const updateStudentPoints = async (req, res) => {
  const { studentId } = req.params;
  const { activity_pts } = req.body;

  await db.query(
    `UPDATE STUDENT
     SET Activity_pts = ?
     WHERE Student_id = ?`,
    [activity_pts, studentId]
  );

  res.json({ message: "Activity points updated" });
};

const getAvailableClubCoordinators = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*
       FROM FACULTY f
       WHERE f.Is_Club_Coordinator = 1
       AND f.Fac_id NOT IN (
         SELECT Coordinator_id FROM CLUB WHERE Coordinator_id IS NOT NULL
       )`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching available coordinators:", err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  getAllFaculty,
  getAssignedStudents,
  getFacultyById,
  createFaculty,
  getStudentProfile,
  updateStudentPoints,
  getAvailableClubCoordinators,
  getStudentTwin, // ✅ ADD THIS
};
