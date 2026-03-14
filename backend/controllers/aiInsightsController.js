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

    msg.total_messages,
    msg.last_message_at,
    msg.last_sender,

    ai.summary_text,
    ai.dominant_topics,
    ai.engagement_level AS ai_engagement,
    ai.risk_score AS ai_risk_score,
    ai.risk_explanation,
    ai.generated_at,
    ai.ai_source

  FROM STUDENT s

  LEFT JOIN (
    SELECT
      Student_id,
      COUNT(*) AS total_messages,
      MAX(Created_At) AS last_message_at,
      SUBSTRING_INDEX(
        GROUP_CONCAT(Sender ORDER BY Created_At DESC),
        ',', 1
      ) AS last_sender
    FROM MESSAGE
    WHERE Fac_id = ?
    GROUP BY Student_id
  ) msg ON msg.Student_id = s.Student_id

  LEFT JOIN STUDENT_AI_INSIGHTS ai
    ON ai.Student_id = s.Student_id

  WHERE s.Supervised_by = ?
  `,
  [facId, facId]
);



    let highRiskCount = 0;

    const students = rows.map((stu) => {
  // ---------------- RULE-BASED FALLBACK ----------------
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

  // ---------------- PREFER OLLAMA IF EXISTS ----------------
  const useAI =
  stu.ai_source &&
  typeof stu.ai_source === "string" &&
  stu.ai_source.toLowerCase() === "ollama";


  return {
    Student_id: stu.Student_id,
    Student_name: stu.Student_name,
    USN: stu.USN,

    summary_text: useAI
      ? stu.summary_text
      : "Recent communication patterns were analyzed to assess engagement and risk.",

    dominant_topics: (() => {
      if (!useAI || !stu.dominant_topics) return ["Academics"];

      // already array (rare but safe)
      if (Array.isArray(stu.dominant_topics)) {
        return stu.dominant_topics;
      }

      // try JSON parse
      try {
        const parsed = JSON.parse(stu.dominant_topics);
        return Array.isArray(parsed) ? parsed : ["Academics"];
      } catch {
        // fallback: comma-separated string
        return stu.dominant_topics
          .split(",")
          .map(t => t.trim())
          .filter(Boolean);
      }
    })(),


    engagement_level: useAI
      ? stu.ai_engagement
      : engagement,

    risk_score: useAI
      ? stu.ai_risk_score
      : Number(riskScore.toFixed(2)),

    risk_explanation: useAI
      ? stu.risk_explanation
      : explanation,

    generated_at: useAI
      ? stu.generated_at
      : new Date(),

    ai_source: useAI ? "ollama" : "rule_based",
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
