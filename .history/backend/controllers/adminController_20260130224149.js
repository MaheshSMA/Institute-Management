const db = require("../config/db");

const getAllStudents = async (req, res) => {
  const [rows] = await db.query(
    `SELECT Student_id, Student_name, USN, Dept_code, Year, Activity_pts
     FROM STUDENT`
  );
  res.json(rows);
};

const getAllFaculty = async (req, res) => {
  const [rows] = await db.query(
    `SELECT Fac_id, Fac_name, Fac_email, Dept_code
     FROM FACULTY`
  );
  res.json(rows);
};

const studentPointsReport = async (req, res) => {
  const [rows] = await db.query(
    `SELECT Student_name, USN, Activity_pts
     FROM STUDENT
     ORDER BY Activity_pts DESC`
  );
  res.json(rows);
};

const getAllEvents = async (req, res) => {
  const [rows] = await db.query(
    `SELECT Event_id, Event_name, Duration, Club_id
     FROM EVENT`
  );
  res.json(rows);
};


const eventParticipationReport = async (req, res) => {
  const [rows] = await db.query(
    `SELECT e.Event_name, COUNT(p.Student_id) AS participants
     FROM EVENT e
     LEFT JOIN PARTICIPATION p ON e.Event_id = p.Event_id
     GROUP BY e.Event_id`
  );
  res.json(rows);
};

const deptWiseStudents = async (req, res) => {
  const [rows] = await db.query(
    `SELECT Dept_code, COUNT(*) AS total_students
     FROM STUDENT
     GROUP BY Dept_code`
  );
  res.json(rows);
};

module.exports = {
  getAllStudents,
  getAllFaculty,
  getAllEvents,
  studentPointsReport,
  eventParticipationReport,
  deptWiseStudents,
};
