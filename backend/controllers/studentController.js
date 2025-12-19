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

    const rvceEmailRegex = /^[a-zA-Z0-9._%+-]+@rvce\.edu\.in$/;

  if (!rvceEmailRegex.test(student_email)) {
    return res.status(400).json({
      error: 'Only @rvce.edu.in email addresses are allowed',
    });
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
};
