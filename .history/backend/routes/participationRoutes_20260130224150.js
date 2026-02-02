const express = require('express');
const {
  addParticipation,
  getParticipantsByEvent,
  getEventsByStudent,
} = require('../controllers/participationController');
const { protect, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/', addParticipation);

router.get('/event/:eventId', getParticipantsByEvent);

router.get('/student/:studentId', getEventsByStudent);

module.exports = router;
