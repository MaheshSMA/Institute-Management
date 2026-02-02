const db = require("../config/db");

/* ===== STUDENT ===== */

const requestJoinClub = async (req, res) => {
  const studentId = req.user.refId;
  const { clubId } = req.params;

  try {
    await db.query(
      `INSERT INTO CLUB_MEMBERSHIP (Student_id, Club_id)
       VALUES (?, ?)`,
      [studentId, clubId]
    );
    res.status(201).json({ message: "Join request sent" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Already requested or member" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

const getMyClubRequests = async (req, res) => {
  const studentId = req.user.refId;

  const [rows] = await db.query(`
    SELECT c.Club_id, c.Club_name, m.Status
    FROM CLUB_MEMBERSHIP m
    JOIN CLUB c ON m.Club_id = c.Club_id
    WHERE m.Student_id = ?
  `, [studentId]);

  res.json(rows);
};

/* ===== CLUB ===== */

const getClubMembershipRequests = async (req, res) => {
  const clubId = req.user.refId;

  const [rows] = await db.query(`
    SELECT 
      cm.Student_id,
      s.Student_name,
      s.USN,
      cm.Status
    FROM CLUB_MEMBERSHIP cm
    JOIN STUDENT s ON cm.Student_id = s.Student_id
    WHERE cm.Club_id = ?
    ORDER BY s.Student_name
  `, [clubId]);

  res.json(rows);
};


const updateMembershipStatus = async (req, res) => {
  const { studentId } = req.params;
  const { status } = req.body;
  const clubId = req.user.refId;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  await db.query(`
    UPDATE CLUB_MEMBERSHIP
    SET Status = ?
    WHERE Student_id = ? AND Club_id = ?
  `, [status, studentId, clubId]);

  res.json({ message: "Status updated" });
};

module.exports = {
  requestJoinClub,
  getMyClubRequests,
  getClubMembershipRequests,
  updateMembershipStatus
};
