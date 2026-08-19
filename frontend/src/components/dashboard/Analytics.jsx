import Chart from "./Chart";
import "./Dashboard.css";
import InterviewPieChart from "./PieChart";

function Analytics({ performanceData, recentInterviews, upcomingInterviews }) {
  return (
    <div className="analytics">
      <Chart performanceData={performanceData} />
      <InterviewPieChart
        recentInterviews={recentInterviews}
        upcomingInterviews={upcomingInterviews}
      />
    </div>
  );
}

export default Analytics;