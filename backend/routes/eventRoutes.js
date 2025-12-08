const express = require('express');
const {
  createEvent,
  getAllEvents,
  getEventsByClub,
} = require('../controllers/eventController');

const router = express.Router();

router.post('/', createEvent);

router.get('/', getAllEvents);

router.get('/club/:clubId', getEventsByClub);

module.exports = router;
