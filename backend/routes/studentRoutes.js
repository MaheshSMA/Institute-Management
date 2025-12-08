
const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
} = require('../controllers/studentController');

const router = express.Router();

router.get('/', getAllStudents);

router.get('/:id', getStudentById);

router.post('/', createStudent);

module.exports = router;
