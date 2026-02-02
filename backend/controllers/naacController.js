const db = require("../config/db");

/* ============================================================
   GET /api/naac/status
   → Used by AdminNAACDashboard (metrics table)
============================================================ */
const getNAACStatus = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.Metric_code,
        m.Metric_name,
        s.Current_value,
        s.Compliance,
        s.Last_checked
      FROM NAAC_STATUS s
      JOIN NAAC_METRIC m
        ON m.Metric_code = s.Metric_code
      ORDER BY s.Metric_code
    `);

    res.json(rows);
  } catch (err) {
    console.error("Fetch NAAC status failed:", err);
    res.status(500).json({ error: "Failed to fetch NAAC status" });
  }
};

/* ============================================================
   POST /api/naac/evaluate/criterion-2
   → Computes ONLY Criterion 2 metrics (2.2.1, 2.3.1)
============================================================ */
const evaluateCriterion2 = async (req, res) => {
  try {
    /* ---------- 2.2.1 Student–Faculty Ratio ---------- */
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
      `
      INSERT INTO NAAC_STATUS
        (Metric_code, Current_value, Compliance, Last_checked)
      VALUES ('2.2.1', ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        Current_value = VALUES(Current_value),
        Compliance = VALUES(Compliance),
        Last_checked = NOW()
      `,
      [ratio.toFixed(2), ratioStatus]
    );

    /* ---------- 2.3.1 Mentoring Coverage ---------- */
    const [[{ total_students }]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM STUDENT"
    );

    const [[{ mentored }]] = await db.query(
      `
      SELECT COUNT(*) AS mentored
      FROM STUDENT
      WHERE Supervised_by IS NOT NULL
      `
    );

    const coverage =
      total_students === 0
        ? 0
        : (mentored / total_students) * 100;

    const coverageStatus =
      coverage >= 90 ? "COMPLIANT" :
      coverage >= 75 ? "PARTIAL" :
      "NON_COMPLIANT";

    await db.query(
      `
      INSERT INTO NAAC_STATUS
        (Metric_code, Current_value, Compliance, Last_checked)
      VALUES ('2.3.1', ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        Current_value = VALUES(Current_value),
        Compliance = VALUES(Compliance),
        Last_checked = NOW()
      `,
      [coverage.toFixed(2), coverageStatus]
    );

    res.json({
      message: "Criterion 2 evaluated successfully",
      metrics: ["2.2.1", "2.3.1"]
    });
  } catch (err) {
    console.error("Criterion 2 evaluation failed:", err);
    res.status(500).json({ error: "Criterion 2 evaluation failed" });
  }
};

/* ============================================================
   POST /api/naac/cgpa/compute
   → Computes CGPA from NAAC_CRITERION_SCORE
============================================================ */
const computeNAACCGPA = async (req, res) => {
  try {
    const [criteria] = await db.query(`
      SELECT
        Criterion_code,
        Total_score,
        Max_score,
        Weight
      FROM NAAC_CRITERION_SCORE
    `);

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

    const cgpa =
      weightTotal === 0
        ? 0
        : (weightedSum / weightTotal) * 4;

    const grade = deriveNAACGrade(cgpa);

    await db.query(
      `
      INSERT INTO NAAC_CGPA
        (CGPA, Grade, Calculated_at)
      VALUES (?, ?, NOW())
      `,
      [cgpa.toFixed(2), grade]
    );

    res.json({
      CGPA: cgpa.toFixed(2),
      Grade: grade,
      Calculated_at: new Date()
    });
  } catch (err) {
    console.error("CGPA computation failed:", err);
    res.status(500).json({ error: "CGPA computation failed" });
  }
};

/* ============================================================
   GET /api/naac/cgpa/latest
   → Used by dashboard summary card
============================================================ */
const getLatestCGPA = async (req, res) => {
  try {
    const [[row]] = await db.query(`
      SELECT *
      FROM NAAC_CGPA
      ORDER BY Calculated_at DESC
      LIMIT 1
    `);

    if (!row) {
      return res.status(404).json({ error: "CGPA not computed yet" });
    }

    res.json(row);
  } catch (err) {
    console.error("Fetch CGPA failed:", err);
    res.status(500).json({ error: "Failed to fetch CGPA" });
  }
};

/* ============================================================
   NAAC GRADE MAPPING
============================================================ */
const deriveNAACGrade = (cgpa) => {
  if (cgpa >= 3.51) return "A++";
  if (cgpa >= 3.26) return "A+";
  if (cgpa >= 3.01) return "A";
  if (cgpa >= 2.76) return "B++";
  if (cgpa >= 2.51) return "B+";
  if (cgpa >= 2.01) return "B";
  return "C";
};

const updateCriterion2Score = async () => {
  // Fetch Criterion-2 metrics
  const [metrics] = await db.query(`
    SELECT Compliance
    FROM NAAC_STATUS
    WHERE Metric_code IN ('2.2.1', '2.3.1')
  `);

  if (metrics.length === 0) return;

  let score = 0;

  for (const m of metrics) {
    if (m.Compliance === "COMPLIANT") score += 4;
    else if (m.Compliance === "PARTIAL") score += 2;
    else score += 0;
  }

  // Normalize to NAAC scale (example: out of 400)
  const totalScore = (score / (metrics.length * 4)) * 400;

  await db.query(
    `
    UPDATE NAAC_CRITERION_SCORE
    SET Total_score = ?, Last_calculated = NOW()
    WHERE Criterion_code = 'C2'
    `,
    [totalScore.toFixed(2)]
  );
  await updateCriterion2Score();
  res.json({
  message: "Criterion 2 evaluated successfully",
  metrics: ["2.2.1", "2.3.1"]
});
};


module.exports = {
  getNAACStatus,
  evaluateCriterion2,
  computeNAACCGPA,
  getLatestCGPA
};
