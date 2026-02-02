const db = require('../config/db');

const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM STUDENT');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM STUDENT WHERE Student_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyCounsellor = async (req, res) => {
  try {
    const studentId = req.user.refId; // from JWT

    const [[row]] = await db.query(
      `
      SELECT 
        f.Fac_id,
        f.Fac_name,
        f.Dept_code
      FROM STUDENT s
      LEFT JOIN FACULTY f
        ON s.Supervised_by = f.Fac_id
      WHERE s.Student_id = ?
      `,
      [studentId]
    );

    res.json(row || null);
  } catch (err) {
    console.error("Fetch counsellor failed:", err);
    res.status(500).json({ error: "Failed to fetch counsellor" });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      student_name,
      usn,
      dob,
      year,
      dept_code,
      student_email,
      activity_pts = 0,
    } = req.body;

    if (!student_name || !usn || !dept_code) {
      return res
        .status(400)
        .json({ error: 'student_name, usn and dept_code are required' });
    }

    const [result] = await db.query(
      `INSERT INTO STUDENT 
       (Student_name, USN, DOB, Year, Dept_code, Student_email, Activity_pts)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [student_name, usn, dob, year, dept_code, student_email, activity_pts]
    );

    res.status(201).json({
      message: 'Student created successfully',
      student_id: result.insertId,
    });
  } catch (err) {
    console.error('Error creating student:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ error: 'USN or email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  getMyCounsellor,
};
