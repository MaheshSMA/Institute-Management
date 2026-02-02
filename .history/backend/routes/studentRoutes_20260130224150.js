
const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
} = require('../controllers/studentController');
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/',protect,requireRole("Admin"), getAllStudents);

router.get('/:id', getStudentById);

router.post('/', createStudent);

module.exports = router;
