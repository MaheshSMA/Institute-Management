const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createEvent,
  getClubEvents,
  deleteEvent
} = require("../controllers/clubEventController");

console.log("✅ clubRoutes loaded");

router.post(
  "/events",
  protect,
  requireRole("Club"),
  createEvent
);

router.get(
  "/events",
  protect,
  requireRole("Club"),
  getClubEvents
);

router.delete(
  "/events/:eventId",
  protect,
  requireRole("Club"),
  deleteEvent
);

module.exports = router;
