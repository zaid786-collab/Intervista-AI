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
    # Round 3 System Design
    "sys_scale": {
        "topic": "Global High-Availability Distributed Systems",
        "keywords": ["anycast", "geo-dns", "l4", "l7", "load balancer", "envoy", "nginx", "multi-region", "active-active", "cdn", "edge", "replication", "partition tolerance", "cap theorem", "failover"],
        "coreConcepts": ["Anycast Geo-DNS & L4/L7 load balancing", "Active-Active Multi-Region replication", "Edge caching & CDN PoPs", "Partition tolerance and failover"],
    },
    "sys_sharding": {
        "topic": "Data Sharding, Hotspots & Resilient Storage",
        "keywords": ["consistent hashing", "virtual node", "shard", "sharding", "hotspot", "partition key", "composite key", "re-indexing", "vnode", "rebalancing", "micro-sharding"],
        "coreConcepts": ["Consistent Hashing with virtual nodes", "Composite shard key salt to prevent hotspots", "Automated live data migration"],
    },
    "sys_resilience": {
        "topic": "Microservice Resilience & Circuit Breakers",
        "keywords": ["circuit breaker", "half-open", "closed", "open", "bulkhead", "exponential backoff", "jitter", "retry", "fallback", "degradation", "timeout", "cascading"],
        "coreConcepts": ["Circuit Breaker 3-state machine", "Exponential backoff with full jitter", "Bulkhead isolation thread pools", "Graceful fallback responses"],
    },
    "sys_security": {
        "topic": "Zero-Trust Architecture & Service Mesh Security",
        "keywords": ["zero-trust", "zero trust", "mtls", "spiffe", "spire", "x.509", "certificate", "service mesh", "istio", "linkerd", "rbac", "vpc", "mutual tls"],
        "coreConcepts": ["SPIFFE/SPIRE cryptographic workload identity", "Automated short-lived X.509 cert rotation via mTLS", "Granular L7 RBAC authorization policies"],
    },
    # Round 4 HR & Behavioral
    "hr_star": {
        "topic": "Behavioral Leadership & Conflict Resolution (STAR)",
        "keywords": ["situation", "task", "action", "result", "star", "conflict", "disagreement", "alignment", "disagree and commit", "data-driven", "benchmark", "stakeholder", "outcome", "metric", "retrospective"],
        "coreConcepts": ["STAR structured narrative", "Objective data and proof-of-concept resolution", "Active listening & Disagree and Commit", "Quantifiable positive outcome"],
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
    # System design & architecture
    if "500 million" in lower or "geo-dns" in lower or "multi-region" in lower or "high availability" in lower:
        return QUESTION_RUBRICS["sys_scale"]
    if "sharding" in lower or "hotspot" in lower or "consistent hashing" in lower:
        return QUESTION_RUBRICS["sys_sharding"]
    if "cascading" in lower or "circuit breaker" in lower or "microservices mesh" in lower:
        return QUESTION_RUBRICS["sys_resilience"]
    if "zero-trust" in lower or "zero trust" in lower or "mtls" in lower or "spiffe" in lower:
        return QUESTION_RUBRICS["sys_security"]
    # HR & Behavioral
    if "star" in lower or "disagreement" in lower or "outage" in lower or "failed to meet" in lower or "elevate" in lower or "why do you specifically" in lower:
        return QUESTION_RUBRICS["hr_star"]
    return None

def is_non_answer(text: str) -> bool:
    trimmed = text.strip()
    if not trimmed or len(trimmed) < 4:
        return True
    lower = trimmed.lower()
    non_answers = [
        "idk", "i don't know", "i dont know", "no idea", "skip", "no answer",
        "asdf", "test", "testing", "na", "n/a", "none", "nothing", "pass", "help",
        "no answer provided.", "qwerty", "hello", "hi", "gibberish", "xyz", "abc"
    ]
    if lower in non_answers:
        return True
    # Repeated characters (e.g. aaaaaa, 111111)
    if re.search(r'(.)\1{4,}', text):
        return True
    # Keyboard mash patterns
    if re.search(r'(asdf|qwer|zxcv|hjkl|12345|67890)', lower) and len(trimmed) < 25:
        return True
    words = trimmed.split()
    if len(words) <= 2 and not any(kw in lower for kw in ["virtual", "cache", "node", "8", "110", "runs", "dom", "o(n)"]):
        return True
    return False

def evaluate_aptitude_answer(q_text: str, answer_text: str) -> Optional[Dict[str, Any]]:
    """Evaluates mathematical and quantitative reasoning in Round 1 Aptitude questions."""
    lower_q = q_text.lower()
    lower_ans = answer_text.lower()
    clean_ans = re.sub(r'[^\w\s\.\,\%\(\)\-\*\+\/\=]', ' ', lower_ans)

    # Q1: 12,000 requests, 4 nodes, 150% surge, 25% upgrade -> 8 nodes
    if "12,000" in lower_q or "12000" in lower_q or ("microservices" in lower_q and "worker nodes" in lower_q):
        has_8 = bool(re.search(r'\b(8|eight)\b', lower_ans))
        has_calc = any(term in lower_ans for term in ["30000", "30,000", "3750", "3,750", "3000", "3,000", "ceil"])
        if has_8 and has_calc:
            return {
                "score": 100,
                "status": "correct",
                "verdict": "Accepted • 100/100",
                "feedback": "Perfect! Correctly deduced that peak surged traffic is 30,000 req/min and each upgraded node handles 3,750 req/min, requiring exactly 8 worker nodes.",
                "keywords": ["8 nodes", "30,000 req/min", "3,750 req/min", "throughput scaling"],
                "suggested_answer_points": ["Original node capacity: 3,000 req/min", "Surged traffic: 30,000 req/min", "Upgraded node: 3,750 req/min", "Ceil(30,000 / 3,750) = 8 nodes"],
                "technical_accuracy": 100,
                "communication_clarity": 95,
                "problem_solving": 100,
            }
        elif has_8:
            return {
                "score": 88,
                "status": "correct",
                "verdict": "Correct Answer • 88/100",
                "feedback": "Correct answer (8 worker nodes). To maximize your score, show the intermediate mathematical calculations: 30,000 req/min surged traffic / 3,750 req/min upgraded node capacity.",
                "keywords": ["8 nodes"],
                "suggested_answer_points": ["Original node capacity: 3,000 req/min", "Surged traffic: 30,000 req/min", "Upgraded node: 3,750 req/min", "Result: 8 nodes"],
                "technical_accuracy": 90,
                "communication_clarity": 80,
                "problem_solving": 90,
            }
        elif has_calc:
            return {
                "score": 50,
                "status": "partial",
                "verdict": "Partially Correct • 50/100",
                "feedback": "Good attempt at calculating throughput, but the final node count is incorrect or missing. The minimum number of worker nodes needed is 8.",
                "keywords": ["throughput calculation"],
                "suggested_answer_points": ["Surged traffic = 30,000 req/min", "Upgraded node = 3,750 req/min", "Nodes needed = 8"],
                "technical_accuracy": 50,
                "communication_clarity": 60,
                "problem_solving": 50,
            }
        else:
            return {
                "score": 20,
                "status": "incorrect",
                "verdict": "Incorrect • 20/100",
                "feedback": "Incorrect answer. The correct calculation requires 8 worker nodes (12,000 * 2.5 = 30,000 req/min; upgraded node capacity = 3,750 req/min; 30,000 / 3,750 = 8 nodes).",
                "keywords": [],
                "suggested_answer_points": ["Original capacity per node: 3,000 req/min", "Surged traffic: 30,000 req/min", "New node capacity: 3,750 req/min", "Total nodes required = 8"],
                "technical_accuracy": 20,
                "communication_clarity": 40,
                "problem_solving": 15,
            }

    # Q2: 3 replica nodes, 95% reliability, quorum at least 2 -> 99.275%
    if "replica nodes" in lower_q or "quorum" in lower_q or ("fault-tolerant" in lower_q and "95%" in lower_q):
        has_prob = any(p in lower_ans for p in ["99.275", "99.28", "99.3", "0.99275", "0.9928", "99.27%"])
        has_binomial = any(b in lower_ans for b in ["binomial", "(0.95)^3", "0.857", "0.135", "combination", "p(all 3)"])
        if has_prob:
            return {
                "score": 100 if has_binomial else 90,
                "status": "correct",
                "verdict": "Accepted • " + ("100/100" if has_binomial else "90/100"),
                "feedback": "Correct! The exact probability that at least 2 nodes remain operational is 99.275% (using binomial expansion P(3) + P(2)).",
                "keywords": ["99.275%", "binomial probability", "quorum reliability"],
                "suggested_answer_points": ["P(all 3 operational) = 0.95^3 = 0.857375", "P(exactly 2) = 3 * 0.95^2 * 0.05 = 0.135375", "Total probability = 99.275%"],
                "technical_accuracy": 100 if has_binomial else 92,
                "communication_clarity": 90,
                "problem_solving": 100,
            }
        elif has_binomial:
            return {
                "score": 55,
                "status": "partial",
                "verdict": "Partially Correct • 55/100",
                "feedback": "Correct methodology (binomial distribution for quorum), but calculation error in the final percentage. The exact probability is 99.275%.",
                "keywords": ["binomial probability"],
                "suggested_answer_points": ["P(X >= 2) = P(3) + P(2) = 99.275%"],
                "technical_accuracy": 60,
                "communication_clarity": 65,
                "problem_solving": 55,
            }
        else:
            return {
                "score": 20,
                "status": "incorrect",
                "verdict": "Incorrect • 20/100",
                "feedback": "Incorrect answer. Use binomial probability P(X >= 2): P(all 3 up) + P(exactly 2 up) = (0.95)^3 + 3*(0.95)^2*(0.05) = 99.275%.",
                "keywords": [],
                "suggested_answer_points": ["P(all 3) = 0.857375", "P(exactly 2) = 0.135375", "Sum = 99.275%"],
                "technical_accuracy": 20,
                "communication_clarity": 35,
                "problem_solving": 20,
            }

    # Q3: Progression 2, 6, 12, 20, 30, 42 ... 10th term -> 110, formula n*(n+1)
    if "2, 6, 12, 20, 30, 42" in lower_q or ("progression" in lower_q and "10th term" in lower_q):
        has_110 = bool(re.search(r'\b(110|one hundred ten)\b', lower_ans))
        has_formula = any(f in clean_ans for f in ["n*(n+1)", "n*(n + 1)", "n(n+1)", "n(n + 1)", "n^2+n", "n^2 + n", "n*n+n"])
        if has_110 and has_formula:
            return {
                "score": 100,
                "status": "correct",
                "verdict": "Accepted • 100/100",
                "feedback": "Flawless deduction! Derived the algebraic formula n*(n+1) and correctly determined that the 10th term is 10 * 11 = 110.",
                "keywords": ["110", "n*(n+1)", "sequence pattern", "nth term"],
                "suggested_answer_points": ["Pattern: 1*2=2, 2*3=6, 3*4=12...", "General formula: a_n = n*(n+1)", "10th term: 10 * 11 = 110"],
                "technical_accuracy": 100,
                "communication_clarity": 95,
                "problem_solving": 100,
            }
        elif has_110:
            return {
                "score": 85,
                "status": "correct",
                "verdict": "Correct Answer • 85/100",
                "feedback": "Correct value for the 10th term (110). To gain full marks, explicitly write the algebraic nth term formula n*(n+1).",
                "keywords": ["110"],
                "suggested_answer_points": ["nth term formula: n*(n+1)", "10th term = 110"],
                "technical_accuracy": 90,
                "communication_clarity": 80,
                "problem_solving": 85,
            }
        elif has_formula:
            return {
                "score": 60,
                "status": "partial",
                "verdict": "Partially Correct • 60/100",
                "feedback": "Formula n*(n+1) is correct, but calculation for the 10th term (10*11 = 110) was missed or incorrect.",
                "keywords": ["n*(n+1)"],
                "suggested_answer_points": ["10th term = 10 * 11 = 110"],
                "technical_accuracy": 65,
                "communication_clarity": 60,
                "problem_solving": 60,
            }
        else:
            return {
                "score": 15,
                "status": "incorrect",
                "verdict": "Incorrect • 15/100",
                "feedback": "Incorrect progression analysis. Notice that each term is n*(n+1): 1*2=2, 2*3=6, 3*4=12. The 10th term is 10*11 = 110.",
                "keywords": [],
                "suggested_answer_points": ["Pattern is n*(n+1)", "10th term = 10 * 11 = 110"],
                "technical_accuracy": 15,
                "communication_clarity": 30,
                "problem_solving": 15,
            }

    # Q4: Stages A, B, C, D, E topological order
    if "pipeline stages" in lower_q or "topological" in lower_q or ("stage a" in lower_q and "stage b" in lower_q):
        has_order = any(order in clean_ans for order in ["d -> a -> b", "a -> d -> b", "d-a-b", "a-d-b", "d, a, b", "a, d, b"])
        has_rules = any(r in lower_ans for r in ["dependency", "topological", "incoming", "prerequisite", "dag"])
        has_e_constraint = "e" in lower_ans and ("first" in lower_ans or "last" in lower_ans or "between" in lower_ans)
        if has_order or (has_rules and has_e_constraint):
            return {
                "score": 92,
                "status": "correct",
                "verdict": "Accepted • 92/100",
                "feedback": "Strong topological reasoning! Correctly observed that A precedes B, C requires B and D, and E is placed in valid interior positions (e.g., D -> A -> B -> E -> C).",
                "keywords": ["topological sort", "DAG", "dependency graph"],
                "suggested_answer_points": ["A must precede B", "C requires B and D", "E cannot be index 1 or 5", "Example valid order: D -> A -> B -> E -> C"],
                "technical_accuracy": 95,
                "communication_clarity": 90,
                "problem_solving": 92,
            }
        else:
            return {
                "score": 25,
                "status": "incorrect",
                "verdict": "Incorrect • 25/100",
                "feedback": "Invalid topological ordering. Valid orderings must have A before B, C after both B and D, and E neither first nor last (e.g., D -> A -> B -> E -> C).",
                "keywords": [],
                "suggested_answer_points": ["Dependency edges: A->B->C, D->C", "Valid order: D -> A -> B -> E -> C or A -> D -> B -> E -> C"],
                "technical_accuracy": 25,
                "communication_clarity": 40,
                "problem_solving": 25,
            }

    # Q5: 8 compute instances, 1 memory-leak -> 2 runs (ternary 3, 3, 2)
    if "8 identical compute" in lower_q or "benchmark runs" in lower_q or "comparator" in lower_q:
        has_2 = bool(re.search(r'\b(2|two)\b', lower_ans)) and ("runs" in lower_ans or "minimum 2" in lower_ans or "2 benchmark" in lower_ans or bool(re.search(r'\b2\b', lower_ans)))
        has_ternary = any(t in lower_ans for t in ["3, 3, 2", "3,3,2", "ternary", "3 and 3", "divide into 3", "three groups", "3 nodes"])
        if has_2 and has_ternary:
            return {
                "score": 100,
                "status": "correct",
                "verdict": "Accepted • 100/100",
                "feedback": "Optimal algorithmic puzzle solution! Correctly partitioned into groups of (3, 3, 2) using ternary search to isolate the degraded node in minimum 2 runs.",
                "keywords": ["2 benchmark runs", "ternary search (3, 3, 2)", "optimal partitioning"],
                "suggested_answer_points": ["Divide into groups of 3, 3, 2", "Run 1: Compare 3 vs 3", "Run 2: Test remaining degraded subset", "Minimum runs = 2"],
                "technical_accuracy": 100,
                "communication_clarity": 95,
                "problem_solving": 100,
            }
        elif has_2:
            return {
                "score": 85,
                "status": "correct",
                "verdict": "Correct Answer • 85/100",
                "feedback": "Correct answer (2 benchmark runs). Explain the ternary partitioning strategy (groups of 3, 3, 2) for maximum technical clarity.",
                "keywords": ["2 runs"],
                "suggested_answer_points": ["Ternary search (3, 3, 2)", "Minimum 2 runs"],
                "technical_accuracy": 88,
                "communication_clarity": 80,
                "problem_solving": 88,
            }
        elif "3" in lower_ans and ("binary" in lower_ans or "divide" in lower_ans):
            return {
                "score": 50,
                "status": "partial",
                "verdict": "Partially Correct • 50/100",
                "feedback": "Binary division gives 3 runs (8 -> 4 -> 2 -> 1). However, ternary partitioning (3, 3, 2) allows pinpointing the node in only 2 runs.",
                "keywords": ["binary vs ternary search"],
                "suggested_answer_points": ["Ternary search 3, 3, 2 gives 2 runs", "Binary gives 3 runs"],
                "technical_accuracy": 55,
                "communication_clarity": 60,
                "problem_solving": 50,
            }
        else:
            return {
                "score": 20,
                "status": "incorrect",
                "verdict": "Incorrect • 20/100",
                "feedback": "Incorrect answer. Minimum 2 benchmark runs are required using ternary search: divide into (3, 3, 2), compare 3 vs 3 on run 1, and test the remaining subset on run 2.",
                "keywords": [],
                "suggested_answer_points": ["Divide into 3, 3, 2", "Minimum 2 benchmark runs"],
                "technical_accuracy": 20,
                "communication_clarity": 35,
                "problem_solving": 20,
            }

    return None

def evaluate_single_question(
    question_id: int,
    question: str,
    answer: str,
    category: Optional[str] = None,
    round_number: Optional[int] = 1,
    company: Optional[str] = "Google",
    role: Optional[str] = "Software Engineer",
    difficulty: Optional[str] = "Medium",
    test_results: Optional[dict] = None,
) -> Dict[str, Any]:
    """Evaluates a single question answer with instant feedback."""
    trimmed_ans = str(answer or "").strip()

    # 1. Non-answer / Empty / Gibberish check -> Strict 0-5%
    if is_non_answer(trimmed_ans):
        return {
            "question_id": question_id,
            "question": question,
            "score": 5,
            "status": "incorrect",
            "verdict": "Non-Responsive • 5/100",
            "feedback": "No substantive response provided. Your input was detected as a placeholder, non-answer, or gibberish. Please provide a relevant, complete answer.",
            "suggested_answer_points": [
                "Address the core problem requirements and constraints",
                "Explain the theoretical approach and algorithm step-by-step",
                "State Big-O time and space complexities where applicable",
            ],
            "identified_keywords": [],
            "technical_accuracy": 0,
            "communication_clarity": 10,
            "problem_solving": 5,
        }

    # 2. Aptitude Evaluation (Round 1)
    apt_eval = evaluate_aptitude_answer(question, trimmed_ans)
    if apt_eval:
        return {
            "question_id": question_id,
            "question": question,
            "score": apt_eval["score"],
            "status": apt_eval["status"],
            "verdict": apt_eval["verdict"],
            "feedback": apt_eval["feedback"],
            "suggested_answer_points": apt_eval.get("suggested_answer_points", []),
            "identified_keywords": apt_eval.get("keywords", []),
            "technical_accuracy": apt_eval.get("technical_accuracy", 80),
            "communication_clarity": apt_eval.get("communication_clarity", 80),
            "problem_solving": apt_eval.get("problem_solving", 80),
        }

    # 3. DSA Automated Test Case Evaluation (Round 2)
    if test_results and isinstance(test_results, dict) and test_results.get("totalCount", 0) > 0:
        total = test_results.get("totalCount", 1)
        passed = test_results.get("passedCount", 0)
        ratio = passed / total
        base_score = round(ratio * 80)
        has_complexity = any(c in trimmed_ans.lower() for c in ["o(", "o (", "complexity", "big-o", "big o", "runtime"])
        complexity_bonus = 15 if has_complexity else 0
        final_score = min(base_score + complexity_bonus + 5, 100)
        status = "correct" if final_score >= 75 else "partial" if final_score >= 40 else "incorrect"
        verdict = f"{'Accepted' if ratio == 1 else 'Partially Accepted'} • {final_score}/100"
        feedback = f"Automated test runner: {passed}/{total} test cases passed ({test_results.get('executionTimeMs', 10)}ms). "
        if ratio == 1:
            feedback += "Outstanding solution! Code passed all edge cases."
        else:
            feedback += f"{total - passed} test case(s) failed. Check boundary conditions."

        return {
            "question_id": question_id,
            "question": question,
            "score": final_score,
            "status": status,
            "verdict": verdict,
            "feedback": feedback,
            "suggested_answer_points": [
                f"Ensure correct function output matching expected test assertions ({passed}/{total} passed)",
                "Optimize runtime time and memory space complexities",
            ],
            "identified_keywords": ["test cases", "runtime execution"],
            "technical_accuracy": round(ratio * 100),
            "communication_clarity": 80,
            "problem_solving": final_score,
        }

    # 4. Semantic Rubric Evaluation (Rounds 3 & 4 or General)
    rubric = find_rubric_for_question(question)
    lower_ans = trimmed_ans.lower()
    words = trimmed_ans.split()
    word_count = len(words)

    all_keywords = rubric["keywords"] if rubric else [
        "o(1)", "o(n)", "complexity", "trade-off", "performance", "architecture", "data structure"
    ]
    matched_kw = [kw for kw in all_keywords if kw in lower_ans]
    has_complexity = any(c in lower_ans for c in ["o(", "o (", "complexity", "big-o", "big o", "runtime", "auxiliary space", "time complexity"])
    has_tradeoffs = any(t in lower_ans for t in ["trade-off", "tradeoff", "advantage", "disadvantage", "pros", "cons", "scale", "bottleneck", "edge case", "versus", "vs"])
    has_structure = any(s in trimmed_ans for s in ["1.", "2.", "-", "•", "\n\n", "step", "first", "second", "finally"])
    has_code = any(f in lower_ans for f in ["function", "const", "def ", "class ", "return", "select", "import", "async", "await", "()", "{}"])

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
    status = "correct" if q_score >= 70 else "partial" if q_score >= 40 else "incorrect"
    verdict = f"{'Strong Answer' if q_score >= 80 else 'Good Attempt' if q_score >= 60 else 'Needs Work'} • {q_score}/100"

    if q_score >= 80:
        feedback = f"Outstanding technical articulation! Covered {len(matched_kw)} key concepts ({', '.join(matched_kw[:4])}). Strong trade-off evaluation."
    elif q_score >= 60:
        feedback = f"Solid understanding of core concepts ({', '.join(matched_kw[:3]) if matched_kw else 'general principles'}). Add explicit Big-O analysis and failure recovery mechanisms."
    elif q_score >= 40:
        feedback = "Basic conceptual awareness. Lacks architectural depth, concrete examples, or complexity trade-offs."
    else:
        feedback = "Answer lacked required technical depth or was off-topic. Review the model key points below."

    return {
        "question_id": question_id,
        "question": question,
        "score": q_score,
        "status": status,
        "verdict": verdict,
        "feedback": feedback,
        "suggested_answer_points": rubric["coreConcepts"] if rubric else [
            "State fundamental system constraints and assumptions upfront",
            "Detail asymptotic time and space complexities (Big-O)",
            "Explain architectural failure modes and mitigation strategies",
        ],
        "identified_keywords": matched_kw[:6],
        "technical_accuracy": round(tech),
        "communication_clarity": round(comm),
        "problem_solving": round(prob),
    }

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

        # Aptitude check first
        apt_res = evaluate_aptitude_answer(q_text, answer_text)
        if apt_res and not is_non_answer(answer_text):
            detailed_feedback.append({
                "question_id": q_id,
                "question": q_text,
                "score": apt_res["score"],
                "technical_accuracy": apt_res["technical_accuracy"],
                "communication_clarity": apt_res["communication_clarity"],
                "feedback": apt_res["feedback"],
                "identified_keywords": apt_res.get("keywords", []),
                "suggested_answer_points": apt_res.get("suggested_answer_points", []),
            })
            total_tech_score += apt_res["technical_accuracy"]
            total_comm_score += apt_res["communication_clarity"]
            total_problem_score += apt_res.get("problem_solving", apt_res["score"])
            all_matched_keywords.update(apt_res.get("keywords", []))
            continue

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
        strengths.append(f"Demonstrated knowledge across key domain concepts.")
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
