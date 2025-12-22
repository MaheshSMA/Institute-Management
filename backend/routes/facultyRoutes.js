const express = require('express');
const {
  getAllFaculty,
  getFacultyById,
  getAssignedStudents,
  createFaculty,
} = require('../controllers/facultyController');
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/',protect, getAllFaculty);

router.get("/my-students",protect,requireRole("Faculty"), getAssignedStudents);

router.get('/:id',protect,requireRole("Faculty"), getFacultyById);

router.post('/', createFaculty);

module.exports = router;
