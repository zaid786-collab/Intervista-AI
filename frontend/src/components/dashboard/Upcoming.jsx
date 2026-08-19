import "./Dashboard.css";
import { FaCalendarPlus, FaVideo } from "react-icons/fa";

function Upcoming({ interviews = [], onScheduleInterview }) {
  const handleAction = () => {
    if (onScheduleInterview) {
      onScheduleInterview();
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="upcoming">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>Upcoming Interviews</h2>
        {interviews && interviews.length > 0 && (
          <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
            {interviews.length} scheduled
          </span>
        )}
      </div>

      {!interviews || interviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "35px 20px", color: "var(--text-muted, #94a3b8)" }}>
          <p style={{ fontSize: "15px", marginBottom: "8px", fontWeight: "600", color: "#fff" }}>
            No Scheduled Sessions
          </p>
          <p style={{ fontSize: "13px", marginBottom: "16px" }}>
            Book an upcoming technical mock session or jump into an instant AI interview room.
          </p>
          <button className="join-btn" onClick={handleAction} style={{ padding: "8px 16px", fontSize: "13px" }}>
            + Schedule Session
          </button>
        </div>
      ) : (
        interviews.map((item, index) => (
          <div className="interview-card" key={item.id || index}>
            <div>
              <h3>{item.company || item.name || "Mock Interview"}</h3>
              <p>{item.role}</p>
              <small>
                {item.date || "Scheduled"} • {item.time || "10:00 AM"}
              </small>
            </div>

            <button className="join-btn" onClick={handleAction}>
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Upcoming;