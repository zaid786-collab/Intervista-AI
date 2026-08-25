import "./Dashboard.css";
import { FaCalendarPlus, FaVideo, FaTimes, FaCalendarAlt } from "react-icons/fa";

function Upcoming({
  interviews = [],
  onScheduleInterview,
  onJoinInterview,
  onCancelSchedule,
}) {
  const handleScheduleClick = () => {
    if (onScheduleInterview) {
      onScheduleInterview();
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleJoinClick = (item) => {
    if (onJoinInterview) {
      onJoinInterview(item);
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="upcoming">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2>
          <FaCalendarAlt style={{ marginRight: "6px", color: "#38bdf8" }} />
          Upcoming Interviews
        </h2>
        {interviews && interviews.length > 0 && (
          <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
            {interviews.length} scheduled
          </span>
        )}
      </div>

      {!interviews || interviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "35px 20px",
            color: "var(--text-muted, #94a3b8)",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            No Scheduled Sessions
          </p>
          <p style={{ fontSize: "13px", marginBottom: "16px" }}>
            Book an upcoming technical mock session or jump into an instant AI interview room.
          </p>
          <button
            className="join-btn"
            onClick={handleScheduleClick}
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            + Schedule Session
          </button>
        </div>
      ) : (
        interviews.map((item, index) => (
          <div className="interview-card" key={item.id || index}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3>{item.company || item.name || "Mock Interview"}</h3>
                {item.difficulty && (
                  <span className="modal-job-tag" style={{ fontSize: "10px" }}>
                    {item.difficulty}
                  </span>
                )}
              </div>
              <p>{item.role}</p>
              <small>
                {item.date || "Upcoming"} • {item.time || "10:00 AM"}
              </small>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                className="join-btn"
                onClick={() => handleJoinClick(item)}
                title={`Join ${item.company} mock session now`}
              >
                <FaVideo style={{ marginRight: "4px" }} /> Join
              </button>

              {onCancelSchedule && (
                <button
                  className="cancel-schedule-btn"
                  onClick={() => onCancelSchedule(item.id || index)}
                  title="Cancel scheduled session"
                  aria-label="Cancel session"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Upcoming;