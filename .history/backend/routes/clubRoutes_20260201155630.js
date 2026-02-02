const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const { createEvent } = require("../controllers/clubEventController");

// Club core routes
router.get("/", /* get clubs */);

// 🔥 Club Events
router.post(
  "/events",
  protect,
  requireRole("Club"),
  createEvent
);

module.exports = router;
