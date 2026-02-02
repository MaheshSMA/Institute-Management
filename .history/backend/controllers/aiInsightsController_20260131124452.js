//backend/controllers/aiInsightsController.js
const db = require("../config/db");
const axios = require("axios"); // 👈 ADD THIS

/**
 * GET /api/ai/insights
 * Faculty-only
 */
const getFacultyAIInsights = async (req, res) => {
  const facId = req.user.refId;

  try {
    /**
     * Step 1: Get assigned students + message stats
     */
    const [rows] = await db.query(
      `
      SELECT
        s.Student_id,
        s.Student_name,
        s.USN,

        COUNT(m.Message_id) AS total_messages,

        MAX(m.Created_At) AS last_message_at,

        SUBSTRING_INDEX(
          GROUP_CONCAT(m.Sender ORDER BY m.Created_At DESC),
          ',', 1
        ) AS last_sender

      FROM STUDENT s
      LEFT JOIN MESSAGE m
        ON m.Student_id = s.Student_id
        AND m.Faculty_id = ?

      WHERE s.Supervised_by = ?
      GROUP BY s.Student_id
      `,
      [facId, facId]
    );

    let highRiskCount = 0;

    const students = rows.map((stu) => {
      let engagement = "Inactive";
      let riskScore = 0.2;
      let explanation = "Limited interaction data available.";

      if (stu.total_messages > 0) {
        engagement = "Stable";
        riskScore = 0.4;
        explanation = "Regular interaction observed.";
      }

      if (stu.last_message_at) {
        const days =
          (Date.now() - new Date(stu.last_message_at)) /
          (1000 * 60 * 60 * 24);

        if (stu.last_sender === "Student" && days > 3) {
          engagement = "Dropping";
          riskScore = 0.65;
          explanation =
            "Student initiated conversation but no recent faculty response.";
        }

        if (days > 10) {
          engagement = "Inactive";
          riskScore = 0.85;
          explanation =
            "Prolonged inactivity detected in communication.";
        }
      }

      if (riskScore >= 0.7) highRiskCount++;

      return {
        Student_id: stu.Student_id,
        Student_name: stu.Student_name,
        USN: stu.USN,

        summary_text:
          "Recent communication patterns were analyzed to assess engagement and risk.",

        dominant_topics: ["Academics"],

        engagement_level: engagement,
        risk_score: Number(riskScore.toFixed(2)),
        risk_explanation: explanation,
        generated_at: new Date(),
        ai_source: "rule_based",
      };
    });

    /**
     * Step 2: Overall summary
     */
    let overallSummary = "No significant risks detected this week.";

    if (highRiskCount > 0) {
      overallSummary = `${highRiskCount} student(s) show high risk due to reduced engagement or inactivity.`;
    }

    res.json({
      overall_summary: overallSummary,
      students,
    });
    // 🔥 Fire AI jobs in background (non-blocking)
    students.forEach((stu) => {
    axios
        .post("http://localhost:8001/run", {
        student_id: stu.Student_id,
        })
        .catch(() => {
        // silently fail — never break main API
        });
    });

  } catch (err) {
    console.error("AI insights error:", err);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
};

module.exports = {
  getFacultyAIInsights,
};
