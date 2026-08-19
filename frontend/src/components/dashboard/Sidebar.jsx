import {
  FaHome,
  FaMicrophone,
  FaChartLine,
  FaBriefcase,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";

function Sidebar({ activeSection = "dashboard", onNavigate }) {
  const handleClick = (item) => {
    if (onNavigate) {
      onNavigate(item);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <span className="sidebar-logo">✦</span>
        <h2>Intervista AI</h2>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-label">MAIN MENU</p>

        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => handleClick("dashboard")}
          >
            <FaHome className="sidebar-icon" />
            <span>Overview</span>
          </li>

          <li
            className={activeSection === "interviews" ? "active" : ""}
            onClick={() => handleClick("interviews")}
          >
            <FaMicrophone className="sidebar-icon" />
            <span>Mock Room</span>
          </li>

          <li
            className={activeSection === "analytics" ? "active" : ""}
            onClick={() => handleClick("analytics")}
          >
            <FaChartLine className="sidebar-icon" />
            <span>Analytics & Skills</span>
          </li>

          <li
            className={activeSection === "schedule" ? "active" : ""}
            onClick={() => handleClick("schedule")}
          >
            <FaCalendarAlt className="sidebar-icon" />
            <span>Schedule & Feed</span>
          </li>

          <li
            className={activeSection === "career" ? "active" : ""}
            onClick={() => handleClick("career")}
          >
            <FaBriefcase className="sidebar-icon" />
            <span>Career Prep</span>
          </li>

          <li
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => handleClick("settings")}
          >
            <FaCog className="sidebar-icon" />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;