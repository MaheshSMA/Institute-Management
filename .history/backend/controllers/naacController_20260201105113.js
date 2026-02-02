// backend/controllers/naacController.js
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

const computeNAACCGPA = async (req, res) => {
  try {
    // 1️⃣ Get all criterion scores
    const [criteria] = await db.query(
      `SELECT
         Criterion_code,
         Total_score,
         Max_score,
         Weight
       FROM NAAC_CRITERION_SCORE`
    );

    if (criteria.length === 0) {
      return res.status(400).json({
        error: "No criterion scores available"
      });
    }

    let weightedSum = 0;
    let weightTotal = 0;

    for (const c of criteria) {
      const normalized = c.Total_score / c.Max_score; // 0–1
      weightedSum += normalized * c.Weight;
      weightTotal += c.Weight;
    }

    const cgpa = weightTotal === 0
      ? 0
      : (weightedSum / weightTotal) * 4;

    // 2️⃣ Persist CGPA snapshot
    await db.query(
  `INSERT INTO NAAC_CGPA
   (CGPA, Grade, Calculated_at)
   VALUES (?, ?, NOW())`,
  [cgpa.toFixed(2), deriveNAACGrade(cgpa)]
);


    res.json({
  CGPA: cgpa.toFixed(2),
  Grade: deriveNAACGrade(cgpa),
  Calculated_at: new Date()
});



  } catch (err) {
    console.error("CGPA computation error:", err);
    res.status(500).json({ error: "CGPA calculation failed" });
  }
};

/* ---------- NAAC GRADE MAPPING ---------- */
const deriveNAACGrade = (cgpa) => {
  if (cgpa >= 3.51) return "A++";
  if (cgpa >= 3.26) return "A+";
  if (cgpa >= 3.01) return "A";
  if (cgpa >= 2.76) return "B++";
  if (cgpa >= 2.51) return "B+";
  if (cgpa >= 2.01) return "B";
  return "C";
};


module.exports = {
  evaluateCriterion2,
  computeNAACCGPA,
};
