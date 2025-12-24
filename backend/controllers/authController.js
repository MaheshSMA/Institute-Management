const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * POST /api/auth/register-student
 * Body: { student_name, usn, dob, year, dept_code, student_email, password }
 */
const registerStudent = async (req, res) => {
  console.log("reached auth rote")
  console.log(req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    console.log(req.body);
    return res.status(400).json({ error: 'Request body is required' });
  }

  const {
    student_name,
    usn,
    dob,
    year,
    dept_code,
    student_email,
    password,
  } = req.body;

  if (!student_name || !usn || !dept_code || !student_email || !password) {
    return res.status(400).json({
      error: 'student_name, usn, dept_code, student_email and password are required',
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    
    
    
    const [studentResult] = await connection.query(
      `INSERT INTO STUDENT
       (Student_name, USN, DOB, Year, Dept_code, Student_email, Activity_pts)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [student_name, usn, dob || null, year || null, dept_code, student_email]
    );

    const studentId = studentResult.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO LOGIN (Email, Password, Role, Ref_id)
       VALUES (?, ?, 'Student', ?)`,
      [student_email, hashedPassword, studentId]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Student registered successfully',
      student_id: studentId,
    });
  } catch (err) {
    console.error('Error registering student:', err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'USN or email already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /api/auth/register-faculty
 * Body: { fac_name, fac_email, dept_code, is_counsellor, is_club_coordinator, password }
 */
const registerFaculty = async (req, res) => {
  const {
    fac_name,
    fac_email,
    dept_code,
    is_counsellor = false,
    is_club_coordinator = false,
    password,
  } = req.body;

  if (!fac_name || !fac_email || !dept_code || !password) {
    return res.status(400).json({
      error: 'fac_name, fac_email, dept_code and password are required',
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [facResult] = await connection.query(
      `INSERT INTO FACULTY
       (Fac_name, Fac_email, Dept_code, Is_Counsellor, Is_Club_Coordinator)
       VALUES (?, ?, ?, ?, ?)`,
      [fac_name, fac_email, dept_code, is_counsellor, is_club_coordinator]
    );

    const facId = facResult.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO LOGIN (Email, Password, Role, Ref_id)
       VALUES (?, ?, 'Faculty', ?)`,
      [fac_email, hashedPassword, facId]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Faculty registered successfully',
      fac_id: facId,
    });
  } catch (err) {
    console.error('Error registering faculty:', err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Faculty email already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /api/auth/register-admin
 * Body: { admin_name, admin_email, password }
 * (You can use this once to create first admin, or insert via SQL)
 */
const registerAdmin = async (req, res) => {
  const { admin_name, admin_email, password } = req.body;

  if (!admin_name || !admin_email || !password) {
    return res.status(400).json({
      error: 'admin_name, admin_email and password are required',
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [adminResult] = await connection.query(
      `INSERT INTO ADMIN (Admin_name, Admin_email, Password)
       VALUES (?, ?, '')`,
      [admin_name, admin_email]
    );

    const adminId = adminResult.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO LOGIN (Email, Password, Role, Ref_id)
       VALUES (?, ?, 'Admin', ?)`,
      [admin_email, hashedPassword, adminId]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Admin registered successfully',
      admin_id: adminId,
    });
  } catch (err) {
    console.error('Error registering admin:', err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Admin email already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res
    .status(400)
    .json({ error: 'email and password are required' });
  }
  
  try {
    
    
    
    
    const [rows] = await db.query(
      `SELECT * FROM LOGIN WHERE Email = ?`,
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = rows[0];
    
    
    
    
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      console.log(password);
      console.log(user.Password);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    
    
    
    const token = generateToken({
      loginId: user.Login_id,
      role: user.Role,
      refId: user.Ref_id,
      email: user.Email,
    });

    res.json({
      message: 'Login successful',
      token,
      role: user.Role,
      ref_id: user.Ref_id,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerStudent,
  registerFaculty,
  registerAdmin,
  login,
};
