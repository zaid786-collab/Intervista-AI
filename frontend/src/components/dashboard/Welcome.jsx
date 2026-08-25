import { FaMoon, FaSun, FaBell, FaBars } from "react-icons/fa";
import "./Dashboard.css";

function Welcome({
  userName,
  totalInterviews = 0,
  onStartInterview,
  darkMode,
  setDarkMode,
  onOpenNotifications,
  notificationCount = 0,
  onToggleMobileSidebar,
}) {
  const handleStart = () => {
    if (onStartInterview) {
      onStartInterview();
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="welcome">
      {/* Pinned to the top right of this first card */}
      <div className="welcome-card-controls">
        {onToggleMobileSidebar && (
          <button
            className="welcome-action-btn mobile-sidebar-btn"
            onClick={onToggleMobileSidebar}
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            <FaBars />
          </button>
        )}

        {setDarkMode && (
          <button
            className="welcome-action-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        )}

        <button
          className="welcome-action-btn notification-btn"
          title="View Notifications & Schedule"
          onClick={onOpenNotifications}
          aria-label="View Notifications"
        >
          <FaBell />
          {notificationCount > 0 && (
            <span className="notification-dot">{notificationCount}</span>
          )}
        </button>
      </div>

      <h1>
        <span>Welcome Back{userName ? `, ${userName}` : ""}</span>
      </h1>
      <p>
        <span>
          {totalInterviews === 0
            ? "Ready to begin your journey? Complete your first AI mock interview below to see live stats & skill ratings!"
            : `You have completed ${totalInterviews} mock interview session${
                totalInterviews > 1 ? "s" : ""
              }. Keep pushing to improve your score!`}
        </span>
      </p>

      <button className="start-btn" onClick={handleStart}>
        + Start New Interview
      </button>
    </div>
  );
}

export default Welcome;