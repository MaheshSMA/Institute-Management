const express = require('express');
const {
  createRequest,
  getRequestsByStudent,
  getRequestsByFaculty,
  updateRequestStatus,
} = require('../controllers/counsellorRequestController');
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/',protect,requireRole("Student"), createRequest);

router.get('/student',protect,requireRole("Student"), getRequestsByStudent);

router.get('/faculty',protect,requireRole("Faculty"), getRequestsByFaculty);

router.patch('/:requestId/status',protect,requireRole("Faculty"), updateRequestStatus);

module.exports = router;
