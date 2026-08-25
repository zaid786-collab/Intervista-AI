import { useState } from "react";
import "./Dashboard.css";
import {
  FaFire,
  FaMedal,
  FaStar,
  FaTrophy,
  FaBolt,
  FaLock,
  FaCheckCircle,
  FaTimes,
  FaAward,
} from "react-icons/fa";

function Achievements({
  totalInterviews = 0,
  avgScore = "0%",
  bestScore = "0%",
  xp: propXp,
}) {
  const bestScoreNum = parseInt(bestScore, 10) || 0;
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Calculate dynamic XP: 100 XP per completed interview + bonus for high scores
  const calculatedXp =
    propXp !== undefined && propXp !== null
      ? propXp
      : totalInterviews * 100 + (bestScoreNum >= 90 ? 100 : bestScoreNum >= 75 ? 50 : 0);

  const achievementsList = [
    {
      id: "ach-1",
      icon: <FaFire />,
      title: "First Steps",
      desc: totalInterviews >= 1 ? "Completed 1st interview session" : "Complete your 1st mock interview",
      reward: "100 XP",
      color: "#f97316",
      unlocked: totalInterviews >= 1,
      progress: `${Math.min(totalInterviews, 1)}/1`,
      criteria: "Complete at least 1 full AI mock interview session with automated scoring.",
    },
    {
      id: "ach-2",
      icon: <FaMedal />,
      title: "Top Performer",
      desc: bestScoreNum >= 85 ? `High score achieved: ${bestScoreNum}%` : "Score 85% or higher on an interview",
      reward: "250 XP",
      color: "#22c55e",
      unlocked: bestScoreNum >= 85,
      progress: bestScoreNum >= 85 ? "Unlocked" : `Best: ${bestScoreNum}% / 85%`,
      criteria: "Achieve an overall rating of 85% or above on technical problem solving and communication.",
    },
    {
      id: "ach-3",
      icon: <FaStar />,
      title: "Consistent Practicer",
      desc: totalInterviews >= 3 ? "Completed 3 practice sessions" : "Complete 3 mock interviews",
      reward: "300 XP",
      color: "#2563eb",
      unlocked: totalInterviews >= 3,
      progress: `${Math.min(totalInterviews, 3)}/3`,
      criteria: "Complete 3 distinct mock interview sessions to establish practice consistency.",
    },
    {
      id: "ach-4",
      icon: <FaTrophy />,
      title: "Interview Master",
      desc: totalInterviews >= 10 ? "Completed 10 interviews milestone" : "Complete 10 mock interviews",
      reward: "1,000 XP",
      color: "#eab308",
      unlocked: totalInterviews >= 10,
      progress: `${Math.min(totalInterviews, 10)}/10`,
      criteria: "Demonstrate elite dedication by completing 10 full AI-evaluated practice interviews.",
    },
  ];

  return (
    <div className="achievements">
      <div className="achievement-header">
        <h2>🏅 Achievements</h2>

        <div className="xp-card" title="Total accumulated candidate XP">
          <FaBolt />
          <span>{calculatedXp.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="achievement-grid">
        {achievementsList.map((item, index) => (
          <div
            className="achievement-card clickable"
            key={index}
            onClick={() => setSelectedAchievement(item)}
            title={`Click to view details for ${item.title}`}
            style={{
              opacity: item.unlocked ? 1 : 0.65,
              border: item.unlocked ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
            }}
          >
            <div
              className="achievement-icon"
              style={{
                background: item.unlocked ? item.color : "rgba(148, 163, 184, 0.2)",
                color: item.unlocked ? "#fff" : "#94a3b8",
              }}
            >
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>{item.title}</h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: item.unlocked ? "#22c55e" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {item.unlocked ? <FaCheckCircle /> : <FaLock />}
                  {item.progress}
                </span>
              </div>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="dashboard-modal-backdrop" onClick={() => setSelectedAchievement(null)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  className="achievement-icon"
                  style={{
                    background: selectedAchievement.unlocked ? selectedAchievement.color : "rgba(148, 163, 184, 0.2)",
                    width: "44px",
                    height: "44px",
                    fontSize: "20px",
                  }}
                >
                  {selectedAchievement.icon}
                </div>
                <div>
                  <h2>{selectedAchievement.title}</h2>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: selectedAchievement.unlocked ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {selectedAchievement.unlocked ? "✓ Unlocked & Verified" : "🔒 Locked Achievement"}
                  </span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedAchievement(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="candidate-modal-body">
              <div className="candidate-stat-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="candidate-stat-box">
                  <span className="stat-label">XP Reward</span>
                  <strong style={{ color: "#eab308" }}>⚡ {selectedAchievement.reward}</strong>
                </div>
                <div className="candidate-stat-box">
                  <span className="stat-label">Progress</span>
                  <strong style={{ color: selectedAchievement.unlocked ? "#22c55e" : "#38bdf8" }}>
                    {selectedAchievement.progress}
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <h4 style={{ fontSize: "13px", marginBottom: "6px", color: "#94a3b8" }}>Unlock Requirement:</h4>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: "#fff" }}>
                  {selectedAchievement.criteria}
                </p>
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="apply-btn"
                  onClick={() => setSelectedAchievement(null)}
                  style={{ padding: "7px 18px" }}
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Achievements;