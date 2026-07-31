import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import "./Dashboard.css";

const data = [
  { name: "Mon", score: 70 },
  { name: "Tue", score: 82 },
  { name: "Wed", score: 75 },
  { name: "Thu", score: 90 },
  { name: "Fri", score: 88 },
  { name: "Sat", score: 95 },
  { name: "Sun", score: 80 }
];

function Chart() {
  return (
    <div className="chart">

      <h2>Weekly Performance</h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="score"
            fill="#1b5fcb"
            radius={[20, 20, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default Chart;