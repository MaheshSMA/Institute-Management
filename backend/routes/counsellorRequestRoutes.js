const express = require('express');
const router = express.Router();
const multer = require("multer");
const { protect, requireRole } = require("../middleware/authMiddleware");

const {
  createRequest,
  getRequestsByStudent,
  getRequestsByFaculty,
  updateRequestStatus,
  markRequestsAsRead,
} = require('../controllers/counsellorRequestController');

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/',protect,requireRole("Student"),upload.single("document"), createRequest);

router.get('/student',protect,requireRole("Student"), getRequestsByStudent);

router.get('/faculty',protect,requireRole("Faculty"), getRequestsByFaculty);

router.patch('/mark-read/:studentId',protect, requireRole("Faculty"), markRequestsAsRead);

router.patch('/:requestId/status',protect,requireRole("Faculty"), updateRequestStatus);

module.exports = router;
