import "./Dashboard.css";

function getColor(value) {
  if (value === 0) return "#1e293b";
  if (value === 1) return "#0ea5e9";
  if (value === 2) return "#22c55e";
  if (value === 3) return "#84cc16";
  return "#16a34a";
}

function InterviewHeatmap({ recentInterviews = [], activities = [] }) {
  // Build 35 days array (0 = 34 days ago, 34 = today)
  const grid = new Array(35).fill(0);
  const now = new Date();

  // Populate grid from recent interviews
  (recentInterviews || []).forEach((item) => {
    if (item.status === "Completed") {
      let itemDate = now;
      if (item.date) {
        const parsed = new Date(item.date);
        if (!isNaN(parsed.getTime())) itemDate = parsed;
      }
      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 35) {
        const index = 34 - diffDays;
        grid[index] = (grid[index] || 0) + 1;
      }
    }
  });

  const totalSessions = grid.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="heatmap">
      <div className="heatmap-header">
        <h2>🔥 Interview Heatmap</h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
          {totalSessions > 0 ? `${totalSessions} sessions in last 35 days` : "0 sessions in last 35 days"}
        </p>
      </div>

      <div className="heatmap-grid">
        {grid.map((value, index) => {
          const daysAgo = 34 - index;
          const label = daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;

          return (
            <div
              key={index}
              className="heat-cell"
              style={{
                background: getColor(value),
                transition: "background 0.3s ease",
              }}
              title={`${label}: ${value} practice session${value !== 1 ? "s" : ""}`}
            />
          );
        })}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-color" style={{ background: "#1e293b" }} />
        <div className="legend-color" style={{ background: "#0ea5e9" }} />
        <div className="legend-color" style={{ background: "#22c55e" }} />
        <div className="legend-color" style={{ background: "#84cc16" }} />
        <div className="legend-color" style={{ background: "#16a34a" }} />
        <span>More</span>
      </div>
    </div>
  );
}

export default InterviewHeatmap;