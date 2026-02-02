const express = require('express');
const {
  createClub,
  getAllClubs,
  getClubById,
} = require('../controllers/clubController');
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/', createClub);

router.get('/', getAllClubs);

router.get('/:id', getClubById);

module.exports = router;
