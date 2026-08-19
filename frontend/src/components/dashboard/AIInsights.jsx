import "./Dashboard.css";
import {
  FaRobot,
  FaSmile,
  FaLightbulb,
  FaArrowUp,
  FaHourglassHalf,
} from "react-icons/fa";

function AIInsights({ avgScore = "0%", totalInterviews = 0, recentInterviews = [] }) {
  const avgNum = parseInt(avgScore, 10) || 0;
  const latestInterview = (recentInterviews || []).find((i) => i.status === "Completed");

  let confidenceText = "0% (Awaiting First Interview)";
  let commText = "Not Assessed Yet";
  let recText = "Select a company & role below to start your first AI Mock Interview!";

  if (totalInterviews > 0) {
    confidenceText = `${avgScore} Candidate Index`;

    if (avgNum >= 88) {
      commText = "Outstanding Technical Clarity & STAR Articulation";
    } else if (avgNum >= 75) {
      commText = "Solid Fundamentals • Expand on edge cases & scale";
    } else if (avgNum >= 60) {
      commText = "Good Base • Flesh out algorithm memory footprints";
    } else {
      commText = "Needs Targeted Practice • State Big-O upfront";
    }

    if (latestInterview?.role) {
      const r = latestInterview.role.toLowerCase();
      if (r.includes("frontend")) {
        recText = `For ${latestInterview.role}: Focus on React Fiber, Core Web Vitals (LCP/INP), and memoization.`;
      } else if (r.includes("backend")) {
        recText = `For ${latestInterview.role}: Practice Redis cache stampede protection and PostgreSQL MVCC.`;
      } else if (r.includes("full stack")) {
        recText = `For ${latestInterview.role}: Emphasize WebSockets, OAuth2 PKCE security, and DB connection pooling.`;
      } else if (r.includes("ai") || r.includes("ml")) {
        recText = `For ${latestInterview.role}: Hone enterprise RAG hybrid search and vLLM inference serving.`;
      } else {
        recText = `Target ${latestInterview.role}: Strengthen structured problem-solving and Big-O runtime analysis.`;
      }
    } else {
      recText = "Keep practicing across diverse companies to build cross-domain interview stamina.";
    }
  }

  return (
    <div className="ai-insights">
      <h2>
        <FaRobot /> AI Insights
      </h2>

      <div className="insight-card">
        <div className="insight-icon" style={{ background: totalInterviews > 0 ? "#22c55e" : "#64748b" }}>
          {totalInterviews > 0 ? <FaSmile /> : <FaHourglassHalf />}
        </div>
        <div>
          <h3>Confidence Score</h3>
          <p style={{ fontWeight: "700", color: totalInterviews > 0 ? "#fff" : "#94a3b8" }}>
            {confidenceText}
          </p>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-icon" style={{ background: "#2563eb" }}>
          <FaLightbulb />
        </div>
        <div>
          <h3>Communication Assessment</h3>
          <p>{commText}</p>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-icon" style={{ background: "#8b5cf6" }}>
          <FaArrowUp />
        </div>
        <div>
          <h3>Next Action Recommendation</h3>
          <p>{recText}</p>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;