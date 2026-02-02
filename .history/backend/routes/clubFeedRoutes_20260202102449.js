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

router.delete(
  "/feed/:feedId",
  protect,
  requireRole("Club"),
  deleteFeedPost
);


module.exports = router;
