// backend/controllers/twinController.js
const { evaluateStudentTwin } = require("../services/twinEngine");

/**
 * POST /api/twin/evaluate/:studentId
 */
const evaluateTwin = async (req, res) => {
  const { studentId } = req.params;

  try {
    await evaluateStudentTwin(studentId);
    res.json({ message: "Twin evaluation completed" });
  } catch (err) {
    console.error("Twin error:", err);
    res.status(500).json({ error: "Twin evaluation failed" });
  }
};

module.exports = {
  evaluateTwin,
};
