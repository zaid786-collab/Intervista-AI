import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";

const defaultData = [
  { name: "Completed", value: 6 },
  { name: "Scheduled", value: 3 },
];

const COLORS = ["#22c55e", "#38bdf8"];

function InterviewPieChart({ recentInterviews, upcomingInterviews }) {
  const completedCount = recentInterviews?.filter((i) => i.status === "Completed")?.length || 6;
  const scheduledCount = upcomingInterviews?.length || 3;

  const data = [
    { name: "Completed", value: completedCount },
    { name: "Scheduled", value: scheduledCount },
  ];

  return (
    <div className="pie-chart">
      <h2>Interview Distribution</h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={85}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InterviewPieChart;