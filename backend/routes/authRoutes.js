// backend/routes/authRoutes.js
const express = require('express');
const {
  registerStudent,
  registerFaculty,
  registerAdmin,
  clubSignup,
  login,
} = require('../controllers/authController');
const { protect, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();

// Registration
router.post('/register-student', registerStudent);
router.post('/register-faculty', registerFaculty);
router.post('/register-admin', registerAdmin); // optional / for initial setup
router.post("/club/signup", clubSignup);


// Login
router.post('/login', login);

module.exports = router;
