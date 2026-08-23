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
  const r2 = DSA_BY_ROLE[roleName] || DSA_BY_ROLE["Frontend Developer"];
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
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
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

  // 1. START INTERVIEW HANDLER (20 Questions across 4 Rounds)
  const startLiveInterviewSession = async () => {
    setShowPreFlightModal(false);
    setLoading(true);
    setEvaluationResult(null);
    setCurrentQIndex(0);
    setShowHint(false);
    setTimeLeft(60 * 60); // 60 minutes for 20 questions
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
        // continue
      }
    }

    // Fallback if backend unreachable or returns less than 20
    if (!fetchedQuestions || fetchedQuestions.length < 20) {
      fetchedQuestions = generate20Questions(company, role);
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
                              const answeredInRound = sessionQuestions
                                .slice(r.startIdx, r.endIdx + 1)
                                .filter((q) => !!answers[q.id]?.trim()).length;
                              const isRoundDone = answeredInRound === 5;
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
                                      {answeredInRound}/5 Answered {isRoundDone ? "✓" : ""}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* 20-QUESTION QUICK NAVIGATION MATRIX */}
                          <div className="questions-matrix-row">
                            {sessionQuestions.map((q, idx) => {
                              const isAnswered = !!answers[q.id]?.trim();
                              const roundNum = Math.floor(idx / 5) + 1;
                              return (
                                <button
                                  key={q.id}
                                  type="button"
                                  onClick={() => {
                                    setCurrentQIndex(idx);
                                    setShowHint(false);
                                  }}
                                  className={`question-matrix-btn round-${roundNum} ${currentQIndex === idx ? "active" : ""} ${isAnswered ? "answered" : ""}`}
                                  title={`Round ${roundNum}: Q${idx + 1} (${q.category})`}
                                >
                                  {isAnswered && <span className="tab-answered-dot">✓</span>}
                                  <span className="q-num">{idx + 1}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Question Prompt Card */}
                          <div className={`cockpit-question-box ${currentRoundIdx === 3 ? "hr-round-box" : ""}`}>
                            <div className="question-box-header">
                              <div className="q-badge-group">
                                <span className="round-badge">
                                  {activeRound.icon} Round {activeRound.id}/4: {activeRound.title}
                                </span>
                                <span className="q-badge">
                                  Question {currentQIndex + 1} of {sessionQuestions.length} • {sessionQuestions[currentQIndex]?.category}
                                </span>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                            </div>

                            {/* HR & CULTURE AUDIO QUESTION NARRATOR BAR */}
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
                                        speakQuestionAudio(`Question ${currentQIndex + 1}. ${sessionQuestions[currentQIndex]?.question}`);
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

                            <h3 className="question-prompt-text">
                              {sessionQuestions[currentQIndex]?.question}
                            </h3>

                            {showHint && sessionQuestions[currentQIndex]?.hint && (
                              <div className="hint-revealed-box">
                                💡 <strong>Interviewer Guidance:</strong> {sessionQuestions[currentQIndex].hint}
                              </div>
                            )}
                          </div>

                          {/* Solution Code / Text Editor Box */}
                          <div className={`solution-editor-container ${currentRoundIdx === 3 ? "hr-editor-mode" : ""}`}>
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
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {currentRoundIdx === 3 ? (
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
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {currentRoundIdx === 3 ? (
                                  <button
                                    type="button"
                                    onClick={handleInsertSTARTemplate}
                                    className="editor-tool-btn star-btn"
                                    title="Insert STAR (Situation, Task, Action, Result) Template"
                                  >
                                    <FaStar style={{ color: "#fbbf24" }} /> STAR Template
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleInsertTemplate}
                                    className="editor-tool-btn"
                                    title="Insert Solution Template"
                                  >
                                    <FaFileAlt /> Template
                                  </button>
                                )}

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
                                  className={`voice-dictation-btn ${isDictating ? "active pulse" : ""} ${currentRoundIdx === 3 ? "hr-primary-voice" : ""}`}
                                  title="Record your voice response with real-time speech transcription"
                                >
                                  <FaMicrophone className={isDictating ? "pulse-dot" : ""} />
                                  {isDictating ? "🎙️ Recording Voice... (Click to Stop)" : currentRoundIdx === 3 ? "🎙️ Answer with Voice (Mic)" : "🎙️ Dictate with Voice"}
                                </button>
                              </div>
                            </div>

                            <textarea
                              rows={currentRoundIdx === 3 ? 11 : 10}
                              value={answers[sessionQuestions[currentQIndex]?.id] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAnswers((prev) => ({
                                  ...prev,
                                  [sessionQuestions[currentQIndex].id]: val,
                                }));
                              }}
                              placeholder={
                                currentRoundIdx === 3
                                  ? "// Speak into your microphone (click 'Answer with Voice' above) or type your response here...\n// [Situation]: Outline the specific scenario or production challenge.\n// [Task]: What was your goal and ownership?\n// [Action]: What concrete technical and leadership steps did you take?\n// [Result]: What was the measurable impact and takeaway?"
                                  : "// Type or voice-dictate your structured response here:\n// 1. High-Level Technical Approach & STAR Context\n// 2. Code Implementation, Algorithms & Architecture\n// 3. Time/Space Complexity O(...) & Trade-offs\n// 4. Edge Cases, Resiliency & Scale..."
                              }
                              className="technical-code-textarea"
                            />

                            {/* Editor Stats Footer */}
                            <div className="editor-stats-footer">
                              <span>Words: <strong>{wordCount}</strong></span>
                              <span>Characters: <strong>{charCount}</strong></span>
                              {currentRoundIdx === 3 ? (
                                <span className="hr-footer-hint">✦ Audio Speech & Written Text Synchronized • STAR Evaluation</span>
                              ) : (
                                <span>✦ Round {activeRound.id} of 4 ({activeRound.range})</span>
                              )}
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