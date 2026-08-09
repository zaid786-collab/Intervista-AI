import { useState } from "react";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Interviews",
    "Analytics",
    "Feedback",
    "Settings",
  ];

  return (
    <div className="sidebar">

      <div className="logo">
        <span aria-hidden="true">✦</span>
        <h2>Intervista AI</h2>
      </div>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className={`sidebar-item ${
              activeItem === item ? "active" : ""
            }`}
            onClick={() => setActiveItem(item)}
          >
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Sidebar;