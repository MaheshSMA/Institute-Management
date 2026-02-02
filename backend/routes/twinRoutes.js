// backend/routes/twinRoutes.js
const express = require("express");
const router = express.Router();
const { evaluateTwin } = require("../controllers/twinController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/evaluate/:studentId",
  protect,
  requireRole("Faculty"),
  evaluateTwin
);

module.exports = router;
