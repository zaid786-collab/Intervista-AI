import {
  FaHome,
  FaMicrophone,
  FaChartLine,
  FaBriefcase,
  FaCalendarAlt,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaColumns,
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: FaHome },
  { id: "interviews", label: "Mock Room", icon: FaMicrophone, badge: "AI" },
  { id: "analytics", label: "Analytics & Skills", icon: FaChartLine },
  { id: "schedule", label: "Schedule & Feed", icon: FaCalendarAlt },
  { id: "career", label: "Career Prep", icon: FaBriefcase },
  { id: "settings", label: "Settings", icon: FaCog },
];

function Sidebar({
  activeSection = "dashboard",
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) {
  const handleClick = (item) => {
    if (onNavigate) {
      onNavigate(item);
    }
    if (mobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : "expanded"} ${
          mobileOpen ? "mobile-open" : ""
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Top Header & Brand */}
        <div className="sidebar-header">
          <div
            className="sidebar-brand"
            onClick={() => handleClick("dashboard")}
            title="Intervista AI"
          >
            <span className="sidebar-logo" aria-hidden="true">✦</span>
            {!isCollapsed && <h2 className="sidebar-title">Intervista AI</h2>}
          </div>

          {/* Collapse / Expand Toggle Button for Desktop */}
          {onToggleCollapse && (
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand sidebar (Max)" : "Collapse sidebar (Min)"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          )}

          {/* Close Button for Mobile Drawer */}
          {onCloseMobile && (
            <button
              type="button"
              className="sidebar-mobile-close"
              onClick={onCloseMobile}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {!isCollapsed && <p className="sidebar-label">MAIN MENU</p>}
          {isCollapsed && <div className="sidebar-mini-divider" />}

          <ul>
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li
                  key={item.id}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => handleClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComponent className="sidebar-icon" />
                  
                  {!isCollapsed && (
                    <span className="sidebar-item-text">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}

                  {/* Floating tooltip when collapsed (Min Mode) */}
                  {isCollapsed && (
                    <div className="sidebar-tooltip">
                      {item.label}
                      {item.badge && <span className="tooltip-badge">{item.badge}</span>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer with Min/Max Mode Indicator */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-footer-toggle"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand to Full View" : "Collapse to Mini View"}
          >
            <FaColumns className="footer-toggle-icon" />
            {!isCollapsed && (
              <span className="footer-toggle-text">
                Collapse Sidebar
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;