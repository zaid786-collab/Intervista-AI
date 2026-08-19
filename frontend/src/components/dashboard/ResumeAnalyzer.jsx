import { useState } from "react";
import "./Dashboard.css";
import {
  FaFileUpload,
  FaCheckCircle,
  FaFilePdf,
  FaStar,
  FaTimes,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import { getToken } from "../../api";

function ResumeAnalyzer({ onResumeAnalyzed }) {
  const [showModal, setShowModal] = useState(false);
  const [resumeText, setResumeText] = useState(
    "Software Engineer with 3+ years experience building React, Node.js, and Python web apps. Designed distributed caching systems with Redis and PostgreSQL, reducing API latency by 35%. Proficient in JavaScript, TypeScript, Docker, and REST APIs."
  );
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState({
    ats_score: 91,
    target_role: "Software Engineer",
    verdict: "Strong ATS Match • Ready for Top Tier Applications",
    keywords: {
      matched: ["react", "javascript", "typescript", "python", "node.js", "redis", "postgresql", "docker", "rest api"],
      missing: ["system design", "ci/cd", "microservices", "kubernetes"],
    },
    suggestions: [
      "Incorporate system design & microservices architecture keywords.",
      "Add quantifiable business impact metrics to bullet points.",
      "Emphasize unit & integration testing coverage (Jest, PyTest).",
    ],
  });

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];

    let successData = null;

    for (const base of candidateBases) {
      try {
        const res = await fetch(`${base}/api/resume/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            resume_text: resumeText,
            target_role: targetRole,
            target_company: targetCompany,
          }),
        });

        if (res.ok) {
          successData = await res.json();
          break;
        }
      } catch {
        // fallback
      }
    }

    if (!successData) {
      const lower = resumeText.toLowerCase();
      const techList = ["react", "node.js", "python", "javascript", "typescript", "sql", "redis", "docker", "aws", "git"];
      const matched = techList.filter((t) => lower.includes(t));
      const missing = ["system design", "ci/cd", "microservices", "testing"].filter((t) => !matched.includes(t));
      const score = Math.min(45 + matched.length * 7 + (lower.includes("%") ? 15 : 0), 96);

      successData = {
        ats_score: score,
        target_role: targetRole,
        verdict: score >= 80 ? "Strong ATS Match • Ready for Top Tier Applications" : "Good Base • Optimize Keywords",
        keywords: { matched, missing },
        suggestions: [
          "Add quantifiable metric outcomes (e.g. 'Improved latency by 35%').",
          "Include high-demand cloud and system design skills.",
          "Ensure bullet points start with strong action verbs.",
        ],
      };
    }

    setAtsResult(successData);
    setLoading(false);
    setShowModal(false);

    if (onResumeAnalyzed) {
      onResumeAnalyzed();
    }
  };

  return (
    <div className="resume">
      <div className="resume-header">
        <h2>📄 AI Resume Analyzer</h2>
        <button className="upload-btn" type="button" onClick={() => setShowModal(true)}>
          <FaFileUpload />
          Analyze Resume
        </button>
      </div>

      <div className="resume-box">
        <FaFilePdf className="pdf-icon" />
        <h3>Resume_Verified.pdf</h3>
        <p style={{ color: "#38bdf8", fontWeight: "bold" }}>Target: {atsResult.target_role}</p>
      </div>

      <div className="resume-score">
        <div>
          <FaStar />
          <h3>ATS Score</h3>
        </div>
        <span style={{ color: atsResult.ats_score >= 80 ? "#22c55e" : "#f59e0b" }}>
          {atsResult.ats_score}%
        </span>
      </div>

      <div className="resume-feedback">
        <h3>
          <FaCheckCircle />
          AI Suggestions & Keywords
        </h3>
        <ul>
          {atsResult.suggestions?.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Upload / Edit Resume Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(10, 15, 29, 0.9)",
            backdropFilter: "blur(8px)",
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
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              color: "#fff",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>📄 Paste / Upload Resume Text</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAnalyze}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Target Company</label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
                  Resume Plain Text (Summary, Experience & Skills)
                </label>
                <textarea
                  rows={8}
                  required
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#f8fafc",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    background: "#2563eb",
                    border: "none",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? <FaSpinner className="fa-spin" /> : <FaCheck />}
                  {loading ? "Analyzing ATS..." : "Analyze Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;