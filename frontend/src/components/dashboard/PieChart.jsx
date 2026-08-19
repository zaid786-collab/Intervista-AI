import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./Dashboard.css";

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

function InterviewPieChart({ recentInterviews = [], upcomingInterviews = [], totalInterviews = 0 }) {
  const completedCount = (recentInterviews || []).filter((i) => i.status === "Completed").length || totalInterviews || 0;
  const pendingCount = (recentInterviews || []).filter((i) => i.status === "Pending").length;
  const scheduledCount = (upcomingInterviews || []).length;

  const total = completedCount + pendingCount + scheduledCount;

  const chartData = total > 0
    ? [
        { name: `Completed (${completedCount})`, value: completedCount, color: "#22c55e" },
        ...(pendingCount > 0 ? [{ name: `Pending (${pendingCount})`, value: pendingCount, color: "#f59e0b" }] : []),
        ...(scheduledCount > 0 ? [{ name: `Scheduled (${scheduledCount})`, value: scheduledCount, color: "#3b82f6" }] : []),
      ]
    : [{ name: "No Interviews Yet", value: 1, color: "#334155" }];

  return (
    <div className="pie-chart">
      <h2>Interview Distribution</h2>

      {total === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--text-muted, #94a3b8)" }}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={75}
                stroke="none"
              >
                <Cell fill="#334155" />
              </Pie>
              <Tooltip formatter={() => ["0 Sessions", "Status"]} />
            </PieChart>
          </ResponsiveContainer>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            No interview sessions yet.<br />
            <span style={{ color: "#38bdf8", fontWeight: "600" }}>Start your first mock session</span> to visualize your completion ratio.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={4}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default InterviewPieChart;