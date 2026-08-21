import { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import { fetchDashboardData } from "../../api";
import { useAuth } from "../../context/useAuth";

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
  FaHome,
  FaMicrophone,
  FaChartLine,
  FaCalendarAlt,
  FaBriefcase,
  FaCog,
  FaUserGraduate,
  FaTrophy,
  FaClock,
  FaSun,
  FaMoon,
  FaPalette,
  FaCheckCircle,
  FaRedo,
} from "react-icons/fa";

const THEME_OPTIONS = [
  {
    id: "theme-cyber",
    name: "Cyber Neon",
    primary: "#2563eb",
    secondary: "#0ea5e9",
    desc: "Electric cyan & deep cobalt blue",
  },
  {
    id: "theme-purple",
    name: "Nebula Violet",
    primary: "#7c3aed",
    secondary: "#ec4899",
    desc: "Cosmic purple & vibrant magenta",
  },
  {
    id: "theme-emerald",
    name: "Matrix Emerald",
    primary: "#059669",
    secondary: "#10b981",
    desc: "Sleek emerald & mint green",
  },
  {
    id: "theme-amber",
    name: "Solar Amber",
    primary: "#ea580c",
    secondary: "#f59e0b",
    desc: "Warm amber & golden flame",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("intervista_theme_mode");
    return saved !== null ? saved === "dark" : true;
  });
  const [accentTheme, setAccentTheme] = useState(() => {
    return localStorage.getItem("intervista_accent_theme") || "theme-cyber";
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleDarkModeToggle = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("intervista_theme_mode", nextMode ? "dark" : "light");
  };

  const handleThemeSelect = (themeId) => {
    setAccentTheme(themeId);
    localStorage.setItem("intervista_accent_theme", themeId);
  };

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

  // Dashboard navigation
  const handleNavigation = (section) => {
    const validSections = ["dashboard", "interviews", "analytics", "schedule", "career", "settings"];
    if (validSections.includes(section)) {
      setActiveSection(section);
    } else if (section === "feedback") {
      setActiveSection("schedule");
    } else {
      setActiveSection("dashboard");
    }
  };

  const metrics = dashboardData?.metrics || {
    total_interviews: 0,
    avg_score: "0%",
    best_score: "0%",
    practice_time: "0 mins",
  };

  const totalInterviewsNum =
    typeof metrics.total_interviews === "number"
      ? metrics.total_interviews
      : parseInt(metrics.total_interviews, 10) || 0;

  return (
    <div className={`${darkMode ? "dashboard dark" : "dashboard light"} ${accentTheme}`}>
      <Sidebar activeSection={activeSection} onNavigate={handleNavigation} />

      <div className="main">
        {/* Dashboard Top Greeting */}
        <div id="dashboard-top">
          <Welcome
            userName={user?.name}
            totalInterviews={totalInterviewsNum}
            onStartInterview={() => handleNavigation("interviews")}
          />
        </div>

        <FloatingControls
          darkMode={darkMode}
          setDarkMode={handleDarkModeToggle}
          onOpenNotifications={() => handleNavigation("schedule")}
          notificationCount={dashboardData?.notifications?.length || 0}
        />

        {/* Executive Stats Cards */}
        <div className="cards">
          <Card
            icon={<FaUserGraduate />}
            title="Total Interviews"
            value={totalInterviewsNum}
            text={
              totalInterviewsNum === 0
                ? "No interviews yet • Start below"
                : `${totalInterviewsNum} completed session${totalInterviewsNum > 1 ? "s" : ""}`
            }
          />

          <Card
            icon={<FaChartLine />}
            title="Average Score"
            value={metrics.avg_score}
            text={
              totalInterviewsNum === 0
                ? "Complete session to evaluate"
                : "Live performance average"
            }
          />

          <Card
            icon={<FaTrophy />}
            title="Best Score"
            value={metrics.best_score}
            text={
              totalInterviewsNum === 0
                ? "No score recorded yet"
                : "Highest recorded score"
            }
          />

          <Card
            icon={<FaClock />}
            title="Practice Time"
            value={metrics.practice_time}
            text={
              totalInterviewsNum === 0
                ? "0 mins practiced"
                : "Total practice duration"
            }
          />
        </div>

        {/* View Switcher Navigation Tabs */}
        <div className="dashboard-view-tabs" role="tablist" aria-label="Dashboard Views">
          <button
            role="tab"
            aria-selected={activeSection === "dashboard"}
            className={`dashboard-tab-btn ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavigation("dashboard")}
          >
            <FaHome className="tab-icon" /> <span>Overview</span>
          </button>

          <button
            role="tab"
            aria-selected={activeSection === "interviews"}
            className={`dashboard-tab-btn ${activeSection === "interviews" ? "active" : ""}`}
            onClick={() => handleNavigation("interviews")}
          >
            <FaMicrophone className="tab-icon" /> <span>Mock Room</span>
          </button>

          <button
            role="tab"
            aria-selected={activeSection === "analytics"}
            className={`dashboard-tab-btn ${activeSection === "analytics" ? "active" : ""}`}
            onClick={() => handleNavigation("analytics")}
          >
            <FaChartLine className="tab-icon" /> <span>Analytics & Skills</span>
          </button>

          <button
            role="tab"
            aria-selected={activeSection === "schedule"}
            className={`dashboard-tab-btn ${activeSection === "schedule" ? "active" : ""}`}
            onClick={() => handleNavigation("schedule")}
          >
            <FaCalendarAlt className="tab-icon" /> <span>Schedule & Feed</span>
          </button>

          <button
            role="tab"
            aria-selected={activeSection === "career"}
            className={`dashboard-tab-btn ${activeSection === "career" ? "active" : ""}`}
            onClick={() => handleNavigation("career")}
          >
            <FaBriefcase className="tab-icon" /> <span>Career Prep</span>
          </button>

          <button
            role="tab"
            aria-selected={activeSection === "settings"}
            className={`dashboard-tab-btn ${activeSection === "settings" ? "active" : ""}`}
            onClick={() => handleNavigation("settings")}
          >
            <FaCog className="tab-icon" /> <span>Settings</span>
          </button>
        </div>

        {/* Active View Content */}
        <div className="dashboard-view-content" key={activeSection}>
          {activeSection === "dashboard" && (
            <>
              {/* Row 1: Recent Interviews & AI Insights */}
              <div className="dashboard-row">
                <Recent
                  interviews={dashboardData?.recent_interviews}
                  onStartInterview={() => handleNavigation("interviews")}
                />
                <AIInsights
                  avgScore={metrics.avg_score}
                  totalInterviews={totalInterviewsNum}
                  recentInterviews={dashboardData?.recent_interviews}
                />
              </div>

              {/* Row 2: Candidate Progress & Achievements */}
              <div className="dashboard-row">
                <ProgressTracker
                  totalInterviews={totalInterviewsNum}
                  avgScore={metrics.avg_score}
                  recentInterviews={dashboardData?.recent_interviews}
                  userProgress={user?.progress}
                />
                <Achievements
                  totalInterviews={totalInterviewsNum}
                  avgScore={metrics.avg_score}
                  bestScore={metrics.best_score}
                  xp={user?.xp}
                />
              </div>

              {/* Row 3: Analytics & Quick Actions */}
              <div className="dashboard-row">
                <Analytics
                  performanceData={dashboardData?.weekly_performance}
                  recentInterviews={dashboardData?.recent_interviews}
                  upcomingInterviews={dashboardData?.upcoming_interviews}
                  totalInterviews={totalInterviewsNum}
                />
                <QuickActions onAction={handleNavigation} />
              </div>
            </>
          )}

          {activeSection === "interviews" && (
            <>
              <div className="full-width" id="mock-interview">
                <MockInterview onInterviewCompleted={loadDashboard} />
              </div>
              <div className="dashboard-row" style={{ marginTop: "25px" }}>
                <InterviewHeatmap
                  recentInterviews={dashboardData?.recent_interviews}
                  activities={dashboardData?.activities}
                />
                <QuickActions onAction={handleNavigation} />
              </div>
            </>
          )}

          {activeSection === "analytics" && (
            <>
              <div className="dashboard-row">
                <Analytics
                  performanceData={dashboardData?.weekly_performance}
                  recentInterviews={dashboardData?.recent_interviews}
                  upcomingInterviews={dashboardData?.upcoming_interviews}
                  totalInterviews={totalInterviewsNum}
                />
                <AIInsights
                  avgScore={metrics.avg_score}
                  totalInterviews={totalInterviewsNum}
                  recentInterviews={dashboardData?.recent_interviews}
                />
              </div>

              <div className="dashboard-row">
                <ProgressTracker
                  totalInterviews={totalInterviewsNum}
                  avgScore={metrics.avg_score}
                  recentInterviews={dashboardData?.recent_interviews}
                  userProgress={user?.progress}
                />
                <Achievements
                  totalInterviews={totalInterviewsNum}
                  avgScore={metrics.avg_score}
                  bestScore={metrics.best_score}
                  xp={user?.xp}
                />
              </div>

              <div className="dashboard-row">
                <InterviewHeatmap
                  recentInterviews={dashboardData?.recent_interviews}
                  activities={dashboardData?.activities}
                />
                <CodingChallenge onChallengeSolved={loadDashboard} />
              </div>
            </>
          )}

          {activeSection === "schedule" && (
            <>
              <div className="dashboard-row">
                <Recent
                  interviews={dashboardData?.recent_interviews}
                  onStartInterview={() => handleNavigation("interviews")}
                />
                <Upcoming
                  interviews={dashboardData?.upcoming_interviews}
                  onScheduleInterview={() => handleNavigation("interviews")}
                />
              </div>

              <div className="dashboard-row">
                <Schedule
                  interviews={dashboardData?.upcoming_interviews}
                  onScheduleAdded={loadDashboard}
                />
                <Notifications notifications={dashboardData?.notifications} />
              </div>

              <div className="full-width">
                <Activity activities={dashboardData?.activities} />
              </div>
            </>
          )}

          {activeSection === "career" && (
            <>
              <div className="career-prep-layout">
                <div className="career-main-col">
                  <ResumeAnalyzer onResumeAnalyzed={loadDashboard} />
                </div>
                <div className="career-side-col">
                  <CodingChallenge onChallengeSolved={loadDashboard} compact={true} />
                </div>
              </div>

              <div className="dashboard-row" style={{ marginTop: "24px" }}>
                <JobRecommendations />
                <Leaderboard />
              </div>
            </>
          )}

          {activeSection === "settings" && (
            <div className="full-width" id="settings-section">
              <div className="dashboard-settings">
                <h2>Dashboard Settings & Preferences</h2>
                <p>Customize your workspace appearance, accent color palette, and data synchronization.</p>

                <div className="settings-grid">
                  {/* Setting 1: Theme Mode */}
                  <div className="settings-card-item">
                    <div>
                      <div className="settings-card-header">
                        <h3>
                          {darkMode ? <FaMoon style={{ color: "#38bdf8" }} /> : <FaSun style={{ color: "#f59e0b" }} />}
                          Display Mode
                        </h3>
                        <span className="settings-status-badge">
                          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                        </span>
                      </div>
                      <p className="settings-card-desc">
                        Switch between high-contrast midnight dark mode and clean daylight illumination.
                      </p>
                    </div>

                    <button
                      onClick={handleDarkModeToggle}
                      className="settings-theme-btn"
                      style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                    >
                      {darkMode ? (
                        <>
                          <FaSun /> Switch to Light Mode
                        </>
                      ) : (
                        <>
                          <FaMoon /> Switch to Dark Mode
                        </>
                      )}
                    </button>
                  </div>

                  {/* Setting 2: Accent Themes */}
                  <div className="settings-card-item">
                    <div>
                      <div className="settings-card-header">
                        <h3>
                          <FaPalette style={{ color: "#a855f7" }} />
                          Color Palette
                        </h3>
                        <span className="settings-status-badge">
                          {THEME_OPTIONS.find((t) => t.id === accentTheme)?.name || "Cyber Neon"}
                        </span>
                      </div>
                      <p className="settings-card-desc">
                        Choose your primary neon accents and button lighting gradients.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowThemePicker(!showThemePicker)}
                      className="settings-theme-btn"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        gap: "8px",
                        background: showThemePicker
                          ? "rgba(255,255,255,0.15)"
                          : undefined,
                      }}
                    >
                      <FaPalette /> {showThemePicker ? "Hide Themes" : "Select Theme Palette"}
                    </button>
                  </div>
                </div>

                {/* Theme Palette Picker Grid */}
                {showThemePicker && (
                  <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h4 style={{ fontSize: "14px", marginBottom: "12px" }}>
                      Choose Workspace Accent Theme:
                    </h4>
                    <div className="theme-options-grid">
                      {THEME_OPTIONS.map((theme) => {
                        const isSelected = accentTheme === theme.id;
                        return (
                          <div
                            key={theme.id}
                            className={`theme-palette-chip ${isSelected ? "active" : ""}`}
                            onClick={() => handleThemeSelect(theme.id)}
                          >
                            <div className="color-dots-preview">
                              <span
                                className="color-dot"
                                style={{ background: theme.primary }}
                              />
                              <span
                                className="color-dot"
                                style={{ background: theme.secondary }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: "600" }}>{theme.name}</div>
                              <small style={{ color: "var(--text-muted, #94a3b8)", fontSize: "11px" }}>
                                {theme.desc}
                              </small>
                            </div>
                            {isSelected && <FaCheckCircle style={{ color: "#38bdf8" }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <AIChat />
      </div>
    </div>
  );
}

export default Dashboard;