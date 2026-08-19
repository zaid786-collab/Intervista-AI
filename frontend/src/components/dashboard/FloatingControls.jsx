import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import "./Dashboard.css";

function FloatingControls({ darkMode, setDarkMode, onOpenNotifications, notificationCount = 0 }) {
  return (
    <div className="floating-controls">
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