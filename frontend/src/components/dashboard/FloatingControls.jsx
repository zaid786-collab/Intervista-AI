import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import "./Dashboard.css";

function FloatingControls({ darkMode, setDarkMode }) {
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

      <button className="floating-btn notification-btn" title="Notifications">
        <FaBell />
        <span className="notification-dot">3</span>
      </button>
    </div>
  );
}

export default FloatingControls;