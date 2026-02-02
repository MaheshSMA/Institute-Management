const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createEvent,
  getClubEvents,
  deleteEvent
} = require("../controllers/clubEventController");

// CREATE
router.post(
  "/events",
  protect,
  requireRole("Club"),
  createEvent
);

// READ (Manage Events)
router.get(
  "/events",
  protect,
  requireRole("Club"),
  getClubEvents
);

// DELETE (Hard delete)
router.delete(
  "/events/:eventId",
  protect,
  requireRole("Club"),
  deleteEvent
);

module.exports = router;
