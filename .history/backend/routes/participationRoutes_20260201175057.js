const express = require('express');
const {
  addParticipation,
  getParticipantsByEvent,
  getEventsByStudent,
} = require('../controllers/participationController');
const { protect, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();


router.post(
  '/',
  protect,
  requireRole("Student"),
  addParticipation
);

router.get(
  '/event/:eventId',
  protect,
  requireRole("Club"),
  getParticipantsByEvent
);

router.get(
  '/student/:studentId',
  protect,
  requireRole("Student"),
  getEventsByStudent
);

module.exports = router;
