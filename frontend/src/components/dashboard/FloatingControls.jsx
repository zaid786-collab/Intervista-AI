import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import "./Dashboard.css";

function FloatingControls({ darkMode, setDarkMode }) {
  const handleScrollToNotifications = () => {
    const el = document.getElementById("notifications-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="floating-controls">
      {setDarkMode && (
        <button
          className="floating-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          type="button"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      )}

      <button
        className="floating-btn notification-btn"
        title="View Notifications"
        onClick={handleScrollToNotifications}
        type="button"
      >
        <FaBell />
        <span className="notification-dot">4</span>
      </button>
    </div>
  );
}

export default FloatingControls;