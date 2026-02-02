//frontend/src/pages/faculty/FacultyAIInsights.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
const timeAgo = (date) => {
  const mins = Math.floor(
    (Date.now() - new Date(date)) / (1000 * 60)
  );

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;

  const hrs = Math.floor(mins / 60);
  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
};

const aiBadge = (source) => {
  const normalized =
    typeof source === "string"
      ? source.trim().toLowerCase()
      : "";

  if (normalized === "ollama") {
    return (
      <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
        🤖 Ollama AI
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
      ⏳ AI pending
    </span>
  );
};



function FacultyAIInsights() {
  const navigate = useNavigate();

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await API.get("/ai/insights"); // backend next step
      setInsights(res.data.students);

      // 🔥 CRITICAL FIX: re-sync selected student
      if (selected) {
        const updated = res.data.students.find(
          s => s.Student_id === selected.Student_id
        );
        if (updated) {
          setSelected(updated);
        }
      }

      setSummary(res.data.overall_summary);
    } catch (err) {
      console.error("Failed to load AI insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const riskBadge = (score) => {
    if (score >= 0.7)
      return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">High</span>;
    if (score >= 0.4)
      return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">Medium</span>;
    return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Low</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading AI insights...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            Student Insight Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-generated overview of assigned students
          </p>
        </div>

        <button
          onClick={() => navigate("/faculty/dashboard")}
          className="text-sm text-blue-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* OVERALL AI SUMMARY */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-900">
          Weekly AI Overview
        </h2>
        <p className="text-sm text-blue-800 mt-1">
          {summary || "No significant risks detected this week."}
        </p>
      </div>

      {/* INSIGHTS TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Engagement</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Risk</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Topics</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {insights.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No AI insights available yet.
                </td>
              </tr>
            ) : (
              insights.map((ins) => (
                <tr key={ins.Student_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{ins.Student_name}</div>
                    <div className="text-xs text-gray-500">{ins.USN}</div>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {ins.engagement_level}
                  </td>

                  <td className="px-4 py-3">
                    {riskBadge(ins.risk_score)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        let topics = [];

                        try {
                          topics = Array.isArray(ins.dominant_topics)
                            ? ins.dominant_topics
                            : JSON.parse(ins.dominant_topics || "[]");
                        } catch (e) {
                          topics = [];
                        }

                        return topics.map((t, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ));
                      })()}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600">
                        {timeAgo(ins.generated_at)}
                      </span>
                      {aiBadge(ins.ai_source)}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(ins)}
                      className="text-blue-700 text-sm hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL PANEL */}
      {selected && (
        <div className="bg-white border rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-xl font-semibold mb-2">
            AI Insight — {selected.Student_name}
          </h3>
          <button
            onClick={async () => {
              await API.post(
                `/ai/regenerate/${selected.Student_id}`
              );
              alert("AI regeneration started. Refresh in a few seconds.");
            }}
            className="mb-4 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            🔄 Regenerate AI Insight
          </button>

        <p className="text-sm text-gray-700 mb-4">
          {selected.ai_source === "ollama"
            ? selected.summary_text
            : "Recent communication patterns were analyzed to assess engagement and risk."}
        </p>


          <div className="text-sm text-gray-800">
            <b>Risk Explanation</b>
            <p className="mt-1">{selected.risk_explanation}</p>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="mt-4 text-sm text-blue-700 hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default FacultyAIInsights;
