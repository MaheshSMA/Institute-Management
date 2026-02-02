const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  requestJoinClub,
  getMyClubRequests,
  getClubJoinRequests,
  updateMembershipStatus,
  getClubMembershipRequests,
} = require("../controllers/clubMembershipController");

/* STUDENT */
router.post(
  "/:clubId/join",
  protect,
  requireRole("Student"),
  requestJoinClub
);

router.get(
  "/my-requests",
  protect,
  requireRole("Student"),
  getMyClubRequests
);

/* CLUB */
router.get(
  "/requests",
  protect,
  requireRole("Club"),
  getClubJoinRequests
);

router.put(
  "/requests/:studentId",
  protect,
  requireRole("Club"),
  updateMembershipStatus
);

// GET all membership requests for this club
router.get(
  "/members/requests",
  protect,
  requireRole("Club"),
  getClubMembershipRequests
);

// UPDATE status
router.put(
  "/members/:studentId",
  protect,
  requireRole("Club"),
  updateMembershipStatus
);


module.exports = router;
