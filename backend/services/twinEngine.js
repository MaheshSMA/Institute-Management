// backend/services/twinEngine.js
const db = require("../config/db");

/**
 * Evaluate rules for a student and update Digital Twin
 */
async function evaluateStudentTwin(studentId) {
  // 1️⃣ Fetch student snapshot
  const [[student]] = await db.query(
    `SELECT Student_id, Activity_pts
     FROM STUDENT
     WHERE Student_id = ?`,
    [studentId]
  );

  if (!student) return;

  // 2️⃣ Get current twin state
  const [[twin]] = await db.query(
    `SELECT Current_state
     FROM STUDENT_TWIN
     WHERE Student_id = ?`,
    [studentId]
  );

  const currentState = twin?.Current_state || "NORMAL";

  // 3️⃣ Load active rules
  const [rules] = await db.query(
    `SELECT * FROM SYSTEM_RULE WHERE Is_active = TRUE`
  );

  for (const rule of rules) {
    let triggered = false;

    // 🔹 RULE: Max Activity Points
    if (
      rule.Rule_code === "R_AP_01" &&
      student.Activity_pts > Number(rule.Condition_expr)
    ) {
      triggered = true;
    }

    if (!triggered) continue;

    // 4️⃣ Avoid duplicate state
    if (currentState === rule.Target_state) return;

    // 5️⃣ Log state transition
    await db.query(
      `INSERT INTO TWIN_STATE_LOG
       (Student_id, Old_state, New_state, Rule_code, Explanation)
       VALUES (?, ?, ?, ?, ?)`,
      [
        studentId,
        currentState,
        rule.Target_state,
        rule.Rule_code,
        rule.Explanation,
      ]
    );

    // 6️⃣ Update twin
    await db.query(
      `INSERT INTO STUDENT_TWIN (Student_id, Current_state, Last_updated)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         Current_state = VALUES(Current_state),
         Last_updated = NOW()`,
      [studentId, rule.Target_state]
    );

    return; // ⚠️ ONE RULE PER EVALUATION (important)
  }
}

module.exports = {
  evaluateStudentTwin,
};
