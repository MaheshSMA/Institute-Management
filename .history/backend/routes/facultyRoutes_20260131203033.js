//backend/routes/facultyRoutes.js
const express = require('express');
const {
  getAllFaculty,
  getFacultyById,
  getAssignedStudents,
  createFaculty,
  getStudentProfile,
  updateStudentPoints,
  getAvailableClubCoordinators,
  getStudentTwin,
  getStudentTwinLogs, // ✅ ADD
} = require("../controllers/facultyController");


const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/',protect, getAllFaculty);

router.get("/my-students",protect,requireRole("Faculty"), getAssignedStudents);

router.get( "/student/:studentId",protect,requireRole("Faculty"),  getStudentProfile);

router.patch("/student/:studentId/points",protect, requireRole("Faculty"), updateStudentPoints);

router.get(
  "/available-coordinators",
  // protect,
  // requireRole("Admin"),
  getAvailableClubCoordinators
);
router.get(
  "/student/:studentId/twin",
  protect,
  requireRole("Faculty"),
  getStudentTwin
);

router.get(
  "/student/:studentId/twin/logs",
  protect,
  requireRole("Faculty"),
  getStudentTwinLogs
);


router.get('/:id',protect,requireRole("Faculty"), getFacultyById);

router.post('/', createFaculty);

module.exports = router;
