import { useState } from "react";

import {
  FaHome,
  FaMicrophone,
  FaChartLine,
  FaComments,
  FaCog,
} from "react-icons/fa";

function Sidebar({ onNavigate }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleClick = (item) => {
    setActiveItem(item);

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
            className={activeItem === "dashboard" ? "active" : ""}
            onClick={() => handleClick("dashboard")}
          >
            <FaHome className="sidebar-icon" />
            <span>Dashboard</span>
          </li>

          <li
            className={activeItem === "interviews" ? "active" : ""}
            onClick={() => handleClick("interviews")}
          >
            <FaMicrophone className="sidebar-icon" />
            <span>Interviews</span>
          </li>

          <li
            className={activeItem === "analytics" ? "active" : ""}
            onClick={() => handleClick("analytics")}
          >
            <FaChartLine className="sidebar-icon" />
            <span>Analytics</span>
          </li>

          <li
            className={activeItem === "feedback" ? "active" : ""}
            onClick={() => handleClick("feedback")}
          >
            <FaComments className="sidebar-icon" />
            <span>Feedback</span>
          </li>

          <li
            className={activeItem === "settings" ? "active" : ""}
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