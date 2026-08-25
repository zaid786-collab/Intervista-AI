import { FaMoon, FaSun, FaBell, FaBars } from "react-icons/fa";
import "./Dashboard.css";

function FloatingControls({
  darkMode,
  setDarkMode,
  onOpenNotifications,
  notificationCount = 0,
  onToggleMobileSidebar,
}) {
  return (
    <div className="floating-controls">
      {onToggleMobileSidebar && (
        <button
          className="floating-btn mobile-sidebar-btn"
          onClick={onToggleMobileSidebar}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <FaBars />
        </button>
      )}

      {setDarkMode && (
        <button
          className="floating-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      )}

      <button
        className="floating-btn notification-btn"
        title="View Notifications & Schedule"
        onClick={onOpenNotifications}
      >
        <FaBell />
        {notificationCount > 0 && (
          <span className="notification-dot">{notificationCount}</span>
        )}
      </button>
    </div>
  );
}

export default FloatingControls;