import { useState } from "react";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import FloatingControls from "./FloatingControls";

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
  FaClock,
} from "react-icons/fa";

function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);

  // Dashboard sidebar navigation
  const handleSidebarNavigation = (section) => {
    const sectionMap = {
      dashboard: "dashboard-top",
      interviews: "mock-interview",
      analytics: "analytics-section",
      feedback: "feedback-section",
      settings: "settings-section",
    };

    const elementId = sectionMap[section];
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>

      <Sidebar
        onNavigate={handleSidebarNavigation}
      />

      <div className="main">

        {/* Dashboard top */}
        <div id="dashboard-top">
          <Welcome />
        </div>

        <FloatingControls
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Stats */}
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

        {/* Analytics */}
        <div
          className="dashboard-row"
          id="analytics-section"
        >
          <Analytics />
          <AIInsights />
        </div>

        {/* Feedback */}
        <div
          className="dashboard-row"
          id="feedback-section"
        >
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

        {/* Interviews */}
        <div
          className="full-width"
          id="mock-interview"
        >
          <MockInterview />
        </div>

        {/* Activity */}
        <div className="full-width">
          <Activity />
        </div>

        {/* Settings / controls */}
        <div
          className="full-width"
          id="settings-section"
        >
          <div className="dashboard-settings">
            <h2>Dashboard Settings</h2>
            <p>
              Customize your dashboard experience and
              manage your preferences.
            </p>

            <div className="settings-buttons">
              <button
              onClick={() => setDarkMode(!darkMode)}
              className="settings-theme-btn"
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>

            <button className="settings-theme-btn">
              Themes
            </button>
            </div>

          </div>
        </div>

        <AIChat />

      </div>
    </div>
  );
}

export default Dashboard;