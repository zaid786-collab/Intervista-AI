import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./Dashboard.css";

const data = [
  { name: "Completed", value: 18 },
  { name: "Pending", value: 6 }
];

const COLORS = ["#22c55e", "#f59e0b"];

function InterviewPieChart() {
  return (
    <div className="pie-chart">

      <h2>Interview Distribution</h2>

      <ResponsiveContainer width="100%" height={280}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default InterviewPieChart;