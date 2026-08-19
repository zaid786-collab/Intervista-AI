import { useState } from "react";
import "./Dashboard.css";
import {
  FaFileUpload,
  FaCheckCircle,
  FaFilePdf,
  FaStar,
  FaTimes,
  FaSpinner,
  FaChartLine,
} from "react-icons/fa";
import { analyzeResume } from "../../api";

const SAMPLE_RESUME = `SENIOR FULL STACK DEVELOPER
Skills: React, JavaScript, TypeScript, Python, FastAPI, Node.js, PostgreSQL, Docker, AWS, Redis, Git, CI/CD, System Design, REST APIs.
Experience:
- Architected and deployed microservices backend using FastAPI and PostgreSQL handling 50,000+ daily active users.
- Optimized frontend bundle size by 42% and improved Core Web Vitals (LCP reduced by 1.2s) in Next.js/React.
- Built real-time WebSocket communication layer reducing server memory footprint by 25%.
- Maintained 95%+ test coverage using PyTest and Jest with automated CI/CD pipelines in GitHub Actions.
Links: github.com/candidate, linkedin.com/in/candidate`;

function ResumeAnalyzer() {
  const [showModal, setShowModal] = useState(false);
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState({
    ats_score: 91,
    target_role: "Full Stack Developer",
    verdict: "Strong Candidate",
    keywords: {
      matched: ["React", "JavaScript", "Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "Redis"],
      missing: ["Kubernetes", "GraphQL", "Microfrontends"],
    },
    strengths: [
      "Quantified engineering impact (42% bundle reduction, 50k+ DAU).",
      "Comprehensive modern tech stack alignment with Full Stack Developer.",
      "Professional links and clean technical summary.",
    ],
    suggestions: [
      "Include Distributed Systems and Caching invalidation patterns.",
      "Highlight leadership or mentoring experiences.",
      "Add security practices (OAuth2, CORS, XSS mitigation).",
    ],
    formatting_score: 95,
    technical_depth_score: 88,
  });

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      alert("Please enter or paste your resume text.");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeResume({
        resume_text: resumeText,
        target_role: targetRole,
      });

      setAnalysis(data);
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result || "");
      setShowModal(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="resume">
      <div className="resume-header">
        <h2>📄 AI Resume Analyzer</h2>

        <button className="upload-btn" onClick={() => setShowModal(true)}>
          <FaFileUpload />
          Analyze Resume
        </button>
      </div>

      <div className="resume-box" onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        <FaFilePdf className="pdf-icon" />
        <h3>Resume Profile: {targetRole}</h3>
        <p>Click to re-analyze or paste new resume</p>
      </div>

      <div className="resume-score">
        <div>
          <FaStar />
          <h3>ATS Score</h3>
        </div>

        <span style={{ color: analysis.ats_score >= 80 ? "#22c55e" : "#f59e0b" }}>
          {analysis.ats_score}%
        </span>
      </div>

      <div className="resume-feedback">
        <h3>
          <FaCheckCircle />
          AI Suggestions ({targetRole})
        </h3>

        <ul>
          {analysis.suggestions.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(10, 15, 29, 0.85)",
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
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaChartLine style={{ color: "#38bdf8" }} />
                Analyze Resume with AI
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  outline: "none",
                }}
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="Software Engineer">Software Engineer (General)</option>
              </select>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Paste Resume Content (Text / Skills / Projects)
                </label>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#38bdf8",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Upload text file
                  <input type="file" accept=".txt,.md" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>
              </div>
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume sections, skills, work experience, and projects..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#090d16",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#f8fafc",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
              {loading ? "Calculating ATS Score & Matching Keywords..." : "Run AI Resume Analysis"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;