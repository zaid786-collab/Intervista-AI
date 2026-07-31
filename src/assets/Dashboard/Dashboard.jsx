import Analytics from "./Analytics";
import Recent from "./Recent";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Welcome from "./Welcome";
import Card from "./Cards";
import {
    FaUserGraduate,
    FaChartLine,
    FaTrophy,
    FaClock
} from "react-icons/fa";



function Dashboard() {

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="main">

                <Navbar />

                <Welcome />

                <div className="cards">

    <Card
        icon={<FaUserGraduate />}
        title="Total Interviews"
        value="24"
        text="Completed this month"
    />

    <Card
        icon={<FaChartLine />}
        title="Average Score"
        value="78%"
        text="Performance is improving"
    />

    <Card
        icon={<FaTrophy />}
        title="Best Score"
        value="92%"
        text="Excellent performance"
    />

    <Card
        icon={<FaClock />}
        title="Practice Time"
        value="18 hrs"
        text="This week's practice"
    />

    <Card
    icon={<FaUserGraduate />}
    title="Total Interviews"
    value="24"
    text="Completed this month"
    color="#2563eb"
    />

    <Card
    icon={<FaChartLine />}
    title="Average Score"
    value="78%"
    text="Performance is improving"
    color="#22c55e"
    />

</div>

<Recent />
< Analytics/>
    </div>

    </div>

    );

}

export default Dashboard;