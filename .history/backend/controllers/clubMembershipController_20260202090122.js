// controllers/clubMembershipController.js
const db = require("../config/db");

const requestJoinClub = async (req, res) => {
  const studentId = req.user.refId;
  const { clubId } = req.params;

  try {
    await db.query(
      `
      INSERT INTO CLUB_MEMBERSHIP (Student_id, Club_id)
      VALUES (?, ?)
      `,
      [studentId, clubId]
    );

    res.status(201).json({ message: "Join request sent" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Already requested or member" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { requestJoinClub };
