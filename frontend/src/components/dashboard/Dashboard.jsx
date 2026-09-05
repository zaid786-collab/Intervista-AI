import { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import Welcome from "./Welcome";
import Card from "./Cards";
import Recent from "./Recent";
import AIInsights from "./AIInsights";
import ProgressTracker from "./ProgressTracker";
import Achievements from "./Achievements";
import Analytics from "./Analytics";
import QuickActions from "./QuickActions";
import MockInterview from "./MockInterview";
import InterviewHeatmap from "./InterviewHeatmap";
import Upcoming from "./Upcoming";
import Schedule from "./Schedule";
import Notifications from "./Notifications";
import Activity from "./Activity";
import ResumeAnalyzer from "./ResumeAnalyzer";
import CodingChallenge from "./CodingChallenge";
import JobRecommendations from "./JobRecommendations";
import Leaderboard from "./Leaderboard";
import AIChat from "./AIChat";

import { useAuth } from "../../context/useAuth";
import { fetchDashboardData } from "../../api";

import {
  FaUserGraduate,
  FaChartLine,
  FaTrophy,
  FaClock,
  FaHome,
  FaMicrophone,
  FaCalendarAlt,
  FaBriefcase,
  FaCog,
  FaPalette,
  FaSun,
  FaMoon,
  FaCheckCircle,
  FaTrashAlt,
  FaBell,
} from "react-icons/fa";

const THEME_OPTIONS = [
  {
    id: "theme-neon-cyan",
    name: "Cyber Neon",
    desc: "Vibrant Cyan & Electric Blue",
    primary: "#00d2ff",
    secondary: "#3a7bd5",
  },
  {
    id: "theme-emerald",
    name: "Emerald Matrix",
    desc: "Matrix Green & Clean Teal",
    primary: "#10b981",
    secondary: "#059669",
  },
  {
    id: "theme-sunset",
    name: "Sunset Blaze",
    desc: "Deep Violet & Radiant Coral",
    primary: "#f43f5e",
    secondary: "#8b5cf6",
  },
  {
    id: "theme-amber",
    name: "Golden Prestige",
    desc: "Luxurious Amber & Gold",
    primary: "#f59e0b",
    secondary: "#d97706",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Notifications State & Sync
  const [notificationsList, setNotificationsList] = useState([]);

  // Schedules State & Sync
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  // Sidebar Min/Max Customizable state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("intervista_sidebar_collapsed") === "true";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Appearance & Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("intervista_theme_mode");
    return saved ? saved === "dark" : true;
  });

  const [accentTheme, setAccentTheme] = useState(() => {
    return localStorage.getItem("intervista_accent_theme") || "theme-neon-cyan";
  });

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("intervista_sidebar_collapsed", String(next));
      return next;
    });
  };

  const handleToggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

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
        if (data) {
          setDashboardData(data);
          // Sync notifications
          if (Array.isArray(data.notifications)) {
            setNotificationsList(data.notifications);
          }
          // Sync schedules with custom stored items
          const customSchedules = JSON.parse(localStorage.getItem("intervista_custom_schedules") || "[]");
          const apiSchedules = data.upcoming_interviews || [];
          setUpcomingSchedules([...customSchedules, ...apiSchedules]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Dashboard sync using offline fallback:", err);
        const customSchedules = JSON.parse(localStorage.getItem("intervista_custom_schedules") || "[]");
        setUpcomingSchedules(customSchedules);
        setLoading(false);
      });
  }, []);

  const handleInterviewCompleted = useCallback(() => {
    loadDashboard();
    try {
      window.dispatchEvent(new Event("intervista_profile_refresh"));
    } catch {
      // ignore
    }
  }, [loadDashboard]);

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

  // Schedule Management Handlers
  const handleAddSchedule = (newSchedule) => {
    setUpcomingSchedules((prev) => {
      const updated = [newSchedule, ...prev];
      const customOnly = updated.filter((s) => s.id && s.id.startsWith("sched-"));
      localStorage.setItem("intervista_custom_schedules", JSON.stringify(customOnly));
      return updated;
    });

    // Add a notification for the schedule
    const schedNotif = {
      id: `notif-${Date.now()}`,
      title: `Interview Scheduled: ${newSchedule.company}`,
      desc: `${newSchedule.role} session confirmed for ${newSchedule.date} at ${newSchedule.time}.`,
      time: "Just now",
      color: "#22c55e",
      read: false,
    };
    setNotificationsList((prev) => [schedNotif, ...prev]);
  };

  const handleCancelSchedule = (idOrIndex) => {
    setUpcomingSchedules((prev) => {
      const updated = prev.filter((item, idx) => (item.id ? item.id !== idOrIndex : idx !== idOrIndex));
      const customOnly = updated.filter((s) => s.id && s.id.startsWith("sched-"));
      localStorage.setItem("intervista_custom_schedules", JSON.stringify(customOnly));
      return updated;
    });
  };

  const handleJoinInterview = (scheduledItem) => {
    setActiveSection("interviews");
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("intervista_prefill_interview", {
          detail: {
            company: scheduledItem.company,
            role: scheduledItem.role,
          },
        })
      );
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleResetHistory = () => {
    localStorage.removeItem("intervista_applied_jobs");
    localStorage.removeItem("intervista_custom_schedules");
    setUpcomingSchedules([]);
    setNotificationsList([]);
    setResetConfirm(false);
    loadDashboard();
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

  const unreadNotifCount = notificationsList.filter((n) => !n.read).length;

  return (
    <div
      className={`${darkMode ? "dashboard dark" : "dashboard light"} ${accentTheme} ${
        sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
    >
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigation}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className={`main ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Dashboard Top Greeting & Action Card */}
        <div id="dashboard-top">
          <Welcome
            userName={user?.name}
            totalInterviews={totalInterviewsNum}
            onStartInterview={() => handleNavigation("interviews")}
            darkMode={darkMode}
            setDarkMode={handleDarkModeToggle}
            onOpenNotifications={() => handleNavigation("schedule")}
            notificationCount={unreadNotifCount}
            onToggleMobileSidebar={handleToggleMobileSidebar}
          />
        </div>

        {/* Executive Stats Cards with Interactive onClick Navigation */}
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
            onClick={() => handleNavigation("interviews")}
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
            onClick={() => handleNavigation("analytics")}
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
            onClick={() => handleNavigation("analytics")}
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
            onClick={() => handleNavigation("schedule")}
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
                  onStartTargetedPractice={(role) => handleJoinInterview({ company: "Targeted Practice", role })}
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
                  upcomingInterviews={upcomingSchedules}
                  totalInterviews={totalInterviewsNum}
                />
                <QuickActions onAction={handleNavigation} />
              </div>
            </>
          )}

          {activeSection === "interviews" && (
            <>
              <div className="full-width" id="mock-interview">
                <MockInterview onInterviewCompleted={handleInterviewCompleted} />
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
            <div id="analytics-section">
              <div className="dashboard-row">
                <Analytics
                  performanceData={dashboardData?.weekly_performance}
                  recentInterviews={dashboardData?.recent_interviews}
                  upcomingInterviews={upcomingSchedules}
                  totalInterviews={totalInterviewsNum}
                />
                <AIInsights
                  avgScore={metrics.avg_score}
                  totalInterviews={totalInterviewsNum}
                  recentInterviews={dashboardData?.recent_interviews}
                  onStartTargetedPractice={(role) => handleJoinInterview({ company: "Targeted Practice", role })}
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
            </div>
          )}

          {activeSection === "schedule" && (
            <div id="schedule-section">
              <div className="dashboard-row">
                <Recent
                  interviews={dashboardData?.recent_interviews}
                  onStartInterview={() => handleNavigation("interviews")}
                />
                <Upcoming
                  interviews={upcomingSchedules}
                  onScheduleInterview={() => handleNavigation("schedule")}
                  onJoinInterview={handleJoinInterview}
                  onCancelSchedule={handleCancelSchedule}
                />
              </div>

              <div className="dashboard-row">
                <Schedule
                  interviews={upcomingSchedules}
                  onScheduleAdded={handleAddSchedule}
                  onJoinInterview={handleJoinInterview}
                  onCancelSchedule={handleCancelSchedule}
                />
                <Notifications
                  notifications={notificationsList}
                  onNotificationsChanged={setNotificationsList}
                />
              </div>

              <div className="full-width">
                <Activity activities={dashboardData?.activities} />
              </div>
            </div>
          )}

          {activeSection === "career" && (
            <div id="career-prep-section">
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
            </div>
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

                  {/* Setting 3: Notifications Preferences */}
                  <div className="settings-card-item">
                    <div>
                      <div className="settings-card-header">
                        <h3>
                          <FaBell style={{ color: "#38bdf8" }} />
                          Notifications
                        </h3>
                        <span className="settings-status-badge">
                          {reminderNotifications ? "Active" : "Muted"}
                        </span>
                      </div>
                      <p className="settings-card-desc">
                        Receive instant reminders before scheduled interviews and new ATS report updates.
                      </p>
                    </div>

                    <button
                      onClick={() => setReminderNotifications(!reminderNotifications)}
                      className="settings-theme-btn"
                      style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                    >
                      {reminderNotifications ? "Mute Reminders" : "Enable Reminders"}
                    </button>
                  </div>

                  {/* Setting 4: Reset Practice Cache */}
                  <div className="settings-card-item">
                    <div>
                      <div className="settings-card-header">
                        <h3>
                          <FaTrashAlt style={{ color: "#ef4444" }} />
                          Reset Practice Cache
                        </h3>
                        <span className="settings-status-badge" style={{ color: "#ef4444" }}>
                          Data Utility
                        </span>
                      </div>
                      <p className="settings-card-desc">
                        Clear local applications, custom mock schedules, and reset notification feeds.
                      </p>
                    </div>

                    {resetConfirm ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={handleResetHistory}
                          className="settings-theme-btn"
                          style={{
                            flex: 1,
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            borderColor: "#ef4444",
                            justifyContent: "center",
                          }}
                        >
                          Confirm Reset
                        </button>
                        <button
                          onClick={() => setResetConfirm(false)}
                          className="settings-theme-btn"
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setResetConfirm(true)}
                        className="settings-theme-btn"
                        style={{ width: "100%", justifyContent: "center", color: "#ef4444" }}
                      >
                        Clear Practice Cache
                      </button>
                    )}
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