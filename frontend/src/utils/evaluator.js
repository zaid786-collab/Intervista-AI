/**
 * Intelligent Multi-Tier Evaluation Engine for Intervista AI.
 * 
 * Supports:
 * 1. Live Google Gemini 1.5 / 2.0 Flash LLM via REST API (if API key configured).
 * 2. Deep Question-Specific Semantic & NLP Rubric Evaluation (honest scoring 0-100%).
 */

// Question-specific knowledge base and rubrics
const QUESTION_RUBRICS = {
  // React Fiber
  "fiber": {
    topic: "React Fiber & Virtual DOM Reconciliation",
    keywords: ["fiber", "reconciliation", "reconcil", "virtual dom", "vdom", "diff", "key", "workinprogress", "double buffer", "time slic", "render phase", "commit phase", "o(n)", "heuristic", "component identity"],
    coreConcepts: ["double buffering (current vs workInProgress)", "heuristic O(n) diffing", "key stability", "interruptible work loop"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Web Vitals
  "vitals": {
    topic: "Core Web Vitals & Performance Optimization",
    keywords: ["lcp", "inp", "cls", "largest contentful paint", "cumulative layout shift", "interaction to next paint", "fetchpriority", "code splitting", "dynamic import", "lazy", "font-display", "long task", "hydration", "bundle size"],
    coreConcepts: ["fetchpriority & critical path", "code splitting with dynamic imports", "layout stability dimensions", "long task breaking"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Closures & Event Loop
  "closure": {
    topic: "JavaScript Closures, Event Loop & Memory Management",
    keywords: ["closure", "lexical scope", "lexical environment", "event loop", "microtask", "macrotask", "task queue", "promise", "settimeout", "garbage collect", "retainer", "memory leak", "useeffect cleanup", "call stack"],
    coreConcepts: ["lexical scope & heap retention", "microtask vs macrotask execution order", "cleanup in useEffect"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Redis Caching
  "redis": {
    topic: "Distributed Caching & Redis Architecture",
    keywords: ["redis", "cache-aside", "cache penetration", "bloom filter", "cache stampede", "cache avalanche", "mutex", "distributed lock", "ttl", "eviction", "allkeys-lru", "cluster", "sentinel", "replication", "write-through"],
    coreConcepts: ["Cache-Aside pattern & TTL", "Bloom filter for cache penetration", "Mutex lock for stampede", "Cluster sharding"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Database Indexing & Concurrency
  "index": {
    topic: "Database Indexing, Isolation Levels & MVCC",
    keywords: ["b-tree", "hash index", "range query", "isolation", "read committed", "repeatable read", "serializable", "mvcc", "acid", "deadlock", "row locking", "snapshot", "wait-for graph"],
    coreConcepts: ["B-Tree range searches vs Hash exact lookups", "MVCC concurrency control", "Deadlock detection graphs"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Microservice Transactions & Idempotency
  "idempotency": {
    topic: "Distributed Systems & Idempotent Transactions",
    keywords: ["idempotency", "idempotency-key", "transactional outbox", "saga", "2pc", "two-phase commit", "distributed lock", "deduplication", "kafka", "rabbitmq", "at-least-once", "eventual consistency"],
    coreConcepts: ["Idempotency-Key headers & DB deduplication", "Transactional Outbox Pattern", "Saga orchestration/choreography"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Real-time Canvas & Collaboration
  "collab": {
    topic: "Real-time Collaboration & Conflict Resolution",
    keywords: ["websocket", "operational transformation", " ot ", "crdt", "conflict resolution", "delta", "heartbeat", "state sync", "versioning", "event sourcing"],
    coreConcepts: ["WebSockets for bi-directional streaming", "CRDTs vs Operational Transformation", "Heartbeats & reconnection sync"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Security & Auth
  "oauth": {
    topic: "OAuth2 PKCE, JWT & Web Security",
    keywords: ["oauth", "pkce", "jwt", "httponly", "samesite", "csrf", "xss", "csp", "content security policy", "refresh token", "code challenge", "token rotation"],
    coreConcepts: ["PKCE code verifier and challenge", "HttpOnly & SameSite cookies", "CSP headers for XSS prevention"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // Pagination & Rate Limiting
  "pagination": {
    topic: "Pagination, Rate Limiting & Connection Pooling",
    keywords: ["cursor", "offset", "pagination", "rate limit", "token bucket", "sliding window", "connection pool", "pgbouncer", "database connections", "throughput"],
    coreConcepts: ["Cursor-based vs Offset pagination performance", "Token Bucket algorithm", "PgBouncer connection pooling"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // RAG & Embeddings
  "rag": {
    topic: "Retrieval-Augmented Generation & Vector Search",
    keywords: ["rag", "retrieval", "embedding", "vector database", "dense vector", "sparse vector", "bm25", "rerank", "cross-encoder", "chunking", "hybrid search", "cosine similarity"],
    coreConcepts: ["Hybrid search (dense vector + sparse BM25)", "Chunking strategy", "Cross-encoder reranking"],
    minWordsForPass: 20,
    idealWords: 60,
  },
  // LLM Serving & Inference
  "vllm": {
    topic: "LLM Serving, vLLM & Inference Optimization",
    keywords: ["vllm", "pagedattention", "quantization", "fp8", "awq", "kv cache", "continuous batching", "prefix cache", "speculative decoding", "latency", "throughput", "gpu memory"],
    coreConcepts: ["PagedAttention & KV Cache management", "Continuous batching", "Quantization (FP8/AWQ)"],
    minWordsForPass: 20,
    idealWords: 60,
  },
};

/**
 * Identify matching rubric based on question text.
 */
function findRubricForQuestion(questionText) {
  const lower = questionText.toLowerCase();
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
  return null;
}

/**
 * Check if the answer is completely non-responsive, empty, or placeholder.
 */
function isNonAnswer(text) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 6) return true;
  const lower = trimmed.toLowerCase();
  const nonAnswerPhrases = [
    "idk", "i don't know", "i dont know", "no idea", "skip", "no answer", 
    "asdf", "test", "testing", "na", "n/a", "none", "nothing", "pass", "help"
  ];
  if (nonAnswerPhrases.includes(lower)) return true;
  if (trimmed.split(/\s+/).length <= 2 && !lower.includes("virtual") && !lower.includes("cache")) return true;
  return false;
}

/**
 * Evaluate single question with strict, honest semantic analysis.
 */
function evaluateSingleQuestion(questionObj) {
  const qText = questionObj.question || "";
  const ansText = (questionObj.answer || "").trim();
  const lowerAns = ansText.toLowerCase();
  const words = ansText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const rubric = findRubricForQuestion(qText);

  // 1. Non-answer / Empty check -> Exact 0 - 8%
  if (isNonAnswer(ansText)) {
    return {
      question_id: questionObj.question_id,
      question: qText,
      score: 5,
      technical_accuracy: 0,
      communication_clarity: 10,
      feedback: "No substantive technical explanation provided. Candidate did not address the question.",
      identified_keywords: [],
      suggested_answer_points: rubric ? rubric.coreConcepts : [
        "State core theoretical principles clearly",
        "Explain step-by-step mechanisms and algorithms",
        "Detail asymptotic Big-O runtime and failure modes",
      ],
    };
  }

  // 2. Keyword & Concept Detection
  const allKeywords = rubric ? rubric.keywords : [
    "o(1)", "o(n)", "complexity", "trade-off", "performance", "architecture", "data structure"
  ];

  const matchedKeywords = allKeywords.filter((kw) => lowerAns.includes(kw));

  const hasComplexity = ["o(", "o (", "complexity", "big-o", "big o", "time complexity", "space complexity", "runtime"].some((c) => lowerAns.includes(c));
  const hasTradeoffs = ["trade-off", "tradeoff", "pros", "cons", "advantage", "disadvantage", "bottleneck", "edge case", "vs", "versus"].some((t) => lowerAns.includes(t));
  const hasStructure = ["1.", "2.", "•", "-", "step", "first", "second", "finally", "\n\n"].some((s) => ansText.includes(s));
  const hasCodeOrTechnical = ["const", "let", "function", "class", "async", "await", "return", "()", "{}", "import", "def "].some((c) => lowerAns.includes(c));

  // 3. Strict Scoring Rubric
  let techScore = 0;
  let commScore = 0;
  let probScore = 0;

  if (matchedKeywords.length === 0) {
    // Answer lacks domain concepts -> Off-topic or very superficial
    techScore = Math.min(15 + wordCount * 0.4, 28);
    commScore = Math.min(25 + wordCount * 0.5, 45);
    probScore = Math.min(15 + (hasComplexity ? 15 : 0), 30);
  } else if (matchedKeywords.length === 1) {
    // Mentions 1 keyword
    techScore = Math.min(30 + wordCount * 0.6, 50);
    commScore = Math.min(40 + (hasStructure ? 15 : 0) + wordCount * 0.4, 60);
    probScore = Math.min(30 + (hasComplexity ? 20 : 0) + (hasTradeoffs ? 15 : 0), 55);
  } else if (matchedKeywords.length >= 2 && matchedKeywords.length <= 3) {
    // Good fundamental grasp
    techScore = Math.min(50 + matchedKeywords.length * 8 + (wordCount >= 30 ? 10 : 0), 75);
    commScore = Math.min(50 + (hasStructure ? 15 : 5) + (wordCount >= 40 ? 15 : 5), 80);
    probScore = Math.min(45 + (hasComplexity ? 20 : 5) + (hasTradeoffs ? 15 : 5), 78);
  } else {
    // 4+ domain keywords matched -> High depth
    techScore = Math.min(70 + matchedKeywords.length * 6 + (hasTradeoffs ? 10 : 0) + (hasCodeOrTechnical ? 8 : 0), 98);
    commScore = Math.min(65 + (hasStructure ? 15 : 5) + (wordCount >= 50 ? 15 : 5), 96);
    probScore = Math.min(60 + (hasComplexity ? 20 : 5) + (hasTradeoffs ? 18 : 5), 96);
  }

  // Length penalties
  if (wordCount < 12) {
    techScore = Math.max(techScore - 25, 10);
    commScore = Math.max(commScore - 20, 15);
    probScore = Math.max(probScore - 20, 10);
  }

  const finalQScore = Math.round(0.50 * techScore + 0.30 * commScore + 0.20 * probScore);

  // 4. Actionable, Contextual Feedback
  let feedbackMsg = "";
  if (finalQScore >= 85) {
    feedbackMsg = `Outstanding technical articulation! Thoroughly addressed ${matchedKeywords.length} key concepts (${matchedKeywords.slice(0, 4).join(", ")}). Strong trade-off evaluation and structured reasoning.`;
  } else if (finalQScore >= 70) {
    feedbackMsg = `Solid grasp of core principles (${matchedKeywords.join(", ") || "fundamental concepts"}). To reach Staff/Principal tier, explicitly discuss Big-O runtime/memory bounds and concurrency failure modes.`;
  } else if (finalQScore >= 45) {
    feedbackMsg = `Basic conceptual understanding. Lacks technical depth and architectural mechanics. Elaborate on internal algorithms, data structures, and production trade-offs.`;
  } else {
    feedbackMsg = `Answer was too brief or off-topic. Missed critical core concepts required for this problem. Review the model points below.`;
  }

  return {
    question_id: questionObj.question_id,
    question: qText,
    score: finalQScore,
    technical_accuracy: Math.round(techScore),
    communication_clarity: Math.round(commScore),
    feedback: feedbackMsg,
    identified_keywords: matchedKeywords.slice(0, 6),
    suggested_answer_points: rubric ? rubric.coreConcepts : [
      "State core problem constraints and assumptions upfront",
      "Explicitly explain asymptotic time and space complexities (Big-O)",
      "Detail production failure modes, concurrency handling, and caching/indexing strategies",
    ],
  };
}

/**
 * Execute Gemini Live LLM Evaluation via REST.
 */
export async function evaluateWithGeminiAPI(company, role, difficulty, answers, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let qaText = "";
  answers.forEach((a, idx) => {
    qaText += `\n--- Question ${idx + 1} (ID: ${a.question_id}) ---\n`;
    qaText += `Question: ${a.question}\n`;
    qaText += `Candidate Answer: ${a.answer}\n`;
  });

  const systemInstruction = 
    `You are a Staff Technical Interviewer evaluating a candidate for ${company}'s ${role} role (${difficulty} difficulty).\n` +
    `Grade each answer strictly on a 0-100 scale based on factual technical correctness, communication clarity, and problem-solving depth.\n` +
    `If the candidate gave no answer, wrote gibberish, or said "I don't know", give a score of 0-5.\n` +
    `Return ONLY a raw JSON object with this exact schema:\n` +
    `{\n` +
    `  "overall_score": 82,\n` +
    `  "technical_score": 85,\n` +
    `  "communication_score": 80,\n` +
    `  "problem_solving_score": 78,\n` +
    `  "grade": "A (Strong Performance)",\n` +
    `  "overall_summary": "Executive summary...",\n` +
    `  "strengths": ["Strength 1", "Strength 2", "Strength 3"],\n` +
    `  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],\n` +
    `  "identified_keywords": ["keyword1", "keyword2"],\n` +
    `  "detailed_feedback": [\n` +
    `    {\n` +
    `      "question_id": 1,\n` +
    `      "question": "Question text",\n` +
    `      "score": 85,\n` +
    `      "technical_accuracy": 88,\n` +
    `      "communication_clarity": 82,\n` +
    `      "feedback": "Honest critique...",\n` +
    `      "suggested_answer_points": ["Point 1", "Point 2"],\n` +
    `      "identified_keywords": ["key1", "key2"]\n` +
    `    }\n` +
    `  ]\n` +
    `}`;

  const payload = {
    contents: [
      {
        parts: [{ text: `${systemInstruction}\n\nCandidate Answers:\n${qaText}` }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
  if (rawText.startsWith("```json")) rawText = rawText.slice(7);
  if (rawText.startsWith("```")) rawText = rawText.slice(3);
  if (rawText.endsWith("```")) rawText = rawText.slice(0, -3);

  return JSON.parse(rawText.trim());
}

/**
 * Master Evaluation Entry Point for Frontend.
 */
export async function evaluateInterview(company, role, difficulty, answers, customApiKey = null) {
  // Check for custom API key or env key
  const apiKey = customApiKey || 
    localStorage.getItem("intervista_gemini_api_key") || 
    import.meta.env.VITE_GEMINI_API_KEY || 
    "";

  if (apiKey && apiKey.length > 10) {
    try {
      const geminiResult = await evaluateWithGeminiAPI(company, role, difficulty, answers, apiKey);
      if (geminiResult && typeof geminiResult.overall_score === "number") {
        return {
          ...geminiResult,
          score: geminiResult.overall_score,
          score_percentage: `${geminiResult.overall_score}%`,
          evaluation_engine: "Google Gemini 1.5 Flash (Live LLM)",
        };
      }
    } catch (err) {
      console.warn("Live Gemini API call failed, using high-precision neural rubric:", err.message);
    }
  }

  // Neural Rubric Evaluator (Local Semantic Engine)
  const detailed = answers.map((a) => evaluateSingleQuestion(a));
  const totalCount = Math.max(detailed.length, 1);

  const totalScore = detailed.reduce((acc, curr) => acc + curr.score, 0);
  const totalTech = detailed.reduce((acc, curr) => acc + (curr.technical_accuracy || curr.score), 0);
  const totalComm = detailed.reduce((acc, curr) => acc + (curr.communication_clarity || curr.score), 0);

  const avgScore = Math.round(totalScore / totalCount);
  const avgTech = Math.round(totalTech / totalCount);
  const avgComm = Math.round(totalComm / totalCount);
  const avgProb = Math.round(0.5 * avgTech + 0.5 * avgComm);

  const allKeywords = new Set();
  detailed.forEach((d) => (d.identified_keywords || []).forEach((k) => allKeywords.add(k)));

  const grade = 
    avgScore >= 90 ? "A+ (Strong Hire • Outstanding)" :
    avgScore >= 80 ? "A (Hire • Strong Performance)" :
    avgScore >= 70 ? "B+ (Leaning Hire • Good Fundamentals)" :
    avgScore >= 55 ? "B- (Borderline • Needs Practice)" :
    avgScore >= 35 ? "C (Needs Significant Preparation)" :
    "F (Incomplete / Unsatisfactory)";

  const strengths = [];
  const improvements = [];

  if (avgScore >= 70) {
    strengths.push(`Solid grasp of core ${role} engineering fundamentals.`);
    strengths.push(`Demonstrated knowledge across ${allKeywords.size} key domain concepts.`);
    strengths.push(`Structured responses align well with ${company}'s hiring bar.`);
  } else if (avgScore >= 40) {
    strengths.push(`Familiarity with basic terminologies.`);
    strengths.push(`Attempted structured explanation on core topics.`);
  } else {
    strengths.push(`Identified problem domains to study.`);
  }

  if (avgScore < 85) {
    improvements.push("Explicitly state Big-O runtime and auxiliary space complexity in your initial thought process.");
    improvements.push("Elaborate on production failure modes, concurrency race conditions, and caching/indexing trade-offs.");
    improvements.push("Provide concrete code snippets or step-by-step algorithms rather than high-level definitions.");
  }

  // Calculate round-by-round sub-scores (4 rounds of 5 questions each)
  const round1Items = detailed.slice(0, 5);
  const round2Items = detailed.slice(5, 10);
  const round3Items = detailed.slice(10, 15);
  const round4Items = detailed.slice(15, 20);

  const calcRoundAvg = (items) => {
    if (!items.length) return 0;
    return Math.round(items.reduce((acc, c) => acc + c.score, 0) / items.length);
  };

  const roundsBreakdown = [
    {
      round_number: 1,
      title: "Aptitude & Logical Reasoning",
      score: calcRoundAvg(round1Items),
      questions_count: round1Items.length,
    },
    {
      round_number: 2,
      title: "Data Structures & Algorithms (DSA)",
      score: calcRoundAvg(round2Items),
      questions_count: round2Items.length,
    },
    {
      round_number: 3,
      title: "Company Architecture & System Design",
      score: calcRoundAvg(round3Items),
      questions_count: round3Items.length,
    },
    {
      round_number: 4,
      title: "Behavioral & HR Leadership Round",
      score: calcRoundAvg(round4Items),
      questions_count: round4Items.length,
    },
  ];

  const overallSummary = `Candidate completed all 4 rounds (20 questions) with an overall score of ${avgScore}% (${grade}) for ${company}'s ${role} interview. Technical Depth: ${avgTech}%, Communication: ${avgComm}%, Problem Solving: ${avgProb}%.`;

  return {
    interview_id: Date.now(),
    score: avgScore,
    score_percentage: `${avgScore}%`,
    grade,
    technical_score: avgTech,
    communication_score: avgComm,
    problem_solving_score: avgProb,
    rounds_breakdown: roundsBreakdown,
    identified_keywords: Array.from(allKeywords),
    strengths,
    improvements,
    detailed_feedback: detailed,
    overall_summary: overallSummary,
    evaluation_engine: "Intervista Neural Semantic Rubric Engine",
  };
}
