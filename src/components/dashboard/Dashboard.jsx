import { useState } from "react";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Welcome from "./Welcome";
import Card from "./Cards";

import Analytics from "./Analytics";
import AIInsights from "./AIInsights";

import Recent from "./Recent";
import Upcoming from "./Upcoming";

import CodingChallenge from "./CodingChallenge";
import ProgressTracker from "./ProgressTracker";

import ResumeAnalyzer from "./ResumeAnalyzer";
import Leaderboard from "./Leaderboard";

import Notifications from "./Notifications";
import Schedule from "./Schedule";

import Achievements from "./Achievements";
import QuickActions from "./QuickActions";

import MockInterview from "./MockInterview";
import Activity from "./Activity";

import InterviewHeatmap from "./InterviewHeatmap";
import JobRecommendations from "./JobRecommendations";
import AIChat from "./AIChat";

import {
    FaUserGraduate,
    FaChartLine,
    FaTrophy,
    FaClock
} from "react-icons/fa";

function Dashboard() {

    const [darkMode, setDarkMode] = useState(true);

    return (

        <div className={darkMode ? "dashboard dark" : "dashboard light"}>

            <Sidebar />

            <div className="main">

                <Navbar
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />

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

                </div>

                <div className="dashboard-row">
                    <Analytics />
                    <AIInsights />
                </div>

                <div className="dashboard-row">
                    <Recent />
                    <Upcoming />
                </div>

                <div className="dashboard-row">
                    <CodingChallenge />
                    <InterviewHeatmap />
                </div>

                <div className="dashboard-row">
                    <ResumeAnalyzer />
                    <Leaderboard />
                </div>

                <div className="dashboard-row">
                    <Notifications />
                    <Schedule />
                </div>

                <div className="dashboard-row">
                    <JobRecommendations />
                    <Achievements />
                </div>

                <div className="dashboard-row">
                    <QuickActions />
                    <ProgressTracker />
                </div>

                <div className="full-width">
                    <MockInterview />
                </div>

                <div className="full-width">
                    <Activity />
                </div>

                <AIChat />

            </div>

        </div>

    );
}

export default Dashboard;