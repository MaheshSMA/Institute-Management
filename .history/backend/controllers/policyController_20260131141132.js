const db = require("../config/db");

/**
 * GET /api/admin/policies
 */
const getPolicies = async (req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM ADMIN_POLICY ORDER BY Created_at DESC`
  );
  res.json(rows);
};

/**
 * POST /api/admin/policies
 */
const createPolicy = async (req, res) => {
  const {
    policy_name,
    policy_type,
    target_role,
    threshold_value
  } = req.body;

  if (!policy_name || !policy_type || !target_role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await db.query(
    `INSERT INTO ADMIN_POLICY
     (Policy_name, Policy_type, Target_role, Threshold_value)
     VALUES (?, ?, ?, ?)`,
    [policy_name, policy_type, target_role, threshold_value]
  );

  res.status(201).json({ message: "Policy created" });
};

/**
 * RUN POLICY CHECK (manual trigger)
 * POST /api/admin/policies/run
 */
const runPolicyEngine = async (req, res) => {
  const [policies] = await db.query(
    `SELECT * FROM ADMIN_POLICY WHERE Is_active = TRUE`
  );

  let violations = [];

  for (const p of policies) {
    if (p.Policy_type === "MAX_ACTIVITY_POINTS") {
      const [students] = await db.query(
        `SELECT Student_id, Activity_pts
         FROM STUDENT
         WHERE Activity_pts > ?`,
        [p.Threshold_value]
      );

      for (const s of students) {
        violations.push({
          Policy_id: p.Policy_id,
          Target_id: s.Student_id,
          Target_role: "Student",
          Current_value: s.Activity_pts,
          Threshold_value: p.Threshold_value
        });
      }
    }

    if (p.Policy_type === "MAX_COUNSELLOR_LOAD") {
      const [faculty] = await db.query(
        `SELECT Supervised_by AS Fac_id, COUNT(*) AS cnt
         FROM STUDENT
         GROUP BY Supervised_by
         HAVING cnt > ?`,
        [p.Threshold_value]
      );

      for (const f of faculty) {
        violations.push({
          Policy_id: p.Policy_id,
          Target_id: f.Fac_id,
          Target_role: "Faculty",
          Current_value: f.cnt,
          Threshold_value: p.Threshold_value
        });
      }
    }
  }

  // Store violations
  for (const v of violations) {
    await db.query(
      `INSERT INTO POLICY_VIOLATION
       (Policy_id, Target_id, Target_role, Current_value, Threshold_value)
       VALUES (?, ?, ?, ?, ?)`,
      [
        v.Policy_id,
        v.Target_id,
        v.Target_role,
        v.Current_value,
        v.Threshold_value
      ]
    );
  }

  res.json({
    message: "Policy engine executed",
    violations_detected: violations.length
  });
};

module.exports = {
  getPolicies,
  createPolicy,
  runPolicyEngine
};
