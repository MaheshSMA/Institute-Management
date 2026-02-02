const db = require("../config/db");

/* ================= CLUB POSTS ================= */

// Club creates a feed post
const createFeedPost = async (req, res) => {
  const clubId = req.user.refId;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content required" });
  }

  await db.query(
    `
    INSERT INTO CLUB_FEED (Club_id, Content)
    VALUES (?, ?)
    `,
    [clubId, content]
  );

  res.status(201).json({ message: "Post published" });
};

/* ================= STUDENT VIEWS ================= */
/* ================= CLUB VIEWS OWN FEED ================= */

const getClubFeedForClub = async (req, res) => {
  const clubId = req.user.refId;

  const [feed] = await db.query(
    `
    SELECT Feed_id, Content, Created_At
    FROM CLUB_FEED
    WHERE Club_id = ?
    ORDER BY Created_At DESC
    `,
    [clubId]
  );

  res.json(feed);
};

const deleteFeedPost = async (req, res) => {
  const clubId = req.user.refId;
  const { feedId } = req.params;

  await db.query(
    `
    DELETE FROM CLUB_FEED
    WHERE Feed_id = ? AND Club_id = ?
    `,
    [feedId, clubId]
  );

  res.json({ message: "Post deleted" });
};

const getClubFeedForStudent = async (req, res) => {
  const studentId = req.user.refId;
  const { clubId } = req.params;

  // check if student is approved member
  const [[membership]] = await db.query(
    `
    SELECT Status FROM CLUB_MEMBERSHIP
    WHERE Student_id = ? AND Club_id = ? AND Status = 'Approved'
    `,
    [studentId, clubId]
  );

  if (!membership) {
    return res.status(403).json({ error: "Not a club member" });
  }

  const [feed] = await db.query(
    `
    SELECT Feed_id, Content, Created_At
    FROM CLUB_FEED
    WHERE Club_id = ?
    ORDER BY Created_At DESC
    `,
    [clubId]
  );

  res.json(feed);
};


module.exports = {
  createFeedPost,
  getClubFeedForStudent,
  getClubFeedForClub,
    deleteFeedPost,
};
