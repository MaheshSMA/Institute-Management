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

const getAssignedStudents = async (req, res) => {
  const facId = req.user.refId;
  console.log("reached get student");

  try {
    const [students] = await db.query(
      `SELECT 
        s.Student_id,
        s.Student_name,
        s.USN,
        s.Dept_code,
        s.Year,
        s.Activity_pts,
        COUNT(
          CASE WHEN cr.Is_read = FALSE THEN 1 END
        ) AS unread_count
       FROM STUDENT s
       LEFT JOIN COUNSELLOR_REQUEST cr
         ON cr.Student_id = s.Student_id
         AND cr.Fac_id = ?
       WHERE s.Supervised_by = ?
       GROUP BY s.Student_id`,
      [facId, facId]
    );

    res.json(students);
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
};
