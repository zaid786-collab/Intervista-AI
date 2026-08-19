import { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FaVideo,
  FaMicrophone,
  FaLaptopCode,
  FaPlayCircle,
  FaCircle,
  FaClock,
  FaLightbulb,
  FaCheckCircle,
  FaCalendarAlt,
  FaAward,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { getToken } from "../../api";

const COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Adobe",
  "NVIDIA",
  "Salesforce",
  "IBM",
];

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "AI / ML Engineer",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// Comprehensive offline fallback questions
const OFFLINE_QUESTION_BANK = {
  "Frontend Developer": [
    {
      id: 1,
      category: "React & Architecture",
      question: "Explain the React Fiber reconciliation algorithm and how React uses keys for efficient Virtual DOM diffing.",
      hint: "Mention double buffering, time-slicing work loops, fiber node trees, heuristic O(n) comparison, and key stability.",
    },
    {
      id: 2,
      category: "Performance & Web Vitals",
      question: "How do you diagnose and optimize Core Web Vitals (LCP, INP, CLS) in a high-traffic React application?",
      hint: "Discuss fetchpriority='high', modern AVIF/WebP formats, code splitting with dynamic import(), useDeferredValue, and layout shift prevention.",
    },
    {
      id: 3,
      category: "JavaScript & Concurrency",
      question: "Explain JavaScript closures, event loop microtask/macrotask queues, and common sources of memory leaks.",
      hint: "Detail lexical scoping, garbage collection references, Promise vs setTimeout order, and event listener cleanup in useEffect.",
    },
  ],
  "Backend Developer": [
    {
      id: 1,
      category: "Distributed Caching",
      question: "How do you architect a high-throughput, fault-tolerant Redis distributed caching layer?",
      hint: "Address cache-aside, cache penetration, bloom filters, cache stampede (mutex locking), eviction policies, and cluster sharding.",
    },
    {
      id: 2,
      category: "Databases & Concurrency",
      question: "Compare PostgreSQL B-Tree vs Hash indexing and explain transaction isolation levels and deadlock detection.",
      hint: "Mention Read Committed, Repeatable Read, Serializable, MVCC concurrency control, row locking, and wait-for graph cycle detection.",
    },
    {
      id: 3,
      category: "Microservices & Transactions",
      question: "How do you achieve idempotency and distributed transactional consistency across microservices?",
      hint: "Discuss Idempotency-Key headers, transactional outbox pattern, distributed locks, Sagas, and message queue consumer deduplication.",
    },
  ],
  "Full Stack Engineer": [
    {
      id: 1,
      category: "Full Stack Architecture",
      question: "Design a real-time collaborative document editing system (like Google Docs) with conflict resolution.",
      hint: "Discuss WebSockets, Operational Transformation (OT) vs CRDTs, JWT token refresh, delta compression, and heartbeat sync.",
    },
    {
      id: 2,
      category: "Security & Auth",
      question: "Explain OAuth2 PKCE authorization flow, secure JWT token storage, and defending against CSRF/XSS.",
      hint: "Compare HttpOnly cookies vs localStorage, SameSite attributes, Content Security Policy, and refresh token rotation.",
    },
    {
      id: 3,
      category: "Scale & APIs",
      question: "How do you implement scalable pagination, API rate limiting, and database connection pooling under heavy load?",
      hint: "Compare cursor-based vs offset pagination, Token Bucket vs Sliding Window algorithms, and PgBouncer connection pooling.",
    },
  ],
  "AI / ML Engineer": [
    {
      id: 1,
      category: "RAG & Vector Systems",
      question: "Design an enterprise-grade Retrieval-Augmented Generation (RAG) pipeline with hybrid search and reranking.",
      hint: "Discuss chunking strategies, dense vector embeddings, BM25 keyword matching, cross-encoder rerankers, and vector DB indexing.",
    },
    {
      id: 2,
      category: "LLM Serving & Inference",
      question: "How do you optimize LLM inference throughput and latency in production (vLLM, quantization, KV caching)?",
      hint: "Mention PagedAttention, continuous batching, FP8/AWQ quantization, prefix caching, and speculative decoding.",
    },
  ],
};

const TECH_KEYWORDS = [
  "virtual dom", "reconciliation", "fiber", "hooks", "closure", "useeffect", "usecallback", "usememo",
  "debouncing", "throttling", "lcp", "cls", "inp", "tree shaking", "code splitting", "lazy loading",
  "b-tree", "hash index", "indexing", "postgresql", "mysql", "acid", "mvcc", "isolation levels",
  "cache-aside", "redis", "bloom filter", "cache stampede", "distributed lock", "mutex", "deadlock",
  "rate limiting", "token bucket", "sliding window", "jwt", "refresh token", "httponly", "csrf", "xss",
  "kafka", "rabbitmq", "transactional outbox", "idempotency", "microservices", "rest api", "graphql",
  "transformer", "self-attention", "rag", "embeddings", "vector database", "quantization", "vllm",
  "o(1)", "o(n)", "o(log n)", "o(n log n)", "time complexity", "space complexity", "hash map", "two pointers",
  "dynamic programming", "sliding window", "binary search", "recursion", "memoization"
];

function MockInterview({ onInterviewCompleted }) {
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);

  // Live session modal states
  const [interviewActive, setInterviewActive] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Scheduling modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00 AM");
  const [scheduleMode, setScheduleMode] = useState("Virtual");
  const [scheduleSuccess, setScheduleSuccess] = useState("");

  // Countdown timer during active interview
  useEffect(() => {
    let timer = null;
    if (interviewActive && !evaluationResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [interviewActive, evaluationResult, timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 1. START INTERVIEW HANDLER
  const handleStartInterview = async () => {
    setLoading(true);
    setEvaluationResult(null);
    setCurrentQIndex(0);
    setShowHint(false);
    setTimeLeft(45 * 60);

    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];

    let fetchedQuestions = null;

    for (const base of candidateBases) {
      try {
        const url = base ? `${base}/api/interviews/start` : `/api/interviews/start`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ company, role, difficulty, duration_minutes: 45 }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            fetchedQuestions = data.questions;
            break;
          }
        }
      } catch {
        // continue to next base or offline fallback
      }
    }

    // Fallback if backend unreachable
    if (!fetchedQuestions) {
      const qList = OFFLINE_QUESTION_BANK[role] || OFFLINE_QUESTION_BANK["Frontend Developer"];
      fetchedQuestions = qList.map((q) => ({
        id: q.id,
        category: q.category,
        question: `[${company}] ${q.question}`,
        hint: q.hint,
      }));
    }

    setSessionQuestions(fetchedQuestions);
    const initialAns = {};
    fetchedQuestions.forEach((q) => {
      initialAns[q.id] = "";
    });
    setAnswers(initialAns);
    setInterviewActive(true);
    setLoading(false);
  };

  // 2. SUBMIT INTERVIEW HANDLER
  const handleSubmitInterview = async () => {
    setLoading(true);

    const answersPayload = sessionQuestions.map((q) => ({
      question_id: q.id,
      question: q.question,
      answer: answers[q.id] || "No answer provided.",
    }));

    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
    let evalData = null;

    for (const base of candidateBases) {
      try {
        const url = base ? `${base}/api/interviews/submit` : `/api/interviews/submit`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            company,
            role,
            difficulty,
            duration_minutes: 45,
            answers: answersPayload,
          }),
        });

        if (res.ok) {
          evalData = await res.json();
          break;
        }
      } catch {
        // continue fallback
      }
    }

    // Local Rubric Evaluator Fallback
    if (!evalData) {
      let totalTech = 0;
      let totalComm = 0;
      let totalProb = 0;
      const allKeywords = new Set();
      const detailed = [];

      answersPayload.forEach((item) => {
        const text = item.answer.trim();
        const lower = text.toLowerCase();
        const words = text.split(/\s+/).filter(Boolean).length;

        const matched = TECH_KEYWORDS.filter((kw) => lower.includes(kw));
        matched.forEach((kw) => allKeywords.add(kw));

        const hasComplexity = ["o(", "complexity", "big-o", "time", "space", "memory"].some((c) => lower.includes(c));
        const hasTradeoffs = ["trade-off", "tradeoff", "pros", "cons", "scale", "bottleneck", "edge case"].some((t) => lower.includes(t));

        let baseTech = Math.min(40 + matched.length * 14 + (hasTradeoffs ? 15 : 0), 98);
        if (words < 12) baseTech = Math.max(baseTech - 35, 35);

        let baseComm = Math.min(50 + (words >= 30 ? 15 : 5) + (text.includes("\n") || text.includes("-") ? 15 : 5), 98);
        if (words < 10) baseComm = 40;

        let baseProb = Math.min(45 + (hasComplexity ? 20 : 5) + (hasTradeoffs ? 20 : 5), 96);

        const qScore = Math.round(0.5 * baseTech + 0.3 * baseComm + 0.2 * baseProb);
        totalTech += baseTech;
        totalComm += baseComm;
        totalProb += baseProb;

        let qFeedback = "Solid answer covering core fundamentals. State Big-O complexity and edge-case failure modes to reach Senior tier.";
        if (qScore >= 88) {
          qFeedback = `Outstanding technical articulation! Matched ${matched.length} key concepts (${matched.slice(0, 3).join(", ") || "core principles"}). Clear trade-off evaluation.`;
        } else if (qScore < 60) {
          qFeedback = "Answer was too brief. Elaborate on the algorithm, memory footprints, and practical code implementation details.";
        }

        detailed.push({
          question_id: item.question_id,
          question: item.question,
          score: qScore,
          feedback: qFeedback,
          identified_keywords: matched.slice(0, 5),
          suggested_answer_points: [
            "Clearly state assumptions and constraints upfront",
            "Explicitly state time and space complexity",
            "Detail production failure modes and caching strategies",
          ],
        });
      });

      const count = Math.max(answersPayload.length, 1);
      const avgTech = Math.round(totalTech / count);
      const avgComm = Math.round(totalComm / count);
      const avgProb = Math.round(totalProb / count);
      const finalScore = Math.round(0.5 * avgTech + 0.3 * avgComm + 0.2 * avgProb);

      const grade =
        finalScore >= 90
          ? "A+ (Strong Hire • Outstanding)"
          : finalScore >= 80
          ? "A (Hire • Strong Performance)"
          : finalScore >= 70
          ? "B+ (Leaning Hire • Good Fundamentals)"
          : "Needs Targeted Practice";

      evalData = {
        interview_id: Date.now(),
        score: finalScore,
        score_percentage: `${finalScore}%`,
        grade,
        technical_score: avgTech,
        communication_score: avgComm,
        problem_solving_score: avgProb,
        identified_keywords: Array.from(allKeywords),
        strengths: [
          `Solid grasp of ${role} engineering fundamentals.`,
          `Effectively incorporated ${allKeywords.size} core domain terms.`,
          `Demonstrated structured problem-solving alignment with ${company} standards.`,
        ],
        improvements: [
          "State Big-O time and space complexity in your initial thought process.",
          "Discuss potential failure modes and caching/indexing strategies.",
          "Highlight edge cases (null inputs, scale bottlenecks, race conditions).",
        ],
        detailed_feedback: detailed,
        overall_summary: `Candidate achieved an overall interview performance score of ${finalScore}% (${grade}) for ${company}'s ${role} position. Technical Depth: ${avgTech}%, Communication: ${avgComm}%, Problem Solving: ${avgProb}%.`,
      };
    }

    setEvaluationResult(evalData);
    setLoading(false);

    // Auto-refresh Dashboard metrics
    if (onInterviewCompleted) {
      onInterviewCompleted();
    }
  };

  // 3. SCHEDULE INTERVIEW HANDLER
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleDate) {
      setScheduleSuccess("Please select an interview date.");
      return;
    }

    setLoading(true);
    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];

    for (const base of candidateBases) {
      try {
        const url = base ? `${base}/api/interviews/schedule` : `/api/interviews/schedule`;
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            company,
            role,
            date: scheduleDate,
            time: scheduleTime,
            mode: scheduleMode,
          }),
        });
        break;
      } catch {
        // fallback
      }
    }

    setScheduleSuccess(`✓ Successfully scheduled ${company} (${role}) on ${scheduleDate} at ${scheduleTime}!`);
    setLoading(false);

    if (onInterviewCompleted) {
      onInterviewCompleted();
    }

    setTimeout(() => {
      setShowScheduleModal(false);
      setScheduleSuccess("");
    }, 2000);
  };

  return (
    <div className="mock-interview">
      <div className="mock-header">
        <h2>🎤 AI Mock Interview Room</h2>
        <span className="live-status">
          <FaCircle />
          AI Online
        </span>
      </div>

      <div className="mock-grid">
        {/* Company Selector */}
        <div className="mock-card">
          <h3>Company</h3>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {COMPANIES.map((c) => (
              <option key={c} value={c} style={{ background: "#1e293b", color: "#fff" }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Role Selector */}
        <div className="mock-card">
          <h3>Role</h3>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {ROLES.map((r) => (
              <option key={r} value={r} style={{ background: "#1e293b", color: "#fff" }}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selector */}
        <div className="mock-card">
          <h3>Difficulty</h3>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} style={{ background: "#1e293b", color: "#fff" }}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Card */}
        <div className="mock-card">
          <h3>Duration</h3>
          <p style={{ marginTop: "12px", fontWeight: "bold", fontSize: "16px", color: "#38bdf8" }}>
            45 Minutes
          </p>
        </div>
      </div>

      <div className="device-status">
        <div>
          <FaVideo /> Camera Ready
        </div>
        <div>
          <FaMicrophone /> Microphone Connected
        </div>
        <div>
          <FaLaptopCode /> Screen Sharing Available
        </div>
      </div>

      <div className="interview-actions">
        <button
          className="start-interview"
          onClick={handleStartInterview}
          disabled={loading}
          type="button"
        >
          {loading ? <FaSpinner className="fa-spin" /> : <FaPlayCircle />}
          {loading ? "Initializing AI Engine..." : "Start Interview"}
        </button>

        <button
          className="schedule-btn"
          onClick={() => setShowScheduleModal(true)}
          type="button"
        >
          <FaCalendarAlt style={{ marginRight: "6px" }} />
          Schedule Later
        </button>
      </div>

      {/* ================= INTERVIEW SESSION MODAL ================= */}
      {interviewActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(10, 15, 29, 0.92)",
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
              maxWidth: "850px",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
              padding: "28px",
              color: "#fff",
            }}
          >
            {!evaluationResult ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>
                  <div>
                    <span style={{ color: "#38bdf8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>
                      ✦ {company} • {role} ({difficulty})
                    </span>
                    <h2 style={{ margin: "4px 0 0", fontSize: "20px" }}>Live Technical AI Interview</h2>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(239,68,68,0.15)", color: "#f87171", padding: "6px 12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px" }}>
                      <FaClock />
                      <span>{formatTimer(timeLeft)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInterviewActive(false)}
                      style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {sessionQuestions.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    {/* Tabs for questions */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                      {sessionQuestions.map((q, idx) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setCurrentQIndex(idx);
                            setShowHint(false);
                          }}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "bold",
                            background: currentQIndex === idx ? "#2563eb" : "rgba(255,255,255,0.06)",
                            color: currentQIndex === idx ? "#fff" : "#94a3b8",
                          }}
                        >
                          Q{idx + 1}: {q.category || `Question ${idx + 1}`}
                        </button>
                      ))}
                    </div>

                    {/* Question Box */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <span style={{ color: "#38bdf8", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                          Question {currentQIndex + 1} of {sessionQuestions.length}
                        </span>

                        {sessionQuestions[currentQIndex]?.hint && (
                          <button
                            type="button"
                            onClick={() => setShowHint(!showHint)}
                            style={{
                              background: "rgba(234,179,8,0.15)",
                              border: "1px solid rgba(234,179,8,0.3)",
                              color: "#facc15",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FaLightbulb />
                            {showHint ? "Hide Hint" : "Need a Hint?"}
                          </button>
                        )}
                      </div>

                      <h3 style={{ fontSize: "17px", lineHeight: "1.5", margin: 0, color: "#f8fafc" }}>
                        {sessionQuestions[currentQIndex]?.question}
                      </h3>

                      {showHint && sessionQuestions[currentQIndex]?.hint && (
                        <div style={{ marginTop: "14px", padding: "12px", background: "rgba(234,179,8,0.08)", borderLeft: "3px solid #facc15", borderRadius: "4px", color: "#fef08a", fontSize: "13px" }}>
                          💡 <strong>Interviewer Hint:</strong> {sessionQuestions[currentQIndex].hint}
                        </div>
                      )}
                    </div>

                    {/* Answer Editor */}
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px", fontWeight: "bold" }}>
                        Your Technical Explanation & Code Snippets:
                      </label>
                      <textarea
                        rows={8}
                        value={answers[sessionQuestions[currentQIndex]?.id] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAnswers((prev) => ({
                            ...prev,
                            [sessionQuestions[currentQIndex].id]: val,
                          }));
                        }}
                        placeholder="Write your structured solution, architectural trade-offs, code snippets, and time/space complexity analysis..."
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "10px",
                          background: "#020617",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#f8fafc",
                          fontFamily: "monospace",
                          fontSize: "14px",
                          resize: "vertical",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentQIndex((prev) => Math.max(prev - 1, 0));
                          setShowHint(false);
                        }}
                        disabled={currentQIndex === 0}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.05)",
                          color: "#fff",
                          cursor: currentQIndex === 0 ? "not-allowed" : "pointer",
                          opacity: currentQIndex === 0 ? 0.5 : 1,
                        }}
                      >
                        ← Previous
                      </button>

                      {currentQIndex < sessionQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentQIndex((prev) => Math.min(prev + 1, sessionQuestions.length - 1));
                            setShowHint(false);
                          }}
                          style={{
                            padding: "10px 22px",
                            borderRadius: "8px",
                            background: "#2563eb",
                            border: "none",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Next Question →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmitInterview}
                          disabled={loading}
                          style={{
                            padding: "12px 28px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #22c55e, #16a34a)",
                            border: "none",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {loading ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                          {loading ? "Evaluating with AI Engine..." : "Submit & Generate Report"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ================= REPORT CARD ================= */
              <div>
                <div style={{ textAlign: "center", padding: "16px 0 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "inline-flex", padding: "12px", background: "rgba(34,197,94,0.15)", borderRadius: "50%", color: "#22c55e", fontSize: "36px", marginBottom: "10px" }}>
                    <FaAward />
                  </div>
                  <h2 style={{ fontSize: "22px", margin: "0 0 6px" }}>Interview Report & AI Feedback</h2>
                  <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                    {company} • {role} ({difficulty})
                  </p>
                </div>

                {/* Multi-factor Score Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", margin: "20px 0" }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Overall Score</span>
                    <h3 style={{ fontSize: "28px", color: "#22c55e", margin: "4px 0" }}>{evaluationResult.score_percentage}</h3>
                    <small style={{ color: "#cbd5e1", fontWeight: "bold" }}>{evaluationResult.grade}</small>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Technical Depth</span>
                    <h3 style={{ fontSize: "28px", color: "#38bdf8", margin: "4px 0" }}>{evaluationResult.technical_score || 88}%</h3>
                    <small style={{ color: "#cbd5e1" }}>Domain concepts</small>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Communication</span>
                    <h3 style={{ fontSize: "28px", color: "#a855f7", margin: "4px 0" }}>{evaluationResult.communication_score || 85}%</h3>
                    <small style={{ color: "#cbd5e1" }}>Clarity & Structure</small>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>XP Reward</span>
                    <h3 style={{ fontSize: "28px", color: "#f59e0b", margin: "4px 0" }}>+100 XP</h3>
                    <small style={{ color: "#cbd5e1" }}>Added to Profile</small>
                  </div>
                </div>

                {/* Identified Keywords */}
                {evaluationResult.identified_keywords && evaluationResult.identified_keywords.length > 0 && (
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "18px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "8px" }}>
                      ✦ TECHNICAL KEYWORDS DETECTED IN YOUR RESPONSES:
                    </span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {evaluationResult.identified_keywords.map((kw, idx) => (
                        <span key={idx} style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(56,189,248,0.15)", color: "#38bdf8", fontSize: "12px", fontWeight: "500", border: "1px solid rgba(56,189,248,0.3)" }}>
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                <div style={{ background: "rgba(59,130,246,0.08)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(59,130,246,0.2)", marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 6px", color: "#60a5fa" }}>AI Performance Evaluation</h4>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#e2e8f0" }}>
                    {evaluationResult.overall_summary}
                  </p>
                </div>

                {/* Per-Question Detailed Breakdown */}
                {evaluationResult.detailed_feedback && evaluationResult.detailed_feedback.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ color: "#38bdf8", margin: "0 0 12px", fontSize: "16px" }}>📝 Question-by-Question Detailed Analysis</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {evaluationResult.detailed_feedback.map((qf, idx) => (
                        <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#f8fafc" }}>
                              Question {idx + 1}: {qf.question}
                            </span>
                            <span style={{ padding: "4px 10px", borderRadius: "6px", background: qf.score >= 80 ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: qf.score >= 80 ? "#4ade80" : "#fbbf24", fontWeight: "bold", fontSize: "13px" }}>
                              {qf.score}%
                            </span>
                          </div>

                          <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
                            <strong>AI Feedback:</strong> {qf.feedback}
                          </p>

                          {qf.identified_keywords && qf.identified_keywords.length > 0 && (
                            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                              <strong>Matched Concepts:</strong> {qf.identified_keywords.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Improvements */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ background: "rgba(34,197,94,0.06)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <h4 style={{ color: "#22c55e", margin: "0 0 8px" }}>✓ Key Strengths</h4>
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1", fontSize: "13px", lineHeight: 1.5 }}>
                      {evaluationResult.strengths?.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: "4px" }}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "rgba(245,158,11,0.06)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <h4 style={{ color: "#f59e0b", margin: "0 0 8px" }}>⚠ Suggested Improvements</h4>
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1", fontSize: "13px", lineHeight: 1.5 }}>
                      {evaluationResult.improvements?.map((imp, idx) => (
                        <li key={idx} style={{ marginBottom: "4px" }}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewActive(false);
                      setEvaluationResult(null);
                    }}
                    style={{
                      padding: "12px 36px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                  >
                    Done & Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SCHEDULE MODAL ================= */}
      {showScheduleModal && (
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
              padding: "28px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>📅 Schedule Mock Interview</h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            {scheduleSuccess ? (
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22c55e", color: "#4ade80", padding: "16px", borderRadius: "8px", textAlign: "center", fontSize: "14px" }}>
                {scheduleSuccess}
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Company & Role</label>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px 14px", borderRadius: "8px", color: "#38bdf8", fontWeight: "bold" }}>
                    {company} • {role}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Interview Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Time Slot</label>
                    <select
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        outline: "none",
                      }}
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Interview Mode</label>
                    <select
                      value={scheduleMode}
                      onChange={(e) => setScheduleMode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        outline: "none",
                      }}
                    >
                      <option value="Virtual">Virtual Video</option>
                      <option value="Online Coding">Online Coding</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#2563eb",
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
                  {loading ? <FaSpinner className="fa-spin" /> : <FaCalendarAlt />}
                  {loading ? "Scheduling..." : "Confirm Schedule"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MockInterview;