import { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaArrowUp, FaTrophy, FaTimes, FaStar, FaFire, FaCheckCircle } from "react-icons/fa";
import { getToken } from "../../api";

const CANDIDATE_DATA = {
  weekly: [
    { rank: 1, name: "Sarah Chen", score: "98%", badge: "🥇", role: "AI Systems Engineer", streak: "14 Days", topSkill: "PyTorch & Transformers" },
    { rank: 2, name: "Alex Rivera", score: "95%", badge: "🥈", role: "Full Stack Developer", streak: "9 Days", topSkill: "React & Distributed DBs" },
    { rank: 3, name: "Priya Sharma", score: "93%", badge: "🥉", role: "Backend Architect", streak: "12 Days", topSkill: "Go & High-Scale Systems" },
    { rank: 4, name: "Michael Zhang", score: "91%", badge: "🏅", role: "Frontend Engineer", streak: "7 Days", topSkill: "Core Web Vitals & Next.js" },
    { rank: 5, name: "David Kim", score: "89%", badge: "🏅", role: "Cloud & DevOps", streak: "6 Days", topSkill: "Kubernetes & Terraform" },
  ],
  monthly: [
    { rank: 1, name: "Sarah Chen", score: "96%", badge: "🥇", role: "AI Systems Engineer", streak: "32 Days", topSkill: "LLM Fine-Tuning" },
    { rank: 2, name: "Priya Sharma", score: "94%", badge: "🥈", role: "Backend Architect", streak: "28 Days", topSkill: "Kafka & Microservices" },
    { rank: 3, name: "Alex Rivera", score: "92%", badge: "🥉", role: "Full Stack Developer", streak: "21 Days", topSkill: "React & Node.js" },
    { rank: 4, name: "Elena Rostova", score: "90%", badge: "🏅", role: "Security Engineer", streak: "18 Days", topSkill: "OAuth2 & Zero Trust" },
    { rank: 5, name: "Michael Zhang", score: "89%", badge: "🏅", role: "Frontend Engineer", streak: "15 Days", topSkill: "WebGL & Performance" },
  ],
  allTime: [
    { rank: 1, name: "Sarah Chen", score: "97%", badge: "🥇", role: "AI Systems Engineer", streak: "45 Days", topSkill: "Distributed AI Training" },
    { rank: 2, name: "Priya Sharma", score: "95%", badge: "🥈", role: "Backend Architect", streak: "40 Days", topSkill: "High Throughput DBs" },
    { rank: 3, name: "Alex Rivera", score: "94%", badge: "🥉", role: "Full Stack Developer", streak: "35 Days", topSkill: "Full Lifecycle Architecture" },
    { rank: 4, name: "Devon Vance", score: "93%", badge: "🏅", role: "Algorithms Specialist", streak: "30 Days", topSkill: "Graph Theory & Dynamic Prog" },
    { rank: 5, name: "Elena Rostova", score: "91%", badge: "🏅", role: "Security Engineer", streak: "25 Days", topSkill: "AppSec & Cryptography" },
  ],
};

function Leaderboard() {
  const [timeframe, setTimeframe] = useState("weekly");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [board, setBoard] = useState(CANDIDATE_DATA.weekly);

  useEffect(() => {
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
    const token = getToken();

    for (const base of candidateBases) {
      fetch(`${base}/api/leaderboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const apiMapped = data.slice(0, 5).map((u, i) => ({
              rank: i + 1,
              name: u.name,
              score: `${u.avg_score || 90}%`,
              badge: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏅",
              role: u.role || "Software Engineer",
              streak: `${(u.total_interviews || 3) * 2} Days`,
              topSkill: "Technical Problem Solving",
            }));
            setBoard(apiMapped);
          } else {
            setBoard(CANDIDATE_DATA[timeframe]);
          }
        })
        .catch(() => {
          setBoard(CANDIDATE_DATA[timeframe]);
        });
    }
  }, [timeframe]);

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
    setBoard(CANDIDATE_DATA[tf]);
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <div>
          <h2>🏆 Top Candidates</h2>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted, #94a3b8)" }}>
            Global Verified Performance Rankings
          </span>
        </div>

        {/* Timeframe selector pills */}
        <div className="leaderboard-time-pills">
          <button
            className={`time-pill ${timeframe === "weekly" ? "active" : ""}`}
            onClick={() => handleTimeframeChange("weekly")}
          >
            Weekly
          </button>
          <button
            className={`time-pill ${timeframe === "monthly" ? "active" : ""}`}
            onClick={() => handleTimeframeChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={`time-pill ${timeframe === "allTime" ? "active" : ""}`}
            onClick={() => handleTimeframeChange("allTime")}
          >
            All-Time
          </button>
        </div>
      </div>

      {board.map((user) => (
        <div
          className="leader-item clickable"
          key={user.rank}
          onClick={() => setSelectedCandidate(user)}
          title={`Click to inspect ${user.name}'s profile`}
        >
          <div className="leader-left">
            <div className="leader-rank">{user.badge}</div>
            <div>
              <h3>{user.name}</h3>
              <small>{user.role}</small>
            </div>
          </div>

          <div className="leader-score">
            <FaArrowUp />
            <span>{user.score}</span>
          </div>
        </div>
      ))}

      {/* Candidate Profile Inspection Modal */}
      {selectedCandidate && (
        <div
          className="dashboard-modal-backdrop"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="dashboard-modal candidate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{selectedCandidate.badge}</span>
                <div>
                  <h2>{selectedCandidate.name}</h2>
                  <p>{selectedCandidate.role}</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedCandidate(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="candidate-modal-body">
              <div className="candidate-stat-grid">
                <div className="candidate-stat-box">
                  <span className="stat-label">Interview Score</span>
                  <strong style={{ color: "#22c55e" }}>{selectedCandidate.score}</strong>
                </div>
                <div className="candidate-stat-box">
                  <span className="stat-label">Global Rank</span>
                  <strong style={{ color: "#38bdf8" }}>#{selectedCandidate.rank}</strong>
                </div>
                <div className="candidate-stat-box">
                  <span className="stat-label">Practice Streak</span>
                  <strong style={{ color: "#f59e0b" }}>🔥 {selectedCandidate.streak}</strong>
                </div>
              </div>

              <div className="candidate-skill-section">
                <h4>Primary Specialization</h4>
                <div className="skill-badge-large">
                  <FaStar style={{ color: "#eab308" }} />
                  <span>{selectedCandidate.topSkill}</span>
                </div>
              </div>

              <div className="candidate-badges">
                <h4>Earned Badges</h4>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                  <span className="badge-chip">🎯 95%+ Precision</span>
                  <span className="badge-chip">⚡ System Design Master</span>
                  <span className="badge-chip">🔥 10+ Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;