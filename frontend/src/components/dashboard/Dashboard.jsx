import { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import { fetchDashboardData } from "../../api";

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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(() => {
    fetchDashboardData()
      .then((data) => {
        if (data) setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Dashboard sync using offline fallback:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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

  const metrics = dashboardData?.metrics || {
    total_interviews: 24,
    avg_score: "78%",
    best_score: "92%",
    practice_time: "18 hrs",
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>
      <Sidebar onNavigate={handleSidebarNavigation} />

      <div className="main">
        {/* Dashboard top */}
        <div id="dashboard-top">
          <Welcome />
        </div>

        <FloatingControls darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Stats Cards */}
        <div className="cards">
          <Card
            icon={<FaUserGraduate />}
            title="Total Interviews"
            value={metrics.total_interviews}
            text="Completed this month"
          />

          <Card
            icon={<FaChartLine />}
            title="Average Score"
            value={metrics.avg_score}
            text="Performance is improving"
          />

          <Card
            icon={<FaTrophy />}
            title="Best Score"
            value={metrics.best_score}
            text="Excellent performance"
          />

          <Card
            icon={<FaClock />}
            title="Practice Time"
            value={metrics.practice_time}
            text="This week's practice"
          />
        </div>

        {/* Analytics & AI Insights */}
        <div className="dashboard-row" id="analytics-section">
          <Analytics
            performanceData={dashboardData?.weekly_performance}
            recentInterviews={dashboardData?.recent_interviews}
          />
          <AIInsights
            avgScore={metrics.avg_score}
            totalInterviews={metrics.total_interviews}
          />
        </div>

        {/* Feedback & Upcoming */}
        <div className="dashboard-row" id="feedback-section">
          <Recent interviews={dashboardData?.recent_interviews} />
          <Upcoming />
        </div>

        {/* Coding Challenge & Heatmap */}
        <div className="dashboard-row">
          <CodingChallenge onChallengeSolved={loadDashboard} />
          <InterviewHeatmap />
        </div>

        {/* Resume Analyzer & Leaderboard */}
        <div className="dashboard-row">
          <ResumeAnalyzer onResumeAnalyzed={loadDashboard} />
          <Leaderboard />
        </div>

        {/* Notifications & Schedule */}
        <div className="dashboard-row" id="notifications-section">
          <Notifications notifications={dashboardData?.notifications} />
          <Schedule
            interviews={dashboardData?.upcoming_interviews}
            onScheduleAdded={loadDashboard}
          />
        </div>

        {/* Job Recommendations & Achievements */}
        <div className="dashboard-row">
          <JobRecommendations />
          <Achievements />
        </div>

        {/* Quick Actions & Progress Tracker */}
        <div className="dashboard-row">
          <QuickActions onAction={handleSidebarNavigation} />
          <ProgressTracker />
        </div>

        {/* Interviews Section */}
        <div className="full-width" id="mock-interview">
          <MockInterview onInterviewCompleted={loadDashboard} />
        </div>

        {/* Activity Feed */}
        <div className="full-width">
          <Activity activities={dashboardData?.activities} />
        </div>

        {/* Settings / controls */}
        <div className="full-width" id="settings-section">
          <div className="dashboard-settings">
            <h2>Dashboard Settings</h2>
            <p>Customize your dashboard experience and manage your preferences.</p>

            <div className="settings-buttons">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="settings-theme-btn"
              >
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>

              <button className="settings-theme-btn">Themes</button>
            </div>
          </div>
        </div>

        <AIChat />
      </div>
    </div>
  );
}

export default Dashboard;