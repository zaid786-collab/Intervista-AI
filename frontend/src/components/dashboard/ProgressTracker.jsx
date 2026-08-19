import "./Dashboard.css";

function ProgressTracker({
  totalInterviews = 0,
  avgScore = "0%",
  recentInterviews = [],
  userProgress = 0,
}) {
  const avgNum = parseInt(avgScore, 10) || 0;
  const completedList = (recentInterviews || []).filter((i) => i.status === "Completed");

  // Calculate detailed averages if available from evaluations
  let techAvg = 0;
  let commAvg = 0;
  let probAvg = 0;
  let evalCount = 0;

  completedList.forEach((item) => {
    if (item.technical_score) {
      techAvg += item.technical_score;
      commAvg += item.communication_score || item.technical_score;
      probAvg += item.problem_solving_score || item.technical_score;
      evalCount++;
    }
  });

  const dsaProgress = totalInterviews === 0
    ? 0
    : evalCount > 0
    ? Math.round(probAvg / evalCount)
    : Math.min(Math.round(avgNum * 1.02), 100);

  const commProgress = totalInterviews === 0
    ? 0
    : evalCount > 0
    ? Math.round(commAvg / evalCount)
    : Math.min(Math.round(avgNum * 0.95), 100);

  const probProgress = totalInterviews === 0
    ? 0
    : evalCount > 0
    ? Math.round(probAvg / evalCount)
    : Math.min(Math.round(avgNum * 0.98), 100);

  const sysProgress = totalInterviews === 0
    ? 0
    : evalCount > 0
    ? Math.round(techAvg / evalCount)
    : Math.min(Math.round(avgNum * 0.90), 100);

  const coreProgress = totalInterviews === 0
    ? 0
    : evalCount > 0
    ? Math.round((techAvg + probAvg) / (2 * evalCount))
    : Math.min(Math.round(avgNum * 0.92), 100);

  const behavProgress = totalInterviews === 0
    ? 0
    : evalCount > 0
    ? Math.round(commAvg / evalCount)
    : Math.min(Math.round(avgNum * 0.88), 100);

  const skills = [
    { name: "Data Structures & Algorithms", progress: dsaProgress, color: "#2563eb" },
    { name: "Communication Skills", progress: commProgress, color: "#22c55e" },
    { name: "Problem Solving & Logic", progress: probProgress, color: "#f59e0b" },
    { name: "System Design & Architecture", progress: sysProgress, color: "#8b5cf6" },
    { name: "Core CS Fundamentals", progress: coreProgress, color: "#ec4899" },
    { name: "Behavioral & Articulation", progress: behavProgress, color: "#06b6d4" },
  ];

  const overallAvg = totalInterviews === 0
    ? 0
    : Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / skills.length);

  return (
    <div className="progress-tracker">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>📈 Candidate Progress</h2>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            padding: "3px 10px",
            borderRadius: "12px",
            background: totalInterviews > 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(148, 163, 184, 0.15)",
            color: totalInterviews > 0 ? "#22c55e" : "#94a3b8",
          }}
        >
          {totalInterviews === 0 ? "0% Initial" : `${overallAvg}% Overall Competency`}
        </span>
      </div>

      {totalInterviews === 0 && (
        <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", marginBottom: "16px" }}>
          Skill bars start at 0% and unlock as you complete interview assessments and challenges.
        </p>
      )}

      {skills.map((skill, index) => (
        <div className="skill" key={index}>
          <div className="skill-top">
            <span>{skill.name}</span>
            <span style={{ fontWeight: "700", color: skill.progress > 0 ? "#fff" : "#94a3b8" }}>
              {skill.progress}%
            </span>
          </div>

          <div className="progress-bar" style={{ background: "rgba(255, 255, 255, 0.08)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
            <div
              className="progress-fill"
              style={{
                width: `${skill.progress}%`,
                background: skill.color,
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProgressTracker;