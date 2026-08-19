import Chart from "./Chart";
import "./Dashboard.css";
import InterviewPieChart from "./PieChart";

function Analytics({ performanceData, recentInterviews, upcomingInterviews, totalInterviews }) {
  return (
    <div className="analytics">
      <Chart performanceData={performanceData} />
      <InterviewPieChart
        recentInterviews={recentInterviews}
        upcomingInterviews={upcomingInterviews}
        totalInterviews={totalInterviews}
      />
    </div>
  );
}

export default Analytics;