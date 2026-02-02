const express = require("express");
const { getFacultyAIInsights } = require("../controllers/aiInsightsController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/insights",
  protect,
  requireRole("Faculty"),
  getFacultyAIInsights
);

module.exports = router;
