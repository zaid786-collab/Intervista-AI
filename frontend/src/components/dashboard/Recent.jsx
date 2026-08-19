import { useState } from "react";
import "./Dashboard.css";
import { FaCalendarAlt, FaTimes, FaCheckCircle, FaAward, FaFilePdf, FaDownload } from "react-icons/fa";
import { generateInterviewPDF } from "../../utils/pdfGenerator";
import { useAuth } from "../../context/useAuth";

function Recent({ interviews = [], onStartInterview }) {
  const { user } = useAuth();
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleStart = () => {
    if (onStartInterview) {
      onStartInterview();
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownloadPDF = (interview, e) => {
    if (e) e.stopPropagation();
    setDownloadingId(interview.id);
    try {
      generateInterviewPDF(interview, user?.name || "Interview Candidate");
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
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
            Take your first AI-evaluated mock interview to view score history, rubric breakdowns, and download official PDF reports.
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
              <th>Report / Actions</th>
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
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                      className="detail-btn"
                      onClick={() => setSelectedInterview(item)}
                      style={{ padding: "5px 10px", fontSize: "12px" }}
                    >
                      Summary
                    </button>
                    {item.status === "Completed" && (
                      <button
                        type="button"
                        onClick={(e) => handleDownloadPDF(item, e)}
                        disabled={downloadingId === item.id}
                        title="Download Evaluation PDF Report"
                        style={{
                          padding: "5px 9px",
                          borderRadius: "6px",
                          background: "rgba(56,189,248,0.12)",
                          border: "1px solid rgba(56,189,248,0.3)",
                          color: "#38bdf8",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: "600",
                        }}
                      >
                        <FaFilePdf />
                        {downloadingId === item.id ? "Saving..." : "PDF"}
                      </button>
                    )}
                  </div>
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
              maxWidth: "520px",
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", margin: "16px 0", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", textAlign: "center" }}>
              <div>
                <small style={{ color: "#94a3b8", display: "block" }}>Overall Score</small>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#22c55e" }}>
                  {selectedInterview.score || "Completed"}
                </div>
              </div>
              <div>
                <small style={{ color: "#94a3b8", display: "block" }}>Tech Depth</small>
                <div style={{ fontSize: "16px", fontWeight: "600", marginTop: "2px", color: "#38bdf8" }}>
                  {selectedInterview.technical_score ? `${selectedInterview.technical_score}%` : "Evaluated"}
                </div>
              </div>
              <div>
                <small style={{ color: "#94a3b8", display: "block" }}>Date & Time</small>
                <div style={{ fontSize: "13px", marginTop: "4px", color: "#cbd5e1" }}>
                  {selectedInterview.date || "Recent"}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
              <strong style={{ display: "block", color: "#60a5fa", fontSize: "12px", marginBottom: "4px" }}>AI EVALUATOR FEEDBACK</strong>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: "#cbd5e1", margin: 0 }}>
                {selectedInterview.feedback || "Performance evaluated successfully. Candidate demonstrated good domain understanding with structured reasoning."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {selectedInterview.status === "Completed" && (
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(selectedInterview)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FaFilePdf />
                  Download PDF Report
                </button>
              )}

              <button
                onClick={() => setSelectedInterview(null)}
                style={{
                  flex: 1,
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
        </div>
      )}
    </div>
  );
}

export default Recent;