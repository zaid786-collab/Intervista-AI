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
  FaBan,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import { generateInterviewPDF } from "../../utils/pdfGenerator";
import { evaluateInterview, evaluateSingleQuestion, evaluateQuestionAPI } from "../../utils/evaluator";
import { getToken, recordLocalInterviewSession, recordLocalScheduledInterview } from "../../api";
import { STRUCTURED_DSA_BY_ROLE } from "../../utils/dsaQuestions";
import { runTestCases } from "../../utils/codeRunner";
import { ProctoringManager, PROCTORING_VIOLATION_TYPES } from "../../utils/ProctoringManager";
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

const INTERVIEW_TYPES = [
  "Technical Interview",
  "Coding & DSA",
  "System Design & Architecture",
  "Behavioral & HR",
  "Comprehensive (All Rounds)",
];

const DOMAINS = [
  "C++",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "React",
  "Go (Golang)",
  "Rust",
  "SQL & Databases",
  "System Design & Architecture",
  "Machine Learning & AI",
  "Cloud & DevOps",
  "Custom / Other Topic",
];

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "AI / ML Engineer",
  "DevOps / SRE",
  "System Software Engineer",
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

const FALLBACK_DOMAIN_BANKS = {
  "C++": [
    {
      id: 1,
      round_number: 1,
      round_title: "C++ Modern Semantics & Memory",
      category: "C++ Modern Semantics",
      question: "Explain move semantics and rvalue references (&&) introduced in C++11. How does std::move convert an lvalue to an rvalue, and what actually happens during resource transfer?",
      hint: "Focus on preventing expensive deep copies of heap memory by transferring internal pointers and setting the source pointer to nullptr.",
      expected_key_points: ["Move semantics & rvalue references (&&)", "std::move ownership transfer", "Pointers reassignment and nullptr reset"],
      domain: "C++",
    },
    {
      id: 2,
      round_number: 1,
      round_title: "C++ Smart Pointers & RAII",
      category: "C++ Smart Pointers",
      question: "Compare std::unique_ptr and std::shared_ptr in C++. When would you use std::weak_ptr, and how does it prevent cyclic dependency memory leaks?",
      hint: "unique_ptr has zero runtime overhead with exclusive ownership; shared_ptr uses atomic reference counting control block; weak_ptr observes without incrementing strong refcount.",
      expected_key_points: ["Exclusive vs shared ownership semantics", "Atomic reference count overhead", "weak_ptr breaking reference cycles"],
      domain: "C++",
    },
    {
      id: 3,
      round_number: 1,
      round_title: "C++ Object Model & Virtual Dispatch",
      category: "C++ Vtable & Virtual Dispatch",
      question: "Describe how the C++ compiler and runtime implement dynamic polymorphism via vtables and vptrs. What are the space and runtime performance costs?",
      hint: "Each class with virtual functions gets a static vtable; each object gets a hidden 8-byte vptr pointing to the vtable. Virtual call requires double indirection.",
      expected_key_points: ["Vtable structure and per-instance vptr", "Double indirection invocation cost", "Virtual destructor importance for derived classes"],
      domain: "C++",
    },
    {
      id: 4,
      round_number: 1,
      round_title: "C++ Compile-Time Metaprogramming",
      category: "C++ Templates & Metaprogramming",
      question: "What is the difference between template specialization and function overloading in C++? How do modern C++20 Concepts improve upon SFINAE?",
      hint: "Concepts provide compile-time predicates evaluated cleanly with readable compiler diagnostics, avoiding verbose std::enable_if SFINAE boilerplate.",
      expected_key_points: ["SFINAE vs C++20 concepts constraints", "Template specialization rules", "Compile-time validation and diagnostics"],
      domain: "C++",
    },
    {
      id: 5,
      round_number: 1,
      round_title: "C++ Concurrency & Memory Model",
      category: "C++ Concurrency & Memory Model",
      question: "Explain the difference between std::mutex and std::atomic in C++. What are memory orders (relaxed, acquire-release, sequentially consistent) and when should they be used?",
      hint: "std::atomic provides lock-free hardware CPU instructions (e.g. CAS/LOCK XADD) without kernel context switches, while memory orders define visibility across CPU cores.",
      expected_key_points: ["Atomic CPU instructions vs kernel mutexes", "Acquire-release synchronization", "False sharing prevention with alignas"],
      domain: "C++",
    },
  ],
  "Python": [
    {
      id: 1,
      round_number: 1,
      round_title: "Python Runtime & Architecture",
      category: "Python GIL & Concurrency",
      question: "Explain Python's Global Interpreter Lock (GIL). Why does it exist in CPython, and how does it affect CPU-bound versus IO-bound multithreaded applications?",
      hint: "GIL protects CPython memory management and reference counting. IO-bound tasks release the GIL during syscalls; CPU-bound tasks require multiprocessing or C-extensions.",
      expected_key_points: ["CPython reference counting safety", "CPU-bound contention vs IO-bound GIL release", "multiprocessing / asyncio alternatives"],
      domain: "Python",
    },
    {
      id: 2,
      round_number: 1,
      round_title: "Python Memory Management",
      category: "Python Memory & GC",
      question: "How does Python manage memory using reference counting and generational garbage collection? How do weakref and cyclic references interact?",
      hint: "Reference counting deallocates immediately when refcount reaches 0; generational GC (Gen 0, 1, 2) breaks reference cycles using graph traversal.",
      expected_key_points: ["Immediate refcount deallocation", "3-tier generational cycle detection", "weakref avoiding cyclic retention"],
      domain: "Python",
    },
    {
      id: 3,
      round_number: 1,
      round_title: "Python Metaprogramming & Internals",
      category: "Python Metaprogramming & Decorators",
      question: "Explain how Python decorators work under the hood using first-class functions and closures. Why is functools.wraps important when writing production decorators?",
      hint: "Decorators wrap a callable with another callable, capturing lexical scope. functools.wraps preserves docstrings, __name__, and metadata.",
      expected_key_points: ["First-class function closures", "functools.wraps preserving __name__ and introspection", "Parameterized decorator outer factories"],
      domain: "Python",
    },
    {
      id: 4,
      round_number: 1,
      round_title: "Python AsyncIO & Event Loop",
      category: "Python AsyncIO & Event Loop",
      question: "How does asyncio coordinate asynchronous tasks in Python? Contrast coroutines with OS threads and explain what happens when a coroutine yields control.",
      hint: "AsyncIO runs a single-threaded event loop utilizing epoll/kqueue. When a coroutine awaits, it yields a Future to the event loop without blocking the thread.",
      expected_key_points: ["Single-threaded event loop with epoll/kqueue", "Cooperative multitasking vs OS preemptive threads", "Coroutines generator-based execution"],
      domain: "Python",
    },
    {
      id: 5,
      round_number: 1,
      round_title: "Python Data Model & Generators",
      category: "Python Generators & Iterables",
      question: "Describe the Python Iterator Protocol (__iter__ and __next__). How do generators provide lazy evaluation and significant memory reduction over lists?",
      hint: "Generators pause execution state on yield, producing values on-demand with O(1) memory footprint instead of allocating the full array in RAM.",
      expected_key_points: ["Iterator protocol (__iter__ and __next__)", "Lazy evaluation yielding values on-demand", "O(1) memory complexity vs O(N) lists"],
      domain: "Python",
    },
  ],
  "Java": [
    {
      id: 1,
      round_number: 1,
      round_title: "Java Memory & JVM Architecture",
      category: "JVM Memory Model",
      question: "Explain the JVM memory architecture: Heap (Eden, Survivor, Tenured/Old), Stack, and Metaspace. How does G1 GC collect garbage compared to ZGC?",
      hint: "Objects allocate in Eden, promote to Survivor, and move to Tenured if they survive aging threshold. G1 GC divides heap into regions, while ZGC achieves sub-millisecond pauses.",
      expected_key_points: ["Eden, Survivor, Tenured generations", "Thread-local Stack vs shared Heap", "G1 regional GC vs concurrent ZGC"],
      domain: "Java",
    },
    {
      id: 2,
      round_number: 1,
      round_title: "Java Concurrency & Synchronization",
      category: "Java Concurrency",
      question: "Compare synchronized blocks, volatile variables, and ReentrantLock in Java. What does the Java Memory Model (JMM) happens-before relationship guarantee?",
      hint: "volatile guarantees CPU cache visibility and prevents instruction reordering; synchronized guarantees both atomicity and mutual exclusion.",
      expected_key_points: ["volatile visibility without atomicity", "synchronized monitor locks and JMM happens-before", "ReentrantLock condition variables and fairness"],
      domain: "Java",
    },
    {
      id: 3,
      round_number: 1,
      round_title: "Java Collections & Internals",
      category: "Java ConcurrentHashMap",
      question: "How is ConcurrentHashMap implemented in Java 8+? Explain how it achieves high concurrency without locking the entire map like Hashtable.",
      hint: "Java 8 uses CAS operations for empty buckets and synchronized locking on the bucket node header only. Large buckets convert from linked lists to red-black trees.",
      expected_key_points: ["CAS on empty buckets", "Synchronized lock on bucket head node only", "Treeify threshold converting lists to Red-Black Trees"],
      domain: "Java",
    },
    {
      id: 4,
      round_number: 1,
      round_title: "Java Virtual Threads & Loom",
      category: "Java Virtual Threads",
      question: "What are Project Loom Virtual Threads in Java 21+? How do they differ from traditional platform threads, and what is carrier thread unmounting?",
      hint: "Virtual threads are lightweight user-mode threads managed by JVM (M:N mapping). When blocking on IO, the virtual thread unmounts from the carrier platform thread.",
      expected_key_points: ["M:N user-space scheduling by JVM", "Carrier thread unmounting on IO blocking", "Massive throughput without reactive boilerplate"],
      domain: "Java",
    },
    {
      id: 5,
      round_number: 1,
      round_title: "Java Classloading & Bytecode",
      category: "Java ClassLoaders",
      question: "Explain the Java ClassLoader delegation model (Bootstrap, Platform/Extension, Application). What is ClassNotFoundException vs NoClassDefFoundError?",
      hint: "Parent-first delegation queries parent classloader first. ClassNotFoundException is checked runtime failure; NoClassDefFoundError occurs when linking fails.",
      expected_key_points: ["Parent-first delegation hierarchy", "Bytecode verification and linking stages", "ClassNotFoundException vs NoClassDefFoundError"],
      domain: "Java",
    },
  ],
};

function generateDomainQuestions(companyName, roleName, interviewType, domainName, difficultyLevel, count = 10) {
  const normDom = (domainName || "C++").trim();
  const matchedKey = Object.keys(FALLBACK_DOMAIN_BANKS).find(k => k.toLowerCase() === normDom.toLowerCase());

  if (interviewType === "Comprehensive (All Rounds)") {
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
        question: `Describe a situation where you had a strong technical disagreement with a Senior Engineer or Product Manager at ${companyName}. How did you resolve it constructively using the STAR method?`,
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

  if (interviewType === "Behavioral & HR") {
    return [
      {
        id: 1,
        round_number: 1,
        round_title: "Behavioral & Leadership",
        category: "HR - Conflict Resolution & Alignment",
        question: `Describe a situation where you had a strong technical disagreement with a Senior Engineer or Product Manager at ${companyName}. How did you resolve it constructively using the STAR method?`,
        hint: "Structure using STAR (Situation, Task, Action, Result). Focus on objective data, running benchmarks, active listening, and 'disagree and commit' alignment.",
        expected_key_points: ["STAR method structure", "Objective data and proof-of-concept", "Alignment and impact"],
        domain: "Behavioral & HR",
      },
      {
        id: 2,
        round_number: 1,
        round_title: "Behavioral & Leadership",
        category: "HR - Crisis Management & Ownership",
        question: `Tell me about a high-severity production outage or critical bug that occurred under your ownership. How did you coordinate incident response and lead the post-mortem?`,
        hint: "Emphasize rapid mitigation first, transparent communication, root cause analysis (5 Whys), and blameless post-mortem safeguards.",
        expected_key_points: ["Rapid triage and mitigation", "Transparent communication", "Blameless post-mortem"],
        domain: "Behavioral & HR",
      },
      {
        id: 3,
        round_number: 1,
        round_title: "Behavioral & Leadership",
        category: "HR - Failure & Growth Mindset",
        question: `Can you share an experience where a project you spearheaded failed to meet expectations or hit its deadline? What were your core takeaways?`,
        hint: "Demonstrate radical ownership, honesty, learning agility, early risk escalation, and how this experience shaped your current engineering standards.",
        expected_key_points: ["Radical ownership", "Learning agility", "Long-term standards"],
        domain: "Behavioral & HR",
      },
      {
        id: 4,
        round_number: 1,
        round_title: "Behavioral & Leadership",
        category: "HR - Leadership & Mentorship",
        question: `How do you elevate the engineers around you? Give a concrete example of how you mentored a colleague, improved code review quality, or championed engineering best practices.`,
        hint: "Highlight concrete actions: hosting architecture RFC sessions, creating starter boilerplates, providing empathetic PR reviews, and pairing with junior teammates.",
        expected_key_points: ["Mentorship and pairing", "Architecture RFCs", "Engineering standards elevation"],
        domain: "Behavioral & HR",
      },
      {
        id: 5,
        round_number: 1,
        round_title: "Behavioral & Leadership",
        category: "HR - Company Culture & Vision",
        question: `Why do you specifically want to join ${companyName} over other top tech firms, and how does your 2-3 year technical vision align with our engineering culture and scale?`,
        hint: `Connect your personal passions and technical strengths directly to ${companyName}'s core principles, products, and technical scale.`,
        expected_key_points: ["Company mission alignment", "Technical ambition at scale", "Culture fit"],
        domain: "Behavioral & HR",
      },
    ];
  }

  if (matchedKey) {
    const bank = FALLBACK_DOMAIN_BANKS[matchedKey];
    return bank.map((q, idx) => ({
      ...q,
      id: idx + 1,
      round_number: Math.floor(idx / 5) + 1,
      round_title: `${normDom} ${interviewType}`,
    }));
  }

  // Generic domain fallback
  return [
    {
      id: 1,
      round_number: 1,
      round_title: `${normDom} Core Concepts`,
      category: `${normDom} Fundamentals`,
      question: `Explain the core architecture, memory model, and execution lifecycle of ${normDom}. How does it handle concurrency and resource management?`,
      hint: `Discuss runtime execution, memory safety guarantees, threading models, and optimization techniques in ${normDom}.`,
      expected_key_points: [`${normDom} memory model`, "Concurrency and thread safety", "Resource lifecycle management"],
      domain: normDom,
    },
    {
      id: 2,
      round_number: 1,
      round_title: `${normDom} Performance & Trade-offs`,
      category: `${normDom} Performance`,
      question: `What are the primary performance bottlenecks and optimization strategies in ${normDom}? Detail profiling, latency reduction, and memory overhead mitigation.`,
      hint: `Address CPU cache efficiency, allocation overhead, algorithmic complexity, and asynchronous execution in ${normDom}.`,
      expected_key_points: ["Profiling and bottleneck analysis", "Memory overhead mitigation", "Throughput optimization"],
      domain: normDom,
    },
    {
      id: 3,
      round_number: 1,
      round_title: `${normDom} Production Architecture`,
      category: `${normDom} Architecture`,
      question: `How would you architect a mission-critical, scalable production system using ${normDom}? Discuss error handling, testing patterns, and graceful degradation.`,
      hint: `Explain architectural isolation, distributed communication, fault resilience, and maintainability in ${normDom}.`,
      expected_key_points: ["Production architectural resilience", "Structured error handling and testing", "Scalability patterns"],
      domain: normDom,
    },
  ];
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
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [domain, setDomain] = useState("C++");
  const [customDomain, setCustomDomain] = useState("");
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

  // Proctoring & Anti-Cheating States
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [proctoringWarning, setProctoringWarning] = useState(null); // { warningNumber, maxWarnings, type, message, violations }
  const [warningCount, setWarningCount] = useState(0);
  const [terminationData, setTerminationData] = useState(null); // { warningCount, maxWarnings, status, terminationReason, violations, interviewId }
  const [mediaGracePeriod, setMediaGracePeriod] = useState(null); // { device: "Camera"|"Microphone", secondsLeft: 10 }
  const proctoringManagerRef = useRef(null);

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
      proctoringManagerRef.current?.setPermissionRequesting(true);
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
          if (interviewActive && !terminationData) {
            proctoringManagerRef.current?.handleCameraDropped();
          }
        };
      }

      cameraStreamRef.current = stream;
      setCameraStream(stream);
      setCameraStatus("granted");
      setIsCameraActive(true);
      proctoringManagerRef.current?.handleCameraRecovered();
      return stream;
    } catch (err) {
      console.warn("[MEDIA] Camera access warning:", err);
      setCameraStatus(err.name === "NotAllowedError" ? "denied" : err.name === "NotFoundError" ? "denied" : err.name === "NotReadableError" ? "denied" : "idle");
      return null;
    } finally {
      setTimeout(() => {
        proctoringManagerRef.current?.setPermissionRequesting(false);
      }, 800);
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
      proctoringManagerRef.current?.setPermissionRequesting(true);
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
          if (interviewActive && !terminationData) {
            proctoringManagerRef.current?.handleMicrophoneDropped();
          }
        };
      }

      micStreamRef.current = stream;
      setMicStream(stream);
      setMicStatus("granted");
      setIsMicActive(true);
      setupAudioAnalyser(stream);
      proctoringManagerRef.current?.handleMicrophoneRecovered();
      return stream;
    } catch (err) {
      console.warn("[MEDIA] Microphone access warning:", err);
      setMicStatus(err.name === "NotAllowedError" ? "denied" : err.name === "NotFoundError" ? "denied" : err.name === "NotReadableError" ? "denied" : "idle");
      return null;
    } finally {
      setTimeout(() => {
        proctoringManagerRef.current?.setPermissionRequesting(false);
      }, 800);
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
      proctoringManagerRef.current?.setPermissionRequesting(true);
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
          if (interviewActive && !terminationData) {
            proctoringManagerRef.current?.handleScreenShareStopped();
          }
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
    } finally {
      setTimeout(() => {
        proctoringManagerRef.current?.setPermissionRequesting(false);
      }, 800);
    }
  };

  // Connect both Camera & Mic in ONE single browser permission dialog
  const requestCombinedCamAndMic = async () => {
    try {
      proctoringManagerRef.current?.setPermissionRequesting(true);
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
            if (interviewActive && !terminationData) {
              proctoringManagerRef.current?.handleCameraDropped();
            }
          };
        }
        cameraStreamRef.current = vStream;
        setCameraStream(vStream);
        setCameraStatus("granted");
        setIsCameraActive(true);
        proctoringManagerRef.current?.handleCameraRecovered();
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
            if (interviewActive && !terminationData) {
              proctoringManagerRef.current?.handleMicrophoneDropped();
            }
          };
        }
        micStreamRef.current = aStream;
        setMicStream(aStream);
        setMicStatus("granted");
        setIsMicActive(true);
        setupAudioAnalyser(aStream);
        proctoringManagerRef.current?.handleMicrophoneRecovered();
      }

      return stream;
    } catch (err) {
      console.warn("[MEDIA] Combined Cam/Mic warning:", err);
      if (!cameraStreamRef.current) setCameraStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      if (!micStreamRef.current) setMicStatus(err.name === "NotAllowedError" ? "denied" : "idle");
      return null;
    } finally {
      setTimeout(() => {
        proctoringManagerRef.current?.setPermissionRequesting(false);
      }, 800);
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
      if (proctoringManagerRef.current) {
        proctoringManagerRef.current.stop();
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

  // Auto-speak HR & Culture questions when navigated to
  useEffect(() => {
    const curQ = sessionQuestions[currentQIndex];
    const isHR = (curQ?.category && curQ.category.toLowerCase().includes("hr")) ||
                 (curQ?.round_title && (curQ.round_title.toLowerCase().includes("behavioral") || curQ.round_title.toLowerCase().includes("hr"))) ||
                 interviewType === "Behavioral & HR" ||
                 (sessionQuestions.length === 20 && currentQIndex >= 15);
    if (
      interviewActive &&
      !evaluationResult &&
      isHR &&
      autoPlayAudio
    ) {
      const qText = curQ?.question;
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

  // 2b. SAVE SINGLE ANSWER (SILENT DB PERSISTENCE - NO LIVE EVALUATION SHOWN)
  const handleSaveSingleAnswer = async (q, advance = false) => {
    if (!q || isSubmittingQuestion) return;
    const currentAns = (answers[q.id] || "").trim();
    if (!currentAns) {
      setRunSuccessToast("Please enter an answer before saving, or click 'Skip Question'.");
      setTimeout(() => setRunSuccessToast(""), 3000);
      return;
    }

    setIsSubmittingQuestion(true);
    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];

    try {
      for (const base of candidateBases) {
        try {
          const url = base ? `${base}/api/interviews/save-answer` : `/api/interviews/save-answer`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              session_id: activeSessionId,
              question_id: q.id,
              question: q.question,
              candidate_answer: currentAns,
              status: "COMPLETED",
            }),
          });
          if (res.ok) break;
        } catch {
          // fallback to next base
        }
      }

      setSubmittedQuestions((prev) => ({
        ...prev,
        [q.id]: true,
      }));

      setRunSuccessToast(`✓ Question ${currentQIndex + 1} answer saved.`);
      setTimeout(() => setRunSuccessToast(""), 2500);

      if (advance && currentQIndex < sessionQuestions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setShowHint(false);
        setActiveTestCaseTab(0);
      }
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // 2c. SKIP QUESTION (RECORD AS SKIPPED WITH 0 SCORE DEFERRED)
  const handleSkipQuestion = async (q) => {
    if (!q || isSubmittingQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: "",
    }));

    setIsSubmittingQuestion(true);
    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];

    try {
      for (const base of candidateBases) {
        try {
          const url = base ? `${base}/api/interviews/save-answer` : `/api/interviews/save-answer`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              session_id: activeSessionId,
              question_id: q.id,
              question: q.question,
              candidate_answer: "",
              status: "SKIPPED",
            }),
          });
          if (res.ok) break;
        } catch {
          // next base
        }
      }

      setSubmittedQuestions((prev) => ({
        ...prev,
        [q.id]: "SKIPPED",
      }));

      setRunSuccessToast(`Question ${currentQIndex + 1} skipped.`);
      setTimeout(() => setRunSuccessToast(""), 2500);

      if (currentQIndex < sessionQuestions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setShowHint(false);
        setActiveTestCaseTab(0);
      }
    } finally {
      setIsSubmittingQuestion(false);
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

  // Countdown timer during active interview (halted immediately upon termination)
  useEffect(() => {
    let timer = null;
    if (interviewActive && !evaluationResult && !terminationData && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [interviewActive, evaluationResult, terminationData, timeLeft]);

  // Live countdown for media disconnection grace period
  useEffect(() => {
    if (!mediaGracePeriod) return;
    const interval = setInterval(() => {
      setMediaGracePeriod((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mediaGracePeriod]);

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

      const effectiveDomain = domain === "Custom / Other Topic" ? (customDomain.trim() || "General Software Engineering") : domain;
      const questionCount = interviewType === "Comprehensive (All Rounds)" ? 20 : 10;
      const payload = {
        company,
        role,
        difficulty,
        interview_type: interviewType,
        domain: effectiveDomain,
        question_count: questionCount,
        duration_minutes: 60,
      };

      let sessionIdentifier = `intv_sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      for (const base of candidateBases) {
        try {
          const url = base ? `${base}/api/interviews/start` : `/api/interviews/start`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.session_id) {
              sessionIdentifier = data.session_id;
            }
            if (data.questions && data.questions.length > 0) {
              fetchedQuestions = data.questions;
              break;
            }
          }
        } catch {
          // continue to next base URL
        }
      }

      // Fallback if backend unreachable
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        fetchedQuestions = generateDomainQuestions(company, role, interviewType, effectiveDomain, difficulty, questionCount);
      }

      // Automatically sync coding editor language to domain
      const lowerDom = effectiveDomain.toLowerCase();
      if (lowerDom.includes("c++")) {
        setSelectedLanguage("cpp");
      } else if (lowerDom.includes("python")) {
        setSelectedLanguage("python");
      } else if (lowerDom.includes("java") && !lowerDom.includes("javascript")) {
        setSelectedLanguage("java");
      } else {
        setSelectedLanguage("javascript");
      }

      setSessionQuestions(fetchedQuestions);
      const initialAns = {};
      fetchedQuestions.forEach((q) => {
        if (q.starter_templates) {
          const lang = lowerDom.includes("c++") ? "cpp" : lowerDom.includes("python") ? "python" : lowerDom.includes("java") ? "java" : "javascript";
          if (q.starter_templates[lang]) {
            initialAns[q.id] = q.starter_templates[lang];
          } else if (q.starter_templates.javascript) {
            initialAns[q.id] = q.starter_templates.javascript;
          } else {
            initialAns[q.id] = Object.values(q.starter_templates)[0] || "";
          }
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

      // Initialize Proctoring Engine for the session
      setActiveSessionId(sessionIdentifier);
      setWarningCount(0);
      setProctoringWarning(null);
      setTerminationData(null);
      setMediaGracePeriod(null);

      if (proctoringManagerRef.current) {
        proctoringManagerRef.current.stop();
      }

      const proctor = new ProctoringManager({
        sessionId: sessionIdentifier,
        company,
        role,
        difficulty,
        config: {
          maxWarnings: 5,
          detectTabSwitch: true,
          detectWindowBlur: false,
          requireFullscreen: false,
          requireScreenShare: true,
          monitorCamera: true,
          monitorMicrophone: true,
          detectCopyPaste: true,
          incidentDebounceMs: 2500,
          mediaGracePeriodMs: 10000,
        },
        onWarning: (warningInfo) => {
          console.warn("[PROCTORING] Warning received:", warningInfo);
          setProctoringWarning(warningInfo);
          setWarningCount(warningInfo.warningNumber);
        },
        onTerminate: (termInfo) => {
          console.error("[PROCTORING] Termination triggered:", termInfo);
          setTerminationData(termInfo);
          setWarningCount(termInfo.warningCount);
          setProctoringWarning(null);
          setMediaGracePeriod(null);
          stopAllStreams();
        },
        onGracePeriodStart: (device, seconds) => {
          setMediaGracePeriod({ device, secondsLeft: seconds });
        },
        onGracePeriodEnd: () => {
          setMediaGracePeriod(null);
        },
      });

      proctoringManagerRef.current = proctor;
      proctor.start();
    } catch (err) {
      console.error("[Interview Init] Failed to start interview session:", err);
      setInitError(`Interview initialization failed: ${err.message || "Unknown error"}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  // 2. SUBMIT INTERVIEW HANDLER
  const handleSubmitInterview = async () => {
    if (terminationData) {
      alert("This interview has been terminated for proctoring violations. Answer submission is disabled.");
      return;
    }

    setLoading(true);
    setAiSpeechState("analyzing");

    const elapsedSeconds = sessionStartTime
      ? Math.max(Math.floor((Date.now() - sessionStartTime) / 1000), 1)
      : Math.max(45 * 60 - timeLeft, 1);
    const activeMinutes = Math.max(Math.round(elapsedSeconds / 60), 1);

    const answersPayload = sessionQuestions.map((q) => {
      const isSkipped = submittedQuestions[q.id] === "SKIPPED";
      const ansVal = isSkipped ? "" : (answers[q.id] || "");
      return {
        question_id: q.id,
        question: q.question,
        answer: ansVal,
        candidate_answer: ansVal,
        status: isSkipped ? "SKIPPED" : ansVal.trim() ? "COMPLETED" : "EMPTY",
        test_results: testResultsMap[q.id] || null,
      };
    });

    const token = getToken();
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
    let evalData = null;

    const effectiveDomain = domain === "Custom / Other Topic" ? (customDomain.trim() || "General Software Engineering") : domain;
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
            session_id: activeSessionId,
            company,
            role,
            difficulty,
            interview_type: interviewType,
            domain: effectiveDomain,
            duration_minutes: activeMinutes,
            answers: answersPayload,
            warning_count: proctoringManagerRef.current?.getWarningCount() || 0,
            proctoring_data: {
              violations: proctoringManagerRef.current?.getViolationHistory() || [],
            },
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
      evalData = await evaluateInterview(company, role, difficulty, answersPayload, apiKey, interviewType, effectiveDomain);
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

    if (proctoringManagerRef.current) {
      proctoringManagerRef.current.stop();
    }
    setProctoringWarning(null);

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
    if (terminationData) {
      setInterviewActive(false);
      setEvaluationResult(null);
      setTerminationData(null);
      setProctoringWarning(null);
      setWarningCount(0);
      setMediaGracePeriod(null);
      if (proctoringManagerRef.current) {
        proctoringManagerRef.current.reset();
      }
      stopAllStreams();
      return;
    }
    if (window.confirm("Are you sure you want to end this interview session? Your progress will be saved.")) {
      setInterviewActive(false);
      setEvaluationResult(null);
      setTerminationData(null);
      setProctoringWarning(null);
      setWarningCount(0);
      setMediaGracePeriod(null);
      if (proctoringManagerRef.current) {
        proctoringManagerRef.current.stop();
      }
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
      <div className="mock-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
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
          <h3>Interview Type</h3>
          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            className="mock-select"
          >
            {INTERVIEW_TYPES.map((t) => (
              <option key={t} value={t} style={{ background: "#1e293b", color: "#fff" }}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mock-card">
          <h3>Domain / Topic</h3>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mock-select"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d} style={{ background: "#1e293b", color: "#fff" }}>
                {d}
              </option>
            ))}
          </select>
          {domain === "Custom / Other Topic" && (
            <input
              type="text"
              placeholder="e.g. Kubernetes, Rust, Solana"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="mock-select"
              style={{ marginTop: "8px" }}
            />
          )}
        </div>

        <div className="mock-card">
          <h3>Job Role</h3>
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
      </div>

      {/* Strict Constraint Status Banner */}
      <div style={{
        marginTop: "12px",
        marginBottom: "20px",
        padding: "10px 16px",
        background: "rgba(14, 165, 233, 0.08)",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontWeight: "600", fontSize: "14px" }}>
          <span>🎯 Active Hard Constraints:</span>
          <span style={{ color: "#f8fafc", fontWeight: "700" }}>
            {domain === "Custom / Other Topic" ? (customDomain.trim() || "Custom Topic") : domain}
          </span>
          <span style={{ color: "#64748b" }}>•</span>
          <span style={{ color: "#38bdf8" }}>{interviewType}</span>
          <span style={{ color: "#64748b" }}>•</span>
          <span style={{ color: "#a855f7" }}>{role}</span>
          <span style={{ color: "#64748b" }}>•</span>
          <span style={{
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            background: difficulty === "Easy" ? "rgba(34, 197, 94, 0.2)" : difficulty === "Medium" ? "rgba(234, 179, 8, 0.2)" : "rgba(239, 68, 68, 0.2)",
            color: difficulty === "Easy" ? "#4ade80" : difficulty === "Medium" ? "#facc15" : "#f87171"
          }}>
            {difficulty}
          </span>
        </div>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          Every question is dynamically generated and strictly validated against these constraints.
        </span>
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

          {/* ================= RED WARNING POPUP (LEFT SIDE) (WARNINGS 1 TO 4) ================= */}
          {proctoringWarning && !terminationData && (
            <div className="proctoring-warning-toast-left" role="alert" aria-live="assertive">
              <div className="proctoring-warning-toast-header">
                <FaExclamationTriangle className="toast-warning-icon" />
                <span className="toast-warning-title">INTERVIEW WARNING</span>
              </div>

              <p className="toast-warning-desc">
                You left the interview window.
              </p>

              <div className="toast-warning-count-badge">
                WARNING {proctoringWarning.warningNumber} / {proctoringWarning.maxWarnings}
              </div>

              {/* Visual step meter */}
              <div className="toast-warning-meter">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`toast-meter-step ${step <= proctoringWarning.warningNumber ? "step-active" : "step-inactive"}`}
                  />
                ))}
              </div>

              <p className="toast-warning-subtext">
                Please remain on the interview screen. Repeated violations will terminate your interview.
              </p>

              <div className="toast-warning-actions">
                <button
                  type="button"
                  className="toast-ack-btn"
                  onClick={() => setProctoringWarning(null)}
                >
                  <FaCheck /> Continue Interview
                </button>
              </div>
            </div>
          )}

          <div className="cockpit-container">
            {terminationData ? (
              /* ================= INTERVIEW TERMINATED FOR PROCTORING VIOLATIONS SCREEN ================= */
              <div className="proctoring-terminated-container">
                <div className="terminated-card">
                  <div className="terminated-icon-wrapper">
                    <FaBan />
                  </div>

                  <div className="terminated-badge">STATUS: TERMINATED FOR PROCTORING VIOLATIONS</div>

                  <h1 className="terminated-title">Interview Terminated</h1>

                  <div className="terminated-counter-summary">
                    Proctoring Warnings: <strong>5 / 5 Warnings</strong>
                  </div>

                  <div className="terminated-reason-box" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "10px 14px", margin: "12px 0 16px 0", textAlign: "left" }}>
                    <div style={{ color: "#ef4444", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reason:</div>
                    <div style={{ color: "#fca5a5", fontSize: "14px", fontWeight: "500", marginTop: "2px" }}>Repeatedly leaving the interview window.</div>
                  </div>

                  <p className="terminated-explanation">
                    {terminationData.terminationReason ||
                      "Interview terminated due to repeated proctoring violations. Media streams have been disconnected and further answer submissions are prohibited."}
                  </p>

                  {/* Violation Category Breakdown */}
                  <div className="violation-breakdown-grid">
                    <div className="breakdown-stat-card">
                      <span className="stat-num">
                        {terminationData.violations?.filter((v) => v.type === "TAB_SWITCH" || v.type === "WINDOW_BLUR").length || 0}
                      </span>
                      <span className="stat-title">Tab / Window Switches</span>
                    </div>
                    <div className="breakdown-stat-card">
                      <span className="stat-num">
                        {terminationData.violations?.filter((v) => v.type === "FULLSCREEN_EXIT").length || 0}
                      </span>
                      <span className="stat-title">Fullscreen Exits</span>
                    </div>
                    <div className="breakdown-stat-card">
                      <span className="stat-num">
                        {terminationData.violations?.filter((v) => v.type === "SCREEN_SHARE_STOPPED").length || 0}
                      </span>
                      <span className="stat-title">Screen Share Stops</span>
                    </div>
                    <div className="breakdown-stat-card">
                      <span className="stat-num">
                        {terminationData.violations?.filter((v) => v.type === "PASTE_DETECTED").length || 0}
                      </span>
                      <span className="stat-title">Paste Violations</span>
                    </div>
                    <div className="breakdown-stat-card">
                      <span className="stat-num">
                        {terminationData.violations?.filter((v) => v.type === "CAMERA_DISCONNECTED" || v.type === "MIC_DISCONNECTED").length || 0}
                      </span>
                      <span className="stat-title">Media Interruptions</span>
                    </div>
                  </div>

                  {/* Logged Violations Timeline */}
                  {terminationData.violations && terminationData.violations.length > 0 && (
                    <div className="violation-timeline-section">
                      <h3>Logged Violations Audit Trail:</h3>
                      <div className="violation-timeline-list">
                        {terminationData.violations.map((v, idx) => (
                          <div key={idx} className="timeline-item">
                            <span className="timeline-badge">Warning #{v.warningNumber || idx + 1}</span>
                            <span className="timeline-type">[{v.type}]</span>
                            <span className="timeline-msg">{v.message}</span>
                            <span className="timeline-time">
                              {v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="terminated-actions">
                    <button
                      type="button"
                      className="terminated-dashboard-btn"
                      onClick={handleCloseSession}
                    >
                      <FaTimes /> Return to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            ) : !evaluationResult ? (
              <>
                {/* SUBMISSION & EVALUATION OVERLAY */}
                {loading && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(15, 23, 42, 0.92)",
                    zIndex: 999999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)"
                  }}>
                    <div style={{
                      textAlign: "center",
                      padding: "40px",
                      background: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "16px",
                      maxWidth: "480px"
                    }}>
                      <FaSpinner className="fa-spin" style={{ fontSize: "48px", color: "#38bdf8", marginBottom: "20px" }} />
                      <h3 style={{ fontSize: "22px", color: "#f8fafc", marginBottom: "12px" }}>Analyzing Your Interview...</h3>
                      <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
                        Our AI Proctor & Technical Evaluator is auditing all candidate responses, validating semantic relevance, and synthesizing your comprehensive performance report.
                      </p>
                    </div>
                  </div>
                )}

                {/* COCKPIT TOP HEADER */}
                <div className="cockpit-top-bar">
                  <div className="cockpit-brand">
                    <span className="cockpit-role-badge">
                      ✦ {company} • {role} ({difficulty})
                    </span>
                    <h3 className="cockpit-title">AI Technical Interview</h3>
                  </div>

                  <div className="cockpit-telemetry-cluster">
                    {/* Proctoring Integrity indicator */}
                    <div
                      className={`telemetry-pill proctoring-pill ${warningCount > 0 ? "warning-pill" : "safe-pill"}`}
                      title="Proctoring & Anti-Cheating Integrity Monitor"
                    >
                      <FaShieldAlt />
                      <span>Warnings: {warningCount}/5</span>
                    </div>

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

                {/* Media Disconnection Grace Period Recovery Banner */}
                {mediaGracePeriod && (
                  <div className="proctoring-grace-banner">
                    <div className="grace-banner-content">
                      <FaExclamationTriangle className="grace-icon" />
                      <div>
                        <strong>{mediaGracePeriod.device} Disconnected!</strong>
                        <span> Recovery grace period active: <strong>{mediaGracePeriod.secondsLeft}s</strong> remaining before a proctoring violation is recorded.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="grace-reconnect-btn"
                      onClick={mediaGracePeriod.device === "Camera" ? requestCamera : requestMicrophone}
                    >
                      <FaSyncAlt /> Re-enable {mediaGracePeriod.device} Now
                    </button>
                  </div>
                )}

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
                      // Dynamically group sessionQuestions by round_number
                      const roundsMap = sessionQuestions.reduce((acc, q, idx) => {
                        const rNum = q.round_number || (Math.floor(idx / 5) + 1);
                        if (!acc[rNum]) {
                          const icon = rNum === 1 ? "🧩" : rNum === 2 ? "💻" : rNum === 3 ? "🏢" : "👥";
                          acc[rNum] = {
                            id: rNum,
                            title: q.round_title || `Round ${rNum}`,
                            short: q.round_title ? (q.round_title.length > 20 ? q.round_title.slice(0, 18) + "..." : q.round_title) : `Part ${rNum}`,
                            icon,
                            startIdx: idx,
                            questions: [],
                          };
                        }
                        acc[rNum].questions.push({ ...q, globalIdx: idx });
                        return acc;
                      }, {});
                      const dynamicRounds = Object.values(roundsMap);

                      const curQ = sessionQuestions[currentQIndex] || sessionQuestions[0];
                      const curRoundNum = curQ?.round_number || (Math.floor(currentQIndex / 5) + 1);
                      const activeRound = roundsMap[curRoundNum] || { id: curRoundNum, title: curQ?.round_title || `Round ${curRoundNum}`, icon: "⚡", questions: [] };

                      return (
                        <div className="interview-workspace">
                          {/* DYNAMIC ROUND STAGE TRACKER TABS */}
                          <div className="rounds-stage-tracker">
                            {dynamicRounds.map((r) => {
                              const isCurrentRound = curRoundNum === r.id;
                              const answeredInRound = r.questions.filter((q) => !!submittedQuestions[q.id]).length;
                              const isRoundDone = answeredInRound === r.questions.length && r.questions.length > 0;
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
                                      {answeredInRound}/{r.questions.length} Saved {isRoundDone ? "✓" : ""}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* DYNAMIC QUESTION QUICK NAVIGATION MATRIX */}
                          <div className="questions-matrix-row">
                            {sessionQuestions.map((q, idx) => {
                              const roundNum = q.round_number || (Math.floor(idx / 5) + 1);
                              const isSaved = submittedQuestions[q.id] === true;
                              const isSkipped = submittedQuestions[q.id] === "SKIPPED";
                              
                              const userAns = (answers[q.id] || "").trim();
                              const defaultTemplate = (q.starter_templates && (q.starter_templates[selectedLanguage] || q.starter_templates.javascript))
                                ? (q.starter_templates[selectedLanguage] || q.starter_templates.javascript).trim()
                                : "";
                              const isDrafting = !isSaved && !isSkipped && userAns.length > 0 && userAns !== defaultTemplate;

                              const statusClass = isSaved
                                ? "saved"
                                : isSkipped
                                ? "skipped"
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
                                  title={`Round ${roundNum}: Q${idx + 1} (${q.category || q.round_title}) • ${isSaved ? "Answer Saved" : isSkipped ? "Skipped" : isDrafting ? "Drafting answer" : "Unanswered"}`}
                                >
                                  {isSaved && <span className="tab-evaluated-dot pass">✓</span>}
                                  {isSkipped && <span className="tab-evaluated-dot fail">⊘</span>}
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
                            const isDSA = (curQ?.test_cases && curQ.test_cases.length > 0) ||
                                          (curQ?.starter_templates && Object.keys(curQ.starter_templates).length > 0) ||
                                          (curQ?.category && (curQ.category.toLowerCase().includes("coding") || curQ.category.toLowerCase().includes("dsa"))) ||
                                          interviewType === "Coding & DSA";
                            const isHR = (curQ?.category && curQ.category.toLowerCase().includes("hr")) ||
                                         (curQ?.round_title && (curQ.round_title.toLowerCase().includes("behavioral") || curQ.round_title.toLowerCase().includes("hr"))) ||
                                         interviewType === "Behavioral & HR";
                            const qTestResults = testResultsMap[curQ?.id];
                            const isSubmitted = !!submittedCodeMap[curQ?.id];

                            return (
                              <>
                                <div className={`cockpit-question-box ${isHR ? "hr-round-box" : ""} ${isDSA ? "dsa-structured-box" : ""}`}>
                                  <div className="question-box-header">
                                    <div className="q-badge-group">
                                      <span className="round-badge">
                                        {activeRound.icon} Round {activeRound.id} of {dynamicRounds.length}: {activeRound.title}
                                      </span>
                                      <span className="q-badge">
                                        Question {currentQIndex + 1} of {sessionQuestions.length} • {curQ?.category}
                                      </span>
                                      {curQ?.difficulty && (
                                        <span className={`dsa-diff-pill ${curQ.difficulty.toLowerCase()}`}>
                                          {curQ.difficulty}
                                        </span>
                                      )}
                                      {submittedQuestions[curQ?.id] === true && (
                                        <span className="dsa-solved-pill pass">
                                          ✓ Answer Saved
                                        </span>
                                      )}
                                      {submittedQuestions[curQ?.id] === "SKIPPED" && (
                                        <span className="dsa-solved-pill retry">
                                          ⊘ Skipped
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

                                  {/* HR AUDIO NARRATOR */}
                                  {isHR && (
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
                                <div className={`solution-editor-container ${isHR ? "hr-editor-mode" : ""} ${isDSA ? "dsa-editor-mode" : ""} editor-screen-${editorScreenMode}`}>
                                  {isHR && (
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
                                      ) : isHR ? (
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

                                      {isHR ? (
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
                                            onClick={() => handleSaveSingleAnswer(curQ, false)}
                                            disabled={isSubmittingQuestion}
                                            className="question-submit-answer-btn"
                                            title="Save your answer to this question in the database"
                                          >
                                            {isSubmittingQuestion ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                                            {isSubmittingQuestion ? "Saving..." : submittedQuestions[curQ?.id] === true ? "✓ Answer Saved" : "Save Answer"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleSkipQuestion(curQ)}
                                            disabled={isSubmittingQuestion}
                                            className="editor-tool-btn"
                                            style={{ fontSize: "12px", padding: "6px 10px", color: "#f87171" }}
                                            title="Skip this question (0 score recorded)"
                                          >
                                            <FaBan /> Skip
                                          </button>
                                          {/* VOICE DICTATION (Non-DSA rounds) */}
                                          <button
                                            type="button"
                                            onClick={toggleVoiceDictation}
                                            className={`voice-dictation-btn ${isDictating ? "active pulse" : ""} ${isHR ? "hr-primary-voice" : ""}`}
                                            title="Record your voice response with real-time speech transcription"
                                          >
                                            <FaMicrophone className={isDictating ? "pulse-dot" : ""} />
                                            {isDictating ? "🎙️ Recording..." : isHR ? "🎙️ Answer with Voice" : "🎙️ Dictate"}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Code Textarea */}
                                  <textarea
                                    rows={isDSA ? 12 : isHR ? 11 : 10}
                                    value={answers[curQ?.id] || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAnswers((prev) => ({
                                        ...prev,
                                        [curQ.id]: val,
                                      }));
                                    }}
                                    onPaste={(e) => {
                                      if (proctoringManagerRef.current) {
                                        proctoringManagerRef.current.handlePasteEvent(e);
                                      }
                                    }}
                                    placeholder={
                                      isDSA
                                        ? `// Write your ${selectedLanguage} solution here...\n// Function signature: ${curQ?.function_name || "solution"}(...)`
                                        : isHR
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

                                  {/* Editor Stats Footer */}
                                  <div className="editor-stats-footer">
                                    <span>Words: <strong>{wordCount}</strong> | Chars: <strong>{charCount}</strong></span>
                                    {isDSA ? (
                                      <span className="dsa-footer-hint">
                                        ✦ LeetCode Assessment Sandbox • Tests verified in real-time
                                      </span>
                                    ) : isHR ? (
                                      <span className="hr-footer-hint">✦ Audio Speech & Written Text Synchronized • STAR Evaluation</span>
                                    ) : (
                                      <span>✦ Round {activeRound.id} of {dynamicRounds.length} ({activeRound.title})</span>
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
                                  handleSaveSingleAnswer(curQ, false);
                                }}
                                disabled={isSubmittingQuestion}
                                className="cockpit-submit-q-btn"
                                title="Save current question answer"
                              >
                                {isSubmittingQuestion ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                                {isSubmittingQuestion ? "Saving Answer..." : submittedQuestions[sessionQuestions[currentQIndex]?.id] === true ? "✓ Answer Saved" : "Save Answer"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const curQ = sessionQuestions[currentQIndex];
                                  handleSkipQuestion(curQ);
                                }}
                                disabled={isSubmittingQuestion}
                                className="cockpit-prev-btn"
                                style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "#f87171" }}
                                title="Skip question (0 points awarded)"
                              >
                                <FaBan /> Skip Question
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
                    {company} • {role} ({difficulty}) • {interviewType} • {domain === "Custom / Other Topic" ? (customDomain.trim() || "Custom Topic") : domain} • {sessionQuestions.length} Questions Completed
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

                  <div className="score-summary-card">
                    <span className="score-label">Proctoring & Integrity</span>
                    <h3 className={`score-val ${(evaluationResult.warning_count || 0) === 0 ? "green" : "amber"}`}>
                      {(evaluationResult.warning_count || 0) === 0 ? "100%" : `${Math.max(100 - (evaluationResult.warning_count || 0) * 10, 50)}%`}
                    </h3>
                    <small>{(evaluationResult.warning_count || 0) === 0 ? "✓ Clean Session (0 Warnings)" : `⚠️ ${evaluationResult.warning_count}/5 Warnings Incurred`}</small>
                  </div>
                </div>

                {/* Dynamic Round Performance Matrix */}
                <div className="report-rounds-matrix">
                  <h4>🎯 Performance Breakdown by Round & Focus Area</h4>
                  <div className="report-rounds-grid">
                    {(evaluationResult.rounds_breakdown || [
                      { round_number: 1, title: `${interviewType} - Part 1`, score: Math.round(evaluationResult.problem_solving_score || 80), questions_count: Math.ceil(sessionQuestions.length / 2) || 5 },
                      { round_number: 2, title: `${interviewType} - Part 2`, score: Math.round(evaluationResult.technical_score || 85), questions_count: Math.floor(sessionQuestions.length / 2) || 5 },
                    ]).map((rb) => {
                      const score = rb.score;
                      const badge = score >= 85 ? "Strong Hire" : score >= 70 ? "Hire" : score >= 50 ? "Average" : "Needs Practice";
                      return (
                        <div key={rb.round_number} className="round-score-card">
                          <div className="round-score-top">
                            <span className="round-num-tag">Round {rb.round_number} ({rb.questions_count || 1} Qs)</span>
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

                {/* Question Statistics Summary */}
                <div className="report-question-stats-banner" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px",
                  margin: "20px 0",
                  padding: "16px",
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Total Questions</span>
                    <h4 style={{ fontSize: "22px", margin: "4px 0", color: "#f8fafc" }}>
                      {evaluationResult.question_count || sessionQuestions.length}
                    </h4>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Answered</span>
                    <h4 style={{ fontSize: "22px", margin: "4px 0", color: "#60a5fa" }}>
                      {evaluationResult.answered_count ?? (evaluationResult.question_count ? evaluationResult.question_count - (evaluationResult.skipped_count || 0) : sessionQuestions.length)}
                    </h4>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Correct</span>
                    <h4 style={{ fontSize: "22px", margin: "4px 0", color: "#22c55e" }}>
                      {evaluationResult.correct_count ?? 0}
                    </h4>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Partially Correct</span>
                    <h4 style={{ fontSize: "22px", margin: "4px 0", color: "#f59e0b" }}>
                      {evaluationResult.partially_correct_count ?? evaluationResult.partial_count ?? 0}
                    </h4>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Incorrect / Irrelevant</span>
                    <h4 style={{ fontSize: "22px", margin: "4px 0", color: "#ef4444" }}>
                      {evaluationResult.incorrect_count ?? 0}
                    </h4>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Skipped</span>
                    <h4 style={{ fontSize: "22px", margin: "4px 0", color: "#a855f7" }}>
                      {evaluationResult.skipped_count ?? 0}
                    </h4>
                  </div>
                </div>

                {/* Per-Question Detailed Breakdown */}
                {evaluationResult.detailed_feedback && evaluationResult.detailed_feedback.length > 0 && (
                  <div className="report-questions-breakdown">
                    <h4>📝 Question-by-Question Detailed Analysis ({evaluationResult.detailed_feedback.length} Questions)</h4>
                    <div className="report-questions-list">
                      {evaluationResult.detailed_feedback.map((qf, idx) => {
                        const curQ = sessionQuestions[idx];
                        const roundNum = curQ?.round_number || qf.round_number || (Math.floor(idx / 5) + 1);
                        const roundName = curQ?.round_title || qf.round_title || `Part ${roundNum}`;
                        const statusUpper = (qf.status || "").toUpperCase();
                        const isSkipped = statusUpper === "SKIPPED";
                        const isIrrelevant = statusUpper === "IRRELEVANT";
                        const isZero = qf.score === 0;

                        return (
                          <div key={idx} className="report-question-item" style={{
                            borderLeft: isZero ? "4px solid #ef4444" : qf.score >= 70 ? "4px solid #22c55e" : "4px solid #f59e0b",
                            marginBottom: "16px",
                            padding: "16px",
                            background: "rgba(15, 23, 42, 0.6)",
                            borderRadius: "8px"
                          }}>
                            <div className="item-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                              <div>
                                <span className="item-round-tag" style={{ marginRight: "8px" }}>Round {roundNum}: {roundName}</span>
                                <span className="item-q-title" style={{ fontWeight: 600 }}>Q{idx + 1}: {qf.question}</span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span className={`item-score ${qf.score >= 70 ? "good" : qf.score >= 35 ? "avg" : "fail"}`} style={{
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  background: qf.score >= 70 ? "rgba(34, 197, 94, 0.2)" : qf.score >= 35 ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                  color: qf.score >= 70 ? "#4ade80" : qf.score >= 35 ? "#fbbf24" : "#f87171"
                                }}>
                                  {qf.score} / 100
                                </span>
                                <div style={{ fontSize: "11px", marginTop: "4px", color: "#94a3b8" }}>
                                  Status: <strong>{qf.status || (qf.score >= 70 ? "CORRECT" : qf.score >= 35 ? "PARTIAL" : "INCORRECT")}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Candidate's Original Immutable Answer */}
                            <div style={{ margin: "10px 0", padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", fontSize: "13px" }}>
                              <strong style={{ color: "#93c5fd" }}>Candidate's Submitted Answer:</strong>
                              <p style={{ margin: "4px 0 0 0", color: (qf.candidate_answer || answers[curQ?.id] || "").trim() ? "#e2e8f0" : "#64748b", fontStyle: (qf.candidate_answer || answers[curQ?.id] || "").trim() ? "normal" : "italic" }}>
                                {(qf.candidate_answer || answers[curQ?.id] || "").trim() || "[No Answer / Skipped]"}
                              </p>
                            </div>

                            <p className="item-feedback" style={{ margin: "8px 0" }}>
                              <strong>AI Feedback:</strong> {qf.feedback}
                            </p>

                            {/* Missing Concepts if any */}
                            {qf.missing_concepts && qf.missing_concepts.length > 0 && (
                              <div style={{ margin: "6px 0", fontSize: "12px", color: "#fca5a5" }}>
                                <strong>Missing Concepts:</strong> {qf.missing_concepts.join(", ")}
                              </div>
                            )}

                            {/* Suggested Ideal Points */}
                            {qf.suggested_answer_points && qf.suggested_answer_points.length > 0 && (
                              <div style={{ margin: "6px 0", fontSize: "12px", color: "#86efac" }}>
                                <strong>Model Solution Concepts:</strong> {qf.suggested_answer_points.join(" • ")}
                              </div>
                            )}

                            {qf.identified_keywords && qf.identified_keywords.length > 0 && (
                              <div className="item-concepts" style={{ fontSize: "12px", marginTop: "4px", color: "#cbd5e1" }}>
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