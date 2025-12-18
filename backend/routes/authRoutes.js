// backend/routes/authRoutes.js
const express = require('express');
const {
  registerStudent,
  registerFaculty,
  registerAdmin,
  login,
} = require('../controllers/authController');

const router = express.Router();

// Registration
console.log("reached auth rote")
router.post('/register-student', registerStudent);
console.log("not here")
router.post('/register-faculty', registerFaculty);
router.post('/register-admin', registerAdmin); // optional / for initial setup

// Login
router.post('/login', login);

module.exports = router;
