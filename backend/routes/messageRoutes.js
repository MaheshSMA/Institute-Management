// backend/routes/messageRoutes.js
const express = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();

// GET /api/messages/:studentId
router.get(
  "/:studentId",
  protect,
  requireRole("Student", "Faculty"),
  getMessages
);

// POST /api/messages/:studentId
router.post(
  "/:studentId",
  protect,
  requireRole("Student", "Faculty"),
  sendMessage
);

module.exports = router;
