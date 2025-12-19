const express = require('express');
const {
  createEvent,
  getAllEvents,
  getEventsByClub,
  updateEvent,
} = require('../controllers/eventController');

const router = express.Router();

router.post('/', createEvent);

router.get('/', getAllEvents);

router.get('/club/:clubId', getEventsByClub);

router.put("/:eventId", updateEvent);

module.exports = router;
