const express = require("express");
const router = express.Router();
const policy = require("../controllers/policyController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.get("/", protect, requireRole("Admin"), policy.getPolicies);
router.post("/", protect, requireRole("Admin"), policy.createPolicy);
router.post("/run", protect, requireRole("Admin"), policy.runPolicyEngine);

module.exports = router;
