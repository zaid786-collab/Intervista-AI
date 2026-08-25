import { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FaBell,
  FaRobot,
  FaCalendarAlt,
  FaCode,
  FaCheckCircle,
  FaCheckDouble,
  FaTrashAlt,
  FaTimes,
} from "react-icons/fa";

function Notifications({
  notifications: propNotifications = [],
  onNotificationsChanged,
}) {
  const [notifications, setNotifications] = useState(propNotifications);

  useEffect(() => {
    setNotifications(propNotifications);
  }, [propNotifications]);

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    if (onNotificationsChanged) {
      onNotificationsChanged(updated);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    if (onNotificationsChanged) {
      onNotificationsChanged([]);
    }
  };

  const handleDismiss = (id, index) => {
    const updated = notifications.filter((item, i) => (item.id ? item.id !== id : i !== index));
    setNotifications(updated);
    if (onNotificationsChanged) {
      onNotificationsChanged(updated);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications">
      <div className="notification-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h2>
            <FaBell style={{ color: "#38bdf8" }} />
            Notifications
          </h2>
          <span className="notification-count">
            {unreadCount > 0 ? `${unreadCount} New` : "0 Unread"}
          </span>
        </div>

        {notifications.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {unreadCount > 0 && (
              <button
                className="view-btn"
                onClick={handleMarkAllRead}
                title="Mark all as read"
                style={{ padding: "4px 10px", fontSize: "11px" }}
              >
                <FaCheckDouble style={{ marginRight: "3px" }} /> Mark Read
              </button>
            )}

            <button
              className="view-btn"
              onClick={handleClearAll}
              title="Clear all notifications"
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <FaTrashAlt style={{ marginRight: "3px" }} /> Clear
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "30px 15px",
            color: "var(--text-muted, #94a3b8)",
          }}
        >
          <FaCheckDouble
            style={{ fontSize: "24px", color: "#22c55e", marginBottom: "8px" }}
          />
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff",
              marginBottom: "4px",
            }}
          >
            All Caught Up!
          </p>
          <p style={{ fontSize: "13px" }}>
            Evaluation alerts, ATS feedback, and schedule reminders will appear here in real-time.
          </p>
        </div>
      ) : (
        notifications.map((item, index) => (
          <div
            className={`notification-card ${item.read ? "read" : "unread"}`}
            key={item.id || index}
            style={{
              opacity: item.read ? 0.75 : 1,
              borderLeft: item.read ? "1px solid rgba(255,255,255,0.06)" : "3px solid #38bdf8",
            }}
          >
            <div
              className="notification-icon"
              style={{ background: item.color || "#2563eb" }}
            >
              {item.icon || (item.title?.includes("Schedule") ? <FaCalendarAlt /> : item.title?.includes("Code") ? <FaCode /> : <FaRobot />)}
            </div>

            <div className="notification-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <small>{item.time || "Recent"}</small>
              <button
                className="dismiss-notif-btn"
                onClick={() => handleDismiss(item.id, index)}
                title="Dismiss notification"
                aria-label="Dismiss notification"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;