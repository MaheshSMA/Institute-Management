const express = require('express');
const {
  createClub,
  getAllClubs,
  getClubById,
} = require('../controllers/clubController');

const router = express.Router();

router.post('/', createClub);

router.get('/', getAllClubs);

router.get('/:id', getClubById);

module.exports = router;
