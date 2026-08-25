import { useState } from "react";
import "./Dashboard.css";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaLaptopCode,
  FaPlus,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

function Schedule({
  interviews: propInterviews = [],
  onScheduleAdded,
  onJoinInterview,
  onCancelSchedule,
}) {
  const list = propInterviews || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [mode, setMode] = useState("AI Video Mock");

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a valid date for your mock session.");
      return;
    }

    const newSchedule = {
      id: `sched-${Date.now()}`,
      company,
      role,
      date,
      time,
      mode,
      color: company === "Google" ? "#4285F4" : company === "Amazon" ? "#FF9900" : company === "Microsoft" ? "#7FBA00" : "#2563eb",
      status: "Upcoming",
    };

    if (onScheduleAdded) {
      onScheduleAdded(newSchedule);
    }

    setShowAddModal(false);
    setDate("");
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
    <div className="schedule">
      <div className="schedule-header">
        <h2>
          <FaCalendarAlt />
          Interview Schedule
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {list.length > 0 && (
            <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
              {list.length} scheduled
            </span>
          )}

          <button
            className="view-btn"
            onClick={() => setShowAddModal(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
          >
            <FaPlus style={{ fontSize: "11px" }} /> Schedule
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "30px 15px",
            color: "var(--text-muted, #94a3b8)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            No Upcoming Interviews
          </p>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            Schedule an interview session in advance to keep your preparation on track.
          </p>
          <button
            className="join-btn"
            onClick={() => setShowAddModal(true)}
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
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

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                className="join-btn"
                onClick={() => handleJoinClick(item)}
                style={{ padding: "5px 12px", fontSize: "11.5px" }}
                title="Launch mock interview room"
              >
                Join
              </button>

              {onCancelSchedule && (
                <button
                  className="cancel-schedule-btn"
                  onClick={() => onCancelSchedule(item.id || index)}
                  title="Remove from schedule"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Booking Modal */}
      {showAddModal && (
        <div className="dashboard-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <div>
                <h2>📅 Book Mock Interview</h2>
                <p>Set a reserved date and time for an AI-evaluated practice session.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="schedule-form">
              <div className="form-group">
                <label>Target Company</label>
                <select value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Meta">Meta</option>
                  <option value="Apple">Apple</option>
                  <option value="Uber">Uber</option>
                  <option value="General Tech">General Tech Industry</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Software Engineer">Software Engineer (General)</option>
                  <option value="Frontend Developer">Frontend Developer (React/TS)</option>
                  <option value="Backend Engineer">Backend Engineer (Node/Python/Go)</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="AI / ML Engineer">AI / Machine Learning Engineer</option>
                  <option value="System Design Specialist">System Design Specialist</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)}>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Evaluation Format</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="AI Video Mock">🎙️ Video / Audio Live AI Interaction</option>
                  <option value="Online Coding">💻 Interactive Code Sandbox + Analysis</option>
                  <option value="System Design">📐 Architecture Whiteboard & Scalability</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="modal-filter-pill"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="apply-btn" style={{ padding: "8px 18px" }}>
                  <FaCheck style={{ marginRight: "4px" }} /> Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;