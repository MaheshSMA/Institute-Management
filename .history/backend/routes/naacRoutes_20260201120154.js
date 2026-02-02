const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  evaluateCriterion2,
  computeNAACCGPA
} = require("../controllers/naacController");

router.post(
  "/evaluate/criterion-2",
  protect,
  requireRole("Admin"),
  evaluateCriterion2
);

router.post(
  "/cgpa/compute",
  protect,
  requireRole("Admin"),
  computeNAACCGPA
);

router.get(
  "/cgpa/latest",
  protect,
  requireRole("Admin"),
  async (req, res) => {
    const db = require("../config/db");
    const [[row]] = await db.query(`
      SELECT CGPA, Grade, Calculated_at
      FROM NAAC_CGPA
      ORDER BY Calculated_at DESC
      LIMIT 1
    `);
    res.json(row || null);
  }
);

router.get(
  "/status",
  protect,
  requireRole("Admin"),
  async (req, res) => {
    const db = require("../config/db");
    const [rows] = await db.query(`
      SELECT m.Metric_name, s.*
      FROM NAAC_STATUS s
      JOIN NAAC_METRIC m ON m.Metric_code = s.Metric_code
    `);
    res.json(rows);
  }
);

module.exports = router;
