import { useState, useEffect, useRef, useCallback } from "react";
import "./Dashboard.css";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaLaptopCode,
  FaDesktop,
  FaPlayCircle,
  FaCircle,
  FaClock,
  FaLightbulb,
  FaCheckCircle,
  FaCalendarAlt,
  FaAward,
  FaTimes,
  FaSpinner,
  FaFilePdf,
  FaDownload,
  FaRobot,
  FaSlidersH,
  FaExpand,
  FaCompress,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSyncAlt,
  FaTv,
  FaCode,
  FaFileAlt,
  FaTrashAlt,
  FaBolt,
  FaLock,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import { generateInterviewPDF } from "../../utils/pdfGenerator";
import { evaluateInterview } from "../../utils/evaluator";
import { getToken, recordLocalInterviewSession, recordLocalScheduledInterview } from "../../api";
import aiBotImage from "../../assets/ai_bot.jpg";

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

// Resilient Video Stream Player Component
function VideoPlayer({ stream, mirrored = false, style = {}, className = "" }) {
  const vRef = useRef(null);

  useEffect(() => {
    const el = vRef.current;
    if (!el) return;
    if (stream) {
      if (el.srcObject !== stream) {
        el.srcObject = stream;
      }
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [stream]);

  return (
    <video
      ref={vRef}
      autoPlay
      playsInline
      muted
      className={className}
      style={{
        width: "100%",
        height: "100%",
        objectFit: mirrored ? "cover" : "contain",
        transform: mirrored ? "scaleX(-1)" : "none",
        ...style,
      }}
    />
  );
}

function MockInterview({ onInterviewCompleted }) {
  const { user } = useAuth();
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Live session modal states
  const [interviewActive, setInterviewActive] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Independent Media Stream States
  const [cameraStatus, setCameraStatus] = useState("idle"); // idle | requesting | granted | denied
  const [micStatus, setMicStatus] = useState("idle");
  const [screenStatus, setScreenStatus] = useState("idle");
  const [cameraStream, setCameraStream] = useState(null);
  const [micStream, setMicStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [cameraMirrored, setCameraMirrored] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isDictating, setIsDictating] = useState(false);
  const [showPreFlightModal, setShowPreFlightModal] = useState(false);
  const [showScreenExpanded, setShowScreenExpanded] = useState(false);
  const [aiSpeechState, setAiSpeechState] = useState("observing"); // observing | analyzing | listening

  // AI Key & Settings
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("intervista_gemini_api_key") || "");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  // Scheduling modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00 AM");
  const [scheduleMode, setScheduleMode] = useState("Virtual");
  const [scheduleSuccess, setScheduleSuccess] = useState("");

  // Audio Context Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- AUDIO ANALYSER SETUP ---
  const setupAudioAnalyser = useCallback((stream) => {
    try {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(Math.round((avg / 128) * 100), 100);
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn("Audio analyser initialization error:", e);
    }
  }, []);

  // --- INDEPENDENT STREAM REQUEST HANDLERS (RESILIENT & NON-BLOCKING) ---
  const requestCamera = async () => {
    if (cameraStream) {
      // Toggle off / release camera stream
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraStatus("idle");
      setIsCameraActive(false);
      return null;
    }

    try {
      setCameraStatus("requesting");
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        // Fallback to generic video constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      setCameraStream(stream);
      setCameraStatus("granted");
      setIsCameraActive(true);
      return stream;
    } catch (err) {
      console.warn("Camera access warning:", err);
      setCameraStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      return null;
    }
  };

  const requestMicrophone = async () => {
    if (micStream) {
      // Toggle off / release mic stream
      micStream.getTracks().forEach((t) => t.stop());
      setMicStream(null);
      setMicStatus("idle");
      setIsMicActive(false);
      setAudioLevel(0);
      return null;
    }

    try {
      setMicStatus("requesting");
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      }
      setMicStream(stream);
      setMicStatus("granted");
      setIsMicActive(true);
      setupAudioAnalyser(stream);
      return stream;
    } catch (err) {
      console.warn("Microphone access warning:", err);
      setMicStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      return null;
    }
  };

  const requestScreenShare = async () => {
    if (screenStream) {
      // Stop sharing
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setScreenStatus("idle");
      return null;
    }

    try {
      setScreenStatus("requesting");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });
      setScreenStream(stream);
      setScreenStatus("granted");

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          setScreenStream(null);
          setScreenStatus("idle");
        };
      }
      return stream;
    } catch (err) {
      console.warn("Screen share cancelled or error:", err);
      // If user simply closed or cancelled the picker dialog, reset to idle
      if (err.name === "NotAllowedError" || err.name === "AbortError") {
        setScreenStatus("idle");
      } else {
        setScreenStatus("denied");
      }
      return null;
    }
  };

  // Connect both Camera & Mic in ONE single browser permission dialog
  const requestCombinedCamAndMic = async () => {
    try {
      setCameraStatus("requesting");
      setMicStatus("requesting");
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }

      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      if (videoTracks.length > 0) {
        const vStream = new MediaStream(videoTracks);
        setCameraStream(vStream);
        setCameraStatus("granted");
        setIsCameraActive(true);
      }

      if (audioTracks.length > 0) {
        const aStream = new MediaStream(audioTracks);
        setMicStream(aStream);
        setMicStatus("granted");
        setIsMicActive(true);
        setupAudioAnalyser(aStream);
      }

      return stream;
    } catch (err) {
      console.warn("Combined Cam/Mic warning:", err);
      if (!cameraStream) setCameraStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      if (!micStream) setMicStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      return null;
    }
  };

  // Toggle Camera Track Mute
  const toggleCamera = () => {
    if (cameraStream) {
      const tracks = cameraStream.getVideoTracks();
      tracks.forEach((t) => (t.enabled = !isCameraActive));
      setIsCameraActive(!isCameraActive);
    }
  };

  // Toggle Mic Track Mute
  const toggleMic = () => {
    if (micStream) {
      const tracks = micStream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = !isMicActive));
      setIsMicActive(!isMicActive);
    }
  };

  // Cleanup All Media Streams on Unmount or Session End
  const stopAllStreams = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraStatus("idle");
    }
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      setMicStream(null);
      setMicStatus("idle");
    }
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setScreenStatus("idle");
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsDictating(false);
    }
    setAudioLevel(0);
  }, [cameraStream, micStream, screenStream]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllStreams();
    };
  }, [stopAllStreams]);

  // --- SPEECH RECOGNITION (VOICE-TO-TEXT) ---
  const toggleVoiceDictation = () => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Speech-to-Text is not supported by your browser. Please type your answer.");
      return;
    }

    if (isDictating) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsDictating(true);
        setAiSpeechState("listening");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const currentQId = sessionQuestions[currentQIndex]?.id;
        if (currentQId) {
          setAnswers((prev) => {
            const existing = prev[currentQId] || "";
            return {
              ...prev,
              [currentQId]: existing ? `${existing} ${transcript}` : transcript,
            };
          });
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsDictating(false);
        setAiSpeechState("observing");
      };

      recognition.onend = () => {
        setIsDictating(false);
        setAiSpeechState("observing");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech recognition startup error:", e);
      setIsDictating(false);
    }
  };

  // Helper to insert structured solution scaffolding
  const handleInsertTemplate = () => {
    const currentQId = sessionQuestions[currentQIndex]?.id;
    if (!currentQId) return;
    const template = `// 1. High-Level Architectural Approach:
// - Design patterns, algorithmic intuition, and state model.

// 2. Code Implementation:
function solution() {
  // Your code logic here
}

// 3. Time & Space Complexity Analysis:
// - Time Complexity: O(...)
// - Space Complexity: O(...)

// 4. Edge Cases & Concurrency Trade-offs:
// - Boundary conditions, null checks, and caching considerations.
`;
    setAnswers((prev) => ({
      ...prev,
      [currentQId]: prev[currentQId] ? `${prev[currentQId]}\n\n${template}` : template,
    }));
  };

  // Helper to clear current response
  const handleClearAnswer = () => {
    const currentQId = sessionQuestions[currentQIndex]?.id;
    if (!currentQId) return;
    if (window.confirm("Are you sure you want to clear your current solution?")) {
      setAnswers((prev) => ({
        ...prev,
        [currentQId]: "",
      }));
    }
  };

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

  const handleDownloadPDF = () => {
    if (!evaluationResult) return;
    setDownloadingPdf(true);
    try {
      const payload = {
        ...evaluationResult,
        company,
        role,
        difficulty,
        duration_minutes: evaluationResult.duration_minutes || 45,
        date: evaluationResult.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      };
      generateInterviewPDF(payload, user?.name || "Interview Candidate");
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // --- PARAMETERS VALIDATION & TELEMETRY ---
  const isCameraReady = cameraStatus === "granted" && !!cameraStream;
  const isMicReady = micStatus === "granted" && !!micStream;
  const isScreenReady = screenStatus === "granted" && !!screenStream;
  const allParametersReady = isCameraReady && isMicReady && isScreenReady;
  const anyParameterReady = isCameraReady || isMicReady || isScreenReady;
  const readyCount = (isCameraReady ? 1 : 0) + (isMicReady ? 1 : 0) + (isScreenReady ? 1 : 0);

  const handleInitiateInterview = () => {
    if (!anyParameterReady) {
      setShowPreFlightModal(true);
    } else {
      startLiveInterviewSession();
    }
  };

  useEffect(() => {
    const handleQuickStart = () => {
      if (!interviewActive) {
        const el = document.getElementById("mock-interview");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!anyParameterReady) {
          setShowPreFlightModal(true);
        } else {
          startLiveInterviewSession();
        }
      }
    };

    const handleQuickVoice = () => {
      if (!interviewActive) {
        const el = document.getElementById("mock-interview");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!isMicReady) {
          requestMicrophone();
        }
      }
    };

    window.addEventListener("intervista_start_interview", handleQuickStart);
    window.addEventListener("intervista_voice_practice", handleQuickVoice);
    return () => {
      window.removeEventListener("intervista_start_interview", handleQuickStart);
      window.removeEventListener("intervista_voice_practice", handleQuickVoice);
    };
  }, [interviewActive, anyParameterReady, isMicReady]);

  // 1. START INTERVIEW HANDLER
  const startLiveInterviewSession = async () => {
    setShowPreFlightModal(false);
    setLoading(true);
    setEvaluationResult(null);
    setCurrentQIndex(0);
    setShowHint(false);
    setTimeLeft(45 * 60);
    setSessionStartTime(Date.now());
    setAiSpeechState("observing");

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
        // continue
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
    setSessionStartTime(Date.now());
    setLoading(false);
  };

  // 2. SUBMIT INTERVIEW HANDLER
  const handleSubmitInterview = async () => {
    setLoading(true);
    setAiSpeechState("analyzing");

    const elapsedSeconds = sessionStartTime
      ? Math.max(Math.floor((Date.now() - sessionStartTime) / 1000), 1)
      : Math.max(45 * 60 - timeLeft, 1);
    const activeMinutes = Math.max(Math.round(elapsedSeconds / 60), 1);

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
            duration_minutes: activeMinutes,
            answers: answersPayload,
          }),
        });

        if (res.ok) {
          evalData = await res.json();
          break;
        }
      } catch {
        // fallback
      }
    }

    if (!evalData) {
      evalData = await evaluateInterview(company, role, difficulty, answersPayload, apiKey);
    }

    recordLocalInterviewSession({
      id: evalData.interview_id || Date.now(),
      company,
      role,
      difficulty,
      score: evalData.score || evalData.score_percentage,
      score_num: evalData.score,
      duration_minutes: activeMinutes,
      status: "Completed",
      feedback: evalData.overall_summary,
      technical_score: evalData.technical_score,
      communication_score: evalData.communication_score,
      problem_solving_score: evalData.problem_solving_score,
      grade: evalData.grade,
      strengths: evalData.strengths,
      improvements: evalData.improvements,
      detailed_feedback: evalData.detailed_feedback,
      identified_keywords: evalData.identified_keywords,
    });

    setEvaluationResult(evalData);
    setLoading(false);
    setAiSpeechState("observing");

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

    recordLocalScheduledInterview({
      company,
      role,
      date: scheduleDate,
      time: scheduleTime,
      mode: scheduleMode,
    });

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

  const handleCloseSession = () => {
    if (window.confirm("Are you sure you want to end this interview session? Your progress will be saved.")) {
      setInterviewActive(false);
      setEvaluationResult(null);
      stopAllStreams();
    }
  };

  // Current answer stats
  const currentAnswerText = answers[sessionQuestions[currentQIndex]?.id] || "";
  const wordCount = currentAnswerText.trim() ? currentAnswerText.trim().split(/\s+/).length : 0;
  const charCount = currentAnswerText.length;

  return (
    <div className="mock-interview">
      {/* Header */}
      <div className="mock-header">
        <div>
          <h2>🎤 AI Mock Interview Cockpit</h2>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "13px" }}>
            Proctored AI technical interview with compulsory Camera, Microphone, Screen Sharing & real-time evaluation.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setKeyInput(apiKey);
              setShowApiKeyModal(true);
            }}
            title="Configure AI Model & API Key"
            className="ai-model-toggle-btn"
          >
            <FaRobot />
            {apiKey ? "Gemini LLM (Active)" : "AI Engine: Neural Rubric"}
            <FaSlidersH style={{ fontSize: "10px", marginLeft: "2px" }} />
          </button>

          <span className="live-status">
            <FaCircle className="pulse-dot" />
            AI Proctor Online
          </span>
        </div>
      </div>

      {/* Target Role & Configuration Grid */}
      <div className="mock-grid">
        <div className="mock-card">
          <h3>Target Company</h3>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mock-select"
          >
            {COMPANIES.map((c) => (
              <option key={c} value={c} style={{ background: "#1e293b", color: "#fff" }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mock-card">
          <h3>Domain Role</h3>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mock-select"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} style={{ background: "#1e293b", color: "#fff" }}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="mock-card">
          <h3>Difficulty</h3>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mock-select"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} style={{ background: "#1e293b", color: "#fff" }}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="mock-card">
          <h3>Session Length</h3>
          <p style={{ marginTop: "12px", fontWeight: "bold", fontSize: "16px", color: "#38bdf8" }}>
            45 Minutes Live
          </p>
        </div>
      </div>

      {/* ================= COMPULSORY PARAMETERS SECTION ================= */}
      <div className="interview-parameters-section">
        <div className="parameters-header">
          <div className="parameters-title">
            <FaShieldAlt style={{ color: "#38bdf8", fontSize: "20px" }} />
            <div>
              <h4>Interview Device & Proctor Parameters</h4>
              <span>
                {allParametersReady
                  ? "✓ All 3 parameters (Camera, Mic & Screen) are active and verified!"
                  : isCameraReady || isMicReady
                  ? `✓ ${readyCount}/3 Parameters Active — You are ready to start or select your screen.`
                  : "Enable your Camera, Microphone, or Screen Share to begin."}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="verify-all-devices-btn"
            onClick={requestCombinedCamAndMic}
            title="Enable Camera and Microphone in a single browser prompt"
          >
            <FaBolt style={{ color: "#facc15" }} /> ⚡ Quick Allow (Camera + Mic)
          </button>
        </div>

        <div className="device-cards-grid">
          {/* CAMERA PARAMETER CARD */}
          <div className={`device-parameter-card ${isCameraReady ? "granted" : cameraStatus === "denied" ? "denied" : ""}`}>
            <div className="device-param-top">
              <div className="device-param-icon camera">
                <FaVideo />
              </div>
              <div className="device-param-info">
                <h5>1. Camera (Webcam) <span className="req-tag">Video Feed</span></h5>
                <p>Live candidate video telemetry</p>
              </div>
            </div>

            <div className="device-param-status-row">
              {isCameraReady ? (
                <span className="badge-granted">
                  <FaCheckCircle /> Camera Active
                </span>
              ) : cameraStatus === "denied" ? (
                <span className="badge-denied">
                  <FaExclamationTriangle /> Permission Blocked
                </span>
              ) : (
                <span className="badge-required">
                  <FaCircle style={{ fontSize: "7px", color: "#f87171" }} /> Click to Enable
                </span>
              )}

              <button
                type="button"
                className={`device-action-btn ${isCameraReady ? "active" : ""}`}
                onClick={requestCamera}
                disabled={cameraStatus === "requesting"}
              >
                {isCameraReady ? "Turn Off" : cameraStatus === "requesting" ? "Connecting..." : "Turn On Camera"}
              </button>
            </div>
          </div>

          {/* MICROPHONE PARAMETER CARD */}
          <div className={`device-parameter-card ${isMicReady ? "granted" : micStatus === "denied" ? "denied" : ""}`}>
            <div className="device-param-top">
              <div className="device-param-icon mic">
                <FaMicrophone />
              </div>
              <div className="device-param-info">
                <h5>2. Microphone <span className="req-tag">Audio Feed</span></h5>
                <p>Voice capture & live speech dictation</p>
              </div>
            </div>

            <div className="device-param-status-row">
              {isMicReady ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="badge-granted">
                    <FaCheckCircle /> Mic Active
                  </span>
                  <div className="mini-audio-meter" title={`Audio Level: ${audioLevel}%`}>
                    <span style={{ height: `${Math.max(audioLevel * 0.8, 15)}%` }}></span>
                    <span style={{ height: `${Math.max(audioLevel * 1.0, 30)}%` }}></span>
                    <span style={{ height: `${Math.max(audioLevel * 0.6, 20)}%` }}></span>
                  </div>
                </div>
              ) : micStatus === "denied" ? (
                <span className="badge-denied">
                  <FaExclamationTriangle /> Permission Blocked
                </span>
              ) : (
                <span className="badge-required">
                  <FaCircle style={{ fontSize: "7px", color: "#f87171" }} /> Click to Enable
                </span>
              )}

              <button
                type="button"
                className={`device-action-btn ${isMicReady ? "active" : ""}`}
                onClick={requestMicrophone}
                disabled={micStatus === "requesting"}
              >
                {isMicReady ? "Turn Off" : micStatus === "requesting" ? "Connecting..." : "Turn On Mic"}
              </button>
            </div>
          </div>

          {/* SCREEN SHARING PARAMETER CARD */}
          <div className={`device-parameter-card ${isScreenReady ? "granted" : screenStatus === "denied" ? "denied" : ""}`}>
            <div className="device-param-top">
              <div className="device-param-icon screen">
                <FaDesktop />
              </div>
              <div className="device-param-info">
                <h5>3. Screen Share <span className="req-tag">Coding Stream</span></h5>
                <p>Live coding window / desktop stream</p>
              </div>
            </div>

            <div className="device-param-status-row">
              {isScreenReady ? (
                <span className="badge-granted">
                  <FaCheckCircle /> Screen Active
                </span>
              ) : screenStatus === "denied" ? (
                <span className="badge-denied">
                  <FaExclamationTriangle /> Permission Blocked
                </span>
              ) : (
                <span className="badge-required">
                  <FaCircle style={{ fontSize: "7px", color: "#f87171" }} /> Click to Select
                </span>
              )}

              <button
                type="button"
                className={`device-action-btn ${isScreenReady ? "active" : ""}`}
                onClick={requestScreenShare}
                disabled={screenStatus === "requesting"}
              >
                {isScreenReady ? "Stop Sharing" : screenStatus === "requesting" ? "Selecting..." : "Select Screen"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="interview-actions">
        <button
          className="start-interview"
          onClick={handleInitiateInterview}
          disabled={loading}
          type="button"
        >
          {loading ? <FaSpinner className="fa-spin" /> : <FaPlayCircle />}
          {loading
            ? "Initializing AI Cockpit..."
            : allParametersReady
            ? "Start Interview Room (All Verified)"
            : isCameraReady || isMicReady
            ? "Start Interview Room"
            : `Set Up Devices & Start (${readyCount}/3 Active)`}
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

      {/* ================= PRE-FLIGHT COMPULSORY VERIFICATION MODAL ================= */}
      {showPreFlightModal && (
        <div className="interview-modal-backdrop">
          <div className="preflight-modal-box">
            <div className="preflight-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaShieldAlt style={{ color: "#38bdf8", fontSize: "24px" }} />
                <div>
                  <h3>Device Setup & Telemetry Check</h3>
                  <p>Enable your Camera and Microphone for the best AI interview proctoring experience.</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPreFlightModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Quick 1-click button */}
            <div style={{ marginBottom: "18px", textAlign: "center" }}>
              <button
                type="button"
                className="one-click-setup-btn"
                onClick={requestCombinedCamAndMic}
              >
                <FaBolt /> ⚡ Quick Allow Camera & Microphone (1 Prompt)
              </button>
            </div>

            <div className="preflight-grid">
              {/* 1. Camera Box */}
              <div className={`preflight-device-block ${isCameraReady ? "ready" : ""}`}>
                <div className="device-block-header">
                  <span><FaVideo /> 1. Webcam Camera</span>
                  {isCameraReady ? (
                    <span className="status-tag granted">✓ Active</span>
                  ) : (
                    <span className="status-tag required">Required</span>
                  )}
                </div>

                <div className="preflight-preview-video-container">
                  {cameraStream ? (
                    <VideoPlayer stream={cameraStream} mirrored={cameraMirrored} />
                  ) : (
                    <div className="preview-placeholder">
                      <FaVideoSlash style={{ fontSize: "28px", color: "#64748b" }} />
                      <p>Camera feed is inactive.</p>
                    </div>
                  )}
                </div>

                <div className="device-block-footer">
                  <button
                    type="button"
                    className={`preflight-btn ${isCameraReady ? "active-btn" : ""}`}
                    onClick={requestCamera}
                  >
                    {isCameraReady ? "✓ Camera Connected" : "Grant Camera Access"}
                  </button>
                </div>
              </div>

              {/* 2. Microphone Box */}
              <div className={`preflight-device-block ${isMicReady ? "ready" : ""}`}>
                <div className="device-block-header">
                  <span><FaMicrophone /> 2. Microphone Audio</span>
                  {isMicReady ? (
                    <span className="status-tag granted">✓ Active</span>
                  ) : (
                    <span className="status-tag required">Required</span>
                  )}
                </div>

                <div className="preflight-preview-mic-container">
                  {micStream ? (
                    <div className="mic-active-tester">
                      <FaMicrophone style={{ fontSize: "28px", color: "#22c55e", marginBottom: "8px" }} />
                      <p>Microphone is active! Speak to test volume:</p>
                      <div className="audio-live-bars">
                        {[...Array(12)].map((_, idx) => {
                          const threshold = (idx + 1) * 8;
                          const isActive = audioLevel >= threshold;
                          return (
                            <span
                              key={idx}
                              style={{
                                height: `${Math.max((idx + 1) * 7, 10)}%`,
                                background: isActive
                                  ? idx > 9
                                    ? "#ef4444"
                                    : idx > 6
                                    ? "#f59e0b"
                                    : "#22c55e"
                                  : "rgba(255,255,255,0.1)",
                              }}
                            />
                          );
                        })}
                      </div>
                      <small style={{ color: "#38bdf8", fontWeight: "bold", marginTop: "6px" }}>
                        Voice Level: {audioLevel}%
                      </small>
                    </div>
                  ) : (
                    <div className="preview-placeholder">
                      <FaMicrophoneSlash style={{ fontSize: "28px", color: "#64748b" }} />
                      <p>Microphone is inactive.</p>
                    </div>
                  )}
                </div>

                <div className="device-block-footer">
                  <button
                    type="button"
                    className={`preflight-btn ${isMicReady ? "active-btn" : ""}`}
                    onClick={requestMicrophone}
                  >
                    {isMicReady ? "✓ Microphone Connected" : "Grant Microphone Access"}
                  </button>
                </div>
              </div>

              {/* 3. Screen Sharing Box */}
              <div className={`preflight-device-block ${isScreenReady ? "ready" : ""}`}>
                <div className="device-block-header">
                  <span><FaDesktop /> 3. Screen Share</span>
                  {isScreenReady ? (
                    <span className="status-tag granted">✓ Active</span>
                  ) : (
                    <span className="status-tag required">Required</span>
                  )}
                </div>

                <div className="preflight-preview-screen-container">
                  {screenStream ? (
                    <VideoPlayer stream={screenStream} mirrored={false} style={{ background: "#000" }} />
                  ) : (
                    <div className="preview-placeholder">
                      <FaDesktop style={{ fontSize: "28px", color: "#64748b" }} />
                      <p>Select your coding window/screen.</p>
                    </div>
                  )}
                </div>

                <div className="device-block-footer">
                  <button
                    type="button"
                    className={`preflight-btn ${isScreenReady ? "active-btn" : ""}`}
                    onClick={requestScreenShare}
                  >
                    {isScreenReady ? "✓ Screen Share Active" : "Select Screen / Window"}
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="preflight-actions">
              <button
                type="button"
                className={`preflight-launch-btn ${!anyParameterReady ? "disabled-lock" : "ready-glow"}`}
                onClick={startLiveInterviewSession}
              >
                <FaPlayCircle />
                {allParametersReady
                  ? "🚀 Launch AI Interview Room (All 3 Parameters Ready)"
                  : anyParameterReady
                  ? `🚀 Launch AI Interview Room (${readyCount}/3 Parameters Configured)`
                  : "🚀 Launch AI Interview Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN SCREEN SHARING MODAL ================= */}
      {showScreenExpanded && screenStream && (
        <div className="screen-expanded-backdrop" onClick={() => setShowScreenExpanded(false)}>
          <div className="screen-expanded-container" onClick={(e) => e.stopPropagation()}>
            <div className="screen-expanded-header">
              <span><FaDesktop /> Live Screen Stream (Candidate View)</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowScreenExpanded(false)}
              >
                <FaCompress />
              </button>
            </div>
            <div className="screen-expanded-video-wrap">
              <VideoPlayer stream={screenStream} mirrored={false} style={{ background: "#000" }} />
            </div>
          </div>
        </div>
      )}

      {/* ================= LIVE INTERVIEW COCKPIT SESSION MODAL ================= */}
      {interviewActive && (
        <div className="interview-live-cockpit-overlay">
          {/* Subtle dark ambient backdrop */}
          <div
            className="interview-ai-backdrop"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.94), rgba(15, 23, 42, 0.98)), url(${aiBotImage})`,
            }}
          />

          <div className="cockpit-container">
            {!evaluationResult ? (
              <>
                {/* COCKPIT TOP HEADER */}
                <div className="cockpit-top-bar">
                  <div className="cockpit-brand">
                    <span className="cockpit-role-badge">
                      ✦ {company} • {role} ({difficulty})
                    </span>
                    <h3 className="cockpit-title">AI Technical Interview</h3>
                  </div>

                  <div className="cockpit-telemetry-cluster">
                    {/* Camera indicator */}
                    <div className={`telemetry-pill ${isCameraReady && isCameraActive ? "active" : "inactive"}`}>
                      <FaVideo />
                      <span>{isCameraReady && isCameraActive ? "Camera" : "Cam Off"}</span>
                    </div>

                    {/* Mic indicator */}
                    <div className={`telemetry-pill ${isMicReady && isMicActive ? "active" : "inactive"}`}>
                      <FaMicrophone />
                      <span>{isMicReady && isMicActive ? "Mic" : "Mic Off"}</span>
                      {isMicReady && isMicActive && (
                        <div className="pill-audio-wave">
                          <span style={{ height: `${Math.max(audioLevel * 0.6, 20)}%` }} />
                          <span style={{ height: `${Math.max(audioLevel * 0.9, 40)}%` }} />
                          <span style={{ height: `${Math.max(audioLevel * 0.5, 25)}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Screen share indicator */}
                    <div className={`telemetry-pill ${isScreenReady ? "active" : "inactive"}`}>
                      <FaDesktop />
                      <span>{isScreenReady ? "Screen" : "No Screen"}</span>
                    </div>

                    {/* Timer */}
                    <div className="cockpit-timer">
                      <FaClock />
                      <span>{formatTimer(timeLeft)}</span>
                    </div>

                    {/* End session */}
                    <button
                      type="button"
                      onClick={handleCloseSession}
                      className="cockpit-exit-btn"
                      title="End Interview Session"
                    >
                      <FaTimes />
                      <span>End</span>
                    </button>
                  </div>
                </div>

                {/* COCKPIT MAIN GRID */}
                <div className="cockpit-main-grid">
                  {/* LEFT SIDEBAR: AI EXAMINER & PROCTOR FEEDS */}
                  <div className="cockpit-left-pane">
                    {/* 1. COMPACT AI INTERVIEWER CARD */}
                    <div className="ai-examiner-compact-card">
                      <div className="ai-examiner-top">
                        <div className="ai-avatar-thumb">
                          <img src={aiBotImage} alt="AI Examiner" />
                          <span className="ai-status-dot" />
                        </div>
                        <div className="ai-examiner-meta">
                          <div className="ai-name-row">
                            <strong>Unit-7 AI Examiner</strong>
                            <span className="ai-badge-live">
                              {aiSpeechState === "listening" ? "Listening" : aiSpeechState === "analyzing" ? "Analyzing" : "Online"}
                            </span>
                          </div>
                          {/* Speech wave */}
                          <div className="ai-voice-wave-container">
                            <div className="voice-wave-bar bar-1"></div>
                            <div className="voice-wave-bar bar-2"></div>
                            <div className="voice-wave-bar bar-3"></div>
                            <div className="voice-wave-bar bar-4"></div>
                            <div className="voice-wave-bar bar-5"></div>
                          </div>
                        </div>
                      </div>

                      <p className="ai-speech-bubble">
                        {aiSpeechState === "listening"
                          ? "🎙️ Transcribing speech in real-time... Speak clearly."
                          : aiSpeechState === "analyzing"
                          ? "⚙️ Synthesizing keywords & Big-O complexity..."
                          : "💬 'Provide a structured solution covering architecture, code, and complexity.'"}
                      </p>
                    </div>

                    {/* 2. CANDIDATE WEBCAM VIDEO (PROCTOR) */}
                    <div className="cockpit-feed-card">
                      <div className="feed-card-header">
                        <span>
                          <FaCircle style={{ color: "#ef4444", fontSize: "7px" }} className="pulse-dot" />
                          Candidate Feed
                        </span>
                        <div className="feed-card-actions">
                          <button
                            type="button"
                            onClick={() => setCameraMirrored(!cameraMirrored)}
                            title="Flip Video"
                            className="feed-card-btn"
                          >
                            <FaSyncAlt />
                          </button>
                          <button
                            type="button"
                            onClick={toggleCamera}
                            title={isCameraActive ? "Mute Camera" : "Unmute Camera"}
                            className={`feed-card-btn ${!isCameraActive ? "muted" : ""}`}
                          >
                            {isCameraActive ? <FaVideo /> : <FaVideoSlash />}
                          </button>
                          <button
                            type="button"
                            onClick={toggleMic}
                            title={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
                            className={`feed-card-btn ${!isMicActive ? "muted" : ""}`}
                          >
                            {isMicActive ? <FaMicrophone /> : <FaMicrophoneSlash />}
                          </button>
                        </div>
                      </div>

                      <div className="feed-media-wrap">
                        {cameraStream && isCameraActive ? (
                          <VideoPlayer stream={cameraStream} mirrored={cameraMirrored} />
                        ) : (
                          <div className="feed-off-placeholder">
                            <FaVideoSlash style={{ fontSize: "20px", color: "#64748b" }} />
                            <span>Camera feed paused</span>
                          </div>
                        )}
                        <span className="live-rec-badge">● PROCTOR ACTIVE</span>
                      </div>

                      {/* Integrated Audio Bar */}
                      <div className="candidate-audio-indicator-bar">
                        <div className="audio-vol-meter-bg">
                          <div
                            className="audio-vol-meter-fill"
                            style={{ width: `${Math.max(audioLevel, 5)}%` }}
                          />
                        </div>
                        <span>Mic: {audioLevel}%</span>
                      </div>
                    </div>

                    {/* 3. SCREEN SHARE FEED */}
                    <div className="cockpit-feed-card">
                      <div className="feed-card-header">
                        <span><FaDesktop /> Screen Share</span>
                        <div className="feed-card-actions">
                          {screenStream && (
                            <button
                              type="button"
                              onClick={() => setShowScreenExpanded(true)}
                              title="Expand Fullscreen"
                              className="feed-card-btn"
                            >
                              <FaExpand />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={requestScreenShare}
                            title="Switch Screen"
                            className="feed-card-btn"
                          >
                            <FaTv />
                          </button>
                        </div>
                      </div>

                      <div
                        className="feed-media-wrap"
                        onClick={() => screenStream && setShowScreenExpanded(true)}
                        style={{ cursor: screenStream ? "pointer" : "default" }}
                      >
                        {screenStream ? (
                          <>
                            <VideoPlayer stream={screenStream} mirrored={false} style={{ background: "#000" }} />
                            <div className="screen-click-expand-hint">
                              <FaExpand /> Click to expand
                            </div>
                          </>
                        ) : (
                          <div className="feed-off-placeholder">
                            <FaLaptopCode style={{ fontSize: "20px", color: "#64748b" }} />
                            <button
                              type="button"
                              onClick={requestScreenShare}
                              className="start-screenshare-inline-btn"
                            >
                              Select Screen / Window
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT WORKSPACE: QUESTIONS & CODE EDITOR */}
                  <div className="cockpit-right-pane">
                    {sessionQuestions.length > 0 && (
                      <div className="interview-workspace">
                        {/* Question Selector Tabs */}
                        <div className="question-tabs-row">
                          {sessionQuestions.map((q, idx) => {
                            const isAnswered = !!answers[q.id]?.trim();
                            return (
                              <button
                                key={q.id}
                                type="button"
                                onClick={() => {
                                  setCurrentQIndex(idx);
                                  setShowHint(false);
                                }}
                                className={`question-tab-btn ${currentQIndex === idx ? "active" : ""}`}
                              >
                                {isAnswered && <span className="tab-answered-dot">✓</span>}
                                Question {idx + 1}: {q.category || `Part ${idx + 1}`}
                              </button>
                            );
                          })}
                        </div>

                        {/* Question Prompt Card */}
                        <div className="cockpit-question-box">
                          <div className="question-box-header">
                            <span className="q-badge">
                              ✦ Question {currentQIndex + 1} of {sessionQuestions.length} • {sessionQuestions[currentQIndex]?.category}
                            </span>

                            {sessionQuestions[currentQIndex]?.hint && (
                              <button
                                type="button"
                                onClick={() => setShowHint(!showHint)}
                                className="hint-toggle-btn"
                              >
                                <FaLightbulb />
                                {showHint ? "Hide Guidance" : "💡 View Guidance"}
                              </button>
                            )}
                          </div>

                          <h3 className="question-prompt-text">
                            {sessionQuestions[currentQIndex]?.question}
                          </h3>

                          {showHint && sessionQuestions[currentQIndex]?.hint && (
                            <div className="hint-revealed-box">
                              💡 <strong>Interviewer Guidance:</strong> {sessionQuestions[currentQIndex].hint}
                            </div>
                          )}
                        </div>

                        {/* Solution Code Editor Box */}
                        <div className="solution-editor-container">
                          <div className="editor-header">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <FaCode style={{ color: "#38bdf8" }} />
                              <label>Your Structured Solution & Code Implementation:</label>
                            </div>

                            {/* Actions Toolbar */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={handleInsertTemplate}
                                className="editor-tool-btn"
                                title="Insert Solution Template"
                              >
                                <FaFileAlt /> Template
                              </button>

                              <button
                                type="button"
                                onClick={handleClearAnswer}
                                className="editor-tool-btn clear"
                                title="Clear Response"
                              >
                                <FaTrashAlt />
                              </button>

                              {/* VOICE-TO-TEXT DICTATION BUTTON */}
                              <button
                                type="button"
                                onClick={toggleVoiceDictation}
                                className={`voice-dictation-btn ${isDictating ? "active" : ""}`}
                                title="Dictate response with real-time speech recognition"
                              >
                                <FaMicrophone className={isDictating ? "pulse-dot" : ""} />
                                {isDictating ? "🎙️ Listening... (Stop)" : "🎙️ Dictate with Voice"}
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={10}
                            value={answers[sessionQuestions[currentQIndex]?.id] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAnswers((prev) => ({
                                ...prev,
                                [sessionQuestions[currentQIndex].id]: val,
                              }));
                            }}
                            placeholder="// Type or voice-dictate your structured solution here:&#10;// 1. High-Level Architectural Approach & Trade-offs&#10;// 2. Code Implementation & Algorithmic Flow&#10;// 3. Time Complexity O(...) & Space Complexity O(...)&#10;// 4. Edge Cases, Null Handling & Concurrency..."
                            className="technical-code-textarea"
                          />

                          {/* Editor Stats Footer */}
                          <div className="editor-stats-footer">
                            <span>Words: <strong>{wordCount}</strong></span>
                            <span>Characters: <strong>{charCount}</strong></span>
                            <span>✦ AI Semantic Rubric Scoring Active</span>
                          </div>
                        </div>

                        {/* Navigation & Submit Bar */}
                        <div className="cockpit-footer-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentQIndex((prev) => Math.max(prev - 1, 0));
                              setShowHint(false);
                            }}
                            disabled={currentQIndex === 0}
                            className="cockpit-prev-btn"
                          >
                            ← Previous Question
                          </button>

                          {currentQIndex < sessionQuestions.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentQIndex((prev) => Math.min(prev + 1, sessionQuestions.length - 1));
                                setShowHint(false);
                              }}
                              className="cockpit-next-btn"
                            >
                              Next Question →
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSubmitInterview}
                              disabled={loading}
                              className="cockpit-submit-btn"
                            >
                              {loading ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                              {loading ? "Evaluating AI Rubrics..." : "Submit Interview & Generate AI Report"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* ================= REPORT CARD ================= */
              <div className="report-card-container">
                <div className="report-card-header">
                  <div className="report-award-icon">
                    <FaAward />
                  </div>
                  <h2>Interview Performance & AI Rubric Report</h2>
                  <p>
                    {company} • {role} ({difficulty})
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={downloadingPdf}
                    className="report-pdf-btn"
                  >
                    <FaFilePdf />
                    {pdfSuccess ? "✓ PDF Report Saved!" : downloadingPdf ? "Generating PDF..." : "Download Official PDF Report"}
                  </button>
                </div>

                {/* Multi-factor Score Grid */}
                <div className="score-summary-grid">
                  <div className="score-summary-card">
                    <span className="score-label">Overall Score</span>
                    <h3 className="score-val green">{evaluationResult.score_percentage}</h3>
                    <small>{evaluationResult.grade}</small>
                  </div>

                  <div className="score-summary-card">
                    <span className="score-label">Technical Depth</span>
                    <h3 className="score-val blue">{evaluationResult.technical_score || 88}%</h3>
                    <small>Domain concepts</small>
                  </div>

                  <div className="score-summary-card">
                    <span className="score-label">Communication</span>
                    <h3 className="score-val purple">{evaluationResult.communication_score || 85}%</h3>
                    <small>Clarity & Structure</small>
                  </div>

                  <div className="score-summary-card">
                    <span className="score-label">XP Reward</span>
                    <h3 className="score-val amber">+100 XP</h3>
                    <small>Added to Profile</small>
                  </div>
                </div>

                {/* Identified Keywords */}
                {evaluationResult.identified_keywords && evaluationResult.identified_keywords.length > 0 && (
                  <div className="report-keywords-box">
                    <span className="keywords-title">
                      ✦ TECHNICAL KEYWORDS DETECTED IN YOUR RESPONSES:
                    </span>
                    <div className="keywords-chip-list">
                      {evaluationResult.identified_keywords.map((kw, idx) => (
                        <span key={idx} className="keyword-chip">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                <div className="report-ai-summary-box">
                  <h4>AI Proctor Performance Evaluation</h4>
                  <p>{evaluationResult.overall_summary}</p>
                </div>

                {/* Per-Question Detailed Breakdown */}
                {evaluationResult.detailed_feedback && evaluationResult.detailed_feedback.length > 0 && (
                  <div className="report-questions-breakdown">
                    <h4>📝 Question-by-Question Detailed Analysis</h4>
                    <div className="report-questions-list">
                      {evaluationResult.detailed_feedback.map((qf, idx) => (
                        <div key={idx} className="report-question-item">
                          <div className="item-header">
                            <span>Question {idx + 1}: {qf.question}</span>
                            <span className={`item-score ${qf.score >= 80 ? "good" : "avg"}`}>
                              {qf.score}%
                            </span>
                          </div>
                          <p className="item-feedback">
                            <strong>AI Feedback:</strong> {qf.feedback}
                          </p>
                          {qf.identified_keywords && qf.identified_keywords.length > 0 && (
                            <div className="item-concepts">
                              <strong>Matched Concepts:</strong> {qf.identified_keywords.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Improvements */}
                <div className="strengths-improvements-grid">
                  <div className="strengths-box">
                    <h4>✓ Key Strengths</h4>
                    <ul>
                      {evaluationResult.strengths?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="improvements-box">
                    <h4>⚠ Suggested Improvements</h4>
                    <ul>
                      {evaluationResult.improvements?.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="report-footer-actions">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={downloadingPdf}
                    className="report-download-btn"
                  >
                    <FaDownload />
                    {pdfSuccess ? "✓ PDF Downloaded!" : "Download Evaluation PDF"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInterviewActive(false);
                      setEvaluationResult(null);
                      stopAllStreams();
                    }}
                    className="report-return-btn"
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
        <div className="interview-modal-backdrop">
          <div className="schedule-modal-box">
            <div className="schedule-modal-header">
              <h3>📅 Schedule Mock Interview</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowScheduleModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {scheduleSuccess ? (
              <div className="schedule-success-box">
                {scheduleSuccess}
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit}>
                <div className="schedule-field">
                  <label>Company & Role</label>
                  <div className="schedule-selected-meta">
                    {company} • {role}
                  </div>
                </div>

                <div className="schedule-field">
                  <label>Interview Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="schedule-input"
                  />
                </div>

                <div className="schedule-row">
                  <div className="schedule-field">
                    <label>Time Slot</label>
                    <select
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="schedule-select"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <div className="schedule-field">
                    <label>Interview Mode</label>
                    <select
                      value={scheduleMode}
                      onChange={(e) => setScheduleMode(e.target.value)}
                      className="schedule-select"
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
                  className="schedule-confirm-btn"
                >
                  {loading ? <FaSpinner className="fa-spin" /> : <FaCalendarAlt />}
                  {loading ? "Scheduling..." : "Confirm Schedule"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= AI MODEL SETTINGS MODAL ================= */}
      {showApiKeyModal && (
        <div className="interview-modal-backdrop">
          <div className="ai-settings-modal-box">
            <div className="settings-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaRobot style={{ color: "#38bdf8", fontSize: "20px" }} />
                <h3>AI Evaluation Engine Settings</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowApiKeyModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="ai-settings-info">
              <strong>✦ Supported AI Engines:</strong>
              1. <strong>Live Google Gemini 1.5 Flash</strong>: Enter your free API key from Google AI Studio for live generative assessment.<br />
              2. <strong>Neural Semantic Rubric Engine</strong>: Built-in strict multi-factor evaluator that scores domain depth, Big-O complexity, and trade-offs.
            </div>

            <div className="ai-key-input-wrap">
              <label>Google Gemini API Key (Optional for Live LLM):</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="key-input"
              />
              <small>Keys are saved securely in your local browser storage and never shared.</small>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  const val = keyInput.trim();
                  setApiKey(val);
                  if (val) {
                    localStorage.setItem("intervista_gemini_api_key", val);
                  } else {
                    localStorage.removeItem("intervista_gemini_api_key");
                  }
                  setShowApiKeyModal(false);
                }}
                className="save-key-btn"
              >
                Save AI Settings
              </button>

              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey("");
                    setKeyInput("");
                    localStorage.removeItem("intervista_gemini_api_key");
                    setShowApiKeyModal(false);
                  }}
                  className="clear-key-btn"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockInterview;