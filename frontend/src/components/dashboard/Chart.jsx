import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./Dashboard.css";

const defaultZeroData = [
  { name: "Mon", score: 0 },
  { name: "Tue", score: 0 },
  { name: "Wed", score: 0 },
  { name: "Thu", score: 0 },
  { name: "Fri", score: 0 },
  { name: "Sat", score: 0 },
  { name: "Sun", score: 0 },
];

function Chart({ performanceData }) {
  const chartData =
    performanceData && performanceData.length > 0
      ? performanceData
      : defaultZeroData;

  const hasAnyScore = chartData.some((d) => d.score > 0);

  return (
    <div className="chart">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>Weekly Performance</h2>
        <span style={{ fontSize: "12px", color: hasAnyScore ? "#22c55e" : "#94a3b8", fontWeight: "600" }}>
          {hasAnyScore ? "● Active Weekly Scores" : "○ 0 Interviews This Week"}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} stroke="#94a3b8" />
          <Tooltip
            formatter={(value) => [`${value}%`, "Performance Score"]}
            contentStyle={{
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar
            dataKey="score"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;