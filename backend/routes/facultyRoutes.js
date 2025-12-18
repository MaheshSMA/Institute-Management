const express = require('express');
const {
  getAllFaculty,
  getFacultyById,
  getAssignedStudents,
  createFaculty,
} = require('../controllers/facultyController');

const router = express.Router();

router.get('/', getAllFaculty);

router.get('/:id', getFacultyById);

router.post('/', createFaculty);

router.get("/:facId/students", getAssignedStudents);
module.exports = router;
