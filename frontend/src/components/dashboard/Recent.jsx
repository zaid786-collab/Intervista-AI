import { useState } from "react";
import "./Dashboard.css";
import { FaCalendarAlt, FaTimes, FaCheckCircle, FaAward } from "react-icons/fa";

function Recent({ interviews = [], onStartInterview }) {
  const [selectedInterview, setSelectedInterview] = useState(null);

  const handleStart = () => {
    if (onStartInterview) {
      onStartInterview();
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="recent">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>Recent Interviews</h2>
        {interviews && interviews.length > 0 && (
          <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
            {interviews.length} recorded session{interviews.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {!interviews || interviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted, #94a3b8)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "600", color: "#fff" }}>
            No Interviews Completed Yet
          </p>
          <p style={{ fontSize: "13px", marginBottom: "20px" }}>
            Take your first AI-evaluated mock interview to view score history, rubric breakdowns, and personalized feedback.
          </p>
          <button className="start-btn" onClick={handleStart} style={{ padding: "8px 18px", fontSize: "13px" }}>
            + Start First Interview
          </button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company & Role</th>
              <th>Score</th>
              <th>Status</th>
              <th>Date</th>
              <th>Detail</th>
            </tr>
          </thead>

          <tbody>
            {interviews.map((item, index) => (
              <tr key={item.id || index}>
                <td>
                  <strong>{item.company || "Mock Interview"}</strong>
                  <br />
                  <small style={{ color: "var(--text-muted, #94a3b8)" }}>{item.role}</small>
                </td>

                <td>
                  <span style={{ fontWeight: "700", color: item.score && item.score !== "-" ? "#22c55e" : "inherit" }}>
                    {item.score || "-"}
                  </span>
                </td>

                <td>
                  <span className={item.status === "Completed" ? "completed" : "pending"}>
                    {item.status}
                  </span>
                </td>

                <td>
                  <small style={{ color: "var(--text-muted, #94a3b8)" }}>
                    {item.date || "Today"}
                    {item.duration_minutes ? ` • ${item.duration_minutes}m` : " • 1m"}
                  </small>
                </td>

                <td>
                  <button
                    className="detail-btn"
                    onClick={() => setSelectedInterview(item)}
                  >
                    View Summary
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Summary Modal */}
      {selectedInterview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setSelectedInterview(null)}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedInterview(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>

            <h3 style={{ fontSize: "18px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaAward style={{ color: "#eab308" }} />
              {selectedInterview.company} • {selectedInterview.role}
            </h3>

            <div style={{ display: "flex", gap: "16px", margin: "16px 0", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <div>
                <small style={{ color: "#94a3b8" }}>Score</small>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#22c55e" }}>
                  {selectedInterview.score || "Completed"}
                </div>
              </div>
              <div>
                <small style={{ color: "#94a3b8" }}>Duration</small>
                <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px", color: "#38bdf8" }}>
                  {selectedInterview.duration_minutes || 1} min
                </div>
              </div>
              <div>
                <small style={{ color: "#94a3b8" }}>Date</small>
                <div style={{ fontSize: "14px", marginTop: "4px" }}>
                  {selectedInterview.date || "Recent"}
                </div>
              </div>
            </div>

            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1" }}>
              {selectedInterview.feedback || "Performance evaluated successfully. Candidate demonstrated good domain understanding with room to elaborate on scale and edge cases."}
            </p>

            <button
              onClick={() => setSelectedInterview(null)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Close Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recent;