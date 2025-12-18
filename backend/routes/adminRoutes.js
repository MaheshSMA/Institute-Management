const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");

router.get("/students", admin.getAllStudents);
router.get("/faculty", admin.getAllFaculty);
router.get("/events", admin.getAllEvents);

router.get("/reports/student-points", admin.studentPointsReport);
router.get("/reports/event-participation", admin.eventParticipationReport);
router.get("/reports/dept-students", admin.deptWiseStudents);

module.exports = router;
