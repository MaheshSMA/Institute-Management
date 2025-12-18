const db = require('../config/db');

/**
 * POST /api/requests
 * Body:
 *  - student_id
 *  - fac_id
 *  - type: 'Counsellor Join' | 'Activity Point'
 *  - reason
 *  - document_path (optional)
 *  - pts_earned (optional, only for Activity Point)
 */
const createRequest = async (req, res) => {
  try {
    const {
      student_id,
      fac_id,
      type,
      reason,
      document_path,
      pts_earned = 0,
    } = req.body;

    if (!student_id || !fac_id || !type) {
      return res.status(400).json({
        error: 'student_id, fac_id and type are required',
      });
    }

    if (type !== 'Counsellor Join' && type !== 'Activity Point') {
      return res.status(400).json({
        error: "type must be 'Counsellor Join' or 'Activity Point'",
      });
    }

    const [result] = await db.query(
      `INSERT INTO COUNSELLOR_REQUEST
       (Student_id, Fac_id, Status, Reason, Document_path, Type, Pts_earned)
       VALUES (?, ?, 'Pending', ?, ?, ?, ?)`,
      [student_id, fac_id, reason || null, document_path || null, type, pts_earned]
    );

    res.status(201).json({
      message: 'Request created successfully',
      request_id: result.insertId,
    });
  } catch (err) {
    console.error('Error creating counsellor request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/requests/student/:studentId
 */
const getRequestsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM COUNSELLOR_REQUEST
       WHERE Student_id = ?
       ORDER BY Created_At DESC`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching student requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /api/requests/faculty/:facId?status=Pending&type=Activity%20Point
 */
const getRequestsByFaculty = async (req, res) => {
  const { facId } = req.params;
  const { status, type } = req.query;

  try {
    let query = `SELECT * FROM COUNSELLOR_REQUEST WHERE Fac_id = ?`;
    const params = [facId];

    if (status) {
      query += ` AND Status = ?`;
      params.push(status);
    }

    if (type) {
      query += ` AND Type = ?`;
      params.push(type);
    }

    query += ` ORDER BY Created_At DESC`;

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching faculty requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * PATCH /api/requests/:requestId/status
 * Body:
 *  - status: 'Approved' | 'Rejected'
 *
 * Workflow:
 *  - If Approved & Type = 'Counsellor Join' => set STUDENT.Supervised_by
 *  - If Approved & Type = 'Activity Point'  => STUDENT.Activity_pts += Pts_earned
 */
const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({
      error: "status must be 'Approved' or 'Rejected'",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [reqRows] = await connection.query(
      `SELECT * FROM COUNSELLOR_REQUEST WHERE Request_id = ? FOR UPDATE`,
      [requestId]
    );

    if (reqRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = reqRows[0];

    if (request.Status !== 'Pending') {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: 'Request already processed' });
    }

    await connection.query(
      `UPDATE COUNSELLOR_REQUEST
       SET Status = ?
       WHERE Request_id = ?`,
      [status, requestId]
    );

    if (status === 'Rejected') {
      await connection.commit();
      connection.release();
      return res.json({ message: 'Request rejected successfully' });
    }

    const { Type, Student_id, Fac_id, Pts_earned } = request;

    if (Type === 'Counsellor Join') {
  
      await connection.query(
        `UPDATE STUDENT
         SET Supervised_by = ?
         WHERE Student_id = ?`,
        [Fac_id, Student_id]
      );
    } else if (Type === 'Activity Point') {
  
      const pointsToAdd = Pts_earned || 0;

      await connection.query(
        `UPDATE STUDENT
         SET Activity_pts = Activity_pts + ?
         WHERE Student_id = ?`,
        [pointsToAdd, Student_id]
      );
    }

    await connection.commit();
    connection.release();

    res.json({ message: 'Request processed successfully' });
  } catch (err) {
    console.error('Error updating request status:', err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createRequest,
  getRequestsByStudent,
  getRequestsByFaculty,
  updateRequestStatus,
};
