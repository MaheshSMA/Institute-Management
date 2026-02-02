const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");

module.exports = router;
