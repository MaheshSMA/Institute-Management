const db = require("../config/db");

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
    const studentId = req.user.refId;
    const { type, reason, pts_earned = 0, fac_id: facIdFromBody } = req.body;
    const document_path = req.file ? req.file.path : null;

    if (!studentId || !type) {
      return res.status(400).json({
        error: "student_id and type are required",
      });
    }

    // ✅ CASE 1: Counsellor Join (from StudentFacultyList)
    if (type === "Counsellor Join") {
      if (!facIdFromBody) {
        return res.status(400).json({
          error: "fac_id is required for counsellor join",
        });
      }

      const [result] = await db.query(
        `INSERT INTO COUNSELLOR_REQUEST
         (Student_id, Fac_id, Status, Reason, Type)
         VALUES (?, ?, 'Pending', ?, ?)`,
        [
          studentId,
          facIdFromBody,
          reason || "Requesting counsellor assignment",
          type,
        ]
      );

      return res.status(201).json({
        message: "Counsellor join request sent",
        request_id: result.insertId,
      });
    }

    // ✅ CASE 2: Reason stated / Activity Point (from StudentRequests)
    if (!["Reason stated", "Activity Point"].includes(type)) {
      return res.status(400).json({
        error: "Invalid request type",
      });
    }

    const [studentRows] = await db.query(
      `SELECT Supervised_by FROM STUDENT WHERE Student_id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const fac_id = studentRows[0].Supervised_by;

    if (!fac_id) {
      return res.status(400).json({
        error: "No counsellor assigned to student",
      });
    }

    const [result] = await db.query(
      `INSERT INTO COUNSELLOR_REQUEST
       (Student_id, Fac_id, Status, Reason, Document_path, Type, Pts_earned)
       VALUES (?, ?, 'Pending', ?, ?, ?, ?)`,
      [
        studentId,
        fac_id,
        reason || null,
        document_path,
        type,
        type === "Activity Point" ? pts_earned : 0,
      ]
    );

    res.status(201).json({
      message: "Request created successfully",
      request_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /api/requests/student/:studentId
 */

const markRequestsAsRead = async (req, res) => {
  const facId = req.user.refId;
  const { studentId } = req.params;

  try {
    await db.query(
      `UPDATE COUNSELLOR_REQUEST
       SET Is_read = TRUE
       WHERE Fac_id = ? AND Student_id = ? AND Is_read = FALSE`,
      [facId, studentId]
    );

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getRequestsByStudent = async (req, res) => {
  const studentId = req.user.refId;

  try {
    const [rows] = await db.query(
      `SELECT * FROM COUNSELLOR_REQUEST
       WHERE Student_id = ?
       ORDER BY Created_At DESC`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching student requests:", err);
    res.status(500).json({ error: "Server error" });
  }
};


/**
 * GET /api/requests/faculty/:facId?status=Pending&type=Activity%20Point
 */
const getRequestsByFaculty = async (req, res) => {
  const facId = req.user.refId;
  const { status, type } = req.query;

  let query = `SELECT 
                cr.*, 
                s.Student_name, 
                s.USN, 
                s.Dept_code,
                SUM(CASE WHEN cr.Is_read = FALSE THEN 1 ELSE 0 END) 
                  OVER (PARTITION BY cr.Student_id) AS unread_count
              FROM COUNSELLOR_REQUEST cr
              JOIN STUDENT s ON cr.Student_id = s.Student_id
              WHERE cr.Fac_id = ?`;
  const params = [facId];

  if (status) {
    query += ` AND cr.Status = ?`;
    params.push(status);
  }

  if (type) {
    query += ` AND cr.Type = ?`;
    params.push(type);
  }

  query += ` ORDER BY cr.Created_At DESC`;

  const [rows] = await db.query(query, params);
  res.json(rows);
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
  const facId = req.user.refId;

  if (!status || !["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      error: "status must be 'Approved' or 'Rejected'",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [reqRows] = await connection.query(
      `SELECT * FROM COUNSELLOR_REQUEST
        WHERE Request_id = ? AND Fac_id = ?
        FOR UPDATE`,
      [requestId, facId]
    );

    if (reqRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: "Request not found" });
    }

    const request = reqRows[0];

    if (request.Status !== "Pending") {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: "Request already processed" });
    }

    await connection.query(
      `UPDATE COUNSELLOR_REQUEST
       SET Status = ?
       WHERE Request_id = ?`,
      [status, requestId]
    );

    if (status === "Rejected") {
      await connection.commit();
      connection.release();
      return res.json({ message: "Request rejected successfully" });
    }

    const { Type, Student_id, Fac_id, Pts_earned } = request;

    if (Type === "Reason stated") {
      await connection.query(
        `UPDATE STUDENT
         SET Supervised_by = ?
         WHERE Student_id = ?`,
        [Fac_id, Student_id]
      );
    } else if (Type === "Activity Point") {
      const pointsToAdd = Pts_earned || 0;

      await connection.query(
        `UPDATE STUDENT
         SET Activity_pts = Activity_pts + ?
         WHERE Student_id = ? AND Supervised_by = ?`,
        [pointsToAdd, Student_id, Fac_id]
      );
    }

    await connection.commit();
    connection.release();

    res.json({ message: "Request processed successfully" });
  } catch (err) {
    console.error("Error updating request status:", err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createRequest,
  getRequestsByStudent,
  getRequestsByFaculty,
  updateRequestStatus,
  markRequestsAsRead,
};
