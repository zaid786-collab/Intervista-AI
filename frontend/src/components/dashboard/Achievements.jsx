    import "./Dashboard.css";
import {
  FaFire,
  FaMedal,
  FaStar,
  FaTrophy,
  FaBolt,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

function Achievements({
  totalInterviews = 0,
  avgScore = "0%",
  bestScore = "0%",
  xp: propXp,
}) {
  const bestScoreNum = parseInt(bestScore, 10) || 0;
  
  // Calculate dynamic XP: 100 XP per completed interview + bonus for high scores
  const calculatedXp = propXp !== undefined && propXp !== null
    ? propXp
    : totalInterviews * 100 + (bestScoreNum >= 90 ? 100 : bestScoreNum >= 75 ? 50 : 0);

  const achievementsList = [
    {
      icon: <FaFire />,
      title: "First Steps",
      desc: totalInterviews >= 1 ? "Completed 1st interview session" : "Complete your 1st mock interview",
      color: "#f97316",
      unlocked: totalInterviews >= 1,
      progress: `${Math.min(totalInterviews, 1)}/1`,
    },
    {
      icon: <FaMedal />,
      title: "Top Performer",
      desc: bestScoreNum >= 85 ? `High score achieved: ${bestScoreNum}%` : "Score 85% or higher on an interview",
      color: "#22c55e",
      unlocked: bestScoreNum >= 85,
      progress: bestScoreNum >= 85 ? "Unlocked" : `Best: ${bestScoreNum}% / 85%`,
    },
    {
      icon: <FaStar />,
      title: "Consistent Practicer",
      desc: totalInterviews >= 3 ? "Completed 3 practice sessions" : "Complete 3 mock interviews",
      color: "#2563eb",
      unlocked: totalInterviews >= 3,
      progress: `${Math.min(totalInterviews, 3)}/3`,
    },
    {
      icon: <FaTrophy />,
      title: "Interview Master",
      desc: totalInterviews >= 10 ? "Completed 10 interviews milestone" : "Complete 10 mock interviews",
      color: "#eab308",
      unlocked: totalInterviews >= 10,
      progress: `${Math.min(totalInterviews, 10)}/10`,
    },
  ];

  return (
    <div className="achievements">
      <div className="achievement-header">
        <h2>🏅 Achievements</h2>

        <div className="xp-card">
          <FaBolt />
          <span>{calculatedXp.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="achievement-grid">
        {achievementsList.map((item, index) => (
          <div
            className="achievement-card"
            key={index}
            style={{
              opacity: item.unlocked ? 1 : 0.65,
              border: item.unlocked ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
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
    </div>
  );
}

export default Achievements;