const db = require("../config/db");

const evaluateCriterion2 = async (req, res) => {
  try {
    const now = new Date();

    /* ---------------- 2.2.1 Student–Faculty Ratio ---------------- */
    const [[{ students }]] = await db.query(
      "SELECT COUNT(*) AS students FROM STUDENT"
    );
    const [[{ faculty }]] = await db.query(
      "SELECT COUNT(*) AS faculty FROM FACULTY"
    );

    const ratio = faculty === 0 ? 0 : students / faculty;

    const ratioStatus =
      ratio <= 20 ? "COMPLIANT" :
      ratio <= 25 ? "PARTIAL" :
      "NON_COMPLIANT";

    await db.query(
      `INSERT INTO NAAC_STATUS
       (Metric_code, Current_value, Compliance, Last_checked)
       VALUES ('2.2.1', ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         Current_value = VALUES(Current_value),
         Compliance = VALUES(Compliance),
         Last_checked = VALUES(Last_checked)`,
      [ratio.toFixed(2), ratioStatus, now]
    );

    /* ---------------- 2.3.1 Mentoring Coverage ---------------- */
    const [[{ total_students }]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM STUDENT"
    );

    const [[{ mentored }]] = await db.query(
      `SELECT COUNT(*) AS mentored
       FROM STUDENT
       WHERE Supervised_by IS NOT NULL`
    );

    const coverage =
      total_students === 0 ? 0 :
      (mentored / total_students) * 100;

    const coverageStatus =
      coverage >= 90 ? "COMPLIANT" :
      coverage >= 75 ? "PARTIAL" :
      "NON_COMPLIANT";

    await db.query(
      `INSERT INTO NAAC_STATUS
       (Metric_code, Current_value, Compliance, Last_checked)
       VALUES ('2.3.1', ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         Current_value = VALUES(Current_value),
         Compliance = VALUES(Compliance),
         Last_checked = VALUES(Last_checked)`,
      [coverage.toFixed(2), coverageStatus, now]
    );

    res.json({
      message: "NAAC Criterion 2 evaluated successfully",
      metrics_updated: ["2.2.1", "2.3.1"]
    });
  } catch (err) {
    console.error("NAAC evaluation error:", err);
    res.status(500).json({ error: "NAAC evaluation failed" });
  }
};

module.exports = {
  evaluateCriterion2
};
