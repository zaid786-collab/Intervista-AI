import { useState, useRef } from "react";
import "./Dashboard.css";
import {
  FaFileUpload,
  FaCheckCircle,
  FaFilePdf,
  FaStar,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaLightbulb,
  FaDownload,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";
import { getToken } from "../../api";
import { generateInterviewPDF } from "../../utils/pdfGenerator";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "AI / ML Engineer",
  "Software Engineer",
];

const DEFAULT_RESUME_TEXT = `SENIOR FULL STACK SOFTWARE ENGINEER
Email: alex.dev@example.com | San Francisco, CA

SUMMARY
Full Stack Engineer with 5+ years of experience building scalable React and Python web apps. Spearheaded microservices migration reducing P99 latency by 35% and scaling to 5M+ users.

SKILLS
React, TypeScript, JavaScript, Python, FastAPI, Node.js, PostgreSQL, Redis, Docker, AWS, Git, CI/CD, Jest

EXPERIENCE
Software Engineer | CloudScale (2021 – Present)
• Built real-time analytics dashboard with React and WebSockets, boosting user engagement by 40%.
• Designed PostgreSQL indexing and Redis caching layer, saving $25,000 in monthly database costs.
• Implemented automated CI/CD pipelines reducing deployment time from 2 hours to 10 minutes.

EDUCATION
B.S. in Computer Science (2020)`;

// Quick client-side PDF text parser
function extractTextFromPDFBuffer(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const chunkSize = 8192;
    let binary = "";
    for (let i = 0; i < len; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, len)));
    }

    const tjRegex = /\((.*?)\)\s*(?:Tj|'|")/g;
    let match;
    const words = [];
    while ((match = tjRegex.exec(binary)) !== null) {
      const clean = match[1].replace(/\\([()\\])/g, "$1").trim();
      if (clean.length > 0) words.push(clean);
    }

    if (words.length > 10) return words.join(" ");

    const matches = binary.match(/[a-zA-Z0-9.,@#+\-%/:_() ]{4,}/g) || [];
    const filtered = matches.filter(
      (m) => !m.includes("Font") && !m.includes("Type") && !m.includes("Length") && !m.includes("Catalog")
    );
    return filtered.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

function ResumeAnalyzer({ onResumeAnalyzed }) {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME_TEXT);
  const [fileName, setFileName] = useState("Alex_Dev_Resume.pdf");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("improvements"); // "improvements" | "strengths"
  const [showEditor, setShowEditor] = useState(false);

  const fileInputRef = useRef(null);

  // Clean, structured ATS result state
  const [atsResult, setAtsResult] = useState({
    ats_score: 91,
    target_role: "Full Stack Engineer",
    verdict: "Strong ATS Fit • Ready for Top Tier Roles",
    keywords: {
      matched: ["react", "typescript", "python", "fastapi", "postgresql", "redis", "docker", "aws", "git", "ci/cd"],
      missing: ["system design", "microservices", "kubernetes"],
    },
    strengths: [
      "Matched 10 core technical skills for Full Stack Engineer.",
      "Clear metrics used across projects (35% latency reduction, $25k savings).",
      "Clean standard section structure compatible with modern ATS parsers."
    ],
    suggestions: [
      "Incorporate missing keywords: system design, microservices, kubernetes.",
      "Start all bullet points with strong action verbs (Architected, Spearheaded, Optimized).",
      "Add quantifiable business impact to every project entry."
    ],
    action_verbs: [
      { weak: "worked on", better: "Architected / Spearheaded" },
      { weak: "helped with", better: "Collaborated on / Drove" },
    ],
  });

  const handleFileUpload = (file) => {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      reader.onload = (e) => {
        const extracted = extractTextFromPDFBuffer(e.target.result);
        const text = extracted && extracted.length > 30 ? extracted : DEFAULT_RESUME_TEXT;
        setResumeText(text);
        runEvaluation(text, file.name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        const text = e.target.result;
        setResumeText(text);
        runEvaluation(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const runEvaluation = async (textToEvaluate, currentFile = fileName) => {
    setLoading(true);
    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
    let success = null;

    for (const base of candidateBases) {
      try {
        const res = await fetch(`${base}/api/resume/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            resume_text: textToEvaluate || resumeText,
            target_role: targetRole,
            target_company: "Tech Company",
          }),
        });
        if (res.ok) {
          success = await res.json();
          break;
        }
      } catch {
        // fallback
      }
    }

    if (!success) {
      const lower = (textToEvaluate || resumeText).toLowerCase();
      const tech = ["react", "typescript", "javascript", "python", "node.js", "fastapi", "sql", "postgresql", "redis", "docker", "aws", "git", "ci/cd", "jest"];
      const matched = tech.filter((t) => lower.includes(t));
      const missing = ["system design", "microservices", "kubernetes"].filter((t) => !matched.includes(t));
      const hasMetrics = lower.includes("%") || lower.includes("$") || lower.includes("reduced") || lower.includes("improved");

      const score = Math.min(50 + matched.length * 5 + (hasMetrics ? 15 : 0), 96);
      success = {
        ats_score: score,
        target_role: targetRole,
        verdict: score >= 85 ? "Strong ATS Fit • Ready for Top Tier Roles" : score >= 70 ? "Good Base • Minor Optimizations Needed" : "Needs Keyword & Metric Optimization",
        keywords: { matched, missing },
        strengths: [
          `Detected ${matched.length} key technical competencies for ${targetRole}.`,
          hasMetrics ? "Good usage of quantifiable impact numbers and metrics." : "Clean technical language.",
        ],
        suggestions: [
          missing.length > 0 ? `Add missing high-demand skills: ${missing.join(", ")}.` : "Highlight system design and architectural trade-offs.",
          "Ensure each project bullet starts with strong power verbs (Spearheaded, Architected, Optimized).",
          "Include quantifiable results (e.g. 'Improved API response time by 30%')."
        ],
        action_verbs: [
          { weak: "worked on", better: "Architected / Spearheaded" },
          { weak: "helped with", better: "Collaborated on / Drove" },
        ]
      };
    }

    setAtsResult(success);
    setLoading(false);
    if (onResumeAnalyzed) onResumeAnalyzed();
  };

  const handleDownloadReport = () => {
    generateInterviewPDF({
      company: "General Tech",
      role: targetRole,
      difficulty: "ATS Evaluation",
      score: atsResult.ats_score,
      grade: atsResult.ats_score >= 85 ? "A+ (ATS Ready)" : "A (Competitive)",
      feedback: `ATS Resume Score: ${atsResult.ats_score}%. ${atsResult.verdict}`,
      strengths: atsResult.strengths,
      improvements: atsResult.suggestions,
      detailed_feedback: [
        {
          question: "Matched Skills",
          score: atsResult.ats_score,
          feedback: `Found: ${atsResult.keywords?.matched?.join(", ")}`,
          identified_keywords: atsResult.keywords?.matched || [],
        },
        {
          question: "Missing Recommended Skills",
          score: 80,
          feedback: `Recommended to add: ${atsResult.keywords?.missing?.join(", ")}`,
          suggested_answer_points: atsResult.suggestions || [],
        }
      ]
    }, "Resume ATS Audit");
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "#22c55e"; // Green
    if (score >= 70) return "#38bdf8"; // Blue
    return "#f59e0b"; // Yellow
  };

  return (
    <div className="resume-clean-card">
      {/* 1. CLEAN HEADER */}
      <div className="resume-clean-header">
        <div>
          <h3>📄 AI Resume Analyzer</h3>
          <p>Get instant ATS match scores, missing keywords, and simple suggestions.</p>
        </div>

        <div className="role-selector-pill">
          <span>Target Role:</span>
          <select
            value={targetRole}
            onChange={(e) => {
              setTargetRole(e.target.value);
              setTimeout(() => runEvaluation(resumeText, fileName), 50);
            }}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. SIMPLE UPLOAD DROPZONE */}
      <div
        className={`resume-upload-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
        />

        <div className="upload-zone-content">
          <div className="upload-icon-box">
            <FaFileUpload />
          </div>
          <div>
            <div className="upload-title">
              Click to upload your resume <span>(PDF or DOCX)</span> or drag & drop
            </div>
            <div className="upload-subtitle">
              Current File: <strong>{fileName}</strong>
            </div>
          </div>
        </div>

        {loading && (
          <div className="upload-loading">
            <FaSpinner className="fa-spin" />
            <span>Analyzing Resume...</span>
          </div>
        )}
      </div>

      {/* 3. SCORE OVERVIEW CARD */}
      <div className="ats-score-summary">
        <div className="score-badge-circle" style={{ borderColor: getScoreColor(atsResult.ats_score) }}>
          <span className="score-num" style={{ color: getScoreColor(atsResult.ats_score) }}>
            {atsResult.ats_score}%
          </span>
          <span className="score-text">ATS Score</span>
        </div>

        <div className="score-verdict-info">
          <div className="verdict-pill" style={{ color: getScoreColor(atsResult.ats_score) }}>
            <FaCheckCircle /> {atsResult.verdict}
          </div>
          <div className="skills-summary-bar">
            <span><strong>{atsResult.keywords?.matched?.length || 0}</strong> Skills Matched</span>
            <span>•</span>
            <span><strong>{atsResult.keywords?.missing?.length || 0}</strong> Missing Skills</span>
          </div>
        </div>

        <div className="score-quick-actions">
          <button type="button" className="btn-clean secondary" onClick={() => setShowEditor(true)}>
            <FaFileAlt /> View Text
          </button>
          <button type="button" className="btn-clean primary" onClick={handleDownloadReport}>
            <FaDownload /> Download Report
          </button>
        </div>
      </div>

      {/* 4. SIMPLE TWO-TAB BREAKDOWN */}
      <div className="clean-tabs-nav">
        <button
          type="button"
          className={`tab-btn-clean ${activeTab === "improvements" ? "active" : ""}`}
          onClick={() => setActiveTab("improvements")}
        >
          <FaLightbulb /> Suggested Improvements ({atsResult.suggestions?.length || 0})
        </button>

        <button
          type="button"
          className={`tab-btn-clean ${activeTab === "strengths" ? "active" : ""}`}
          onClick={() => setActiveTab("strengths")}
        >
          <FaCheckCircle /> Matched Skills & Strengths ({atsResult.keywords?.matched?.length || 0})
        </button>
      </div>

      {/* TAB CONTENT: IMPROVEMENTS */}
      {activeTab === "improvements" && (
        <div className="clean-tab-body">
          {/* Missing Keywords */}
          {atsResult.keywords?.missing?.length > 0 && (
            <div className="simple-missing-box">
              <span className="missing-label">Recommended skills to add:</span>
              <div className="missing-tags">
                {atsResult.keywords.missing.map((k, i) => (
                  <span key={i} className="missing-tag">+ {k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Suggestions */}
          <div className="simple-suggestions-list">
            {atsResult.suggestions?.map((item, idx) => (
              <div key={idx} className="suggestion-item">
                <span className="sug-num">{idx + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          {/* Action Verbs Tip */}
          {atsResult.action_verbs?.length > 0 && (
            <div className="simple-verbs-tip">
              <strong>Tip:</strong> Replace weak verbs with strong action verbs:
              <div className="verbs-inline-list">
                {atsResult.action_verbs.map((v, i) => (
                  <span key={i} className="verb-item">
                    <span className="weak">"{v.weak}"</span> → <span className="strong">{v.better}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: STRENGTHS */}
      {activeTab === "strengths" && (
        <div className="clean-tab-body">
          <div className="matched-skills-section">
            <span className="matched-label">Matched Skills Found in Resume:</span>
            <div className="matched-tags">
              {atsResult.keywords?.matched?.map((k, i) => (
                <span key={i} className="matched-tag">✓ {k}</span>
              ))}
            </div>
          </div>

          <div className="simple-strengths-list">
            {atsResult.strengths?.map((s, idx) => (
              <div key={idx} className="strength-row">
                <FaCheck className="check-icon" />
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TEXT EDITOR MODAL */}
      {showEditor && (
        <div className="interview-modal-backdrop" onClick={() => setShowEditor(false)}>
          <div className="clean-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-simple">
              <h4>Resume Text</h4>
              <button type="button" className="close-btn-simple" onClick={() => setShowEditor(false)}>
                <FaTimes />
              </button>
            </div>
            <p className="modal-hint">You can edit your resume text and re-calculate the score.</p>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="clean-textarea"
            />
            <div className="modal-footer-simple">
              <button type="button" className="btn-clean secondary" onClick={() => setShowEditor(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-clean primary"
                onClick={() => {
                  setShowEditor(false);
                  runEvaluation(resumeText, fileName);
                }}
              >
                Re-Analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;