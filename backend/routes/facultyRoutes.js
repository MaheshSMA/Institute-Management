const express = require('express');
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
} = require('../controllers/facultyController');

const router = express.Router();

router.get('/', getAllFaculty);

router.get('/:id', getFacultyById);

router.post('/', createFaculty);

module.exports = router;
