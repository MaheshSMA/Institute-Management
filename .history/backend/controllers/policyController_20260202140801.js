const runPolicyEngine = async (req, res) => {
  const [policies] = await db.query(
    `SELECT * FROM ADMIN_POLICY WHERE Is_active = TRUE`
  );

  let detectedViolations = [];

  for (const p of policies) {
    /* ================= MAX ACTIVITY POINTS ================= */
    if (p.Policy_type === "MAX_ACTIVITY_POINTS") {
      const [students] = await db.query(
        `SELECT Student_id, Activity_pts FROM STUDENT`
      );

      const violatingIds = new Set();

      for (const s of students) {
        if (s.Activity_pts > p.Threshold_value) {
          violatingIds.add(s.Student_id);

          detectedViolations.push({
            Policy_id: p.Policy_id,
            Target_id: s.Student_id,
            Target_role: "Student",
            Current_value: s.Activity_pts,
            Threshold_value: p.Threshold_value
          });

          // 🔁 UPSERT (insert OR update)
          await db.query(
            `
            INSERT INTO POLICY_VIOLATION
              (Policy_id, Target_id, Target_role, Current_value, Threshold_value, Status)
            VALUES (?, ?, ?, ?, ?, 'Detected')
            ON DUPLICATE KEY UPDATE
              Current_value = VALUES(Current_value),
              Threshold_value = VALUES(Threshold_value),
              Status = 'Detected',
              Detected_at = NOW()
            `,
            [
              p.Policy_id,
              s.Student_id,
              "Student",
              s.Activity_pts,
              p.Threshold_value
            ]
          );
        }
      }

      // 🔄 AUTO-RESOLVE
      await db.query(
        `
        UPDATE POLICY_VIOLATION
        SET Status = 'Resolved'
        WHERE Policy_id = ?
          AND Target_role = 'Student'
          AND Status = 'Detected'
          AND Target_id NOT IN (?)
        `,
        [
          p.Policy_id,
          violatingIds.size ? [...violatingIds] : [-1]
        ]
      );
    }

    /* ================= MAX COUNSELLOR LOAD ================= */
    if (p.Policy_type === "MAX_COUNSELLOR_LOAD") {
      const [faculty] = await db.query(
        `
        SELECT Supervised_by AS Fac_id, COUNT(*) AS cnt
        FROM STUDENT
        GROUP BY Supervised_by
        `
      );

      const violatingIds = new Set();

      for (const f of faculty) {
        if (f.cnt > p.Threshold_value) {
          violatingIds.add(f.Fac_id);

          detectedViolations.push({
            Policy_id: p.Policy_id,
            Target_id: f.Fac_id,
            Target_role: "Faculty",
            Current_value: f.cnt,
            Threshold_value: p.Threshold_value
          });

          await db.query(
            `
            INSERT INTO POLICY_VIOLATION
              (Policy_id, Target_id, Target_role, Current_value, Threshold_value, Status)
            VALUES (?, ?, ?, ?, ?, 'Detected')
            ON DUPLICATE KEY UPDATE
              Current_value = VALUES(Current_value),
              Threshold_value = VALUES(Threshold_value),
              Status = 'Detected',
              Detected_at = NOW()
            `,
            [
              p.Policy_id,
              f.Fac_id,
              "Faculty",
              f.cnt,
              p.Threshold_value
            ]
          );
        }
      }

      // 🔄 AUTO-RESOLVE
      await db.query(
        `
        UPDATE POLICY_VIOLATION
        SET Status = 'Resolved'
        WHERE Policy_id = ?
          AND Target_role = 'Faculty'
          AND Status = 'Detected'
          AND Target_id NOT IN (?)
        `,
        [
          p.Policy_id,
          violatingIds.size ? [...violatingIds] : [-1]
        ]
      );
    }
  }

  res.json({
    message: "Policy engine executed",
    violations_detected: detectedViolations.length
  });
};
