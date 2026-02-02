// backend/routes/clubRoutes.js
const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createEvent,
  getClubEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/clubEventController");
const { getClubFeedForStudent } = require("../controllers/clubFeedController");
const { getClubStats, getAllClubsForStudent } = require("../controllers/clubController");

// CREATE
router.post(
  "/events",
  protect,
  requireRole("Club"),
  createEvent
);

// READ (all events – manage)
router.get(
  "/events",
  protect,
  requireRole("Club"),
  getClubEvents
);

// READ (single event – edit)
router.get(
  "/events/:eventId",
  protect,
  requireRole("Club"),
  getEventById
);

// UPDATE
router.put(
  "/events/:eventId",
  protect,
  requireRole("Club"),
  updateEvent
);

// DELETE
router.delete(
  "/events/:eventId",
  protect,
  requireRole("Club"),
  deleteEvent
);

router.get(
  "/stats",
  protect,
  requireRole("Club"),
  getClubStats
);

router.get(
  "/",
  protect,
  requireRole("Student"),
  getAllClubsForStudent
);

router.get(
  "/:clubId/feed/student",
  protect,
  requireRole("Student"),
  getClubFeedForStudent
);


module.exports = router;
