const express = require('express');
const {
  createEvent,
  getAllEvents,
  getEventsByClub,
  getMyClubEvents,
  updateEvent,
} = require('../controllers/eventController');
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/',protect,requireRole("Faculty"), createEvent);

router.get('/',protect, getAllEvents);

router.get("/my-club", protect, requireRole("Faculty"), getMyClubEvents);

// router.get('/club/:clubId', getEventsByClub);

router.put("/:eventId", protect, requireRole("Faculty"),  updateEvent);

module.exports = router;
