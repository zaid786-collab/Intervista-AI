import Chart from "./Chart";
import "./Dashboard.css";
import InterviewPieChart from "./PieChart";

function Analytics() {
    return (
        <div className="analytics">

            <Chart />

            <InterviewPieChart />

        </div>
    );
}

export default Analytics;