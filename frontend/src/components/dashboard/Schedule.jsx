import "./Dashboard.css";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaLaptopCode,
} from "react-icons/fa";

function Schedule({ interviews: propInterviews = [], onScheduleAdded }) {
  const list = propInterviews || [];

  const handleAction = () => {
    const el = document.getElementById("mock-interview");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="schedule">
      <div className="schedule-header">
        <h2>
          <FaCalendarAlt />
          Interview Schedule
        </h2>

        {list.length > 0 && (
          <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
            {list.length} scheduled
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 15px", color: "var(--text-muted, #94a3b8)" }}>
          <p style={{ fontSize: "14px", marginBottom: "6px", fontWeight: "600", color: "#fff" }}>
            No Upcoming Interviews
          </p>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            Schedule an interview session in advance to keep your preparation on track.
          </p>
          <button className="join-btn" onClick={handleAction} style={{ padding: "8px 16px", fontSize: "13px" }}>
            + Schedule Session
          </button>
        </div>
      ) : (
        list.map((item, index) => (
          <div className="schedule-card" key={item.id || index}>
            <div
              className="schedule-icon"
              style={{ background: item.color || "#2563eb" }}
            >
              {item.icon || (item.mode === "Online Coding" ? <FaLaptopCode /> : <FaVideo />)}
            </div>

            <div className="schedule-info">
              <h3>{item.company}</h3>
              <p>{item.role}</p>
            </div>

            <div className="schedule-time">
              <FaClock />
              <span>{item.date || "Upcoming"}</span>
              <small>{item.time || ""}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Schedule;