const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createFeedPost,
  getClubFeedForStudent,
  getClubFeedForClub
} = require("../controllers/clubFeedController");

/* CLUB */
router.post(
  "/feed",
  protect,
  requireRole("Club"),
  createFeedPost
);

router.get(
  "/feed",
  protect,
  requireRole("Club"),
  getClubFeedForClub
);

/* STUDENT */
router.get(
  "/:clubId/feed",
  protect,
  requireRole("Student"),
  getClubFeedForStudent
);

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


module.exports = router;
