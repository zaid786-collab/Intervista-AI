import {
  FaMoon,
  FaSun,
  FaBell,
  FaUserCircle
} from "react-icons/fa";

import "./Dashboard.css";

function FloatingControls({ darkMode, setDarkMode }) {
  return (
    <div className="floating-controls">

      <button
        className="floating-btn"
        onClick={() => setDarkMode(!darkMode)}
        title="Theme"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <button className="floating-btn notification-btn" title="Notifications">
        <FaBell />
        <span className="notification-dot">3</span>
      </button>

      <button className="floating-profile" title="Profile">
        <FaUserCircle />
      </button>

    </div>
  );
}

export default FloatingControls;