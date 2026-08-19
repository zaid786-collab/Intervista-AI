import "./Dashboard.css";
import {
  FaCheckCircle,
  FaRobot,
  FaCalendarAlt,
  FaCode,
  FaStream,
} from "react-icons/fa";

function Activity({ activities: propActivities = [] }) {
  const list = propActivities || [];

  return (
    <div className="activity">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>Recent Activity</h2>
        {list.length > 0 && (
          <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
            {list.length} event{list.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 15px", color: "var(--text-muted, #94a3b8)" }}>
          <p style={{ fontSize: "14px", marginBottom: "6px", fontWeight: "600", color: "#fff" }}>
            No Recent Activity
          </p>
          <p style={{ fontSize: "13px" }}>
            Your interview completions, score reports, and schedule changes will appear in this real-time stream.
          </p>
        </div>
      ) : (
        list.map((item, index) => (
          <div className="activity-item" key={item.id || index}>
            <div
              className="activity-icon"
              style={{ background: item.color || "#2563eb" }}
            >
              {item.icon || <FaCheckCircle />}
            </div>

            <div className="activity-info">
              <h4>{item.title}</h4>
              <p>{item.company}</p>
            </div>

            <span>{item.time || "Recent"}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default Activity;