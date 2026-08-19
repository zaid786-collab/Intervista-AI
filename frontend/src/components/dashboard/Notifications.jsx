import "./Dashboard.css";
import {
  FaBell,
  FaRobot,
  FaCalendarAlt,
  FaCode,
  FaCheckCircle,
  FaCheckDouble,
} from "react-icons/fa";

function Notifications({ notifications: propNotifications = [] }) {
  const list = propNotifications || [];

  return (
    <div className="notifications">
      <div className="notification-header">
        <h2>
          <FaBell />
          Notifications
        </h2>

        <span className="notification-count">
          {list.length} New
        </span>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 15px", color: "var(--text-muted, #94a3b8)" }}>
          <FaCheckDouble style={{ fontSize: "24px", color: "#22c55e", marginBottom: "8px" }} />
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "4px" }}>
            All Caught Up!
          </p>
          <p style={{ fontSize: "13px" }}>
            Evaluation alerts and schedule reminders will appear here in real-time.
          </p>
        </div>
      ) : (
        list.map((item, index) => (
          <div className="notification-card" key={item.id || index}>
            <div
              className="notification-icon"
              style={{ background: item.color || "#2563eb" }}
            >
              {item.icon || <FaBell />}
            </div>

            <div className="notification-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>

            <small>{item.time || "Recent"}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;