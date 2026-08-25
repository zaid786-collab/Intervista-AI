import { useState } from "react";
import "./Dashboard.css";
import {
  FaRobot,
  FaSmile,
  FaLightbulb,
  FaArrowUp,
  FaHourglassHalf,
  FaPlay,
  FaTimes,
  FaCheckCircle,
  FaBookOpen,
} from "react-icons/fa";

function AIInsights({
  avgScore = "0%",
  totalInterviews = 0,
  recentInterviews = [],
  onStartTargetedPractice,
}) {
  const avgNum = parseInt(avgScore, 10) || 0;
  const latestInterview = (recentInterviews || []).find((i) => i.status === "Completed");
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  let confidenceText = "0% (Awaiting First Interview)";
  let commText = "Not Assessed Yet";
  let recText = "Select a company & role below to start your first AI Mock Interview!";
  let targetRole = latestInterview?.role || "Software Engineer";

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

  const handleLaunchTargeted = () => {
    if (onStartTargetedPractice) {
      onStartTargetedPractice(targetRole);
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowRoadmapModal(false);
  };

  return (
    <div className="ai-insights">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>
          <FaRobot style={{ color: "#38bdf8" }} /> AI Insights
        </h2>

        <button
          className="view-btn"
          onClick={() => setShowRoadmapModal(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "4px 10px" }}
        >
          <FaBookOpen style={{ fontSize: "10px" }} /> Prep Roadmap
        </button>
      </div>

      <div className="insight-card">
        <div
          className="insight-icon"
          style={{ background: totalInterviews > 0 ? "#22c55e" : "#64748b" }}
        >
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

      {/* AI Action Plan Roadmap Modal */}
      {showRoadmapModal && (
        <div className="dashboard-modal-backdrop" onClick={() => setShowRoadmapModal(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
            <div className="modal-header">
              <div>
                <h2>🧠 AI Candidate Prep Roadmap</h2>
                <p>Tailored preparation steps generated from your real interview metrics.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowRoadmapModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="candidate-modal-body">
              <div className="roadmap-step">
                <div className="roadmap-step-num">1</div>
                <div>
                  <h4>Phase 1: Algorithmic Rigor & Complexity</h4>
                  <p>State time and auxiliary space bounds before coding. Test empty & single-item edge cases.</p>
                </div>
              </div>

              <div className="roadmap-step">
                <div className="roadmap-step-num">2</div>
                <div>
                  <h4>Phase 2: Architectural Clarity</h4>
                  <p>In system design, justify SQL vs NoSQL, write-through vs write-back caching, and horizontal partitioning.</p>
                </div>
              </div>

              <div className="roadmap-step">
                <div className="roadmap-step-num">3</div>
                <div>
                  <h4>Phase 3: Behavioral STAR Precision</h4>
                  <p>Structure experiences around Situation, Task, Action, and quantifiably measured Result.</p>
                </div>
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  className="modal-filter-pill"
                  onClick={() => setShowRoadmapModal(false)}
                >
                  Close
                </button>
                <button
                  className="apply-btn"
                  onClick={handleLaunchTargeted}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <FaPlay style={{ fontSize: "10px" }} /> Practice Recommended Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIInsights;