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
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaStop,
  FaStar,
  FaColumns,
  FaCheck,
  FaTerminal,
  FaBug,
  FaUndo,
  FaListAlt,
  FaLayerGroup,
  FaCodeBranch,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import { generateInterviewPDF } from "../../utils/pdfGenerator";
import { evaluateInterview, evaluateSingleQuestion, evaluateQuestionAPI } from "../../utils/evaluator";
import { getToken, recordLocalInterviewSession, recordLocalScheduledInterview } from "../../api";
import { STRUCTURED_DSA_BY_ROLE } from "../../utils/dsaQuestions";
import { runTestCases } from "../../utils/codeRunner";
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

const APTITUDE_QUESTIONS = [
  {
    id: 1,
    round_number: 1,
    round_title: "Aptitude & Logical Reasoning",
    category: "Quantitative & Throughput Estimation",
    question: "A distributed microservices cluster processes 12,000 requests per minute across 4 worker nodes. If peak traffic surges by 150% and each node's throughput is upgraded by 25%, calculate the minimum total worker nodes needed to ensure zero queue degradation.",
    hint: "Original capacity per node: 3,000 req/min. Surged traffic: 30,000 req/min. New node capacity: 3,750 req/min. Nodes required = ceil(30000 / 3750) = 8 nodes.",
  },
  {
    id: 2,
    round_number: 1,
    round_title: "Aptitude & Logical Reasoning",
    category: "Probability & System Reliability",
    question: "A fault-tolerant cloud service runs 3 independent replica nodes. Each node independently has an operational reliability of 95% at any time. Calculate the exact probability that at least 2 nodes remain operational to maintain quorum.",
    hint: "Use binomial probability: P(all 3 up) + P(exactly 2 up) = (0.95)^3 + 3 * (0.95)^2 * (0.05) = 0.857375 + 0.135375 = 99.275%.",
  },
  {
    id: 3,
    round_number: 1,
    round_title: "Aptitude & Logical Reasoning",
    category: "Pattern & Sequence Deduction",
    question: "Analyze the computational complexity progression: 2, 6, 12, 20, 30, 42, ... Derive the algebraic nth term formula and determine the 10th term in this sequence.",
    hint: "Notice n*(n+1): 1*2=2, 2*3=6, 3*4=12, ..., 10th term = 10*11 = 110.",
  },
  {
    id: 4,
    round_number: 1,
    round_title: "Aptitude & Logical Reasoning",
    category: "Logical Dependency & Scheduling",
    question: "Five asynchronous pipeline stages (A, B, C, D, E) must execute under strict dependency rules: Stage A must complete before B starts; C requires both B and D to finish; E cannot be first or last. Deduce all valid topological execution orderings.",
    hint: "Analyze graph edges A->B->C and D->C with position constraint for E. Example valid order: D -> A -> B -> E -> C or A -> D -> B -> E -> C.",
  },
  {
    id: 5,
    round_number: 1,
    round_title: "Aptitude & Logical Reasoning",
    category: "Algorithmic Logic Puzzle",
    question: "You manage 8 identical compute instances, but exactly one instance contains a memory-leak regression making it run at half speed. You have a dual-sided comparator benchmark tool. What is the minimum number of benchmark runs required to pinpoint the degraded node?",
    hint: "Divide instances into groups of 3, 3, 2 (ternary search). Compare 3 vs 3. If balanced, test the remaining 2. Minimum 2 benchmark runs are sufficient.",
  },
];

const DSA_BY_ROLE = {
  "Frontend Developer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Sliding Window & Streams",
      question: "Given an unbounded stream of user click telemetry timestamps, design an O(n) sliding-window algorithm to find the maximum number of user interactions in any continuous 5-second interval.",
      hint: "Use a sliding window with two pointers or a monotonic deque to maintain valid timestamps within [t, t+5] in O(1) amortized time per event.",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Tree Diffing & Keys",
      question: "Explain the tree reconciliation algorithm used in Virtual DOM diffing. How does key hashing prevent O(n^3) tree editing complexity and reduce it to linear O(n)?",
      hint: "Detail level-by-level breadth-first comparison, heuristic assumptions, double-buffered Fiber trees, and stable key map indexing.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Graph & Cycle Detection",
      question: "Given an ES Module dependency graph with possible circular dependencies, implement cycle detection and compute a valid bundling execution order using DFS 3-color marking.",
      hint: "Use DFS with White (unvisited), Gray (currently visiting / cycle detected), and Black (visited) states to perform topological sort.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Dynamic Programming & Trie",
      question: "Implement an autocomplete search dictionary parser using a Prefix Trie combined with Dynamic Programming for fuzzy Levenshtein distance matching under a 2-edit threshold.",
      hint: "Traverse the Trie while maintaining DP state rows for edit distances (insert, delete, replace) to prune unpromising branches early.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Virtual List Engine",
      question: "Architect a 60fps DOM Virtualization list renderer for 1,000,000 items. Explain how you calculate scrollTop offset, viewport slices, overscan buffers, and item recycling.",
      hint: "Compute visible start/end indices: startIndex = Math.floor(scrollTop / itemHeight), render only visible + buffer count, transform translate coordinates.",
    },
  ],
  "Backend Developer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - LRU Cache Design",
      question: "Implement a high-performance, thread-safe Least Recently Used (LRU) Cache supporting O(1) get() and put() operations using a Doubly Linked List and Hash Map.",
      hint: "Combine a HashMap<Key, Node> for O(1) lookups with a DoublyLinkedList for O(1) node relocation on access and tail eviction on capacity breach.",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Priority Queue & Routing",
      question: "Design an adaptive shortest-path network routing algorithm for microservice RPCs using Dijkstra's algorithm with Min-Heap under dynamically fluctuating latency weights.",
      hint: "Use an indexed priority queue to dynamically update node distances (relaxation) and handle edge weight updates gracefully in O((V + E) log V).",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Monotonic Queue Rate Limiting",
      question: "Implement a sliding-window rate limiter using a Redis Sorted Set (ZSET) to enforce 1,000 requests per minute per API key under high concurrency.",
      hint: "Use MULTI/EXEC or Lua script: ZADD current timestamp, ZREMRANGEBYSCORE older than now-60s, ZCARD to check quota, and EXPIRE.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Concurrency & MVCC",
      question: "Compare Optimistic Concurrency Control (OCC) with version columns against Pessimistic Locking (SELECT FOR UPDATE). How do you resolve distributed deadlocks?",
      hint: "Discuss CAS version updates, database row locks, lock acquisition timeouts, and distributed wait-for graphs with deadlock cycle termination.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Distributed Idempotency",
      question: "Design a guaranteed idempotent financial transaction processing pipeline across distributed payment services using the Transactional Outbox pattern.",
      hint: "Store Idempotency-Key headers in DB with state (IN_PROGRESS, COMPLETED), use transactional outbox with CDC (Debezium) into Kafka for consumer deduplication.",
    },
  ],
  "Full Stack Engineer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - CRDT Conflict Resolution",
      question: "Implement a Conflict-Free Replicated Data Type (CRDT) LWW-Element-Set (Last-Write-Wins) for real-time collaborative document editing across disconnected clients.",
      hint: "Maintain Add-Set and Remove-Set with timestamps; resolve concurrent edits deterministically by comparing UTC epoch timestamps and client UUID tie-breakers.",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Tree Indexing & Search",
      question: "Design an in-memory B-Tree or Inverted Index data structure for lightning-fast multi-keyword full-text search across 500,000 customer product catalogs.",
      hint: "Tokenize and normalize words, build InvertedIndex: Map<Token, PostingList<DocID, Frequency>>, and perform posting list intersections using skip pointers.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Queue & Backpressure",
      question: "Design a Producer-Consumer message queue with bounded ring buffer memory and exponential backpressure mechanism when consumer processing slows down.",
      hint: "Use a circular ring buffer with atomic head/tail pointers, condition variables for signaling full/empty buffers, and reactive backpressure flow control.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - OAuth2 PKCE Security",
      question: "Explain the end-to-end OAuth 2.0 PKCE authorization flow for Single Page Applications. How does code_challenge and code_verifier protect against interception attacks?",
      hint: "Generate cryptographic code_verifier (high-entropy string) and code_challenge (SHA-256 hash). Authorization server verifies challenge on token exchange.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Real-time WebSocket Gateway",
      question: "Architect a real-time bi-directional WebSocket gateway capable of broadcasting live events to 250,000 concurrent connected clients with horizontal cluster scaling.",
      hint: "Use Redis Pub/Sub or Apache Kafka as the distributed broadcast bus between WebSocket gateway instances with heartbeat ping/pong connection monitoring.",
    },
  ],
  "AI / ML Engineer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - HNSW Vector Graph Indexing",
      question: "Explain the Hierarchical Navigable Small World (HNSW) graph algorithm for Approximate Nearest Neighbor (ANN) vector search. How does multi-layer routing achieve logarithmic search time?",
      hint: "Discuss skip-list inspired layered graphs, greedy routing at top layers, beam search at layer 0, and distance metrics (Cosine vs Euclidean).",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - KV Cache & PagedAttention",
      question: "Implement an efficient Key-Value (KV) Cache memory management algorithm (similar to vLLM's PagedAttention) to eliminate memory fragmentation during LLM token generation.",
      hint: "Map continuous virtual KV blocks to non-contiguous physical GPU memory pages, enabling dynamic allocation without pre-allocating worst-case sequence lengths.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Matrix Multiply & Quantization",
      question: "Detail the computational mechanics of FP8 / INT4 weight-only quantization vs activation quantization. How does AWQ preserve salient weight channels without perplexity degradation?",
      hint: "Analyze per-channel scaling factors, identifying outlier activation channels (top 1%), and selectively protecting salient weights from aggressive quantization.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Production RAG Architecture",
      question: "Design a multi-stage Retrieval-Augmented Generation (RAG) system with hybrid dense-sparse search (BM25 + BGE-M3), Reciprocal Rank Fusion (RRF), and cross-encoder reranking.",
      hint: "Cover semantic chunking with overlap, sparse BM25 + dense vector embeddings, RRF formula RRF(d) = sum(1 / (k + rank)), and Cohere/bge-reranker reranking.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Distributed Model Training",
      question: "Explain pipeline parallelism, tensor parallelism (Megatron-LM), and ZeRO memory optimization stages (ZeRO-1, 2, 3) in training multi-billion parameter LLMs across GPU clusters.",
      hint: "Detail partitioning optimizer states (ZeRO-1), gradients (ZeRO-2), and model parameters (ZeRO-3), plus inter-GPU all-reduce communication overlaps.",
    },
  ],
};

function generate20Questions(companyName, roleName) {
  const r1 = APTITUDE_QUESTIONS;
  const r2 = STRUCTURED_DSA_BY_ROLE[roleName] || STRUCTURED_DSA_BY_ROLE["Frontend Developer"];
  const r3 = [
    {
      id: 11,
      round_number: 3,
      round_title: `Company Architecture & System Design (${companyName})`,
      category: "System Design - High Availability & Scale",
      question: `Architect a global distributed system for ${companyName} handling 500 Million Daily Active Users. Discuss Geo-DNS routing, L4/L7 load balancing, Multi-Region replication, and edge caching.`,
      hint: "Address Anycast DNS, NGINX/Envoy ingress proxies, CDN points of presence, active-active multi-region databases, and partition tolerance.",
    },
    {
      id: 12,
      round_number: 3,
      round_title: `Company Architecture & System Design (${companyName})`,
      category: `${companyName} Core Engineering Challenge`,
      question: `How would you solve ${companyName}'s signature engineering challenge: designing high-throughput data pipelines with sub-second query latency and zero-downtime rolling deployments?`,
      hint: `Discuss blue-green deployments, canary testing, distributed tracing (OpenTelemetry), and auto-healing infrastructure tailored to ${companyName}.`,
    },
    {
      id: 13,
      round_number: 3,
      round_title: `Company Architecture & System Design (${companyName})`,
      category: "System Design - Data Sharding & Partitions",
      question: `Design a resilient data sharding strategy for ${companyName} that dynamically handles hotspots (e.g. celebrity accounts or viral flash events) without manual database re-indexing.`,
      hint: "Explain Consistent Hashing with virtual nodes, composite shard keys (TenantID + Salt), and micro-sharding with automated live data migration.",
    },
    {
      id: 14,
      round_number: 3,
      round_title: `Company Architecture & System Design (${companyName})`,
      category: "System Design - Fault Tolerance & Circuit Breakers",
      question: `In a mission-critical microservices mesh at ${companyName}, how do you prevent cascading service failures when a downstream database slows down under heavy load?`,
      hint: "Cover Circuit Breaker state machines (Closed, Open, Half-Open), exponential backoff with full jitter, bulkhead thread pools, and graceful degradation.",
    },
    {
      id: 15,
      round_number: 3,
      round_title: `Company Architecture & System Design (${companyName})`,
      category: "System Design - Zero Trust & API Security",
      question: `Design an enterprise Zero-Trust security and mTLS authentication architecture for thousands of microservices communicating across ${companyName}'s cloud VPCs.`,
      hint: "Discuss SPIFFE/SPIRE identity issuance, short-lived X.509 certificates with automated rotation via service mesh (Istio/Linkerd), and fine-grained RBAC.",
    },
  ];
  const r4 = [
    {
      id: 16,
      round_number: 4,
      round_title: "Behavioral & HR Leadership Round",
      category: "HR - Conflict Resolution & Alignment",
      question: `Describe a situation where you had a strong technical disagreement with a Senior Engineer or Product Manager at work. How did you resolve it constructively using the STAR method?`,
      hint: "Structure using STAR (Situation, Task, Action, Result). Focus on objective data, running benchmarks/POCs, active listening, and 'disagree and commit' alignment.",
    },
    {
      id: 17,
      round_number: 4,
      round_title: "Behavioral & HR Leadership Round",
      category: "HR - Crisis Management & Ownership",
      question: `Tell me about a high-severity production outage or critical bug that occurred under your ownership. How did you coordinate the incident response and lead the post-mortem?`,
      hint: "Emphasize rapid mitigation first, transparent communication to stakeholders, root cause analysis (5 Whys), and blameless post-mortem with automated safeguards.",
    },
    {
      id: 18,
      round_number: 4,
      round_title: "Behavioral & HR Leadership Round",
      category: "HR - Failure & Growth Mindset",
      question: `Can you share an experience where a project or technical architecture you spearheaded failed to meet expectations or hit its deadline? What were your core takeaways?`,
      hint: "Demonstrate radical ownership, honesty, learning agility, early risk escalation, and how this experience shaped your current engineering standards.",
    },
    {
      id: 19,
      round_number: 4,
      round_title: "Behavioral & HR Leadership Round",
      category: "HR - Leadership & Mentorship",
      question: `How do you elevate the engineers around you? Give a concrete example of how you mentored a colleague, improved code review quality, or championed engineering best practices.`,
      hint: "Highlight concrete actions: hosting architecture RFC sessions, creating starter boilerplates, providing empathetic PR reviews, and pairing with junior teammates.",
    },
    {
      id: 20,
      round_number: 4,
      round_title: "Behavioral & HR Leadership Round",
      category: "HR - Company Culture & Vision",
      question: `Why do you specifically want to join ${companyName} over other top tech firms, and how does your 2-3 year technical vision align with our engineering culture and scale?`,
      hint: `Connect your personal passions and technical strengths directly to ${companyName}'s core principles, products, and technical scale.`,
    },
  ];
  return [...r1, ...r2, ...r3, ...r4];
}

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
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // Tracks submitted questions during the test; full evaluation takes place at the end
  const [questionEvaluations, setQuestionEvaluations] = useState({}); // Per-question evaluation results
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false); // Question submission & evaluation state
  const [initError, setInitError] = useState(null); // Error state for interview initialization
  const [streamWarning, setStreamWarning] = useState(null); // Warning when a stream drops during active interview

  // Independent Media Stream States
  const [cameraStatus, setCameraStatus] = useState("idle"); // idle | requesting | granted | denied
  const [micStatus, setMicStatus] = useState("idle");
  const [screenStatus, setScreenStatus] = useState("idle");
  const [cameraStream, setCameraStream] = useState(null);
  const [micStream, setMicStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  // Persistent refs for reliable stream lifecycle and unmount cleanup (independent of re-renders)
  const cameraStreamRef = useRef(null);
  const micStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [cameraMirrored, setCameraMirrored] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isDictating, setIsDictating] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [showPreFlightModal, setShowPreFlightModal] = useState(false);
  const [showScreenExpanded, setShowScreenExpanded] = useState(false);
  const [aiSpeechState, setAiSpeechState] = useState("observing"); // observing | analyzing | listening
  const [editorScreenMode, setEditorScreenMode] = useState("normal"); // "normal" | "half" | "max"

  // DSA & Coding Live Execution States
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [testcaseSubTab, setTestcaseSubTab] = useState("testcase"); // "testcase" | "result"
  const [isConsoleDrawerOpen, setIsConsoleDrawerOpen] = useState(true);
  const [testResultsMap, setTestResultsMap] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [submittedCodeMap, setSubmittedCodeMap] = useState({});
  const [customTestInput, setCustomTestInput] = useState("");
  const [customExpected, setCustomExpected] = useState("");
  const [runSuccessToast, setRunSuccessToast] = useState("");

  // Manage Fullscreen immersion & suppress Navbar/Sidebar during active interview or max editor mode
  useEffect(() => {
    if (interviewActive) {
      document.body.classList.add("interview-cockpit-active");
    } else {
      document.body.classList.remove("interview-cockpit-active");
    }

    if (editorScreenMode === "max") {
      document.body.classList.add("editor-fullscreen-active");
    } else {
      document.body.classList.remove("editor-fullscreen-active");
    }

    return () => {
      document.body.classList.remove("interview-cockpit-active");
      document.body.classList.remove("editor-fullscreen-active");
    };
  }, [interviewActive, editorScreenMode]);

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
    console.log("[MEDIA] Camera button clicked. Current camera stream active:", !!cameraStreamRef.current);
    if (cameraStreamRef.current) {
      console.log("[MEDIA] Toggling off camera stream explicitly");
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
      setCameraStream(null);
      setCameraStatus("idle");
      setIsCameraActive(false);
      return null;
    }

    try {
      setCameraStatus("requesting");
      console.log("[MEDIA] Requesting camera via getUserMedia");
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

      console.log("[MEDIA] Camera stream created successfully. Track ID:", stream.getVideoTracks()[0]?.id);

      // Attach track.onended handler to detect hardware disconnection
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          console.log("[MEDIA] Camera track ended event fired (hardware/OS disconnected)");
          cameraStreamRef.current = null;
          setCameraStream(null);
          setCameraStatus("idle");
          setIsCameraActive(false);
        };
      }

      cameraStreamRef.current = stream;
      setCameraStream(stream);
      setCameraStatus("granted");
      setIsCameraActive(true);
      return stream;
    } catch (err) {
      console.warn("[MEDIA] Camera access warning:", err);
      setCameraStatus(err.name === "NotAllowedError" ? "denied" : err.name === "NotFoundError" ? "denied" : err.name === "NotReadableError" ? "denied" : "idle");
      return null;
    }
  };

  const requestMicrophone = async () => {
    console.log("[MEDIA] Microphone button clicked. Current mic stream active:", !!micStreamRef.current);
    if (micStreamRef.current) {
      console.log("[MEDIA] Toggling off microphone stream explicitly");
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      setMicStream(null);
      setMicStatus("idle");
      setIsMicActive(false);
      setAudioLevel(0);
      return null;
    }

    try {
      setMicStatus("requesting");
      console.log("[MEDIA] Requesting microphone via getUserMedia");
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

      console.log("[MEDIA] Microphone stream created successfully. Track ID:", stream.getAudioTracks()[0]?.id);

      // Attach track.onended handler to detect hardware disconnection
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.onended = () => {
          console.log("[MEDIA] Microphone track ended event fired (hardware/OS disconnected)");
          micStreamRef.current = null;
          setMicStream(null);
          setMicStatus("idle");
          setIsMicActive(false);
          setAudioLevel(0);
        };
      }

      micStreamRef.current = stream;
      setMicStream(stream);
      setMicStatus("granted");
      setIsMicActive(true);
      setupAudioAnalyser(stream);
      return stream;
    } catch (err) {
      console.warn("[MEDIA] Microphone access warning:", err);
      setMicStatus(err.name === "NotAllowedError" ? "denied" : err.name === "NotFoundError" ? "denied" : err.name === "NotReadableError" ? "denied" : "idle");
      return null;
    }
  };

  const requestScreenShare = async () => {
    console.log("[MEDIA] Screen share button clicked. Current screen stream active:", !!screenStreamRef.current);
    if (screenStreamRef.current) {
      console.log("[MEDIA] Toggling off screen share stream explicitly");
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setScreenStatus("idle");
      return null;
    }

    try {
      setScreenStatus("requesting");
      console.log("[MEDIA] Requesting screen share via getDisplayMedia");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });

      console.log("[MEDIA] Screen share stream created successfully. Track ID:", stream.getVideoTracks()[0]?.id);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          console.log("[MEDIA] Screen share track ended event fired (user stopped sharing)");
          screenStreamRef.current = null;
          setScreenStream(null);
          setScreenStatus("idle");
        };
      }

      screenStreamRef.current = stream;
      setScreenStream(stream);
      setScreenStatus("granted");
      return stream;
    } catch (err) {
      console.warn("[MEDIA] Screen share cancelled or error:", err);
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
      console.log("[MEDIA] Requesting combined camera & microphone");
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
        const vTrack = vStream.getVideoTracks()[0];
        if (vTrack) {
          vTrack.onended = () => {
            console.log("[MEDIA] Combined: Camera track ended");
            cameraStreamRef.current = null;
            setCameraStream(null);
            setCameraStatus("idle");
            setIsCameraActive(false);
          };
        }
        cameraStreamRef.current = vStream;
        setCameraStream(vStream);
        setCameraStatus("granted");
        setIsCameraActive(true);
      }

      if (audioTracks.length > 0) {
        const aStream = new MediaStream(audioTracks);
        const aTrack = aStream.getAudioTracks()[0];
        if (aTrack) {
          aTrack.onended = () => {
            console.log("[MEDIA] Combined: Microphone track ended");
            micStreamRef.current = null;
            setMicStream(null);
            setMicStatus("idle");
            setIsMicActive(false);
            setAudioLevel(0);
          };
        }
        micStreamRef.current = aStream;
        setMicStream(aStream);
        setMicStatus("granted");
        setIsMicActive(true);
        setupAudioAnalyser(aStream);
      }

      return stream;
    } catch (err) {
      console.warn("[MEDIA] Combined Cam/Mic warning:", err);
      if (!cameraStreamRef.current) setCameraStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      if (!micStreamRef.current) setMicStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      return null;
    }
  };

  // Toggle Camera Track Mute
  const toggleCamera = () => {
    const activeStream = cameraStreamRef.current || cameraStream;
    if (activeStream) {
      const tracks = activeStream.getVideoTracks();
      tracks.forEach((t) => (t.enabled = !isCameraActive));
      setIsCameraActive(!isCameraActive);
    }
  };

  // Toggle Mic Track Mute
  const toggleMic = () => {
    const activeStream = micStreamRef.current || micStream;
    if (activeStream) {
      const tracks = activeStream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = !isMicActive));
      setIsMicActive(!isMicActive);
    }
  };

  // Cleanup All Media Streams on Session End or Manual Stop
  const stopAllStreams = useCallback(() => {
    console.log("[MEDIA] stopAllStreams invoked explicitly");
    if (cameraStreamRef.current) {
      console.log("[MEDIA] Cleaning camera stream");
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    setCameraStream(null);
    setCameraStatus("idle");
    setIsCameraActive(false);

    if (micStreamRef.current) {
      console.log("[MEDIA] Cleaning microphone stream");
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setMicStream(null);
    setMicStatus("idle");
    setIsMicActive(false);

    if (screenStreamRef.current) {
      console.log("[MEDIA] Cleaning screen-share stream");
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    setScreenStream(null);
    setScreenStatus("idle");

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
  }, []);

  // Clean up ONLY on component unmount — NOT during stream state changes
  useEffect(() => {
    return () => {
      console.log("[MEDIA] MockInterview unmounted from DOM — stopping all active streams");
      if (cameraStreamRef.current) {
        console.log("[MEDIA] Unmount: stopping camera stream");
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      if (micStreamRef.current) {
        console.log("[MEDIA] Unmount: stopping microphone stream");
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        console.log("[MEDIA] Unmount: stopping screen-share stream");
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
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
      }
    };
  }, []); // Empty dependency array: NEVER executes on stream state changes, ONLY on actual DOM unmount!

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

  // Helper to insert STAR method scaffolding for HR & Culture questions
  const handleInsertSTARTemplate = () => {
    const currentQId = sessionQuestions[currentQIndex]?.id;
    if (!currentQId) return;
    const starTemplate = `// --- STAR METHOD RESPONSE FORMAT (HR & CULTURE) ---
// [Situation]: Outline the specific scenario, challenge, or production crisis.
// [Task]: What was your exact goal, ownership, and responsibility?
// [Action]: What concrete steps did you take? (Collaboration, trade-offs, communication)
// [Result]: What was the measurable impact, lesson learned, and team outcome?

`;
    setAnswers((prev) => ({
      ...prev,
      [currentQId]: prev[currentQId] ? `${prev[currentQId]}\n\n${starTemplate}` : starTemplate,
    }));
  };

  // --- AUDIO QUESTION NARRATOR (FOR HR & CULTURE ROUND) ---
  const speakQuestionAudio = useCallback((textToSpeak) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();

      if (!textToSpeak) return;
      const cleanText = textToSpeak.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice =
        voices.find(
          (v) =>
            (v.name.includes("Google") ||
              v.name.includes("Natural") ||
              v.name.includes("Samantha") ||
              v.name.includes("Zira")) &&
            v.lang.startsWith("en")
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => {
        setIsSpeakingQuestion(true);
        setAiSpeechState("speaking");
      };

      utterance.onend = () => {
        setIsSpeakingQuestion(false);
        setAiSpeechState("observing");
      };

      utterance.onerror = () => {
        setIsSpeakingQuestion(false);
        setAiSpeechState("observing");
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS narration error:", e);
      setIsSpeakingQuestion(false);
    }
  }, []);

  const stopQuestionAudio = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingQuestion(false);
    setAiSpeechState("observing");
  }, []);

  // Auto-speak HR & Culture questions (Q16-Q20) when navigated to
  useEffect(() => {
    if (
      interviewActive &&
      !evaluationResult &&
      currentQIndex >= 15 &&
      autoPlayAudio
    ) {
      const qText = sessionQuestions[currentQIndex]?.question;
      if (qText) {
        const timer = setTimeout(() => {
          speakQuestionAudio(`Question ${currentQIndex + 1}. ${qText}`);
        }, 400);
        return () => {
          clearTimeout(timer);
          stopQuestionAudio();
        };
      }
    } else {
      stopQuestionAudio();
    }
  }, [
    currentQIndex,
    interviewActive,
    evaluationResult,
    autoPlayAudio,
    sessionQuestions,
    speakQuestionAudio,
    stopQuestionAudio,
  ]);

  // Helper to clear current response
  const handleClearAnswer = () => {
    const currentQId = sessionQuestions[currentQIndex]?.id;
    if (!currentQId) return;
    if (window.confirm("Are you sure you want to clear your current response?")) {
      setAnswers((prev) => ({
        ...prev,
        [currentQId]: "",
      }));
    }
  };

  // Helper to reset DSA code to language starter template
  const handleResetDSAStarter = (q) => {
    if (!q) return;
    const starter = q.starter_templates?.[selectedLanguage] || q.starter_templates?.javascript || "";
    if (starter) {
      setAnswers((prev) => ({
        ...prev,
        [q.id]: starter,
      }));
      setRunSuccessToast("Reset to official starter boilerplate.");
      setTimeout(() => setRunSuccessToast(""), 3000);
    }
  };

  // Helper to change coding language
  const handleLanguageChange = (newLang, q) => {
    setSelectedLanguage(newLang);
    if (q && q.starter_templates) {
      const currentCode = answers[q.id] || "";
      const isUnchangedOrEmpty = !currentCode.trim() || Object.values(q.starter_templates).some((tpl) => tpl.trim() === currentCode.trim());
      if (isUnchangedOrEmpty && q.starter_templates[newLang]) {
        setAnswers((prev) => ({
          ...prev,
          [q.id]: q.starter_templates[newLang],
        }));
      }
    }
  };

  // 1. RUN CODE / UNIT TESTS HANDLER
  const handleRunCodeTests = async (q) => {
    if (!q) return;
    const userCode = answers[q.id] || "";
    if (!userCode.trim()) {
      setRunSuccessToast("Please write or paste your solution before running tests.");
      setTimeout(() => setRunSuccessToast(""), 3500);
      return;
    }

    setIsRunningTests(true);
    setAiSpeechState("analyzing");
    setTestcaseSubTab("result");
    setIsConsoleDrawerOpen(true);

    try {
      const testSuite = q.test_cases || [];
      const functionName = q.function_name || "solution";

      // Execute locally with resilient sandboxed runner
      const results = await runTestCases(userCode, functionName, testSuite, selectedLanguage);

      setTestResultsMap((prev) => ({
        ...prev,
        [q.id]: results,
      }));

      if (results.success) {
        setRunSuccessToast(`✓ All ${results.passedCount}/${results.totalCount} test cases passed! (${results.executionTimeMs}ms)`);
      } else {
        setRunSuccessToast(`⚠️ ${results.passedCount}/${results.totalCount} test cases passed. Review diagnostics below.`);
      }
      setTimeout(() => setRunSuccessToast(""), 4500);
    } catch (err) {
      console.error("Test execution failed:", err);
      setRunSuccessToast("Execution error: " + (err.message || String(err)));
      setTimeout(() => setRunSuccessToast(""), 4000);
    } finally {
      setIsRunningTests(false);
      setAiSpeechState("observing");
    }
  };

  // 2. SUBMIT CODE SOLUTION HANDLER
  // 2. SUBMIT CODE SOLUTION HANDLER
  const handleSubmitCodeSolution = async (q) => {
    if (!q) return;
    const userCode = answers[q.id] || "";
    if (!userCode.trim()) {
      alert("Please write your code solution before submitting.");
      return;
    }

    setIsRunningTests(true);
    setAiSpeechState("analyzing");
    setTestcaseSubTab("result");
    setIsConsoleDrawerOpen(true);

    try {
      const testSuite = q.test_cases || [];
      const functionName = q.function_name || "solution";

      const results = await runTestCases(userCode, functionName, testSuite, selectedLanguage);

      setTestResultsMap((prev) => ({
        ...prev,
        [q.id]: results,
      }));

      setSubmittedCodeMap((prev) => ({
        ...prev,
        [q.id]: true,
      }));

      setSubmittedQuestions((prev) => ({
        ...prev,
        [q.id]: true,
      }));

      if (results.passedCount === results.totalCount) {
        setRunSuccessToast(`🎉 Code Solution Submitted! (${results.passedCount}/${results.totalCount} Test Cases Passed).`);
      } else {
        setRunSuccessToast(`📝 Code Solution Submitted (${results.passedCount}/${results.totalCount} test cases passed).`);
      }
      setTimeout(() => setRunSuccessToast(""), 4500);
    } catch (err) {
      setRunSuccessToast("Submission error: " + (err.message || String(err)));
      setTimeout(() => setRunSuccessToast(""), 4000);
    } finally {
      setIsRunningTests(false);
      setAiSpeechState("observing");
    }
  };

  // 2b. SUBMIT SINGLE QUESTION (SAVED & EVALUATED WITH AI)
  const handleSubmitSingleQuestion = async (q) => {
    if (!q || isSubmittingQuestion) return;
    const currentAns = (answers[q.id] || "").trim();
    if (!currentAns) {
      setRunSuccessToast("Please type or record an answer before submitting.");
      setTimeout(() => setRunSuccessToast(""), 3500);
      return;
    }

    setIsSubmittingQuestion(true);
    setAiSpeechState("analyzing");

    try {
      // Evaluate question via API (or local evaluator fallback)
      const evalRes = await evaluateQuestionAPI({
        question_id: q.id,
        question: q.question,
        answer: currentAns,
        company,
        role,
        difficulty,
        test_results: testResultsMap[q.id] || null,
      });

      if (evalRes) {
        setQuestionEvaluations((prev) => ({
          ...prev,
          [q.id]: evalRes,
        }));
      }

      setSubmittedQuestions((prev) => ({
        ...prev,
        [q.id]: true,
      }));

      setRunSuccessToast(`✓ Question ${currentQIndex + 1} evaluated: ${evalRes?.score ?? 0}/100`);
      setTimeout(() => setRunSuccessToast(""), 3500);
    } catch (err) {
      console.warn("Single question evaluation error:", err);
      // Fallback: save question submission state locally
      setSubmittedQuestions((prev) => ({
        ...prev,
        [q.id]: true,
      }));
      setRunSuccessToast(`✓ Question ${currentQIndex + 1} answer submitted & saved.`);
      setTimeout(() => setRunSuccessToast(""), 3500);
    } finally {
      setIsSubmittingQuestion(false);
      setAiSpeechState("observing");
    }
  };

  // 3. RUN CUSTOM TEST CASE HANDLER
  const handleRunCustomTest = async (q) => {
    if (!q) return;
    const userCode = answers[q.id] || "";
    if (!userCode.trim()) return;

    let parsedInput;
    try {
      parsedInput = JSON.parse(customTestInput);
    } catch {
      parsedInput = customTestInput;
    }

    let parsedExpected;
    try {
      parsedExpected = JSON.parse(customExpected);
    } catch {
      parsedExpected = customExpected;
    }

    const customTC = [
      {
        id: 999,
        name: "Custom Test Case",
        input: parsedInput,
        inputStr: customTestInput || "Custom Input",
        expectedOutput: parsedExpected,
        expectedOutputStr: customExpected || "Custom Expected",
        isHidden: false,
      },
    ];

    setIsRunningTests(true);
    try {
      const results = await runTestCases(userCode, q.function_name || "solution", customTC, selectedLanguage);
      setTestResultsMap((prev) => ({
        ...prev,
        [q.id]: {
          ...(prev[q.id] || {}),
          customResult: results.results?.[0],
        },
      }));
    } finally {
      setIsRunningTests(false);
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
  // Verify both state AND actual track liveness for each stream
  const isCameraReady = cameraStatus === "granted" && !!cameraStream && cameraStream.getVideoTracks().some(t => t.readyState === "live");
  const isMicReady = micStatus === "granted" && !!micStream && micStream.getAudioTracks().some(t => t.readyState === "live");
  const isScreenReady = screenStatus === "granted" && !!screenStream && screenStream.getVideoTracks().some(t => t.readyState === "live");
  const allParametersReady = isCameraReady && isMicReady && isScreenReady;
  const anyParameterReady = isCameraReady || isMicReady || isScreenReady;
  const readyCount = (isCameraReady ? 1 : 0) + (isMicReady ? 1 : 0) + (isScreenReady ? 1 : 0);

  // Monitor stream health during active interview — pause if any stream drops
  useEffect(() => {
    if (!interviewActive || evaluationResult) {
      setStreamWarning(null);
      return;
    }
    const missing = [];
    if (!isCameraReady) missing.push("Camera");
    if (!isMicReady) missing.push("Microphone");
    if (!isScreenReady) missing.push("Screen Share");
    if (missing.length > 0) {
      setStreamWarning(`${missing.join(", ")} ${missing.length === 1 ? "has" : "have"} stopped. Please re-enable to continue the interview.`);
    } else {
      setStreamWarning(null);
    }
  }, [interviewActive, evaluationResult, isCameraReady, isMicReady, isScreenReady]);

  const handleInitiateInterview = () => {
    setInitError(null);
    if (!allParametersReady) {
      // Always show pre-flight modal when any device is missing
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
        if (!allParametersReady) {
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
  }, [interviewActive, allParametersReady, isMicReady]);

  // 1. START INTERVIEW HANDLER (20 Questions across 4 Rounds)
  const startLiveInterviewSession = async () => {
    // Final validation: require all 3 streams to be live before starting
    if (!allParametersReady) {
      const missing = [];
      if (!isCameraReady) missing.push("Camera");
      if (!isMicReady) missing.push("Microphone");
      if (!isScreenReady) missing.push("Screen Share");
      setInitError(`Cannot start interview. Missing: ${missing.join(", ")}. Please enable all 3 devices.`);
      return;
    }

    setShowPreFlightModal(false);
    setLoading(true);
    setInitError(null);
    setEvaluationResult(null);
    setCurrentQIndex(0);
    setShowHint(false);
    setTimeLeft(60 * 60); // 60 minutes for 20 questions
    setSessionStartTime(Date.now());
    setAiSpeechState("observing");
    setTestResultsMap({});
    setSubmittedCodeMap({});

    try {
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
            body: JSON.stringify({ company, role, difficulty, duration_minutes: 60 }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.questions && data.questions.length >= 20) {
              fetchedQuestions = data.questions;
              break;
            }
          }
        } catch {
          // continue to next base URL
        }
      }

      // Fallback if backend unreachable or returns less than 20
      if (!fetchedQuestions || fetchedQuestions.length < 20) {
        fetchedQuestions = generate20Questions(company, role);
      }

      setSessionQuestions(fetchedQuestions);
      const initialAns = {};
      fetchedQuestions.forEach((q) => {
        if (q.starter_templates && q.starter_templates.javascript) {
          initialAns[q.id] = q.starter_templates.javascript;
        } else {
          initialAns[q.id] = "";
        }
      });
      setAnswers(initialAns);
      setQuestionEvaluations({});
      setSubmittedQuestions({});
      setIsSubmittingQuestion(false);
      setCurrentQIndex(0);
      setInterviewActive(true);
      setSessionStartTime(Date.now());
      setStreamWarning(null);
    } catch (err) {
      console.error("[Interview Init] Failed to start interview session:", err);
      setInitError(`Interview initialization failed: ${err.message || "Unknown error"}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
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
      test_results: testResultsMap[q.id] || null,
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
    try {
      window.dispatchEvent(new Event("intervista_profile_refresh"));
    } catch {
      // ignore
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

      {/* Initialization Error Display */}
      {initError && (
        <div style={{
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.4)",
          borderRadius: "12px",
          padding: "14px 18px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#fca5a5",
          fontSize: "14px",
        }}>
          <FaExclamationTriangle style={{ color: "#ef4444", fontSize: "18px", flexShrink: 0 }} />
          <span>{initError}</span>
          <button
            type="button"
            onClick={() => setInitError(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}
          >
            <FaTimes />
          </button>
        </div>
      )}

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
            ? "🚀 Start Interview Room (All 3 Verified)"
            : `Set Up All 3 Devices First (${readyCount}/3 Active)`}
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
              {!allParametersReady && (
                <div style={{
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "12px",
                  color: "#fbbf24",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <FaExclamationTriangle style={{ flexShrink: 0 }} />
                  <span>
                    All 3 devices (Camera, Microphone, Screen Share) must be active to start the interview.
                    {!isCameraReady && " ❌ Camera is not active."}
                    {!isMicReady && " ❌ Microphone is not active."}
                    {!isScreenReady && " ❌ Screen Share is not active."}
                  </span>
                </div>
              )}
              <button
                type="button"
                className={`preflight-launch-btn ${!allParametersReady ? "disabled-lock" : "ready-glow"}`}
                onClick={startLiveInterviewSession}
                disabled={!allParametersReady || loading}
              >
                <FaPlayCircle />
                {allParametersReady
                  ? "🚀 Launch AI Interview Room (All 3 Parameters Ready)"
                  : `🔒 Enable All 3 Devices to Launch (${readyCount}/3 Active)`}
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

      {/* ================= STREAM WARNING OVERLAY DURING ACTIVE INTERVIEW ================= */}
      {interviewActive && streamWarning && !evaluationResult && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100001,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "520px",
            textAlign: "center",
            color: "#fff",
          }}>
            <FaExclamationTriangle style={{ fontSize: "48px", color: "#ef4444", marginBottom: "16px" }} />
            <h3 style={{ marginBottom: "12px", fontSize: "20px" }}>Interview Paused</h3>
            <p style={{ color: "#94a3b8", marginBottom: "20px", lineHeight: 1.6 }}>{streamWarning}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              {!isCameraReady && (
                <button type="button" onClick={requestCamera} className="preflight-btn" style={{ padding: "10px 20px" }}>
                  <FaVideo style={{ marginRight: "6px" }} /> Re-enable Camera
                </button>
              )}
              {!isMicReady && (
                <button type="button" onClick={requestMicrophone} className="preflight-btn" style={{ padding: "10px 20px" }}>
                  <FaMicrophone style={{ marginRight: "6px" }} /> Re-enable Microphone
                </button>
              )}
              {!isScreenReady && (
                <button type="button" onClick={requestScreenShare} className="preflight-btn" style={{ padding: "10px 20px" }}>
                  <FaDesktop style={{ marginRight: "6px" }} /> Re-enable Screen Share
                </button>
              )}
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
                    {sessionQuestions.length > 0 && (() => {
                      const currentRoundIdx = Math.min(Math.floor(currentQIndex / 5), 3);
                      const activeRound = [
                        { id: 1, title: "Aptitude & Logical Reasoning", icon: "🧩", short: "Aptitude & Logic", range: "Q1-5" },
                        { id: 2, title: "Data Structures & Algorithms", icon: "💻", short: "DSA & Core", range: "Q6-10" },
                        { id: 3, title: `Company Architecture (${company})`, icon: "🏢", short: "Company Design", range: "Q11-15" },
                        { id: 4, title: "Behavioral & HR Leadership Round", icon: "👥", short: "HR & Leadership", range: "Q16-20" },
                      ][currentRoundIdx];

                      return (
                        <div className="interview-workspace">
                          {/* 4-ROUND STAGE TRACKER TABS */}
                          <div className="rounds-stage-tracker">
                            {[
                              { id: 1, title: "Aptitude & Logic", icon: "🧩", short: "Aptitude", startIdx: 0, endIdx: 4 },
                              { id: 2, title: "DSA & Technical", icon: "💻", short: "DSA & Coding", startIdx: 5, endIdx: 9 },
                              { id: 3, title: `Company & Design`, icon: "🏢", short: "Company Design", startIdx: 10, endIdx: 14 },
                              { id: 4, title: "Behavioral & HR", icon: "👥", short: "HR & Culture", startIdx: 15, endIdx: 19 },
                            ].map((r, rIdx) => {
                              const isCurrentRound = currentRoundIdx === rIdx;
                              const evaluatedInRound = sessionQuestions
                                .slice(r.startIdx, r.endIdx + 1)
                                .filter((q) => !!questionEvaluations[q.id]).length;
                              const isRoundDone = evaluatedInRound === 5;
                              return (
                                <div
                                  key={r.id}
                                  className={`round-stage-pill ${isCurrentRound ? "active" : ""} ${isRoundDone ? "completed" : ""}`}
                                  onClick={() => {
                                    setCurrentQIndex(r.startIdx);
                                    setShowHint(false);
                                  }}
                                >
                                  <div className="round-pill-icon">{r.icon}</div>
                                  <div className="round-pill-info">
                                    <span className="round-pill-title">Round {r.id}: {r.short}</span>
                                    <small className="round-pill-progress">
                                      {evaluatedInRound}/5 Evaluated {isRoundDone ? "✓" : ""}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* 20-QUESTION QUICK NAVIGATION MATRIX */}
                          <div className="questions-matrix-row">
                            {sessionQuestions.map((q, idx) => {
                              const roundNum = Math.floor(idx / 5) + 1;
                              const evaluation = questionEvaluations[q.id];
                              const isEvaluated = !!evaluation;
                              const isPass = isEvaluated && (evaluation.status === "correct" || evaluation.score >= 70);
                              const isPartial = isEvaluated && (evaluation.status === "partial" || (evaluation.score >= 40 && evaluation.score < 70));
                              const isFail = isEvaluated && !isPass && !isPartial;
                              
                              const userAns = (answers[q.id] || "").trim();
                              const defaultTemplate = (q.starter_templates && q.starter_templates.javascript) ? q.starter_templates.javascript.trim() : "";
                              const isDrafting = !isEvaluated && userAns.length > 0 && userAns !== defaultTemplate;

                              const statusClass = isPass
                                ? "evaluated-pass"
                                : isPartial
                                ? "evaluated-partial"
                                : isFail
                                ? "evaluated-fail"
                                : isDrafting
                                ? "drafting"
                                : "";

                              return (
                                <button
                                  key={q.id}
                                  type="button"
                                  onClick={() => {
                                    setCurrentQIndex(idx);
                                    setShowHint(false);
                                  }}
                                  className={`question-matrix-btn round-${roundNum} ${currentQIndex === idx ? "active" : ""} ${statusClass}`}
                                  title={`Round ${roundNum}: Q${idx + 1} (${q.category}) • ${isEvaluated ? `Evaluated: ${evaluation.score}%` : isDrafting ? "Drafting answer" : "Unanswered"}`}
                                >
                                  {isPass && <span className="tab-evaluated-dot pass">✓</span>}
                                  {isPartial && <span className="tab-evaluated-dot partial">~</span>}
                                  {isFail && <span className="tab-evaluated-dot fail">✗</span>}
                                  {isDrafting && <span className="tab-draft-dot" />}
                                  <span className="q-num">{idx + 1}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Top Run / Submission Toast Notification */}
                          {runSuccessToast && (
                            <div className="cockpit-toast-banner animate-fade-in">
                              <span>{runSuccessToast}</span>
                            </div>
                          )}

                          {/* ================= QUESTION PROMPT / DSA PROBLEM CARD ================= */}
                          {(() => {
                            const curQ = sessionQuestions[currentQIndex];
                            const isDSA = currentRoundIdx === 1 || (curQ?.test_cases && curQ.test_cases.length > 0);
                            const qTestResults = testResultsMap[curQ?.id];
                            const isSubmitted = !!submittedCodeMap[curQ?.id];

                            return (
                              <>
                                <div className={`cockpit-question-box ${currentRoundIdx === 3 ? "hr-round-box" : ""} ${isDSA ? "dsa-structured-box" : ""}`}>
                                  <div className="question-box-header">
                                    <div className="q-badge-group">
                                      <span className="round-badge">
                                        {activeRound.icon} Round {activeRound.id}/4: {activeRound.title}
                                      </span>
                                      <span className="q-badge">
                                        Question {currentQIndex + 1} of {sessionQuestions.length} • {curQ?.category}
                                      </span>
                                      {curQ?.difficulty && (
                                        <span className={`dsa-diff-pill ${curQ.difficulty.toLowerCase()}`}>
                                          {curQ.difficulty}
                                        </span>
                                      )}
                                      {questionEvaluations[curQ?.id] && (
                                        <span className={`dsa-solved-pill ${questionEvaluations[curQ.id].status || "evaluated"}`}>
                                          {questionEvaluations[curQ.id].score >= 70 ? "✓ Evaluated" : questionEvaluations[curQ.id].score >= 40 ? "⚠️ Partial" : "✗ Needs Work"} ({questionEvaluations[curQ.id].score}/100)
                                        </span>
                                      )}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      {/* Quick Top Navigation Controls */}
                                      <div className="q-nav-top-controls">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCurrentQIndex((prev) => Math.max(prev - 1, 0));
                                            setShowHint(false);
                                            setActiveTestCaseTab(0);
                                          }}
                                          disabled={currentQIndex === 0}
                                          className="q-top-nav-btn"
                                          title="Previous Question"
                                        >
                                          ← Prev
                                        </button>
                                        <span className="q-top-nav-counter">
                                          {currentQIndex + 1} / {sessionQuestions.length}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCurrentQIndex((prev) => Math.min(prev + 1, sessionQuestions.length - 1));
                                            setShowHint(false);
                                            setActiveTestCaseTab(0);
                                          }}
                                          disabled={currentQIndex >= sessionQuestions.length - 1}
                                          className="q-top-nav-btn"
                                          title="Next Question"
                                        >
                                          Next →
                                        </button>
                                      </div>

                                      {curQ?.hint && (
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
                                  </div>

                                  {/* HR AUDIO NARRATOR (Round 4) */}
                                  {currentRoundIdx === 3 && (
                                    <div className={`hr-audio-question-banner ${isSpeakingQuestion ? "speaking" : ""}`}>
                                      <div className="hr-audio-status-wrap">
                                        <div className={`hr-audio-eq-bars ${isSpeakingQuestion ? "active" : ""}`}>
                                          <span className="eq-bar bar-1"></span>
                                          <span className="eq-bar bar-2"></span>
                                          <span className="eq-bar bar-3"></span>
                                          <span className="eq-bar bar-4"></span>
                                          <span className="eq-bar bar-5"></span>
                                        </div>
                                        <div className="hr-audio-text-info">
                                          <span className="hr-audio-state-tag">
                                            {isSpeakingQuestion ? "🎙️ AI HR Interviewer Asking Question (Audio Live)..." : "🔊 Audio Question Narrator Ready"}
                                          </span>
                                          <small>Round 4 requires answering in both spoken audio and text.</small>
                                        </div>
                                      </div>

                                      <div className="hr-audio-controls-row">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isSpeakingQuestion) {
                                              stopQuestionAudio();
                                            } else {
                                              speakQuestionAudio(`Question ${currentQIndex + 1}. ${curQ?.question}`);
                                            }
                                          }}
                                          className={`hr-audio-action-btn ${isSpeakingQuestion ? "stop" : "play"}`}
                                        >
                                          {isSpeakingQuestion ? <FaStop /> : <FaVolumeUp />}
                                          {isSpeakingQuestion ? "Stop Audio" : "Listen to Question"}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                                          className={`hr-autoplay-toggle-btn ${autoPlayAudio ? "active" : ""}`}
                                          title="Automatically speak each HR question when navigated to"
                                        >
                                          ⚡ Auto-Speak: <strong>{autoPlayAudio ? "ON" : "OFF"}</strong>
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Question Title & Description */}
                                  {curQ?.title && (
                                    <h3 className="dsa-problem-title">
                                      {curQ.title}
                                    </h3>
                                  )}
                                  <p className="question-prompt-text">
                                    {curQ?.description || curQ?.question}
                                  </p>

                                  {/* Structured Examples (For DSA / Coding Questions) */}
                                  {curQ?.examples && curQ.examples.length > 0 && (
                                    <div className="dsa-examples-container">
                                      <span className="dsa-section-label">📋 Examples:</span>
                                      <div className="dsa-examples-grid">
                                        {curQ.examples.map((ex, exIdx) => (
                                          <div key={exIdx} className="dsa-example-card">
                                            <div className="dsa-example-header">Example {exIdx + 1}:</div>
                                            <div className="dsa-example-body">
                                              <div className="dsa-io-row">
                                                <strong>Input:</strong> <code>{ex.input}</code>
                                              </div>
                                              <div className="dsa-io-row">
                                                <strong>Output:</strong> <code>{ex.output}</code>
                                              </div>
                                              {ex.explanation && (
                                                <div className="dsa-io-row explanation">
                                                  <strong>Explanation:</strong> <span>{ex.explanation}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Constraints Pills */}
                                  {curQ?.constraints && curQ.constraints.length > 0 && (
                                    <div className="dsa-constraints-container">
                                      <span className="dsa-section-label">⚡ Constraints & Complexity:</span>
                                      <div className="dsa-constraints-wrap">
                                        {curQ.constraints.map((cStr, cIdx) => (
                                          <span key={cIdx} className="dsa-constraint-pill">
                                            • {cStr}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {showHint && curQ?.hint && (
                                    <div className="hint-revealed-box">
                                      💡 <strong>Interviewer Guidance:</strong> {curQ.hint}
                                    </div>
                                  )}
                                </div>

                                {/* ================= CODE / SOLUTION EDITOR CONTAINER ================= */}
                                <div className={`solution-editor-container ${currentRoundIdx === 3 ? "hr-editor-mode" : ""} ${isDSA ? "dsa-editor-mode" : ""} editor-screen-${editorScreenMode}`}>
                                  {currentRoundIdx === 3 && (
                                    <div className="hr-dual-mode-banner">
                                      <div className="hr-banner-left">
                                        <span className="hr-mode-badge">🎙️ Audio + ✍️ Text Response Active</span>
                                        <span className="hr-mode-desc">Speak naturally with your microphone or type your structured STAR response. Both are synchronized.</span>
                                      </div>
                                      {isDictating && (
                                        <div className="hr-live-recording-badge">
                                          <span className="live-pulse-dot"></span>
                                          Listening & Transcribing Live...
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="editor-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                      {isDSA ? (
                                        <>
                                          <div className="dsa-lang-selector-wrap">
                                            <FaCode style={{ color: "#38bdf8" }} />
                                            <select
                                              value={selectedLanguage}
                                              onChange={(e) => handleLanguageChange(e.target.value, curQ)}
                                              className="dsa-lang-select"
                                            >
                                              <option value="javascript">JavaScript (Live Sandbox)</option>
                                              <option value="python">Python 3</option>
                                              <option value="cpp">C++ (GCC)</option>
                                              <option value="java">Java 17</option>
                                            </select>
                                          </div>
                                          {isSubmitted && (
                                            <span className="editor-verified-badge">
                                              <FaCheckCircle /> Solution Submitted
                                            </span>
                                          )}
                                        </>
                                      ) : currentRoundIdx === 3 ? (
                                        <>
                                          <FaMicrophone style={{ color: "#38bdf8" }} />
                                          <label>Your HR Voice & Text Response:</label>
                                        </>
                                      ) : (
                                        <>
                                          <FaCode style={{ color: "#38bdf8" }} />
                                          <label>Your Structured Solution & Response:</label>
                                        </>
                                      )}
                                    </div>

                                    {/* Actions Toolbar */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                      {/* Sizing Pills: Normal / Half / Max */}
                                      <div className="editor-screen-mode-pills">
                                        <button
                                          type="button"
                                          onClick={() => setEditorScreenMode("normal")}
                                          className={`editor-mode-pill-btn ${editorScreenMode === "normal" ? "active" : ""}`}
                                          title="Standard Split View"
                                        >
                                          <FaDesktop /> Normal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditorScreenMode("half")}
                                          className={`editor-mode-pill-btn ${editorScreenMode === "half" ? "active" : ""}`}
                                          title="50% Half Screen Editor"
                                        >
                                          <FaColumns /> Half
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditorScreenMode("max")}
                                          className={`editor-mode-pill-btn ${editorScreenMode === "max" ? "active" : ""}`}
                                          title="Maximize Full Viewport Code Editor"
                                        >
                                          <FaExpand /> Max
                                        </button>
                                      </div>

                                      {isDSA && (
                                        <button
                                          type="button"
                                          onClick={() => handleResetDSAStarter(curQ)}
                                          className="editor-tool-btn"
                                          title="Reset to Starter Code"
                                        >
                                          <FaUndo /> Reset
                                        </button>
                                      )}

                                      {currentRoundIdx === 3 ? (
                                        <button
                                          type="button"
                                          onClick={handleInsertSTARTemplate}
                                          className="editor-tool-btn star-btn"
                                          title="Insert STAR Template"
                                        >
                                          <FaStar style={{ color: "#fbbf24" }} /> STAR Template
                                        </button>
                                      ) : !isDSA ? (
                                        <button
                                          type="button"
                                          onClick={handleInsertTemplate}
                                          className="editor-tool-btn"
                                          title="Insert Solution Template"
                                        >
                                          <FaFileAlt /> Template
                                        </button>
                                      ) : null}

                                      <button
                                        type="button"
                                        onClick={handleClearAnswer}
                                        className="editor-tool-btn clear"
                                        title="Clear Response"
                                      >
                                        <FaTrashAlt />
                                      </button>

                                      {/* DSA RUN & SUBMIT BUTTONS */}
                                      {isDSA ? (
                                        <div className="dsa-execution-btn-cluster">
                                          <button
                                            type="button"
                                            onClick={() => handleRunCodeTests(curQ)}
                                            disabled={isRunningTests}
                                            className="dsa-run-code-btn"
                                            title="Run code against visible and custom test cases"
                                          >
                                            {isRunningTests ? <FaSpinner className="fa-spin" /> : <FaPlay />}
                                            {isRunningTests ? "Running Tests..." : "Run Code"}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleSubmitCodeSolution(curQ)}
                                            disabled={isRunningTests}
                                            className={`dsa-submit-solution-btn ${isSubmitted ? "already-submitted" : ""}`}
                                            title="Submit solution for formal evaluation against all test suites"
                                          >
                                            <FaCheckCircle />
                                            {isSubmitted ? "✓ Submitted" : "Submit Code"}
                                          </button>
                                        </div>
                                      ) : (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          <button
                                            type="button"
                                            onClick={() => handleSubmitSingleQuestion(curQ)}
                                            disabled={isSubmittingQuestion}
                                            className="question-submit-answer-btn"
                                            title="Submit your answer to this question for AI evaluation"
                                          >
                                            {isSubmittingQuestion ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                                            {isSubmittingQuestion ? "Evaluating..." : questionEvaluations[curQ?.id] ? "Re-submit & Evaluate" : "Submit Answer"}
                                          </button>
                                          {/* VOICE DICTATION (Non-DSA rounds) */}
                                          <button
                                            type="button"
                                            onClick={toggleVoiceDictation}
                                            className={`voice-dictation-btn ${isDictating ? "active pulse" : ""} ${currentRoundIdx === 3 ? "hr-primary-voice" : ""}`}
                                            title="Record your voice response with real-time speech transcription"
                                          >
                                            <FaMicrophone className={isDictating ? "pulse-dot" : ""} />
                                            {isDictating ? "🎙️ Recording..." : currentRoundIdx === 3 ? "🎙️ Answer with Voice" : "🎙️ Dictate"}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Code Textarea */}
                                  <textarea
                                    rows={isDSA ? 12 : currentRoundIdx === 3 ? 11 : 10}
                                    value={answers[curQ?.id] || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAnswers((prev) => ({
                                        ...prev,
                                        [curQ.id]: val,
                                      }));
                                    }}
                                    placeholder={
                                      isDSA
                                        ? `// Write your ${selectedLanguage} solution here...\n// Function signature: ${curQ?.function_name || "solution"}(...)`
                                        : currentRoundIdx === 3
                                        ? "// Speak into your microphone (click 'Answer with Voice' above) or type your response here...\n// [Situation]: Outline the specific scenario or production challenge.\n// [Task]: What was your goal and ownership?\n// [Action]: What concrete technical and leadership steps did you take?\n// [Result]: What was the measurable impact and takeaway?"
                                        : "// Type or voice-dictate your structured response here:\n// 1. High-Level Technical Approach\n// 2. Implementation & Architecture\n// 3. Time/Space Complexity O(...) & Trade-offs\n// 4. Edge Cases, Resiliency & Scale..."
                                    }
                                    className={`technical-code-textarea ${isDSA ? "dsa-code-mono" : ""}`}
                                    spellCheck={false}
                                  />

                                  {/* ================= LEETCODE-STYLE TEST CASES & RESULTS DRAWER (DSA Round) ================= */}
                                  {isDSA && curQ?.test_cases && curQ.test_cases.length > 0 && (
                                    <div className={`lc-testcase-drawer ${isConsoleDrawerOpen ? "open" : "collapsed"}`}>
                                      {/* Drawer Top Tab Bar (Testcase / Test Result) */}
                                      <div className="lc-drawer-top-tabs">
                                        <div className="lc-tabs-left">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setTestcaseSubTab("testcase");
                                              setIsConsoleDrawerOpen(true);
                                            }}
                                            className={`lc-subtab-btn ${testcaseSubTab === "testcase" ? "active" : ""}`}
                                          >
                                            <FaListAlt className="lc-subtab-icon" /> Testcase
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setTestcaseSubTab("result");
                                              setIsConsoleDrawerOpen(true);
                                            }}
                                            className={`lc-subtab-btn ${testcaseSubTab === "result" ? "active" : ""}`}
                                          >
                                            <FaTerminal className="lc-subtab-icon" /> Test Result
                                            {qTestResults && (
                                              <span className={`lc-tab-badge ${qTestResults.success ? "success" : "fail"}`}>
                                                {qTestResults.passedCount}/{qTestResults.totalCount}
                                              </span>
                                            )}
                                          </button>
                                        </div>

                                        <div className="lc-tabs-right">
                                          <button
                                            type="button"
                                            onClick={() => setIsConsoleDrawerOpen(!isConsoleDrawerOpen)}
                                            className="lc-collapse-toggle-btn"
                                            title={isConsoleDrawerOpen ? "Collapse Console Drawer" : "Expand Console Drawer"}
                                          >
                                            {isConsoleDrawerOpen ? "▼ Collapse" : "▲ Expand Console"}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Drawer Main Body */}
                                      {isConsoleDrawerOpen && (
                                        <div className="lc-drawer-content animate-fade-in">
                                          {/* ================= SUBTAB 1: TESTCASE ================= */}
                                          {testcaseSubTab === "testcase" && (
                                            <div className="lc-testcase-view">
                                              {/* Case Pills */}
                                              <div className="lc-case-pills-row">
                                                {curQ.test_cases.map((tc, tcIdx) => (
                                                  <button
                                                    key={tc.id || tcIdx}
                                                    type="button"
                                                    onClick={() => setActiveTestCaseTab(tcIdx)}
                                                    className={`lc-case-pill ${activeTestCaseTab === tcIdx ? "active" : ""}`}
                                                  >
                                                    Case {tcIdx + 1}
                                                  </button>
                                                ))}

                                                <button
                                                  type="button"
                                                  onClick={() => setActiveTestCaseTab("custom")}
                                                  className={`lc-case-pill custom-add ${activeTestCaseTab === "custom" ? "active" : ""}`}
                                                  title="Add Custom Test Case"
                                                >
                                                  + Custom Case
                                                </button>
                                              </div>

                                              {/* Active Case Parameter Breakdown */}
                                              {activeTestCaseTab !== "custom" && curQ.test_cases[activeTestCaseTab] && (() => {
                                                const tc = curQ.test_cases[activeTestCaseTab];
                                                const rawInput = tc.input;
                                                const isArrayInput = Array.isArray(rawInput);

                                                return (
                                                  <div className="lc-case-inputs-body">
                                                    <div className="lc-param-block">
                                                      <span className="lc-param-label">Input:</span>
                                                      <div className="lc-param-value-card">
                                                        <pre>{tc.inputStr || (isArrayInput ? JSON.stringify(rawInput) : JSON.stringify(rawInput, null, 2))}</pre>
                                                      </div>
                                                    </div>

                                                    <div className="lc-param-block">
                                                      <span className="lc-param-label">Expected Output:</span>
                                                      <div className="lc-param-value-card expected">
                                                        <pre>{tc.expectedOutputStr || JSON.stringify(tc.expectedOutput)}</pre>
                                                      </div>
                                                    </div>

                                                    {tc.explanation && (
                                                      <div className="lc-case-explanation">
                                                        <span>💡 <strong>Note:</strong> {tc.explanation}</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })()}

                                              {/* Custom Input Tab */}
                                              {activeTestCaseTab === "custom" && (
                                                <div className="lc-custom-case-editor">
                                                  <div className="lc-custom-grid">
                                                    <div className="lc-custom-col">
                                                      <label>Custom Input Parameters:</label>
                                                      <textarea
                                                        rows={3}
                                                        value={customTestInput}
                                                        onChange={(e) => setCustomTestInput(e.target.value)}
                                                        placeholder='e.g. [[1, 2, 3, 5, 6, 8, 9, 10]] or [4, [[0,1],[1,2]]]'
                                                        className="lc-custom-textarea"
                                                      />
                                                    </div>
                                                    <div className="lc-custom-col">
                                                      <label>Expected Output (Optional):</label>
                                                      <textarea
                                                        rows={3}
                                                        value={customExpected}
                                                        onChange={(e) => setCustomExpected(e.target.value)}
                                                        placeholder='e.g. 5 or [0, 5, 7, 11]'
                                                        className="lc-custom-textarea"
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="lc-custom-footer-actions">
                                                    <button
                                                      type="button"
                                                      onClick={() => handleRunCustomTest(curQ)}
                                                      disabled={isRunningTests || !customTestInput.trim()}
                                                      className="lc-run-custom-action-btn"
                                                    >
                                                      {isRunningTests ? <FaSpinner className="fa-spin" /> : <FaPlay />} Run Custom Input
                                                    </button>

                                                    {qTestResults?.customResult && (
                                                      <div className={`lc-custom-feedback ${qTestResults.customResult.passed ? "passed" : "failed"}`}>
                                                        <span>Actual Output: <code>{qTestResults.customResult.actual}</code></span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}

                                          {/* ================= SUBTAB 2: TEST RESULT ================= */}
                                          {testcaseSubTab === "result" && (
                                            <div className="lc-testresult-view">
                                              {!qTestResults ? (
                                                <div className="lc-empty-result-state">
                                                  <FaTerminal style={{ fontSize: "28px", color: "#64748b", marginBottom: "8px" }} />
                                                  <h4>You must run your code first.</h4>
                                                  <p>Click the <strong>Run Code</strong> button below to execute your solution against all test suites.</p>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleRunCodeTests(curQ)}
                                                    disabled={isRunningTests}
                                                    className="dsa-run-code-btn"
                                                    style={{ marginTop: "12px" }}
                                                  >
                                                    {isRunningTests ? <FaSpinner className="fa-spin" /> : <FaPlay />} Run Code
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="lc-result-populated-wrap">
                                                  {/* LeetCode Verdict Header */}
                                                  <div className="lc-verdict-header">
                                                    <div className="lc-verdict-main">
                                                      {qTestResults.passedCount === qTestResults.totalCount ? (
                                                        <div className="lc-verdict-title accepted">
                                                          <span>Accepted</span>
                                                          <small className="lc-runtime-tag">Runtime: {qTestResults.executionTimeMs} ms</small>
                                                        </div>
                                                      ) : (
                                                        <div className="lc-verdict-title wrong-answer">
                                                          <span>Wrong Answer</span>
                                                          <small className="lc-runtime-tag">{qTestResults.passedCount} / {qTestResults.totalCount} testcases passed</small>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>

                                                  {/* Result Case Selector Pills */}
                                                  <div className="lc-result-pills-row">
                                                    {curQ.test_cases.map((tc, tcIdx) => {
                                                      const tcResult = qTestResults.results?.find((r) => r.id === tc.id || r.name === tc.name);
                                                      const isPassed = tcResult?.passed;
                                                      const isFailed = tcResult && !tcResult.passed;

                                                      return (
                                                        <button
                                                          key={tc.id || tcIdx}
                                                          type="button"
                                                          onClick={() => setActiveTestCaseTab(tcIdx)}
                                                          className={`lc-result-case-pill ${activeTestCaseTab === tcIdx ? "active" : ""} ${isPassed ? "passed" : isFailed ? "failed" : ""}`}
                                                        >
                                                          <span className={`lc-status-dot ${isPassed ? "pass" : "fail"}`}>
                                                            {isPassed ? "✓" : "✗"}
                                                          </span>
                                                          Case {tcIdx + 1}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>

                                                  {/* Selected Case Result Comparison */}
                                                  {activeTestCaseTab !== "custom" && curQ.test_cases[activeTestCaseTab] && (() => {
                                                    const tc = curQ.test_cases[activeTestCaseTab];
                                                    const tcResult = qTestResults.results?.find((r) => r.id === tc.id || r.name === tc.name);

                                                    return (
                                                      <div className="lc-result-comparison-cards">
                                                        <div className="lc-result-card">
                                                          <span className="lc-card-label">Input:</span>
                                                          <div className="lc-card-content">
                                                            <pre>{tc.inputStr || JSON.stringify(tc.input, null, 2)}</pre>
                                                          </div>
                                                        </div>

                                                        <div className="lc-result-card">
                                                          <span className="lc-card-label">Output:</span>
                                                          <div className={`lc-card-content ${tcResult?.passed ? "output-pass" : "output-fail"}`}>
                                                            <pre>{tcResult ? tcResult.actual : "Pending execution"}</pre>
                                                          </div>
                                                        </div>

                                                        <div className="lc-result-card">
                                                          <span className="lc-card-label">Expected:</span>
                                                          <div className="lc-card-content expected">
                                                            <pre>{tc.expectedOutputStr || JSON.stringify(tc.expectedOutput, null, 2)}</pre>
                                                          </div>
                                                        </div>

                                                        {/* Stdout Console Stream */}
                                                        {qTestResults.logs && qTestResults.logs.length > 0 && (
                                                          <div className="lc-result-card stdout">
                                                            <span className="lc-card-label">Stdout:</span>
                                                            <div className="lc-stdout-box">
                                                              {qTestResults.logs.map((log, lIdx) => (
                                                                <div key={lIdx} className="lc-stdout-line">
                                                                  {log}
                                                                </div>
                                                              ))}
                                                            </div>
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })()}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* LeetCode Bottom Drawer Action Bar */}
                                      <div className="lc-drawer-bottom-bar">
                                        <div className="lc-bottom-bar-left">
                                          <button
                                            type="button"
                                            onClick={() => setIsConsoleDrawerOpen(!isConsoleDrawerOpen)}
                                            className="lc-console-toggle-btn"
                                          >
                                            <FaTerminal className="console-icon" /> Console {isConsoleDrawerOpen ? "▼" : "▲"}
                                          </button>
                                        </div>

                                        <div className="lc-bottom-bar-right">
                                          <button
                                            type="button"
                                            onClick={() => handleRunCodeTests(curQ)}
                                            disabled={isRunningTests}
                                            className="lc-action-run-btn"
                                            title="Run code against test cases"
                                          >
                                            {isRunningTests ? <FaSpinner className="fa-spin" /> : <FaPlay />}
                                            {isRunningTests ? "Running..." : "Run"}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleSubmitCodeSolution(curQ)}
                                            disabled={isRunningTests}
                                            className={`lc-action-submit-btn ${isSubmitted ? "submitted" : ""}`}
                                            title="Submit solution for formal evaluation"
                                          >
                                            <FaCheckCircle />
                                            {isSubmitted ? "Submitted" : "Submit"}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* INDIVIDUAL QUESTION EVALUATION RESULT CARD */}
                                  {questionEvaluations[curQ?.id] && (() => {
                                    const evalItem = questionEvaluations[curQ.id];
                                    const isPass = evalItem.status === "correct" || evalItem.score >= 70;
                                    const isPartial = evalItem.status === "partial" || (evalItem.score >= 40 && evalItem.score < 70);
                                    const cardClass = isPass ? "pass" : isPartial ? "partial" : "fail";

                                    return (
                                      <div className={`question-eval-result-card ${cardClass} animate-fade-in`}>
                                        <div className="eval-result-header">
                                          <div className="eval-status-pill">
                                            {isPass ? <FaCheckCircle /> : isPartial ? <FaLightbulb /> : <FaTimes />}
                                            <span>{evalItem.verdict || (isPass ? "Accepted" : isPartial ? "Partially Correct" : "Needs Improvement")}</span>
                                          </div>
                                          <div className="eval-score-badge">
                                            Question Score: <strong>{evalItem.score}/100</strong>
                                          </div>
                                        </div>

                                        <div className="eval-feedback-body">
                                          <p className="eval-commentary">{evalItem.feedback}</p>

                                          {evalItem.identified_keywords && evalItem.identified_keywords.length > 0 && (
                                            <div className="eval-kw-chips">
                                              <span className="eval-chip-label">Concepts Detected:</span>
                                              {evalItem.identified_keywords.map((kw, kIdx) => (
                                                <span key={kIdx} className="eval-chip">✓ {kw}</span>
                                              ))}
                                            </div>
                                          )}

                                          {evalItem.suggested_answer_points && evalItem.suggested_answer_points.length > 0 && (
                                            <div className="eval-model-points">
                                              <span className="eval-points-label">💡 Key Solution Points to Include:</span>
                                              <ul>
                                                {evalItem.suggested_answer_points.map((pt, pIdx) => (
                                                  <li key={pIdx}>{pt}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}

                                  {/* Editor Stats Footer */}
                                  <div className="editor-stats-footer">
                                    <span>Words: <strong>{wordCount}</strong> | Chars: <strong>{charCount}</strong></span>
                                    {isDSA ? (
                                      <span className="dsa-footer-hint">
                                        ✦ LeetCode Assessment Sandbox • Tests verified in real-time
                                      </span>
                                    ) : currentRoundIdx === 3 ? (
                                      <span className="hr-footer-hint">✦ Audio Speech & Written Text Synchronized • STAR Evaluation</span>
                                    ) : (
                                      <span>✦ Round {activeRound.id} of 4 ({activeRound.range})</span>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })()}

                          {/* Navigation & Submit Bar */}
                          <div className="cockpit-footer-actions">
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentQIndex((prev) => Math.max(prev - 1, 0));
                                setShowHint(false);
                                setActiveTestCaseTab(0);
                              }}
                              disabled={currentQIndex === 0}
                              className="cockpit-prev-btn"
                              title={currentQIndex === 0 ? "You are on the first question" : `Go back to Question ${currentQIndex}`}
                            >
                              ← Previous Question
                            </button>

                            <div className="cockpit-footer-middle">
                              <button
                                type="button"
                                onClick={() => {
                                  const curQ = sessionQuestions[currentQIndex];
                                  handleSubmitSingleQuestion(curQ);
                                }}
                                disabled={isSubmittingQuestion}
                                className="cockpit-submit-q-btn"
                                title="Evaluate current question answer"
                              >
                                {isSubmittingQuestion ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                                {isSubmittingQuestion ? "Evaluating Question..." : questionEvaluations[sessionQuestions[currentQIndex]?.id] ? "✓ Re-evaluate This Question" : "Submit This Question"}
                              </button>
                            </div>

                            {currentQIndex < sessionQuestions.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentQIndex((prev) => Math.min(prev + 1, sessionQuestions.length - 1));
                                  setShowHint(false);
                                  setActiveTestCaseTab(0);
                                }}
                                className="cockpit-next-btn"
                              >
                                {((currentQIndex + 1) % 5 === 0)
                                  ? `Next Round (Round ${Math.floor((currentQIndex + 1) / 5) + 1}) →`
                                  : "Next Question →"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSubmitInterview}
                                disabled={loading}
                                className="cockpit-submit-btn"
                              >
                                {loading ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                                {loading ? "Evaluating AI Rubrics..." : "Submit All 4 Rounds & Generate AI Report"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
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
                    {company} • {role} ({difficulty}) • All 4 Rounds Completed (20 Questions)
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
                    <small>DSA & Architecture</small>
                  </div>

                  <div className="score-summary-card">
                    <span className="score-label">Communication</span>
                    <h3 className="score-val purple">{evaluationResult.communication_score || 85}%</h3>
                    <small>Clarity & HR Round</small>
                  </div>

                  <div className="score-summary-card">
                    <span className="score-label">Problem Solving</span>
                    <h3 className="score-val amber">{evaluationResult.problem_solving_score || 84}%</h3>
                    <small>Aptitude & Logic</small>
                  </div>
                </div>

                {/* 4-Round Performance Matrix */}
                <div className="report-rounds-matrix">
                  <h4>🎯 4-Round Interview Performance Breakdown</h4>
                  <div className="report-rounds-grid">
                    {(evaluationResult.rounds_breakdown || [
                      { round_number: 1, title: "Aptitude & Logical Reasoning", score: Math.round(evaluationResult.problem_solving_score || 80), questions_count: 5 },
                      { round_number: 2, title: "Data Structures & Algorithms", score: Math.round(evaluationResult.technical_score || 85), questions_count: 5 },
                      { round_number: 3, title: `Company System Design (${company})`, score: Math.round((evaluationResult.technical_score + evaluationResult.problem_solving_score) / 2 || 82), questions_count: 5 },
                      { round_number: 4, title: "Behavioral & HR Leadership", score: Math.round(evaluationResult.communication_score || 88), questions_count: 5 },
                    ]).map((rb) => {
                      const score = rb.score;
                      const badge = score >= 85 ? "Strong Hire" : score >= 70 ? "Hire" : score >= 50 ? "Average" : "Needs Practice";
                      return (
                        <div key={rb.round_number} className="round-score-card">
                          <div className="round-score-top">
                            <span className="round-num-tag">Round {rb.round_number} (5 Qs)</span>
                            <span className={`round-score-badge ${score >= 70 ? "pass" : "retry"}`}>{badge}</span>
                          </div>
                          <h5>{rb.title}</h5>
                          <div className="round-score-val-wrap">
                            <span className="round-score-val">{score}%</span>
                            <div className="round-score-bar-bg">
                              <div className="round-score-bar-fill" style={{ width: `${score}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                    <h4>📝 Question-by-Question Detailed Analysis (20 Questions across 4 Rounds)</h4>
                    <div className="report-questions-list">
                      {evaluationResult.detailed_feedback.map((qf, idx) => {
                        const roundNum = Math.floor(idx / 5) + 1;
                        const roundName = ["Aptitude & Logic", "DSA & Technical Core", `Company Architecture (${company})`, "Behavioral & HR Leadership"][roundNum - 1];
                        return (
                          <div key={idx} className="report-question-item">
                            <div className="item-header">
                              <div>
                                <span className="item-round-tag">Round {roundNum}: {roundName}</span>
                                <span className="item-q-title">Q{idx + 1}: {qf.question}</span>
                              </div>
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
                        );
                      })}
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