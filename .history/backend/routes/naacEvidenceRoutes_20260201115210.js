const express = require("express");
const router = express.Router();
const upload = require("../middleware/naacUpload");
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  uploadEvidence,
  getEvidenceByMetric
} = require("../controllers/naacEvidenceController");

router.post(
  "/:metricCode",
  protect,
  requireRole("Admin"),
  upload.single("file"),
  uploadEvidence
);

router.get(
  "/:metricCode",
  protect,
  requireRole("Admin"),
  getEvidenceByMetric
);


module.exports = router;
