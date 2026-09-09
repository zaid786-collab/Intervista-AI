/**
 * Intelligent Multi-Tier Evaluation Engine for Intervista AI.
 * 
 * Supports:
 * 1. Live Google Gemini 1.5 / 2.0 Flash LLM via REST API (if API key configured).
 * 2. Deep Question-Specific Semantic & NLP Rubric Evaluation (honest scoring 0-100%).
 * 3. Individual Question Evaluation with instant candidate feedback.
 */

// Question-specific knowledge base and rubrics
const QUESTION_RUBRICS = {
  // React Fiber
  "fiber": {
    topic: "React Fiber & Virtual DOM Reconciliation",
    keywords: ["fiber", "reconciliation", "reconcil", "virtual dom", "vdom", "diff", "key", "workinprogress", "double buffer", "time slic", "render phase", "commit phase", "o(n)", "heuristic", "component identity"],
    coreConcepts: ["double buffering (current vs workInProgress)", "heuristic O(n) diffing", "key stability", "interruptible work loop"],
  },
  // Web Vitals
  "vitals": {
    topic: "Core Web Vitals & Performance Optimization",
    keywords: ["lcp", "inp", "cls", "largest contentful paint", "cumulative layout shift", "interaction to next paint", "fetchpriority", "code splitting", "dynamic import", "lazy", "font-display", "long task", "hydration", "bundle size"],
    coreConcepts: ["fetchpriority & critical path", "code splitting with dynamic imports", "layout stability dimensions", "long task breaking"],
  },
  // Closures & Event Loop
  "closure": {
    topic: "JavaScript Closures, Event Loop & Memory Management",
    keywords: ["closure", "lexical scope", "lexical environment", "event loop", "microtask", "macrotask", "task queue", "promise", "settimeout", "garbage collect", "retainer", "memory leak", "useeffect cleanup", "call stack"],
    coreConcepts: ["lexical scope & heap retention", "microtask vs macrotask execution order", "cleanup in useEffect"],
  },
  // Redis Caching
  "redis": {
    topic: "Distributed Caching & Redis Architecture",
    keywords: ["redis", "cache-aside", "cache penetration", "bloom filter", "cache stampede", "cache avalanche", "mutex", "distributed lock", "ttl", "eviction", "allkeys-lru", "cluster", "sentinel", "replication", "write-through"],
    coreConcepts: ["Cache-Aside pattern & TTL", "Bloom filter for cache penetration", "Mutex lock for stampede", "Cluster sharding"],
  },
  // Database Indexing & Concurrency
  "index": {
    topic: "Database Indexing, Isolation Levels & MVCC",
    keywords: ["b-tree", "hash index", "range query", "isolation", "read committed", "repeatable read", "serializable", "mvcc", "acid", "deadlock", "row locking", "snapshot", "wait-for graph"],
    coreConcepts: ["B-Tree range searches vs Hash exact lookups", "MVCC concurrency control", "Deadlock detection graphs"],
  },
  // Microservice Transactions & Idempotency
  "idempotency": {
    topic: "Distributed Systems & Idempotent Transactions",
    keywords: ["idempotency", "idempotency-key", "transactional outbox", "saga", "2pc", "two-phase commit", "distributed lock", "deduplication", "kafka", "rabbitmq", "at-least-once", "eventual consistency"],
    coreConcepts: ["Idempotency-Key headers & DB deduplication", "Transactional Outbox Pattern", "Saga orchestration/choreography"],
  },
  // Real-time Canvas & Collaboration
  "collab": {
    topic: "Real-time Collaboration & Conflict Resolution",
    keywords: ["websocket", "operational transformation", " ot ", "crdt", "conflict resolution", "delta", "heartbeat", "state sync", "versioning", "event sourcing"],
    coreConcepts: ["WebSockets for bi-directional streaming", "CRDTs vs Operational Transformation", "Heartbeats & reconnection sync"],
  },
  // Security & Auth
  "oauth": {
    topic: "OAuth2 PKCE, JWT & Web Security",
    keywords: ["oauth", "pkce", "jwt", "httponly", "samesite", "csrf", "xss", "csp", "content security policy", "refresh token", "code challenge", "token rotation"],
    coreConcepts: ["PKCE code verifier and challenge", "HttpOnly & SameSite cookies", "CSP headers for XSS prevention"],
  },
  // Pagination & Rate Limiting
  "pagination": {
    topic: "Pagination, Rate Limiting & Connection Pooling",
    keywords: ["cursor", "offset", "pagination", "rate limit", "token bucket", "sliding window", "connection pool", "pgbouncer", "database connections", "throughput"],
    coreConcepts: ["Cursor-based vs Offset pagination performance", "Token Bucket algorithm", "PgBouncer connection pooling"],
  },
  // RAG & Embeddings
  "rag": {
    topic: "Retrieval-Augmented Generation & Vector Search",
    keywords: ["rag", "retrieval", "embedding", "vector database", "dense vector", "sparse vector", "bm25", "rerank", "cross-encoder", "chunking", "hybrid search", "cosine similarity"],
    coreConcepts: ["Hybrid search (dense vector + sparse BM25)", "Chunking strategy", "Cross-encoder reranking"],
  },
  // LLM Serving & Inference
  "vllm": {
    topic: "LLM Serving, vLLM & Inference Optimization",
    keywords: ["vllm", "pagedattention", "quantization", "fp8", "awq", "kv cache", "continuous batching", "prefix cache", "speculative decoding", "latency", "throughput", "gpu memory"],
    coreConcepts: ["PagedAttention & KV Cache management", "Continuous batching", "Quantization (FP8/AWQ)"],
  },
  // System Design & Scalability
  "sys_scale": {
    topic: "Global High-Availability Distributed Systems",
    keywords: ["anycast", "geo-dns", "l4", "l7", "load balancer", "envoy", "nginx", "multi-region", "active-active", "cdn", "edge", "replication", "partition tolerance", "cap theorem", "failover"],
    coreConcepts: ["Anycast Geo-DNS & L4/L7 routing", "Active-Active Multi-Region databases", "Edge caching & CDN points of presence", "Partition tolerance and zero-downtime failover"],
  },
  "sys_sharding": {
    topic: "Data Sharding, Hotspots & Resilient Storage",
    keywords: ["consistent hashing", "virtual node", "shard", "sharding", "hotspot", "partition key", "composite key", "re-indexing", "vnode", "rebalancing", "micro-sharding"],
    coreConcepts: ["Consistent Hashing with virtual nodes", "Composite shard key salt to prevent hotspots", "Automated live data migration"],
  },
  "sys_resilience": {
    topic: "Microservice Resilience & Circuit Breakers",
    keywords: ["circuit breaker", "half-open", "closed", "open", "bulkhead", "exponential backoff", "jitter", "retry", "fallback", "degradation", "timeout", "cascading"],
    coreConcepts: ["Circuit Breaker 3-state machine", "Exponential backoff with full jitter", "Bulkhead isolation thread pools", "Graceful fallback degradation"],
  },
  "sys_security": {
    topic: "Zero-Trust Architecture & Service Mesh Security",
    keywords: ["zero-trust", "zero trust", "mtls", "spiffe", "spire", "x.509", "certificate", "service mesh", "istio", "linkerd", "rbac", "vpc", "mutual tls"],
    coreConcepts: ["SPIFFE/SPIRE cryptographic workload identity", "Automated short-lived X.509 cert rotation via mTLS", "Granular L7 RBAC authorization policies"],
  },
  // HR & Behavioral
  "hr_star": {
    topic: "Behavioral Leadership & Conflict Resolution (STAR)",
    keywords: ["situation", "task", "action", "result", "star", "conflict", "disagreement", "alignment", "disagree and commit", "data-driven", "benchmark", "stakeholder", "outcome", "metric", "retrospective"],
    coreConcepts: ["STAR structured narrative", "Objective data and proof-of-concept resolution", "Active listening & Disagree and Commit", "Quantifiable positive outcome"],
  },
  // C++
  "cpp_core": {
    topic: "C++ Memory, Modern Semantics & OOP",
    keywords: ["raii", "pointer", "reference", "destructor", "vtable", "vptr", "move semantics", "rvalue", "lvalue", "std::move", "unique_ptr", "shared_ptr", "weak_ptr", "const", "virtual", "template", "sfinae", "concepts", "stl", "stack", "heap", "new", "delete", "atomic", "mutex"],
    coreConcepts: ["RAII deterministic destruction", "Move semantics & rvalue references", "Smart pointer ownership models", "Vtable polymorphism & virtual destructors"],
  },
  // Python
  "python_core": {
    topic: "Python Internals, GIL & Memory",
    keywords: ["gil", "global interpreter lock", "mutable", "immutable", "generator", "yield", "decorator", "comprehension", "asyncio", "coroutine", "event loop", "dunder", "__init__", "reference count", "garbage collect"],
    coreConcepts: ["GIL bytecode serialization & concurrency", "Reference counting & cyclic GC", "Decorators & closures", "Generators lazy evaluation"],
  },
  // Java
  "java_core": {
    topic: "Java JVM, Concurrency & Collections",
    keywords: ["jvm", "heap", "stack", "metaspace", "garbage collection", "g1 gc", "synchronized", "volatile", "atomic", "cas", "concurrenthashmap", "generics", "stream", "classloader", "thread"],
    coreConcepts: ["JVM Memory generations", "Volatile visibility vs synchronized atomicity", "ConcurrentHashMap CAS node locking"],
  },
};

/**
 * Identify matching rubric based on question text or dynamic key points.
 */
function findRubricForQuestion(questionText, domain = null, expectedKeyPoints = null) {
  if (expectedKeyPoints && Array.isArray(expectedKeyPoints) && expectedKeyPoints.length > 0) {
    const extractedKws = [];
    expectedKeyPoints.forEach(pt => {
      const matches = (pt.toLowerCase().match(/[a-z0-9_\+\-]{3,}/g) || []);
      extractedKws.push(...matches);
    });
    if (domain) extractedKws.push(domain.toLowerCase());
    return {
      topic: `${domain || 'Technical'} Core Concept`,
      keywords: Array.from(new Set(extractedKws)),
      coreConcepts: expectedKeyPoints,
    };
  }

  const lower = (questionText || "").toLowerCase();
  const lowerDom = (domain || "").toLowerCase();

  if (lowerDom.includes("c++") || lower.includes("c++") || lower.includes("raii") || lower.includes("vtable") || lower.includes("rvalue")) return QUESTION_RUBRICS["cpp_core"];
  if (lowerDom.includes("python") || lower.includes("python") || lower.includes("gil") || lower.includes("decorator")) return QUESTION_RUBRICS["python_core"];
  if (lowerDom.includes("java") || lower.includes("java") || lower.includes("jvm") || lower.includes("concurrenthashmap")) return QUESTION_RUBRICS["java_core"];
  if (lower.includes("fiber") || lower.includes("reconciliation") || lower.includes("virtual dom")) return QUESTION_RUBRICS["fiber"];
  if (lower.includes("vitals") || lower.includes("lcp") || lower.includes("inp") || lower.includes("cls")) return QUESTION_RUBRICS["vitals"];
  if (lower.includes("closure") || lower.includes("event loop") || lower.includes("microtask")) return QUESTION_RUBRICS["closure"];
  if (lower.includes("redis") || lower.includes("cache") || lower.includes("caching")) return QUESTION_RUBRICS["redis"];
  if (lower.includes("index") || lower.includes("b-tree") || lower.includes("isolation") || lower.includes("mvcc")) return QUESTION_RUBRICS["index"];
  if (lower.includes("idempotency") || lower.includes("payment") || lower.includes("transactional outbox") || lower.includes("saga")) return QUESTION_RUBRICS["idempotency"];
  if (lower.includes("collab") || lower.includes("docs") || lower.includes("conflict") || lower.includes("crdt") || lower.includes("operational transformation")) return QUESTION_RUBRICS["collab"];
  if (lower.includes("oauth") || lower.includes("pkce") || lower.includes("jwt") || lower.includes("csrf") || lower.includes("xss")) return QUESTION_RUBRICS["oauth"];
  if (lower.includes("pagination") || lower.includes("rate limit") || lower.includes("pool")) return QUESTION_RUBRICS["pagination"];
  if (lower.includes("rag") || lower.includes("hybrid search") || lower.includes("vector")) return QUESTION_RUBRICS["rag"];
  if (lower.includes("vllm") || lower.includes("quantization") || lower.includes("inference") || lower.includes("kv cache")) return QUESTION_RUBRICS["vllm"];
  if (lower.includes("500 million") || lower.includes("geo-dns") || lower.includes("multi-region") || lower.includes("high availability") || lower.includes("high-availability") || lower.includes("distributed system")) return QUESTION_RUBRICS["sys_scale"];
  if (lower.includes("sharding") || lower.includes("hotspot") || lower.includes("consistent hashing")) return QUESTION_RUBRICS["sys_sharding"];
  if (lower.includes("cascading") || lower.includes("circuit breaker") || lower.includes("microservices mesh")) return QUESTION_RUBRICS["sys_resilience"];
  if (lower.includes("zero-trust") || lower.includes("zero trust") || lower.includes("mtls") || lower.includes("spiffe")) return QUESTION_RUBRICS["sys_security"];
  if (lower.includes("star") || lower.includes("disagreement") || lower.includes("outage") || lower.includes("failed to meet") || lower.includes("elevate") || lower.includes("why do you specifically")) return QUESTION_RUBRICS["hr_star"];
  return null;
}

/**
 * Check if candidate intentionally skipped the question.
 */
function isSkippedAnswer(text, status = "") {
  if (status && status.toUpperCase() === "SKIPPED") return true;
  const t = (text || "").trim().toLowerCase();
  return t === "skipped" || t === "[skipped]" || t === "skip";
}

/**
 * Check if the answer is completely empty or just whitespace.
 */
function isEmptyAnswer(text) {
  return !(text || "").trim();
}

/**
 * Check if the candidate explicitly gave up or stated they do not know.
 */
function isNoAnswer(text) {
  const t = (text || "").trim().toLowerCase();
  const noAnswerPhrases = [
    "i don't know", "i dont know", "no idea", "not sure", "i have no idea",
    "can't answer", "cant answer", "i am not aware", "i don't remember",
    "idk", "no answer", "pass", "na", "n/a", "none", "nothing", "skip"
  ];
  if (noAnswerPhrases.includes(t)) return true;
  const noAnswerRegex = /^(i\s+(do\s*not|don'?t)\s*(know|have\s+any\s+idea|remember|recall)|no\s+idea|not\s+sure|i\s+can'?t\s+answer|haven'?t\s+studied|unaware)[\.\!\?]?$/i;
  return noAnswerRegex.test(t);
}

/**
 * Detect keyboard mash, repetitive characters, or meaningless strings.
 */
function isMeaninglessOrGibberish(text) {
  const t = (text || "").trim();
  if (!t) return true;
  if (/(.)\1{4,}/.test(t)) return true;
  if (/(asdf|qwer|zxcv|hjkl|12345|67890)/i.test(t) && t.length < 30) return true;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length <= 2 && t.length > 8 && !/[aeiouy]/i.test(t)) return true;
  return false;
}

/**
 * Detect keyword stuffing where words are pasted without syntax.
 */
function isKeywordStuffing(text) {
  const words = (text || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length < 8) return false;
  const technicalKeywords = new Set([
    "c++", "python", "java", "react", "virtual", "memory", "pointer", "object",
    "database", "cloud", "docker", "kubernetes", "stack", "heap", "thread",
    "cache", "redis", "index", "api", "rest", "async", "await", "function",
    "class", "algorithm", "complexity", "sql", "nosql", "cluster", "shard"
  ]);
  const connectorWords = new Set([
    "is", "are", "the", "a", "an", "because", "due", "to", "in", "order",
    "which", "that", "when", "where", "how", "used", "allocates", "stores",
    "manages", "provides", "implements", "allows", "between", "while"
  ]);
  const matchedKeywords = words.filter(w => technicalKeywords.has(w)).length;
  const matchedConnectors = words.filter(w => connectorWords.has(w)).length;
  if (matchedKeywords >= 4 && matchedConnectors <= 1 && matchedKeywords / words.length > 0.45) {
    return true;
  }
  return false;
}

/**
 * Check if the answer is completely non-responsive, empty, or placeholder.
 */
function isNonAnswer(text) {
  return isEmptyAnswer(text) || isNoAnswer(text) || isMeaninglessOrGibberish(text);
}

/**
 * Checks if the answer is completely off-topic or irrelevant to the question asked.
 */
function isIrrelevantToQuestion(questionText, answerText) {
  const lowerQ = (questionText || "").toLowerCase();
  const lowerA = (answerText || "").toLowerCase();

  const offTopicPatterns = [
    /\b(i\s+like\s+playing|playing\s+cricket|watching\s+movies|weather\s+is\s+very\s+nice)\b/i,
    /\b(good\s+morning|hello\s+sir|how\s+are\s+you|nice\s+to\s+meet\s+you)\b/i,
    /\b(i\s+want\s+a\s+job|please\s+hire\s+me|i\s+am\s+hardworking)\b/i,
    /\b(football|cricket|biryani|pizza|burger|song|movie|sunny\s+day)\b/i
  ];
  if (offTopicPatterns.some(p => p.test(lowerA))) {
    const qTokens = (lowerQ.match(/[a-z0-9_]{3,}/g) || []).filter(w => !["what", "explain", "difference", "between", "does", "with"].includes(w));
    const aTokens = new Set(lowerA.match(/[a-z0-9_]{3,}/g) || []);
    const overlap = qTokens.filter(t => aTokens.has(t));
    if (overlap.length === 0) return true;
  }

  const broadTechnicalTerms = [
    "data structure", "algorithm", "complexity", "runtime", "memory", "cache",
    "database", "index", "thread", "async", "concurrency", "network", "http",
    "api", "server", "client", "frontend", "backend", "microservice", "cloud",
    "docker", "kubernetes", "scale", "latency", "throughput", "security", "auth",
    "token", "session", "encryption", "test", "debug", "deploy", "git", "code",
    "function", "class", "object", "component", "render", "state", "hook", "props",
    "dom", "css", "html", "sql", "nosql", "query", "table", "schema", "rest",
    "graphql", "websocket", "grpc", "queue", "event", "pubsub", "kafka", "redis",
    "load balance", "proxy", "gateway", "ci/cd", "pipeline", "cluster", "distributed",
    "partition", "shard", "replication", "failover", "dns", "tcp", "udp", "ssl",
    "tls", "cors", "cookie", "jwt", "oauth", "pointer", "stack", "heap", "raii",
    "star", "situation", "task", "action", "result", "leadership", "mentor"
  ];

  const stopWords = new Set([
    "what", "when", "where", "which", "that", "this", "with", "from", "your", "have",
    "been", "does", "will", "would", "could", "should", "about", "their", "there",
    "than", "then", "into", "also", "each", "other", "some", "more", "most",
    "very", "just", "like", "make", "many", "only", "over", "such", "take",
    "they", "these", "much", "well", "here"
  ]);

  const qWords = (lowerQ.match(/[a-z]{4,}/g) || []).filter((w) => !stopWords.has(w));
  const hasAnyTechnical = broadTechnicalTerms.some((term) => lowerA.includes(term));
  const aWords = new Set(lowerA.match(/[a-z]{4,}/g) || []);
  const hasQuestionOverlap = qWords.some((w) => aWords.has(w));

  if (!hasAnyTechnical && !hasQuestionOverlap) {
    return true;
  }
  return false;
}

/**
 * Evaluates mathematical and logical deduction in Round 1 Aptitude questions.
 */
function evaluateAptitudeAnswer(questionText, answerText) {
  const lowerQ = (questionText || "").toLowerCase();
  const lowerAns = (answerText || "").toLowerCase();
  const cleanAns = lowerAns.replace(/[^\w\s.,%()\-*+/=]/g, " ");

  // Q1: 12,000 requests, 4 nodes, 150% surge, 25% upgrade -> 8 nodes
  if (lowerQ.includes("12,000") || lowerQ.includes("12000") || (lowerQ.includes("microservices") && lowerQ.includes("worker nodes"))) {
    const has8 = /\b(8|eight)\b/i.test(lowerAns);
    const hasCalc = ["30000", "30,000", "3750", "3,750", "3000", "3,000", "ceil"].some((t) => lowerAns.includes(t));
    if (has8 && hasCalc) {
      return {
        score: 100,
        status: "correct",
        verdict: "Accepted • 100/100",
        feedback: "Perfect! Correctly deduced that peak surged traffic is 30,000 req/min and each upgraded node handles 3,750 req/min, requiring exactly 8 worker nodes.",
        keywords: ["8 nodes", "30,000 req/min", "3,750 req/min", "throughput scaling"],
        suggested_answer_points: ["Original node capacity: 3,000 req/min", "Surged traffic: 30,000 req/min", "Upgraded node: 3,750 req/min", "Ceil(30,000 / 3,750) = 8 nodes"],
        technical_accuracy: 100,
        communication_clarity: 95,
        problem_solving: 100,
      };
    } else if (has8) {
      return {
        score: 88,
        status: "correct",
        verdict: "Correct Answer • 88/100",
        feedback: "Correct answer (8 worker nodes). To maximize your score, show the intermediate mathematical calculations: 30,000 req/min surged traffic / 3,750 req/min upgraded node capacity.",
        keywords: ["8 nodes"],
        suggested_answer_points: ["Original node capacity: 3,000 req/min", "Surged traffic: 30,000 req/min", "Upgraded node: 3,750 req/min", "Result: 8 nodes"],
        technical_accuracy: 90,
        communication_clarity: 80,
        problem_solving: 90,
      };
    } else if (hasCalc) {
      return {
        score: 50,
        status: "partial",
        verdict: "Partially Correct • 50/100",
        feedback: "Good attempt at calculating throughput, but the final node count is incorrect or missing. The minimum number of worker nodes needed is 8.",
        keywords: ["throughput calculation"],
        suggested_answer_points: ["Surged traffic = 30,000 req/min", "Upgraded node = 3,750 req/min", "Nodes needed = 8"],
        technical_accuracy: 50,
        communication_clarity: 60,
        problem_solving: 50,
      };
    } else {
      return {
        score: 20,
        status: "incorrect",
        verdict: "Incorrect • 20/100",
        feedback: "Incorrect answer. The correct calculation requires 8 worker nodes (12,000 * 2.5 = 30,000 req/min; upgraded node capacity = 3,750 req/min; 30,000 / 3,750 = 8 nodes).",
        keywords: [],
        suggested_answer_points: ["Original capacity per node: 3,000 req/min", "Surged traffic: 30,000 req/min", "New node capacity: 3,750 req/min", "Total nodes required = 8"],
        technical_accuracy: 20,
        communication_clarity: 40,
        problem_solving: 15,
      };
    }
  }

  // Q2: 3 replica nodes, 95% reliability, quorum at least 2 -> 99.275%
  if (lowerQ.includes("replica nodes") || lowerQ.includes("quorum") || (lowerQ.includes("fault-tolerant") && lowerQ.includes("95%"))) {
    const hasProb = ["99.275", "99.28", "99.3", "0.99275", "0.9928", "99.27%"].some((p) => lowerAns.includes(p));
    const hasBinomial = ["binomial", "(0.95)^3", "0.857", "0.135", "combination", "p(all 3)"].some((b) => lowerAns.includes(b));
    if (hasProb) {
      return {
        score: hasBinomial ? 100 : 90,
        status: "correct",
        verdict: hasBinomial ? "Accepted • 100/100" : "Accepted • 90/100",
        feedback: "Correct! The exact probability that at least 2 nodes remain operational is 99.275% (using binomial expansion P(3) + P(2)).",
        keywords: ["99.275%", "binomial probability", "quorum reliability"],
        suggested_answer_points: ["P(all 3 operational) = 0.95^3 = 0.857375", "P(exactly 2) = 3 * 0.95^2 * 0.05 = 0.135375", "Total probability = 99.275%"],
        technical_accuracy: hasBinomial ? 100 : 92,
        communication_clarity: 90,
        problem_solving: 100,
      };
    } else if (hasBinomial) {
      return {
        score: 55,
        status: "partial",
        verdict: "Partially Correct • 55/100",
        feedback: "Correct methodology (binomial distribution for quorum), but calculation error in the final percentage. The exact probability is 99.275%.",
        keywords: ["binomial probability"],
        suggested_answer_points: ["P(X >= 2) = P(3) + P(2) = 99.275%"],
        technical_accuracy: 60,
        communication_clarity: 65,
        problem_solving: 55,
      };
    } else {
      return {
        score: 20,
        status: "incorrect",
        verdict: "Incorrect • 20/100",
        feedback: "Incorrect answer. Use binomial probability P(X >= 2): P(all 3 up) + P(exactly 2 up) = (0.95)^3 + 3*(0.95)^2*(0.05) = 99.275%.",
        keywords: [],
        suggested_answer_points: ["P(all 3) = 0.857375", "P(exactly 2) = 0.135375", "Sum = 99.275%"],
        technical_accuracy: 20,
        communication_clarity: 35,
        problem_solving: 20,
      };
    }
  }

  // Q3: Progression 2, 6, 12, 20, 30, 42 ... 10th term -> 110, formula n*(n+1)
  if (lowerQ.includes("2, 6, 12, 20, 30, 42") || (lowerQ.includes("progression") && lowerQ.includes("10th term"))) {
    const has110 = /\b(110|one hundred ten)\b/i.test(lowerAns);
    const hasFormula = ["n*(n+1)", "n*(n + 1)", "n(n+1)", "n(n + 1)", "n^2+n", "n^2 + n", "n*n+n"].some((f) => cleanAns.includes(f));
    if (has110 && hasFormula) {
      return {
        score: 100,
        status: "correct",
        verdict: "Accepted • 100/100",
        feedback: "Flawless deduction! Derived the algebraic formula n*(n+1) and correctly determined that the 10th term is 10 * 11 = 110.",
        keywords: ["110", "n*(n+1)", "sequence pattern", "nth term"],
        suggested_answer_points: ["Pattern: 1*2=2, 2*3=6, 3*4=12...", "General formula: a_n = n*(n+1)", "10th term: 10 * 11 = 110"],
        technical_accuracy: 100,
        communication_clarity: 95,
        problem_solving: 100,
      };
    } else if (has110) {
      return {
        score: 85,
        status: "correct",
        verdict: "Correct Answer • 85/100",
        feedback: "Correct value for the 10th term (110). To gain full marks, explicitly write the algebraic nth term formula n*(n+1).",
        keywords: ["110"],
        suggested_answer_points: ["nth term formula: n*(n+1)", "10th term = 110"],
        technical_accuracy: 90,
        communication_clarity: 80,
        problem_solving: 85,
      };
    } else if (hasFormula) {
      return {
        score: 60,
        status: "partial",
        verdict: "Partially Correct • 60/100",
        feedback: "Formula n*(n+1) is correct, but calculation for the 10th term (10*11 = 110) was missed or incorrect.",
        keywords: ["n*(n+1)"],
        suggested_answer_points: ["10th term = 10 * 11 = 110"],
        technical_accuracy: 65,
        communication_clarity: 60,
        problem_solving: 60,
      };
    } else {
      return {
        score: 15,
        status: "incorrect",
        verdict: "Incorrect • 15/100",
        feedback: "Incorrect progression analysis. Notice that each term is n*(n+1): 1*2=2, 2*3=6, 3*4=12. The 10th term is 10*11 = 110.",
        keywords: [],
        suggested_answer_points: ["Pattern is n*(n+1)", "10th term = 10 * 11 = 110"],
        technical_accuracy: 15,
        communication_clarity: 30,
        problem_solving: 15,
      };
    }
  }

  // Q4: Stages A, B, C, D, E topological order
  if (lowerQ.includes("pipeline stages") || lowerQ.includes("topological") || (lowerQ.includes("stage a") && lowerQ.includes("stage b"))) {
    const hasOrder = ["d -> a -> b", "a -> d -> b", "d-a-b", "a-d-b", "d, a, b", "a, d, b"].some((o) => cleanAns.includes(o));
    const hasRules = ["dependency", "topological", "incoming", "prerequisite", "dag"].some((r) => lowerAns.includes(r));
    const hasEConstraint = lowerAns.includes("e") && (lowerAns.includes("first") || lowerAns.includes("last") || lowerAns.includes("between"));
    if (hasOrder || (hasRules && hasEConstraint)) {
      return {
        score: 92,
        status: "correct",
        verdict: "Accepted • 92/100",
        feedback: "Strong topological reasoning! Correctly observed that A precedes B, C requires B and D, and E is placed in valid interior positions (e.g., D -> A -> B -> E -> C).",
        keywords: ["topological sort", "DAG", "dependency graph"],
        suggested_answer_points: ["A must precede B", "C requires B and D", "E cannot be index 1 or 5", "Example valid order: D -> A -> B -> E -> C"],
        technical_accuracy: 95,
        communication_clarity: 90,
        problem_solving: 92,
      };
    } else {
      return {
        score: 25,
        status: "incorrect",
        verdict: "Incorrect • 25/100",
        feedback: "Invalid topological ordering. Valid orderings must have A before B, C after both B and D, and E neither first nor last (e.g., D -> A -> B -> E -> C).",
        keywords: [],
        suggested_answer_points: ["Dependency edges: A->B->C, D->C", "Valid order: D -> A -> B -> E -> C or A -> D -> B -> E -> C"],
        technical_accuracy: 25,
        communication_clarity: 40,
        problem_solving: 25,
      };
    }
  }

  // Q5: 8 compute instances, 1 memory-leak -> 2 runs (ternary 3, 3, 2)
  if (lowerQ.includes("8 identical compute") || lowerQ.includes("benchmark runs") || lowerQ.includes("comparator")) {
    const has2 = /\b(2|two)\b/i.test(lowerAns) && (lowerAns.includes("runs") || lowerAns.includes("minimum 2") || lowerAns.includes("2 benchmark") || /\b2\b/.test(lowerAns));
    const hasTernary = ["3, 3, 2", "3,3,2", "ternary", "3 and 3", "divide into 3", "three groups", "3 nodes"].some((t) => lowerAns.includes(t));
    if (has2 && hasTernary) {
      return {
        score: 100,
        status: "correct",
        verdict: "Accepted • 100/100",
        feedback: "Optimal algorithmic puzzle solution! Correctly partitioned into groups of (3, 3, 2) using ternary search to isolate the degraded node in minimum 2 runs.",
        keywords: ["2 benchmark runs", "ternary search (3, 3, 2)", "optimal partitioning"],
        suggested_answer_points: ["Divide into groups of 3, 3, 2", "Run 1: Compare 3 vs 3", "Run 2: Test remaining degraded subset", "Minimum runs = 2"],
        technical_accuracy: 100,
        communication_clarity: 95,
        problem_solving: 100,
      };
    } else if (has2) {
      return {
        score: 85,
        status: "correct",
        verdict: "Correct Answer • 85/100",
        feedback: "Correct answer (2 benchmark runs). Explain the ternary partitioning strategy (groups of 3, 3, 2) for maximum technical clarity.",
        keywords: ["2 runs"],
        suggested_answer_points: ["Ternary search (3, 3, 2)", "Minimum 2 runs"],
        technical_accuracy: 88,
        communication_clarity: 80,
        problem_solving: 88,
      };
    } else if (lowerAns.includes("3") && (lowerAns.includes("binary") || lowerAns.includes("divide"))) {
      return {
        score: 50,
        status: "partial",
        verdict: "Partially Correct • 50/100",
        feedback: "Binary division gives 3 runs (8 -> 4 -> 2 -> 1). However, ternary partitioning (3, 3, 2) allows pinpointing the node in only 2 runs.",
        keywords: ["binary vs ternary search"],
        suggested_answer_points: ["Ternary search 3, 3, 2 gives 2 runs", "Binary gives 3 runs"],
        technical_accuracy: 55,
        communication_clarity: 60,
        problem_solving: 50,
      };
    } else {
      return {
        score: 20,
        status: "incorrect",
        verdict: "Incorrect • 20/100",
        feedback: "Incorrect answer. Minimum 2 benchmark runs are required using ternary search: divide into (3, 3, 2), compare 3 vs 3 on run 1, and test the remaining subset on run 2.",
        keywords: [],
        suggested_answer_points: ["Divide into 3, 3, 2", "Minimum 2 benchmark runs"],
        technical_accuracy: 20,
        communication_clarity: 35,
        problem_solving: 20,
      };
    }
  }

  return null;
}

/**
 * Evaluate single question with strict, honest semantic analysis.
 */
export function evaluateSingleQuestion(questionObj, company = "Google", role = "Software Engineer", difficulty = "Medium") {
  const qId = questionObj.question_id || questionObj.id || 1;
  const qText = questionObj.question || "";
  const ansText = (questionObj.answer || "").trim();
  const rawStatus = (questionObj.status || "").toUpperCase();
  const lowerAns = ansText.toLowerCase();
  const words = ansText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 0. Skipped check -> Strict 0/100
  if (isSkippedAnswer(ansText, rawStatus)) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: "",
      score: 0,
      status: "SKIPPED",
      verdict: "Skipped • 0/100",
      relevance: 0,
      correctness: 0,
      completeness: 0,
      technical_depth: 0,
      technical_accuracy: 0,
      communication_clarity: 0,
      problem_solving: 0,
      feedback: "Question was skipped by candidate.",
      strengths: [],
      weaknesses: ["Question was not attempted."],
      missing_concepts: [],
      identified_keywords: [],
      suggested_answer_points: [
        "Review foundational concepts for this topic",
        "Attempt all questions to maximize partial credit opportunities"
      ],
    };
  }

  // 1. Non-answer / Empty / No-Answer check -> Strict 0/100
  if (isEmptyAnswer(ansText)) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: 0,
      status: "EMPTY",
      verdict: "Empty Response • 0/100",
      relevance: 0,
      correctness: 0,
      completeness: 0,
      technical_depth: 0,
      technical_accuracy: 0,
      communication_clarity: 0,
      problem_solving: 0,
      feedback: "Empty response. No answer was provided.",
      strengths: [],
      weaknesses: ["No response submitted."],
      missing_concepts: [],
      identified_keywords: [],
      suggested_answer_points: ["Provide an explanation addressing the problem requirements."],
    };
  }

  if (isNoAnswer(ansText)) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: 0,
      status: "NO_ANSWER",
      verdict: "No Answer • 0/100",
      relevance: 0,
      correctness: 0,
      completeness: 0,
      technical_depth: 0,
      technical_accuracy: 0,
      communication_clarity: 0,
      problem_solving: 0,
      feedback: "Candidate indicated lack of knowledge. Zero credit awarded.",
      strengths: [],
      weaknesses: ["Candidate explicitly stated they do not know the answer."],
      missing_concepts: [],
      identified_keywords: [],
      suggested_answer_points: ["Review fundamental topic literature."],
    };
  }

  if (isMeaninglessOrGibberish(ansText)) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: 0,
      status: "IRRELEVANT",
      verdict: "Meaningless Response • 0/100",
      relevance: 0,
      correctness: 0,
      completeness: 0,
      technical_depth: 0,
      technical_accuracy: 0,
      communication_clarity: 0,
      problem_solving: 0,
      feedback: "Input detected as gibberish, placeholder, or keyboard mash. Zero credit awarded.",
      strengths: [],
      weaknesses: ["Response lacks coherent technical or conceptual meaning."],
      missing_concepts: [],
      identified_keywords: [],
      suggested_answer_points: ["Provide coherent explanations addressing the technical constraints."],
    };
  }

  if (isKeywordStuffing(ansText)) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: 0,
      status: "IRRELEVANT",
      verdict: "Keyword Stuffing • 0/100",
      relevance: 0,
      correctness: 0,
      completeness: 0,
      technical_depth: 0,
      technical_accuracy: 0,
      communication_clarity: 0,
      problem_solving: 0,
      feedback: "Disconnected technical keywords without grammatical reasoning detected. Zero credit awarded.",
      strengths: [],
      weaknesses: ["Keywords used without logical reasoning or context."],
      missing_concepts: [],
      identified_keywords: [],
      suggested_answer_points: ["Construct cohesive sentences explaining mechanism and trade-offs."],
    };
  }

  // 2. Aptitude Evaluation (Round 1)
  const aptEval = evaluateAptitudeAnswer(qText, ansText);
  if (aptEval) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: aptEval.score,
      status: aptEval.status,
      verdict: aptEval.verdict,
      relevance: aptEval.technical_accuracy,
      correctness: aptEval.technical_accuracy,
      completeness: aptEval.technical_accuracy,
      technical_depth: aptEval.problem_solving,
      technical_accuracy: aptEval.technical_accuracy,
      communication_clarity: aptEval.communication_clarity,
      problem_solving: aptEval.problem_solving,
      feedback: aptEval.feedback,
      strengths: aptEval.score >= 70 ? ["Correct mathematical deduction"] : [],
      weaknesses: aptEval.score < 70 ? ["Inaccurate mathematical computation"] : [],
      missing_concepts: [],
      identified_keywords: aptEval.keywords || [],
      suggested_answer_points: aptEval.suggested_answer_points || [],
    };
  }

  // 3. Test Case & Automated Code Execution Factor (Round 2 DSA)
  const testResults = questionObj.test_results || questionObj.testResults;
  if (testResults && typeof testResults.totalCount === "number" && testResults.totalCount > 0) {
    const passedRatio = testResults.passedCount / testResults.totalCount;
    const baseScore = Math.round(passedRatio * 80);
    const hasComplexity = ["o(", "o (", "complexity", "big-o", "big o", "runtime"].some((c) => lowerAns.includes(c));
    const finalScore = Math.min(baseScore + (hasComplexity ? 15 : 0) + 5, 100);
    const status = finalScore >= 75 ? "CORRECT" : finalScore >= 40 ? "PARTIAL" : "INCORRECT";
    const verdict = `${passedRatio === 1 ? "Accepted" : "Partially Accepted"} • ${finalScore}/100`;
    let feedbackMsg = `Automated tests: ${testResults.passedCount}/${testResults.totalCount} passed (${testResults.executionTimeMs || 10}ms). `;
    if (passedRatio === 1) {
      feedbackMsg += "All test assertions passed successfully! Solid runtime complexity.";
    } else {
      feedbackMsg += `${testResults.totalCount - testResults.passedCount} test case(s) failed. Check edge conditions.`;
    }

    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: finalScore,
      status,
      verdict,
      relevance: Math.round(passedRatio * 100),
      correctness: Math.round(passedRatio * 100),
      completeness: Math.round(passedRatio * 100),
      technical_depth: finalScore,
      technical_accuracy: Math.round(passedRatio * 100),
      communication_clarity: 80,
      problem_solving: finalScore,
      feedback: feedbackMsg,
      strengths: passedRatio > 0.5 ? ["Passed core automated test cases"] : [],
      weaknesses: passedRatio < 1.0 ? ["Failed boundary or edge test cases"] : [],
      missing_concepts: [],
      identified_keywords: ["automated test suite", "execution runner"],
      suggested_answer_points: [
        `Ensure correct return output for all input bounds (${testResults.passedCount}/${testResults.totalCount} passed)`,
        "Verify optimal Big-O time and space complexity",
      ],
    };
  }

  // 4. Keyword & Concept Detection (Rounds 3 & 4 or general technical)
  const rubric = findRubricForQuestion(qText, questionObj.domain || role, questionObj.expected_key_points || questionObj.expectedKeyPoints);

  // 4a. Explicit Relevance Check — catch completely off-topic answers -> STRICT 0/100
  if (isIrrelevantToQuestion(qText, ansText)) {
    return {
      question_id: qId,
      question: qText,
      candidate_answer: ansText,
      score: 0,
      status: "IRRELEVANT",
      verdict: "Off-Topic • 0/100",
      relevance: 0,
      correctness: 0,
      completeness: 0,
      technical_depth: 0,
      technical_accuracy: 0,
      communication_clarity: 0,
      problem_solving: 0,
      feedback: "Answer is completely off-topic and unrelated to the question asked. Zero technical relevance detected.",
      strengths: [],
      weaknesses: ["Answer is completely irrelevant to the question."],
      missing_concepts: rubric ? rubric.coreConcepts : [],
      identified_keywords: [],
      suggested_answer_points: rubric ? rubric.coreConcepts : [
        "Address the core problem requirements and constraints",
        "Explain step-by-step algorithms and architecture mechanisms",
        "Detail asymptotic Big-O runtime and failure modes",
      ],
    };
  }

  const allKeywords = rubric ? rubric.keywords : [
    "o(1)", "o(n)", "complexity", "trade-off", "performance", "architecture", "data structure", "algorithm", "pointer", "stack", "queue", "hash", "tree", "dp", "dynamic programming", "sliding window"
  ];

  const matchedKeywords = allKeywords.filter((kw) => lowerAns.includes(kw));
  const hasComplexity = ["o(", "o (", "complexity", "big-o", "big o", "time complexity", "space complexity", "runtime"].some((c) => lowerAns.includes(c));
  const hasTradeoffs = ["trade-off", "tradeoff", "pros", "cons", "advantage", "disadvantage", "bottleneck", "edge case", "vs", "versus"].some((t) => lowerAns.includes(t));
  const hasStructure = ["1.", "2.", "•", "-", "step", "first", "second", "finally", "\n\n"].some((s) => ansText.includes(s));
  const hasCodeOrTechnical = ["const", "let", "function", "class", "async", "await", "return", "()", "{}", "import", "def ", "int ", "vector"].some((c) => lowerAns.includes(c));

  let techScore = 0;
  let commScore = 0;
  let probScore = 0;

  if (matchedKeywords.length === 0) {
    techScore = Math.min(10 + wordCount * 0.3, 20);
    commScore = Math.min(15 + wordCount * 0.4, 30);
    probScore = Math.min(10 + (hasComplexity ? 10 : 0), 20);
  } else if (matchedKeywords.length === 1) {
    techScore = Math.min(25 + wordCount * 0.5, 45);
    commScore = Math.min(35 + (hasStructure ? 15 : 0) + wordCount * 0.4, 55);
    probScore = Math.min(25 + (hasComplexity ? 15 : 0) + (hasTradeoffs ? 10 : 0), 45);
  } else if (matchedKeywords.length >= 2 && matchedKeywords.length <= 3) {
    techScore = Math.min(45 + matchedKeywords.length * 8 + (wordCount >= 30 ? 10 : 0), 75);
    commScore = Math.min(45 + (hasStructure ? 15 : 5) + (wordCount >= 40 ? 15 : 5), 80);
    probScore = Math.min(40 + (hasComplexity ? 20 : 5) + (hasTradeoffs ? 15 : 5), 75);
  } else {
    techScore = Math.min(65 + matchedKeywords.length * 6 + (hasTradeoffs ? 10 : 0) + (hasCodeOrTechnical ? 8 : 0), 98);
    commScore = Math.min(60 + (hasStructure ? 15 : 5) + (wordCount >= 50 ? 15 : 5), 96);
    probScore = Math.min(55 + (hasComplexity ? 20 : 5) + (hasTradeoffs ? 18 : 5), 96);
  }

  if (wordCount < 12) {
    techScore = Math.max(techScore - 30, 0);
    commScore = Math.max(commScore - 25, 0);
    probScore = Math.max(probScore - 25, 0);
  }

  let finalQScore = Math.round(0.30 * techScore + 0.25 * (matchedKeywords.length > 0 ? Math.min(matchedKeywords.length * 25, 100) : 10) + 0.20 * probScore + 0.15 * (hasComplexity || hasTradeoffs ? 70 : 30) + 0.10 * commScore);
  
  // Strict relevance override gate
  const relevanceScore = matchedKeywords.length > 0 ? Math.min(matchedKeywords.length * 30, 100) : (wordCount > 10 ? 15 : 0);
  if (relevanceScore < 20 && matchedKeywords.length === 0) {
    finalQScore = 0;
  }
  finalQScore = Math.max(0, Math.min(100, finalQScore));

  const status = finalQScore >= 70 ? "CORRECT" : finalQScore >= 35 ? "PARTIAL" : "INCORRECT";
  const verdict = `${finalQScore >= 80 ? "Strong Answer" : finalQScore >= 60 ? "Good Attempt" : finalQScore > 0 ? "Needs Work" : "Zero Credit"} • ${finalQScore}/100`;

  let feedbackMsg = "";
  if (finalQScore >= 80) {
    feedbackMsg = `Outstanding technical execution! Covered ${matchedKeywords.length} core concepts (${matchedKeywords.slice(0, 4).join(", ") || "optimal algorithms"}). Strong trade-off evaluation.`;
  } else if (finalQScore >= 60) {
    feedbackMsg = `Solid grasp of principles (${matchedKeywords.join(", ") || "fundamentals"}). Add explicit Big-O runtime and failure recovery modes.`;
  } else if (finalQScore >= 35) {
    feedbackMsg = "Basic conceptual awareness. Lacks architectural depth, concrete examples, or complexity trade-offs.";
  } else {
    feedbackMsg = "Answer lacked required technical depth, contained inaccurate claims, or was irrelevant.";
  }

  return {
    question_id: qId,
    question: qText,
    candidate_answer: ansText,
    score: finalQScore,
    status,
    verdict,
    relevance: relevanceScore,
    correctness: Math.round(techScore),
    completeness: Math.round(probScore),
    technical_depth: Math.round(techScore * 0.9),
    technical_accuracy: Math.round(techScore),
    communication_clarity: Math.round(commScore),
    problem_solving: Math.round(probScore),
    feedback: feedbackMsg.trim(),
    strengths: finalQScore >= 60 ? [`Good coverage of ${matchedKeywords.slice(0, 3).join(", ")}`] : [],
    weaknesses: finalQScore < 70 ? (rubric ? rubric.coreConcepts.slice(0, 2) : ["Incomplete technical coverage"]) : [],
    missing_concepts: finalQScore < 70 && rubric ? rubric.coreConcepts.filter(c => !lowerAns.includes(c.toLowerCase().slice(0, 5))) : [],
    identified_keywords: matchedKeywords.slice(0, 6),
    suggested_answer_points: rubric ? rubric.coreConcepts : [
      "State core problem constraints and assumptions upfront",
      "Explicitly explain asymptotic time and space complexities (Big-O)",
      "Detail boundary edge cases, input validation, and optimal architecture choices",
    ],
  };
}

/**
 * Execute evaluation via FastAPI backend or fallback to local evaluator.
 */
export async function evaluateQuestionAPI(payload) {
  const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
  for (const base of candidateBases) {
    try {
      const url = base ? `${base}/api/interviews/evaluate-question` : `/api/interviews/evaluate-question`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
  }
  return evaluateSingleQuestion(payload, payload.company, payload.role, payload.difficulty);
}

/**
 * Execute Gemini Live LLM Evaluation via REST with strict zero-credit rules.
 */
export async function evaluateWithGeminiAPI(company, role, difficulty, answers, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let qaText = "";
  answers.forEach((a, idx) => {
    qaText += `\n--- Question ${idx + 1} (ID: ${a.question_id || idx + 1}) ---\n`;
    qaText += `Question: ${a.question}\n`;
    qaText += `Candidate Answer: ${a.answer || a.candidate_answer || "[NO ANSWER]"}\n`;
    qaText += `Status: ${a.status || "COMPLETED"}\n`;
  });

  const systemInstruction = 
    `You are a strict professional Staff Technical Interviewer evaluating a candidate for ${company}'s ${role} role (${difficulty} difficulty).\n` +
    `Grade strictly on demonstrated knowledge:\n` +
    `- Relevance (25%)\n- Technical Correctness (30%)\n- Completeness (20%)\n- Depth/Reasoning (15%)\n- Communication (10%)\n` +
    `ZERO CREDIT RULES:\n` +
    `- If candidate skipped the question, score MUST BE 0.\n` +
    `- If answer is empty or whitespace, score MUST BE 0.\n` +
    `- If candidate says "I don't know" or equivalents, score MUST BE 0.\n` +
    `- If answer is off-topic, random, or irrelevant to the technical question, score MUST BE 0.\n` +
    `- If answer is keyword stuffing without sentences, score MUST BE 0.\n` +
    `- If answer is technically contradictory or completely false, score MUST BE 0.\n` +
    `NEVER give 5/100 to an irrelevant or empty answer.\n` +
    `Return ONLY raw JSON:\n` +
    `{\n` +
    `  "overall_score": 75,\n` +
    `  "technical_score": 75,\n` +
    `  "communication_score": 80,\n` +
    `  "problem_solving_score": 70,\n` +
    `  "grade": "B (Solid)",\n` +
    `  "overall_summary": "Summary...",\n` +
    `  "strengths": ["Strength 1"],\n` +
    `  "improvements": ["Improvement 1"],\n` +
    `  "detailed_feedback": [\n` +
    `    {\n` +
    `      "question_id": 1,\n` +
    `      "question": "Question text",\n` +
    `      "candidate_answer": "...",\n` +
    `      "score": 0,\n` +
    `      "status": "IRRELEVANT",\n` +
    `      "relevance": 0,\n` +
    `      "correctness": 0,\n` +
    `      "completeness": 0,\n` +
    `      "technical_depth": 0,\n` +
    `      "communication": 0,\n` +
    `      "feedback": "...",\n` +
    `      "strengths": [],\n` +
    `      "weaknesses": ["Irrelevant response"],\n` +
    `      "missing_concepts": ["Concept 1"],\n` +
    `      "suggested_answer_points": ["Point 1"]\n` +
    `    }\n` +
    `  ]\n` +
    `}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\nCandidate Answers to evaluate:\n${qaText}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (rawText.startsWith("```json")) rawText = rawText.slice(7);
      if (rawText.startsWith("```")) rawText = rawText.slice(3);
      if (rawText.endsWith("```")) rawText = rawText.slice(0, -3);
      const parsed = JSON.parse(rawText.trim());
      return parsed;
    }
  } catch (e) {
    console.warn("Gemini REST API evaluation failed:", e);
  }

  return null;
}

/**
 * Offline / Default Question-Specific NLP Evaluation with strict math and statistics.
 */
export function evaluateWithLocalRubric(company, role, difficulty, answers, interviewType = "Technical Interview", domain = "General") {
  const detailed = answers.map((a) => evaluateSingleQuestion(a, company, role, difficulty, a.domain || domain));

  const totalQuestions = Math.max(detailed.length, 1);
  const totalScore = detailed.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const finalScore = Math.round((totalScore / (totalQuestions * 100)) * 100);

  let skippedCount = 0;
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;

  detailed.forEach((d) => {
    const st = (d.status || "").toUpperCase();
    if (st === "SKIPPED" || d.score === 0 && (d.candidate_answer === "" || d.candidate_answer == null)) {
      skippedCount += 1;
    } else if (d.score >= 70) {
      correctCount += 1;
    } else if (d.score >= 35) {
      partialCount += 1;
    } else {
      incorrectCount += 1;
    }
  });

  const answeredCount = totalQuestions - skippedCount;

  const totalTech = detailed.reduce((acc, curr) => acc + (curr.technical_accuracy || curr.correctness || curr.score || 0), 0);
  const avgTech = Math.round(totalTech / totalQuestions);

  const totalComm = detailed.reduce((acc, curr) => acc + (curr.communication_clarity || curr.communication || curr.score || 0), 0);
  const avgComm = Math.round(totalComm / totalQuestions);

  const totalProb = detailed.reduce((acc, curr) => acc + (curr.problem_solving || curr.completeness || curr.score || 0), 0);
  const avgProb = Math.round(totalProb / totalQuestions);

  let grade = "F (Incomplete / Unsatisfactory)";
  if (finalScore >= 90) grade = "A+ (Strong Hire • Outstanding)";
  else if (finalScore >= 80) grade = "A (Hire • Strong Performance)";
  else if (finalScore >= 70) grade = "B+ (Leaning Hire • Solid)";
  else if (finalScore >= 55) grade = "B- (Borderline • Moderate)";
  else if (finalScore >= 35) grade = "C (Needs Practice)";

  const allKeywords = new Set();
  detailed.forEach((d) => {
    if (d.identified_keywords) {
      d.identified_keywords.forEach((kw) => allKeywords.add(kw));
    }
  });

  const strengths = [];
  const improvements = [];

  detailed.forEach((d) => {
    if (d.strengths && d.strengths.length > 0) {
      d.strengths.forEach((s) => { if (!strengths.includes(s)) strengths.push(s); });
    }
    if (d.weaknesses && d.weaknesses.length > 0) {
      d.weaknesses.forEach((w) => { if (!improvements.includes(w)) improvements.push(w); });
    }
  });

  if (strengths.length === 0) {
    if (finalScore >= 60) strengths.push("Basic foundational knowledge demonstrated in attempted questions.");
    else strengths.push("Completed interview session.");
  }
  if (improvements.length === 0) {
    improvements.push("Provide concrete architectural depth and step-by-step algorithms.");
  }

  // Calculate round-by-round sub-scores dynamically based on question metadata or groups
  const roundsGroup = {};
  detailed.forEach((item, idx) => {
    const origAns = answers[idx] || {};
    const rNum = origAns.round_number || item.round_number || (Math.floor(idx / 5) + 1);
    const rTitle = origAns.round_title || item.round_title || `Round ${rNum}`;
    if (!roundsGroup[rNum]) {
      roundsGroup[rNum] = { round_number: rNum, title: rTitle, items: [] };
    }
    roundsGroup[rNum].items.push(item);
  });

  const roundsBreakdown = Object.values(roundsGroup).map((grp) => {
    const avg = grp.items.length
      ? Math.round(grp.items.reduce((acc, c) => acc + c.score, 0) / grp.items.length)
      : 0;
    return {
      round_number: grp.round_number,
      title: grp.title,
      score: avg,
      questions_count: grp.items.length,
    };
  });

  const overallSummary = `Candidate answered ${answeredCount} of ${totalQuestions} questions (Skipped: ${skippedCount}) with a final score of ${finalScore}% (${grade}) for ${company}'s ${role} interview. Correct: ${correctCount}, Partially Correct: ${partialCount}, Incorrect: ${incorrectCount}.`;

  return {
    interview_id: Date.now(),
    score: finalScore,
    score_percentage: `${finalScore}%`,
    grade,
    technical_score: avgTech,
    communication_score: avgComm,
    problem_solving_score: avgProb,
    question_count: totalQuestions,
    answered_count: answeredCount,
    skipped_count: skippedCount,
    correct_count: correctCount,
    partial_count: partialCount,
    partially_correct_count: partialCount,
    incorrect_count: incorrectCount,
    rounds_breakdown: roundsBreakdown,
    identified_keywords: Array.from(allKeywords),
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 5),
    detailed_feedback: detailed,
    overall_summary: overallSummary,
    evaluation_engine: "Intervista Neural Semantic Rubric Engine",
    analysis: {
      overallPerformance: {
        score: finalScore,
        performanceLevel: grade,
        completionRate: `${Math.round((answeredCount / totalQuestions) * 100)}%`,
      },
      technicalPerformance: {
        knowledge: `${avgTech}%`,
        problemSolving: `${avgProb}%`,
        conceptualUnderstanding: `${Math.round((avgTech + avgProb) / 2)}%`,
        depth: avgTech >= 70 ? "High" : avgTech >= 40 ? "Moderate" : "Low",
      },
      communication: {
        clarity: `${avgComm}%`,
        structure: avgComm >= 70 ? "Structured" : "Developing",
        conciseness: "Adequate",
      },
      strengths: strengths.slice(0, 5),
      weaknesses: improvements.slice(0, 5),
      missingConcepts: detailed.flatMap(d => d.missing_concepts || []).slice(0, 6),
      questionBreakdown: detailed.map((d, i) => ({
        questionNumber: i + 1,
        question: d.question,
        candidateAnswer: d.candidate_answer,
        status: d.status,
        score: d.score,
        feedback: d.feedback,
        missingConcepts: d.missing_concepts || [],
        idealAnswer: (d.suggested_answer_points || []).join("; "),
      })),
    }
  };
}

/**
 * Main evaluation entry point.
 */
export async function evaluateInterview(company, role, difficulty, answers, customApiKey = null, interviewType = "Technical Interview", domain = "General") {
  const envKey = (typeof process !== "undefined" && process.env?.VITE_GEMINI_API_KEY) || "";
  const effectiveKey = customApiKey || envKey;

  if (effectiveKey && effectiveKey.length > 10) {
    const aiResult = await evaluateWithGeminiAPI(company, role, difficulty, answers, effectiveKey, interviewType, domain);
    if (aiResult && typeof aiResult.overall_score === "number") {
      return {
        interview_id: Date.now(),
        score: aiResult.overall_score,
        score_percentage: `${aiResult.overall_score}%`,
        grade: aiResult.grade || (aiResult.overall_score >= 80 ? "A (Hire)" : "B (Needs Practice)"),
        technical_score: aiResult.technical_score || aiResult.overall_score,
        communication_score: aiResult.communication_score || aiResult.overall_score,
        problem_solving_score: aiResult.problem_solving_score || aiResult.overall_score,
        identified_keywords: aiResult.identified_keywords || [],
        strengths: aiResult.strengths || ["Strong technical attempt"],
        improvements: aiResult.improvements || ["Continue practicing system design"],
        detailed_feedback: aiResult.detailed_feedback || [],
        overall_summary: aiResult.overall_summary || "Evaluation completed.",
        evaluation_engine: "Gemini 1.5 Flash AI",
      };
    }
  }

  return evaluateWithLocalRubric(company, role, difficulty, answers, interviewType, domain);
}

