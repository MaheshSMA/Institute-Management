// backend/routes/participationRoutes.js
const express = require('express');
const {
  addParticipation,
  getParticipantsByEvent,
  getEventsByStudent,
  updateParticipation,
  bulkUpdateParticipation
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

router.put(
  "/event/:eventId/student/:studentId",
  protect,
  requireRole("Club"),
  updateParticipation
);

router.put(
  "/event/:eventId/bulk",
  protect,
  requireRole("Club"),
  bulkUpdateParticipation
);



module.exports = router;
