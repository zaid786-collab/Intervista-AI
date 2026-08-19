import { useState } from "react";
import "./Dashboard.css";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaLaptopCode,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { scheduleInterview } from "../../api";

const defaultInterviews = [
  {
    company: "Google",
    role: "SDE Intern",
    date: "04 Aug 2026",
    time: "10:00 AM",
    mode: "Virtual",
    color: "#2563eb",
  },
  {
    company: "Microsoft",
    role: "Frontend Developer",
    date: "05 Aug 2026",
    time: "02:00 PM",
    mode: "Online Coding",
    color: "#22c55e",
  },
  {
    company: "Amazon",
    role: "Backend Engineer",
    date: "07 Aug 2026",
    time: "11:30 AM",
    mode: "Virtual",
    color: "#f59e0b",
  },
];

function Schedule({ interviews: propInterviews }) {
  const [list, setList] = useState(() => (propInterviews && propInterviews.length > 0 ? propInterviews : defaultInterviews));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    company: "Google",
    role: "Software Engineer",
    date: "20 Aug 2026",
    time: "04:00 PM",
    mode: "Virtual",
  });
  const [loading, setLoading] = useState(false);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await scheduleInterview(form);
      setList((prev) => [form, ...prev]);
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Failed to schedule interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule">
      <div className="schedule-header">
        <h2>
          <FaCalendarAlt />
          Interview Schedule
        </h2>

        <button className="view-btn" onClick={() => setShowModal(true)}>
          <FaPlus style={{ marginRight: "4px" }} /> Schedule
        </button>
      </div>

      {list.map((item, index) => (
        <div className="schedule-card" key={index}>
          <div
            className="schedule-icon"
            style={{ background: item.color || "#2563eb" }}
          >
            {item.mode === "Online Coding" ? <FaLaptopCode /> : <FaVideo />}
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
      ))}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(10, 15, 29, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              padding: "26px",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0 }}>📅 Schedule Mock Interview</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddSchedule}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Date</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Time</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#2563eb",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {loading ? "Saving..." : "Add to Schedule"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;