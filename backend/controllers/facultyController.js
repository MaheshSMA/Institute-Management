const db = require('../config/db');

// ✅ GET all faculty
const getAllFaculty = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM FACULTY');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ GET faculty by ID
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

// ✅ CREATE faculty
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

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
};
