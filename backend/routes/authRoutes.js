// backend/routes/authRoutes.js
const express = require('express');
const {
  registerStudent,
  registerFaculty,
  registerAdmin,
  login,
} = require('../controllers/authController');
const { protect, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();

// Registration
router.post('/register-student', registerStudent);
router.post('/register-faculty', registerFaculty);
router.post('/register-admin', registerAdmin); // optional / for initial setup

// Login
router.post('/login', login);

module.exports = router;
