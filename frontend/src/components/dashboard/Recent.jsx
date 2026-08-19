import { useState } from "react";
import "./Dashboard.css";
import { FaTimes, FaAward, FaBuilding } from "react-icons/fa";

const defaultInterviews = [
  {
    role: "Frontend Developer",
    company: "Meta",
    score: "92%",
    status: "Completed",
    date: "10 Aug 2026",
    feedback: "Candidate demonstrated outstanding mastery of React component lifecycle, virtual DOM reconciliation, and web performance.",
  },
  {
    role: "Backend Developer",
    company: "Google",
    score: "85%",
    status: "Completed",
    date: "08 Aug 2026",
    feedback: "Strong grasp of database indexing, REST API design, and distributed caching invalidation.",
  },
  {
    role: "React Developer",
    company: "Netflix",
    score: "78%",
    status: "Pending",
    date: "06 Aug 2026",
    feedback: "Good functional fundamentals. Practice explaining time/space complexities and state management patterns.",
  },
  {
    role: "AI Engineer",
    company: "OpenAI",
    score: "95%",
    status: "Completed",
    date: "02 Aug 2026",
    feedback: "Exceptional depth in transformer architectures, fine-tuning, and LLM orchestration with FastAPI.",
  },
];

function Recent({ interviews = defaultInterviews }) {
  const list = interviews && interviews.length > 0 ? interviews : defaultInterviews;
  const [selectedInterview, setSelectedInterview] = useState(null);

  return (
    <div className="recent">
      <h2>Recent Interviews</h2>

      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Score</th>
            <th>Status</th>
            <th>View Detail</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              <td>
                <strong>{item.role}</strong>
                {item.company && <small style={{ display: "block", color: "#94a3b8" }}>{item.company}</small>}
              </td>

              <td>
                <span style={{ color: item.score ? "#22c55e" : "#94a3b8", fontWeight: "bold" }}>
                  {item.score || "-"}
                </span>
              </td>

              <td>
                <span className={item.status === "Completed" ? "completed" : "pending"}>
                  {item.status}
                </span>
              </td>

              <td>
                <button
                  className="detail-btn"
                  onClick={() => setSelectedInterview(item)}
                  type="button"
                >
                  View Summary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= SUMMARY MODAL ================= */}
      {selectedInterview && (
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
              maxWidth: "500px",
              padding: "26px",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaAward style={{ color: "#22c55e" }} />
                Interview Summary
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInterview(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "10px", marginBottom: "14px" }}>
              <p style={{ margin: "0 0 6px", fontSize: "15px" }}>
                <strong>Role:</strong> {selectedInterview.role}
              </p>
              {selectedInterview.company && (
                <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#cbd5e1" }}>
                  <strong>Company:</strong> {selectedInterview.company}
                </p>
              )}
              <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#cbd5e1" }}>
                <strong>Score:</strong>{" "}
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                  {selectedInterview.score || "Pending"}
                </span>
              </p>
              {selectedInterview.date && (
                <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                  <strong>Date:</strong> {selectedInterview.date}
                </p>
              )}
            </div>

            <div style={{ background: "rgba(59,130,246,0.08)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(59,130,246,0.2)", marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 6px", color: "#60a5fa", fontSize: "14px" }}>AI Feedback & Evaluation</h4>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, color: "#e2e8f0" }}>
                {selectedInterview.feedback || "Solid performance across technical problem solving and communication. Keep practicing complex edge cases."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedInterview(null)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "#2563eb",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
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