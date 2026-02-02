const express = require('express');
const {
  createClub,
  getAllClubs,
  getClubById,
} = require('../controllers/clubController');
const { protect, requireRole } = require("../middleware/authMiddleware");
const { createEvent } = require("../controllers/clubEventController");

router.post(
  "/events",
  protect,
  requireRole("Club"),
  createEvent
);

const router = express.Router();

router.post('/', createClub);

router.get('/', getAllClubs);

router.get('/:id', getClubById);

module.exports = router;
