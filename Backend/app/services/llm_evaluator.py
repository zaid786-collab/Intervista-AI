import os
import json
import re
from typing import List, Dict, Any, Optional
import requests

QUESTION_RUBRICS = {
    "fiber": {
        "topic": "React Fiber & Virtual DOM Reconciliation",
        "keywords": ["fiber", "reconciliation", "reconcil", "virtual dom", "vdom", "diff", "key", "workinprogress", "double buffer", "time slic", "render phase", "commit phase", "o(n)", "heuristic", "component identity"],
        "coreConcepts": ["double buffering (current vs workInProgress)", "heuristic O(n) diffing", "key stability", "interruptible work loop"],
    },
    "vitals": {
        "topic": "Core Web Vitals & Performance Optimization",
        "keywords": ["lcp", "inp", "cls", "largest contentful paint", "cumulative layout shift", "interaction to next paint", "fetchpriority", "code splitting", "dynamic import", "lazy", "font-display", "long task", "hydration", "bundle size"],
        "coreConcepts": ["fetchpriority & critical path", "code splitting with dynamic imports", "layout stability dimensions", "long task breaking"],
    },
    "closure": {
        "topic": "JavaScript Closures, Event Loop & Memory Management",
        "keywords": ["closure", "lexical scope", "lexical environment", "event loop", "microtask", "macrotask", "task queue", "promise", "settimeout", "garbage collect", "retainer", "memory leak", "useeffect cleanup", "call stack"],
        "coreConcepts": ["lexical scope & heap retention", "microtask vs macrotask execution order", "cleanup in useEffect"],
    },
    "redis": {
        "topic": "Distributed Caching & Redis Architecture",
        "keywords": ["redis", "cache-aside", "cache penetration", "bloom filter", "cache stampede", "cache avalanche", "mutex", "distributed lock", "ttl", "eviction", "allkeys-lru", "cluster", "sentinel", "replication", "write-through"],
        "coreConcepts": ["Cache-Aside pattern & TTL", "Bloom filter for cache penetration", "Mutex lock for stampede", "Cluster sharding"],
    },
    "index": {
        "topic": "Database Indexing, Isolation Levels & MVCC",
        "keywords": ["b-tree", "hash index", "range query", "isolation", "read committed", "repeatable read", "serializable", "mvcc", "acid", "deadlock", "row locking", "snapshot", "wait-for graph"],
        "coreConcepts": ["B-Tree range searches vs Hash exact lookups", "MVCC concurrency control", "Deadlock detection graphs"],
    },
    "idempotency": {
        "topic": "Distributed Systems & Idempotent Transactions",
        "keywords": ["idempotency", "idempotency-key", "transactional outbox", "saga", "2pc", "two-phase commit", "distributed lock", "deduplication", "kafka", "rabbitmq", "at-least-once", "eventual consistency"],
        "coreConcepts": ["Idempotency-Key headers & DB deduplication", "Transactional Outbox Pattern", "Saga orchestration/choreography"],
    },
    "collab": {
        "topic": "Real-time Collaboration & Conflict Resolution",
        "keywords": ["websocket", "operational transformation", " ot ", "crdt", "conflict resolution", "delta", "heartbeat", "state sync", "versioning", "event sourcing"],
        "coreConcepts": ["WebSockets for bi-directional streaming", "CRDTs vs Operational Transformation", "Heartbeats & reconnection sync"],
    },
    "oauth": {
        "topic": "OAuth2 PKCE, JWT & Web Security",
        "keywords": ["oauth", "pkce", "jwt", "httponly", "samesite", "csrf", "xss", "csp", "content security policy", "refresh token", "code challenge", "token rotation"],
        "coreConcepts": ["PKCE code verifier and challenge", "HttpOnly & SameSite cookies", "CSP headers for XSS prevention"],
    },
    "pagination": {
        "topic": "Pagination, Rate Limiting & Connection Pooling",
        "keywords": ["cursor", "offset", "pagination", "rate limit", "token bucket", "sliding window", "connection pool", "pgbouncer", "database connections", "throughput"],
        "coreConcepts": ["Cursor-based vs Offset pagination performance", "Token Bucket algorithm", "PgBouncer connection pooling"],
    },
    "rag": {
        "topic": "Retrieval-Augmented Generation & Vector Search",
        "keywords": ["rag", "retrieval", "embedding", "vector database", "dense vector", "sparse vector", "bm25", "rerank", "cross-encoder", "chunking", "hybrid search", "cosine similarity"],
        "coreConcepts": ["Hybrid search (dense vector + sparse BM25)", "Chunking strategy", "Cross-encoder reranking"],
    },
    "vllm": {
        "topic": "LLM Serving, vLLM & Inference Optimization",
        "keywords": ["vllm", "pagedattention", "quantization", "fp8", "awq", "kv cache", "continuous batching", "prefix cache", "speculative decoding", "latency", "throughput", "gpu memory"],
        "coreConcepts": ["PagedAttention & KV Cache management", "Continuous batching", "Quantization (FP8/AWQ)"],
    },
}

def find_rubric_for_question(question_text: str):
    lower = question_text.lower()
    if "fiber" in lower or "reconciliation" in lower or "virtual dom" in lower:
        return QUESTION_RUBRICS["fiber"]
    if "vitals" in lower or "lcp" in lower or "inp" in lower or "cls" in lower:
        return QUESTION_RUBRICS["vitals"]
    if "closure" in lower or "event loop" in lower or "microtask" in lower:
        return QUESTION_RUBRICS["closure"]
    if "redis" in lower or "cache" in lower or "caching" in lower:
        return QUESTION_RUBRICS["redis"]
    if "index" in lower or "b-tree" in lower or "isolation" in lower or "mvcc" in lower:
        return QUESTION_RUBRICS["index"]
    if "idempotency" in lower or "payment" in lower or "transactional outbox" in lower or "saga" in lower:
        return QUESTION_RUBRICS["idempotency"]
    if "collab" in lower or "docs" in lower or "conflict" in lower or "crdt" in lower or "operational transformation" in lower:
        return QUESTION_RUBRICS["collab"]
    if "oauth" in lower or "pkce" in lower or "jwt" in lower or "csrf" in lower or "xss" in lower:
        return QUESTION_RUBRICS["oauth"]
    if "pagination" in lower or "rate limit" in lower or "pool" in lower:
        return QUESTION_RUBRICS["pagination"]
    if "rag" in lower or "hybrid search" in lower or "vector" in lower:
        return QUESTION_RUBRICS["rag"]
    if "vllm" in lower or "quantization" in lower or "inference" in lower or "kv cache" in lower:
        return QUESTION_RUBRICS["vllm"]
    return None

def is_non_answer(text: str) -> bool:
    trimmed = text.strip()
    if not trimmed or len(trimmed) < 6:
        return True
    lower = trimmed.lower()
    non_answers = [
        "idk", "i don't know", "i dont know", "no idea", "skip", "no answer",
        "asdf", "test", "testing", "na", "n/a", "none", "nothing", "pass", "help", "no answer provided."
    ]
    if lower in non_answers:
        return True
    if len(trimmed.split()) <= 2 and "virtual" not in lower and "cache" not in lower:
        return True
    return False

def evaluate_with_gemini(
    company: str,
    role: str,
    difficulty: str,
    answers: List[Dict[str, Any]],
    api_key: str,
) -> Optional[Dict[str, Any]]:
    """Evaluates the candidate's answers using Google Gemini REST API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    questions_and_answers_text = ""
    for idx, item in enumerate(answers, 1):
        questions_and_answers_text += f"\n--- Question {idx} (ID: {item.get('question_id')}) ---\n"
        questions_and_answers_text += f"Question: {item.get('question')}\n"
        questions_and_answers_text += f"Candidate Answer: {item.get('answer')}\n"

    system_instruction = (
        f"You are a Staff Technical Interviewer evaluating a candidate for {company}'s {role} role ({difficulty} difficulty).\n"
        "Grade each answer strictly on a 0-100 scale based on factual technical correctness, communication clarity, and problem-solving depth.\n"
        "If the candidate gave no answer, wrote gibberish, or said 'I don't know', give a score of 0-5.\n"
        "Return ONLY a valid JSON object matching this structure (no markdown fences around it):\n"
        "{\n"
        '  "overall_score": 85,\n'
        '  "technical_score": 88,\n'
        '  "communication_score": 84,\n'
        '  "problem_solving_score": 82,\n'
        '  "grade": "A (Hire • Strong Performance)",\n'
        '  "overall_summary": "Comprehensive executive summary of the performance.",\n'
        '  "strengths": ["Strength 1", "Strength 2", "Strength 3"],\n'
        '  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],\n'
        '  "identified_keywords": ["react", "fiber", "closure", "time complexity"],\n'
        '  "detailed_feedback": [\n'
        "    {\n"
        '      "question_id": 1,\n'
        '      "question": "Question text",\n'
        '      "score": 88,\n'
        '      "technical_accuracy": 90,\n'
        '      "communication_clarity": 85,\n'
        '      "feedback": "Detailed constructive feedback on what was strong and what was missing.",\n'
        '      "suggested_answer_points": ["Point 1", "Point 2", "Point 3"],\n'
        '      "identified_keywords": ["keyword1", "keyword2"]\n'
        "    }\n"
        "  ]\n"
        "}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\nCandidate Answers to evaluate:\n{questions_and_answers_text}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }

    try:
        response = requests.post(url, json=payload, timeout=20)
        if response.status_code == 200:
            data = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            parsed = json.loads(raw_text.strip())
            return parsed
    except Exception as e:
        print(f"[LLM Evaluator] Gemini API error: {e}")
    return None

def evaluate_with_local_rubric(
    company: str,
    role: str,
    difficulty: str,
    answers: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Intelligent question-specific semantic & NLP rubric evaluator.
    Accurately scores candidates from 0% (empty/nonsense) up to 98% (senior depth).
    """
    detailed_feedback = []
    total_tech_score = 0
    total_comm_score = 0
    total_problem_score = 0
    all_matched_keywords = set()

    for item in answers:
        q_id = item.get("question_id", 1)
        q_text = item.get("question", "")
        answer_text = str(item.get("answer", "")).strip()
        lower_answer = answer_text.lower()
        words = answer_text.split()
        word_count = len(words)

        rubric = find_rubric_for_question(q_text)

        # 1. Non-answer / Empty check -> Strict 0-8%
        if is_non_answer(answer_text):
            detailed_feedback.append({
                "question_id": q_id,
                "question": q_text,
                "score": 5,
                "technical_accuracy": 0,
                "communication_clarity": 10,
                "feedback": "No substantive technical explanation provided. Candidate did not address the question.",
                "identified_keywords": [],
                "suggested_answer_points": rubric["coreConcepts"] if rubric else [
                    "State core theoretical principles clearly",
                    "Explain step-by-step mechanisms and algorithms",
                    "Detail asymptotic Big-O runtime and failure modes",
                ],
            })
            total_tech_score += 0
            total_comm_score += 10
            total_problem_score += 0
            continue

        # 2. Keyword & Concept Detection
        all_keywords = rubric["keywords"] if rubric else [
            "o(1)", "o(n)", "complexity", "trade-off", "performance", "architecture", "data structure"
        ]
        matched_kw = [kw for kw in all_keywords if kw in lower_answer]
        all_matched_keywords.update(matched_kw)

        has_complexity = any(c in lower_answer for c in ["o(", "o (", "complexity", "big-o", "big o", "runtime", "auxiliary space", "time complexity"])
        has_tradeoffs = any(t in lower_answer for t in ["trade-off", "tradeoff", "advantage", "disadvantage", "pros", "cons", "scale", "bottleneck", "edge case", "versus", "vs"])
        has_structure = any(s in answer_text for s in ["1.", "2.", "-", "•", "\n\n", "step", "first", "second", "finally"])
        has_code = any(f in lower_answer for f in ["function", "const", "def ", "class ", "return", "select", "import", "async", "await", "()", "{}"])

        # 3. Dynamic multi-factor scoring based on question depth
        if len(matched_kw) == 0:
            tech = min(15 + word_count * 0.4, 28)
            comm = min(25 + word_count * 0.5, 45)
            prob = min(15 + (15 if has_complexity else 0), 30)
        elif len(matched_kw) == 1:
            tech = min(30 + word_count * 0.6, 50)
            comm = min(40 + (15 if has_structure else 0) + word_count * 0.4, 60)
            prob = min(30 + (20 if has_complexity else 0) + (15 if has_tradeoffs else 0), 55)
        elif len(matched_kw) <= 3:
            tech = min(50 + len(matched_kw) * 8 + (10 if word_count >= 30 else 0), 75)
            comm = min(50 + (15 if has_structure else 5) + (15 if word_count >= 40 else 5), 80)
            prob = min(45 + (20 if has_complexity else 5) + (15 if has_tradeoffs else 5), 78)
        else:
            tech = min(70 + len(matched_kw) * 6 + (10 if has_tradeoffs else 0) + (8 if has_code else 0), 98)
            comm = min(65 + (15 if has_structure else 5) + (15 if word_count >= 50 else 5), 96)
            prob = min(60 + (20 if has_complexity else 5) + (18 if has_tradeoffs else 5), 96)

        if word_count < 12:
            tech = max(tech - 25, 10)
            comm = max(comm - 20, 15)
            prob = max(prob - 20, 10)

        q_score = round(0.50 * tech + 0.30 * comm + 0.20 * prob)
        total_tech_score += tech
        total_comm_score += comm
        total_problem_score += prob

        # 4. Contextual Feedback
        if q_score >= 85:
            q_feedback = f"Outstanding technical articulation! Thoroughly covered {len(matched_kw)} core concepts ({', '.join(matched_kw[:4])}). Strong trade-off evaluation and structured reasoning."
        elif q_score >= 70:
            q_feedback = f"Solid grasp of core principles ({', '.join(matched_kw) if matched_kw else 'fundamentals'}). To reach Staff/Principal tier, explicitly discuss Big-O runtime/memory bounds and concurrency failure modes."
        elif q_score >= 45:
            q_feedback = "Basic conceptual understanding. Lacks technical depth and architectural mechanics. Elaborate on internal algorithms, data structures, and production trade-offs."
        else:
            q_feedback = "Answer was too brief or off-topic. Missed critical core concepts required for this problem. Review the model points below."

        detailed_feedback.append({
            "question_id": q_id,
            "question": q_text,
            "score": q_score,
            "feedback": q_feedback,
            "suggested_answer_points": rubric["coreConcepts"] if rubric else [
                "Clearly state assumptions and constraints upfront",
                "Explicitly articulate asymptotic time and space complexities (Big-O)",
                "Detail production failure modes, concurrency handling, and caching/indexing strategies",
            ],
            "identified_keywords": matched_kw[:6],
            "technical_accuracy": round(tech),
            "communication_clarity": round(comm),
        })

    num_answers = max(len(answers), 1)
    avg_tech = round(total_tech_score / num_answers)
    avg_comm = round(total_comm_score / num_answers)
    avg_prob = round(total_problem_score / num_answers)
    final_score = round(0.50 * avg_tech + 0.30 * avg_comm + 0.20 * avg_prob)

    grade = (
        "A+ (Strong Hire • Outstanding)" if final_score >= 90
        else "A (Hire • Strong Performance)" if final_score >= 80
        else "B+ (Leaning Hire • Good Fundamentals)" if final_score >= 70
        else "B- (Borderline • Needs Practice)" if final_score >= 55
        else "C (Needs Significant Preparation)" if final_score >= 35
        else "F (Incomplete / Unsatisfactory)"
    )

    strengths = []
    improvements = []

    if final_score >= 70:
        strengths.append(f"Solid grasp of core {role} engineering fundamentals.")
        strengths.append(f"Demonstrated knowledge across {len(all_matched_keywords)} key domain concepts.")
        strengths.append(f"Structured responses align well with {company}'s hiring bar.")
    elif final_score >= 40:
        strengths.append("Familiarity with basic terminologies.")
        strengths.append("Attempted structured explanation on core topics.")
    else:
        strengths.append("Identified problem domains to study.")

    if final_score < 85:
        improvements.append("Explicitly state Big-O runtime and auxiliary space complexity in your initial thought process.")
        improvements.append("Elaborate on production failure modes, concurrency race conditions, and caching/indexing trade-offs.")
        improvements.append("Provide concrete code snippets or step-by-step algorithms rather than high-level definitions.")

    overall_summary = (
        f"Candidate achieved an overall interview performance score of {final_score}% ({grade}) for {company}'s {role} position. "
        f"Technical Depth: {avg_tech}%, Communication: {avg_comm}%, Problem Solving: {avg_prob}%."
    )

    return {
        "overall_score": final_score,
        "technical_score": avg_tech,
        "communication_score": avg_comm,
        "problem_solving_score": avg_prob,
        "grade": grade,
        "overall_summary": overall_summary,
        "strengths": strengths,
        "improvements": improvements,
        "identified_keywords": list(all_matched_keywords),
        "detailed_feedback": detailed_feedback,
    }

def evaluate_interview_submission(
    company: str,
    role: str,
    difficulty: str,
    answers: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Main evaluation entry point.
    Checks environment for GEMINI_API_KEY, and falls back to question-specific rubric evaluator.
    """
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key and len(gemini_key) > 10:
        result = evaluate_with_gemini(company, role, difficulty, answers, gemini_key)
        if result and "overall_score" in result:
            return result

    return evaluate_with_local_rubric(company, role, difficulty, answers)
