// backend/routes/clubRoutes.js
const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const { createEvent } = require("../controllers/clubEventController");

/* ================= CLUB ROUTES ================= */

// sanity check (VERY IMPORTANT)
router.get("/ping", (req, res) => {
  res.json({ message: "Club routes working ✅" });
});

// create event
router.post(
  "/events",
  protect,
  requireRole("Club"),
  createEvent
);

module.exports = router;
