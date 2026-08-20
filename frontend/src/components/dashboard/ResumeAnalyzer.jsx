import { useState, useRef } from "react";
import "./Dashboard.css";
import { FaUpload, FaSpinner, FaDownload, FaLightbulb, FaRedo } from "react-icons/fa";
import { getToken } from "../../api";
import { generateInterviewPDF } from "../../utils/pdfGenerator";

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "AI / ML Engineer",
];

const TECH_STACK = [
  "react", "typescript", "javascript", "python", "node.js", "fastapi",
  "sql", "postgresql", "redis", "docker", "aws", "git", "ci/cd",
  "jest", "mongodb", "kubernetes", "graphql", "vue", "angular",
];

function extractTextFromPDF(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)));
    }
    const tjRegex = /\((.*?)\)\s*(?:Tj|'|")/g;
    let match;
    const words = [];
    while ((match = tjRegex.exec(binary)) !== null) {
      const clean = match[1].replace(/\\([()\\])/g, "$1").trim();
      if (clean.length > 0) words.push(clean);
    }
    if (words.length > 10) return words.join(" ");
    return (binary.match(/[a-zA-Z0-9.,@#+\-%/:_() ]{4,}/g) || [])
      .filter(m => !["Font", "Type", "Catalog", "Length"].some(x => m.includes(x)))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  } catch { return ""; }
}

function localScore(text, role) {
  const lower = text.toLowerCase();
  const matched = TECH_STACK.filter(t => lower.includes(t));
  const missing = ["system design", "microservices", "ci/cd", "redis", "docker"]
    .filter(t => !matched.includes(t)).slice(0, 4);
  const hasMetrics = ["%", "$", "reduced", "improved", "optimized", "increased"].some(m => lower.includes(m));
  const score = Math.min(50 + matched.length * 5 + (hasMetrics ? 12 : 0), 96);
  return {
    ats_score: score,
    target_role: role,
    verdict: score >= 85 ? "Strong ATS Match" : score >= 70 ? "Good — Minor Tweaks Needed" : "Needs Optimization",
    keywords: { matched, missing },
    strengths: [
      `${matched.length} key ${role} skills detected in your resume.`,
      hasMetrics ? "Quantifiable impact metrics found (%, $, improvements)." : "Consider adding measurable outcomes to bullet points.",
    ],
    suggestions: [
      missing.length > 0 ? `Add missing in-demand skills: ${missing.join(", ")}.` : "Deepen system design and architectural trade-off coverage.",
      "Begin each bullet with strong action verbs: Architected, Built, Optimized, Spearheaded.",
      "Include specific numbers for impact (e.g. 'Improved API response time by 30%').",
    ],
  };
}

function scoreColor(s) {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return "#3b82f6";
  return "#f59e0b";
}

function downloadPDFReport(result, role, fileName) {
  generateInterviewPDF({
    company: "Resume Analysis",
    role,
    difficulty: "ATS Audit",
    score: result.ats_score,
    grade: result.ats_score >= 85 ? "A+" : result.ats_score >= 70 ? "A" : "B",
    feedback: result.verdict,
    strengths: result.strengths,
    improvements: result.suggestions,
    detailed_feedback: [
      {
        question: "Matched Skills",
        score: result.ats_score,
        feedback: `Found in resume: ${result.keywords.matched.join(", ")}`,
        identified_keywords: result.keywords.matched,
      },
      {
        question: "Skill Gaps",
        score: 65,
        feedback: result.keywords.missing.length
          ? `Recommended additions: ${result.keywords.missing.join(", ")}`
          : "No critical gaps detected.",
        suggested_answer_points: result.suggestions,
      },
    ],
  }, `Resume_ATS_Report_${fileName.replace(/\.[^.]+$/, "")}`);
}

export default function ResumeAnalyzer({ onResumeAnalyzed }) {
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const fileRef = useRef(null);

  const analyze = async (text, file, role = targetRole) => {
    setLoading(true);
    const token = getToken();
    let data = null;

    for (const base of ["http://127.0.0.1:8000", "http://localhost:8000", ""]) {
      try {
        const res = await fetch(`${base}/api/resume/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ resume_text: text, target_role: role, target_company: "Top Tech" }),
        });
        if (res.ok) { data = await res.json(); break; }
      } catch { /* fallback */ }
    }

    const finalResult = data || localScore(text, role);
    setResult(finalResult);
    setLoading(false);
    onResumeAnalyzed?.();

    // Auto-download PDF report after analysis
    setTimeout(() => downloadPDFReport(finalResult, role, file), 800);
  };

  const handleFile = (file) => {
    if (!file) return;
    const name = file.name;
    setFileName(name);
    setResult(null);
    setLoading(true);

    const reader = new FileReader();
    if (name.endsWith(".pdf")) {
      reader.onload = (e) => {
        const text = extractTextFromPDF(e.target.result) || "No readable text extracted from PDF.";
        setResumeText(text);
        analyze(text, name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        setResumeText(e.target.result);
        analyze(e.target.result, name);
      };
      reader.readAsText(file);
    }
  };

  const reanalyze = () => {
    if (resumeText) analyze(resumeText, fileName);
  };

  const color = result ? scoreColor(result.ats_score) : "#6366f1";
  const circumference = 2 * Math.PI * 40;
  const dashOffset = result ? circumference - (circumference * result.ats_score) / 100 : circumference;

  return (
    <div className="ra-card">
      {/* Header */}
      <div className="ra-header">
        <div>
          <h3 className="ra-title">Resume Analyzer</h3>
          <p className="ra-subtitle">Upload your resume — get an ATS score &amp; PDF report instantly.</p>
        </div>
        <select
          className="ra-role-select"
          value={targetRole}
          onChange={(e) => {
            setTargetRole(e.target.value);
            if (resumeText) setTimeout(() => analyze(resumeText, fileName, e.target.value), 0);
          }}
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Upload Zone */}
      <div
        className={`ra-dropzone${isDragging ? " active" : ""}${result ? " ra-dropzone-compact" : ""}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      >
        <input
          ref={fileRef} type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {loading ? (
          <div className="ra-loading">
            <FaSpinner className="fa-spin" />
            <span>Analyzing <strong>{fileName}</strong>…</span>
          </div>
        ) : result ? (
          <div className="ra-reupload-hint">
            <FaUpload className="ra-upload-icon-sm" />
            <span>Analyzed: <strong>{fileName}</strong> — click to upload a different resume</span>
          </div>
        ) : (
          <>
            <FaUpload className="ra-upload-icon" />
            <span className="ra-upload-label">Drop your resume here or <u>browse files</u></span>
            <span className="ra-file-name">Supports PDF, DOCX, TXT</span>
          </>
        )}
      </div>

      {/* Results — only after analysis */}
      {result && !loading && (
        <>
          {/* Score Row */}
          <div className="ra-score-row">
            <div className="ra-donut-wrap">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="40" fill="none"
                  stroke={color} strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 48 48)"
                  style={{ transition: "stroke-dashoffset 0.7s ease" }}
                />
              </svg>
              <div className="ra-donut-text">
                <span className="ra-donut-num" style={{ color }}>{result.ats_score}</span>
                <span className="ra-donut-pct">%</span>
              </div>
            </div>

            <div className="ra-score-info">
              <span className="ra-verdict" style={{ color }}>{result.verdict}</span>
              <div className="ra-skill-counts">
                <span className="ra-count-pill green">✓ {result.keywords.matched.length} matched</span>
                <span className="ra-count-pill amber">＋{result.keywords.missing.length} missing</span>
              </div>
              <div className="ra-action-row">
                <button className="ra-btn solid" onClick={() => downloadPDFReport(result, targetRole, fileName)}>
                  <FaDownload /> Download PDF Report
                </button>
                <button className="ra-btn ghost" onClick={reanalyze}>
                  <FaRedo /> Re-Analyze
                </button>
              </div>
              <p className="ra-pdf-hint">📄 PDF report was auto-downloaded after analysis.</p>
            </div>
          </div>

          {/* Missing Skills */}
          {result.keywords.missing.length > 0 && (
            <div className="ra-section">
              <p className="ra-section-label amber">＋ Skills to Add</p>
              <div className="ra-tags">
                {result.keywords.missing.map((k, i) => (
                  <span key={i} className="ra-tag miss">+{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Skills */}
          <div className="ra-section">
            <p className="ra-section-label green">✓ Matched Skills</p>
            <div className="ra-tags">
              {result.keywords.matched.map((k, i) => (
                <span key={i} className="ra-tag match">✓ {k}</span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="ra-section">
            <p className="ra-section-label"><FaLightbulb style={{ color: "#f59e0b" }} /> Suggestions</p>
            <ul className="ra-suggestions">
              {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}