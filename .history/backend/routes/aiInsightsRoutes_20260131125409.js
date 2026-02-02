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
router.post(
  "/regenerate/:studentId",
  protect,
  requireRole("Faculty"),
  async (req, res) => {
    const axios = require("axios");
    const { studentId } = req.params;

    // Fire AI job explicitly (non-blocking)
    axios
      .post("http://localhost:8001/run", {
        student_id: studentId,
      })
      .catch(() => {});

    res.json({ message: "AI regeneration triggered" });
  }
);

module.exports = router;
