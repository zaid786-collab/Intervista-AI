import Chart from "./Chart";
import "./Dashboard.css";
import InterviewPieChart from "./PieChart";

function Analytics({ performanceData }) {
    return (
        <div className="analytics">

            <Chart performanceData={performanceData} />

            <InterviewPieChart />

        </div>
    );
}

export default Analytics;