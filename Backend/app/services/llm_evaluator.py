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
    # C++
    "cpp_core": {
        "topic": "C++ Memory, Modern Semantics & OOP",
        "keywords": ["raii", "pointer", "reference", "destructor", "vtable", "vptr", "move semantics", "rvalue", "lvalue", "std::move", "unique_ptr", "shared_ptr", "weak_ptr", "const", "virtual", "template", "sfinae", "concepts", "stl", "stack", "heap", "new", "delete", "atomic", "mutex", "false sharing", "cache line", "memory order"],
        "coreConcepts": ["RAII deterministic destruction", "Move semantics & rvalue references", "Smart pointer ownership models", "Vtable polymorphism & virtual destructors"],
    },
    # Python
    "python_core": {
        "topic": "Python Internals, GIL & Memory",
        "keywords": ["gil", "global interpreter lock", "mutable", "immutable", "generator", "yield", "decorator", "comprehension", "asyncio", "coroutine", "event loop", "dunder", "__init__", "reference count", "garbage collect", "generational", "descriptor", "__get__", "__set__"],
        "coreConcepts": ["GIL bytecode serialization & CPU vs IO concurrency", "Reference counting & cyclic GC", "Decorators & closures", "Generators lazy evaluation"],
    },
    # Java
    "java_core": {
        "topic": "Java JVM, Concurrency & Collections",
        "keywords": ["jvm", "heap", "stack", "metaspace", "garbage collection", "g1 gc", "synchronized", "volatile", "atomic", "cas", "concurrenthashmap", "generics", "stream", "classloader", "thread"],
        "coreConcepts": ["JVM Memory generations (Young/Old/Metaspace)", "Volatile visibility vs synchronized atomicity", "ConcurrentHashMap CAS node locking"],
    },
}

def find_rubric_for_question(
    question_text: str,
    domain: Optional[str] = None,
    expected_key_points: Optional[List[str]] = None,
):
    # If explicit expected key points are passed, synthesize dynamic rubric
    if expected_key_points and len(expected_key_points) > 0:
        extracted_kws = []
        for pt in expected_key_points:
            extracted_kws.extend([w.lower() for w in re.findall(r'[a-zA-Z0-9_\+\-]{3,}', pt)])
        if domain:
            extracted_kws.append(domain.lower())
        return {
            "topic": f"{domain or 'Technical'} Concept",
            "keywords": list(set(extracted_kws)),
            "coreConcepts": expected_key_points,
        }

    lower = question_text.lower()
    lower_dom = (domain or "").lower()

    if "c++" in lower_dom or "c++" in lower or "pointer" in lower or "raii" in lower or "vtable" in lower or "rvalue" in lower:
        return QUESTION_RUBRICS["cpp_core"]
    if "python" in lower_dom or "python" in lower or "gil" in lower or "decorator" in lower or "asyncio" in lower:
        return QUESTION_RUBRICS["python_core"]
    if "java" in lower_dom or "java" in lower or "jvm" in lower or "concurrenthashmap" in lower:
        return QUESTION_RUBRICS["java_core"]
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
    if "500 million" in lower or "geo-dns" in lower or "multi-region" in lower or "high availability" in lower or "high-availability" in lower or "distributed system" in lower:
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

# =====================================================================
# DETERMINISTIC ZERO-CREDIT GATE (Strict Technical Interviewer Standard)
# =====================================================================

OFF_TOPIC_TERMS = {
    # Sports & Games
    "cricket", "football", "soccer", "tennis", "badminton", "basketball", "baseball", "rugby", "hockey",
    "bat", "ball", "wicket", "bowler", "batsman", "stadium", "fifa", "ipl", "messi", "ronaldo", "virat",
    "video game", "playstation", "xbox", "pubg", "fortnite", "gaming", "streamer", "streamers",
    # Entertainment, Movies & Music
    "movie", "movies", "cinema", "actor", "actress", "netflix", "hollywood", "bollywood", "song", "songs",
    "singer", "dancing", "concert", "theater", "theatre", "popcorn", "series", "anime", "manga",
    # Weather & Nature
    "weather", "sunny", "rain", "raining", "rainy", "breeze", "monsoon", "summer", "winter", "hot outside",
    "cold outside", "climate", "sky", "beautiful day", "nice today",
    # Food, Meals & Dining
    "pizza", "burger", "biryani", "lunch", "dinner", "breakfast", "snack", "tasty", "delicious",
    "eating", "ate", "cook", "cooking", "recipe", "coffee", "tea", "chai",
    # Personal Leisure & Casual Chit-Chat
    "sleeping", "sleepy", "tired", "lazy", "bored", "party", "partying", "club", "hangout",
    "girlfriend", "boyfriend", "shopping", "clothes", "car", "driving", "pet", "dog", "cat",
}

NO_ANSWER_PATTERNS = [
    r"^(i\s*(do\s*not|don'?t)\s*know\b)",
    r"^(no\s*idea\b)",
    r"^(not\s*sure\b)",
    r"^(i\s*(am\s*not|'m\s*not)\s*sure\b)",
    r"^(i\s*have\s*no\s*idea\b)",
    r"^(can'?t\s*answer\b)",
    r"^(cannot\s*answer\b)",
    r"^(i\s*am\s*not\s*aware\b)",
    r"^(i\s*(do\s*not|don'?t)\s*remember\b)",
    r"^(don'?t\s*remember\b)",
    r"^(no\s*clue\b)",
    r"^(i\s*have\s*no\s*clue\b)",
    r"^(haven'?t\s*(studied|learned|read|heard)\b)",
    r"^(skip\b)",
    r"^(pass\b)",
    r"^(no\s*answer\b)",
    r"^(na|n/a|none|nothing)\b",
]

def is_skipped_answer(text: str, status: Optional[str] = None) -> bool:
    """Checks if question was skipped explicitly by candidate."""
    if status and str(status).upper() in ("SKIPPED", "SKIP", "EMPTY"):
        return True
    trimmed = str(text or "").strip().lower()
    return trimmed in ("skip", "skipped", "i skip", "skip question", "skip this question")

def is_starter_boilerplate(text: str) -> bool:
    """Checks if answer is purely untouched starter boilerplate with no candidate solution."""
    trimmed = str(text or "").strip()
    if not trimmed:
        return False
    lower = trimmed.lower()
    starter_markers = [
        "// write your c++ solution here",
        "// write your solution here",
        "// write your code here",
        "// your code here",
        "/* write your solution here */",
        "/* write your code here */",
        "# write your python solution here",
        "# write your code here",
        "// your code goes here",
        "todo: implement",
        "pass  # write your code here",
    ]
    if any(marker in lower for marker in starter_markers):
        cleaned = re.sub(r'//.*', '', trimmed)
        cleaned = re.sub(r'/\*[\s\S]*?\*/', '', cleaned)
        cleaned = re.sub(r'#.*', '', cleaned)
        cleaned = re.sub(r'\s+', '', cleaned)
        cleaned_no_sig = re.sub(r'#include<[^>]+>', '', cleaned)
        cleaned_no_sig = re.sub(r'std::stringreverseWords\(std::strings\)\{returns;\}', '', cleaned_no_sig)
        cleaned_no_sig = re.sub(r'functionreverseWords\(s\)\{returns;\}', '', cleaned_no_sig)
        cleaned_no_sig = re.sub(r'classLRUCache\{[\s\S]*?\}', '', cleaned_no_sig)
        if len(cleaned_no_sig.strip()) <= 15 or "returns;" in cleaned or "return-1;" in cleaned:
            return True
    return False

def is_empty_answer(text: str) -> bool:
    """Checks if answer is empty or whitespace only."""
    return len(str(text or "").strip()) == 0

def is_no_answer(text: str) -> bool:
    """Checks for explicit 'I don't know', 'Not sure', 'No idea' responses."""
    trimmed = str(text or "").strip().lower()
    if not trimmed:
        return True
    clean = re.sub(r'[^\w\s\']', ' ', trimmed).strip()
    for pat in NO_ANSWER_PATTERNS:
        if re.search(pat, clean):
            return True
    if clean in ("idk", "dont know", "dont know the answer", "no idea", "not sure", "cant answer", "no answer provided"):
        return True
    return False

def is_meaningless_or_gibberish(text: str) -> bool:
    """Checks for repeated characters, keyboard mashes, or gibberish words."""
    trimmed = str(text or "").strip()
    if not trimmed or len(trimmed) < 4:
        return True
    lower = trimmed.lower()
    
    non_answers = [
        "asdf", "test", "testing", "na", "n/a", "none", "nothing", "pass", "help",
        "no answer provided.", "qwerty", "hello", "hi", "gibberish", "xyz", "abc", "foo", "bar"
    ]
    if lower in non_answers:
        return True
        
    # Repeated characters (e.g. aaaaaa, 111111)
    if re.search(r'(.)\1{4,}', trimmed):
        return True
        
    # Keyboard mash patterns
    if re.search(r'(asdf|qwer|zxcv|hjkl|12345|67890)', lower) and len(trimmed) < 35:
        return True
        
    # Check for unpronounceable consonant clusters without vowels
    words = re.findall(r'\b[a-z]{4,}\b', lower)
    if words and len(words) <= 4:
        vowel_count = sum(c in 'aeiou' for c in lower)
        if vowel_count == 0 or (len(lower) > 8 and vowel_count / len(lower) < 0.12):
            return True
            
    return False

def is_keyword_stuffing(question: str, answer: str) -> bool:
    """
    Detects if the candidate simply pasted an ungrammatical list of buzzwords
    with no explanatory sentences, verbs, or syntactic structure.
    e.g. 'C++ virtual function memory pointer object database Python Java React cloud.'
    """
    trimmed = str(answer or "").strip()
    words = re.findall(r'\b[a-zA-Z0-9_\+\#\.\-]+\b', trimmed)
    if len(words) < 5:
        return False
        
    # Check for basic connecting verbs or explanatory grammar
    verb_patterns = [
        r'\b(is|are|was|were|be|been|being|has|have|had|do|does|did)\b',
        r'\b(use|uses|used|using|allow|allows|allowed|allowing|enable|enables|enabled)\b',
        r'\b(provide|provides|provided|work|works|worked|working|refer|refers|referred)\b',
        r'\b(mean|means|meant|help|helps|helped|implement|implements|implemented)\b',
        r'\b(handle|handles|handled|store|stores|stored|manage|manages|managed)\b',
        r'\b(execute|executes|executed|allocate|allocates|allocated|destroy|destroys)\b',
        r'\b(because|since|when|which|that|by|so|in order to|due to|whereas|while)\b',
    ]
    has_grammar = any(re.search(pat, trimmed, re.IGNORECASE) for pat in verb_patterns)
    if not has_grammar:
        return True
        
    return False

def is_clearly_irrelevant(
    question: str,
    answer: str,
    domain: Optional[str] = None,
    expected_concepts: Optional[List[str]] = None,
) -> bool:
    """
    Detects if the candidate's answer is completely off-topic relative to the question.
    Catches:
    - Sports, movies, weather, food, personal chatter ('I like playing cricket and watching movies')
    - Total absence of topical relevance to question
    """
    lower_q = str(question or "").lower()
    lower_a = str(answer or "").lower()
    
    # 1. Check for off-topic non-technical terms using whole word boundaries
    words_in_a = set(re.findall(r'\b[a-z]{3,}\b', lower_a))
    off_topic_matches = [term for term in OFF_TOPIC_TERMS if (
        (len(term.split()) > 1 and term in lower_a) or
        (len(term.split()) == 1 and term in words_in_a)
    )]
    if off_topic_matches:
        # Check if candidate is genuinely answering or just discussing their personal life / hobbies
        technical_terms = [
            "algorithm", "function", "variable", "pointer", "memory", "virtual", "class", "object",
            "database", "cache", "thread", "process", "network", "server", "o(n)", "complexity",
            "ownership", "destructor", "unique_ptr", "shared_ptr", "raii", "reference", "heap", "stack"
        ]
        has_real_tech = any(tt in lower_a for tt in technical_terms)
        if not has_real_tech:
            return True
        # Even if they sneaked 1 tech word into an off-topic sentence ("I like cricket and databases")
        off_topic_phrases = ["i like", "playing", "watching", "nice today", "weather is", "food", "movie", "cricket", "football", "sunny day"]
        if any(p in lower_a for p in off_topic_phrases) and not any(q_term in lower_a for q_term in ["pointer", "unique_ptr", "shared_ptr", "polymorphism", "virtual", "stack", "heap"]):
            return True

    # 2. Extract significant words from question (excluding common stop words)
    stop_words = {
        "what", "when", "where", "which", "that", "this", "with", "from", "your", "have",
        "been", "does", "will", "would", "could", "should", "about", "their", "there",
        "than", "then", "into", "also", "each", "other", "some", "more", "most", "very",
        "just", "like", "make", "many", "only", "over", "such", "take", "they", "these",
        "much", "well", "here", "explain", "describe", "discuss", "difference", "between",
        "how", "why", "given", "using", "implement", "calculate", "design"
    }
    q_words = set(w for w in re.findall(r'[a-z]{3,}', lower_q) if w not in stop_words)
    a_words = set(re.findall(r'[a-z]{3,}', lower_a))
    
    # Check expected concepts if provided
    expected_words = set()
    if expected_concepts:
        for ec in expected_concepts:
            expected_words.update(re.findall(r'[a-z]{3,}', ec.lower()))
    
    # Domain concepts
    domain_words = set(re.findall(r'[a-z]{3,}', (domain or "").lower()))
    
    target_words = q_words | expected_words | domain_words
    overlap = target_words & a_words
    
    # If there is ZERO overlap with question concepts, expected concepts, or domain:
    if len(overlap) == 0:
        return True
        
    return False

def is_technically_contradicted(question: str, answer: str) -> bool:
    """
    Detects obvious technical contradictions where candidate asserts the exact opposite of reality.
    e.g. 'A pointer is a function used to create database tables.'
    """
    lower_q = str(question or "").lower()
    lower_a = str(answer or "").lower()
    
    contradictions = [
        (r'\bpointer\b', [r'\bis a function\b', r'\bcreate database\b', r'\bdatabase table\b', r'\bsql query\b']),
        (r'\bpolymorphism\b', [r'\bvariable cannot change\b', r'\bdisallows inheritance\b', r'\bprevents overriding\b']),
        (r'\bstack\b', [r'\bdynamically sized on heap\b', r'\bslower than heap\b', r'\binfinite memory\b']),
        (r'\bvirtual function\b', [r'\bcannot be overridden\b', r'\bcompile-time only\b', r'\bis a database\b']),
        (r'\bunique_ptr\b', [r'\bunique_ptr has shared ownership\b', r'\bunique_ptr allows shared ownership\b', r'\bunique_ptr is shared ownership\b']),
        (r'\bgil\b', [r'\bmulti-core cpu parallelism for threads\b', r'\baccelerates cpu threads\b']),
    ]
    
    for concept_regex, bad_regexes in contradictions:
        if re.search(concept_regex, lower_q):
            if any(re.search(bp, lower_a) for bp in bad_regexes):
                return True
                
    return False

def evaluate_zero_credit_gate(
    question: str,
    answer: str,
    status: Optional[str] = None,
    expected_concepts: Optional[List[str]] = None,
    domain: Optional[str] = None,
    question_id: int = 1,
) -> Optional[Dict[str, Any]]:
    """
    Mandatory pre-evaluation gate.
    If triggered, returns a 0/100 evaluation dictionary immediately.
    Guarantees no positive credit (0/100) for:
    - Skipped questions
    - Empty / whitespace answers
    - 'I don't know' / 'Not sure' answers
    - Meaningless / gibberish answers
    - Keyword stuffing with no sentence structure
    - Clearly off-topic / irrelevant answers
    - Technically contradicted claims
    """
    trimmed = str(answer or "").strip()
    
    # 1. Skipped, Empty, or Untouched Starter Boilerplate
    if is_skipped_answer(trimmed, status) or is_empty_answer(trimmed) or is_starter_boilerplate(trimmed):
        return {
            "question_id": question_id,
            "question": question,
            "candidate_answer": "",
            "status": "SKIPPED",
            "score": 0,
            "relevance": 0,
            "technical_accuracy": 0,
            "completeness": 0,
            "technical_depth": 0,
            "communication_clarity": 0,
            "verdict": "Skipped • 0/100",
            "feedback": "Question was skipped by candidate. Zero credit assigned.",
            "strengths": [],
            "weaknesses": ["Question was skipped entirely."],
            "missing_concepts": expected_concepts or ["Response to this question"],
            "suggested_answer_points": expected_concepts or ["Address question requirements and theoretical principles."],
            "identified_keywords": [],
            "ideal_answer": "Provide a complete technical explanation covering core concepts and trade-offs.",
        }
        
    # 3. 'I don't know' / Non-answer
    if is_no_answer(trimmed):
        return {
            "question_id": question_id,
            "question": question,
            "candidate_answer": trimmed,
            "status": "NO_ANSWER",
            "score": 0,
            "relevance": 0,
            "technical_accuracy": 0,
            "completeness": 0,
            "technical_depth": 0,
            "communication_clarity": 0,
            "verdict": "No Answer • 0/100",
            "feedback": f"Candidate indicated lack of knowledge ('{trimmed}'). No substantive technical reasoning provided.",
            "strengths": [],
            "weaknesses": ["Candidate stated they do not know or are unsure of the concept."],
            "missing_concepts": expected_concepts or ["Fundamental understanding of this topic"],
            "suggested_answer_points": expected_concepts or ["Review the core principles and review documentation."],
            "identified_keywords": [],
            "ideal_answer": "Articulate the theoretical mechanisms, architectural choices, and asymptotic bounds.",
        }
        
    # 4. Gibberish / Meaningless
    if is_meaningless_or_gibberish(trimmed):
        return {
            "question_id": question_id,
            "question": question,
            "candidate_answer": trimmed,
            "status": "IRRELEVANT",
            "score": 0,
            "relevance": 0,
            "technical_accuracy": 0,
            "completeness": 0,
            "technical_depth": 0,
            "communication_clarity": 0,
            "verdict": "Gibberish / Meaningless • 0/100",
            "feedback": "Input detected as gibberish, placeholder, or keyboard mash. Zero credit assigned.",
            "strengths": [],
            "weaknesses": ["Response was non-responsive noise with no technical meaning."],
            "missing_concepts": expected_concepts or ["Coherent explanation of the topic"],
            "suggested_answer_points": expected_concepts or ["Provide a clear, grammatically sound technical explanation."],
            "identified_keywords": [],
            "ideal_answer": "Formulate a well-reasoned, coherent explanation in clear technical English.",
        }
        
    # 5. Keyword Stuffing
    if is_keyword_stuffing(question, trimmed):
        return {
            "question_id": question_id,
            "question": question,
            "candidate_answer": trimmed,
            "status": "IRRELEVANT",
            "score": 0,
            "relevance": 0,
            "technical_accuracy": 0,
            "completeness": 0,
            "technical_depth": 0,
            "communication_clarity": 0,
            "verdict": "Keyword Stuffing • 0/100",
            "feedback": "Response is an unconnected list of buzzwords with no sentence structure, verbs, or logical reasoning. Technical interview evaluation requires demonstrated understanding, not keyword matching.",
            "strengths": [],
            "weaknesses": ["Candidate strung keywords together without coherent explanatory sentences."],
            "missing_concepts": expected_concepts or ["Structured conceptual articulation"],
            "suggested_answer_points": expected_concepts or ["Explain how the concepts interact using complete, structured sentences."],
            "identified_keywords": [],
            "ideal_answer": "Connect concepts logically with explanations of mechanisms and trade-offs.",
        }
        
    # 6. Clearly Irrelevant / Off-topic
    if is_clearly_irrelevant(question, trimmed, domain=domain, expected_concepts=expected_concepts):
        return {
            "question_id": question_id,
            "question": question,
            "candidate_answer": trimmed,
            "status": "IRRELEVANT",
            "score": 0,
            "relevance": 0,
            "technical_accuracy": 0,
            "completeness": 0,
            "technical_depth": 0,
            "communication_clarity": 0,
            "verdict": "Off-Topic / Irrelevant • 0/100",
            "feedback": "Response is completely off-topic and unrelated to the question asked. Candidate discussed unrelated everyday topics instead of addressing the technical question.",
            "strengths": [],
            "weaknesses": ["Response does not address the question asked."],
            "missing_concepts": expected_concepts or ["Direct engagement with the technical question"],
            "suggested_answer_points": expected_concepts or ["Read the prompt carefully and address the specific engineering problem."],
            "identified_keywords": [],
            "ideal_answer": "Focus entirely on the technical problem posed in the question.",
        }
        
    # 7. Technically Contradicted
    if is_technically_contradicted(question, trimmed):
        return {
            "question_id": question_id,
            "question": question,
            "candidate_answer": trimmed,
            "status": "INCORRECT",
            "score": 0,
            "relevance": 10,
            "technical_accuracy": 0,
            "completeness": 0,
            "technical_depth": 0,
            "communication_clarity": 10,
            "verdict": "Factually Contradicted • 0/100",
            "feedback": "Response directly contradicts fundamental technical principles (e.g. defining pointers as database functions or mischaracterizing core semantics).",
            "strengths": [],
            "weaknesses": ["Fundamentally incorrect claim made about core technical concepts."],
            "missing_concepts": expected_concepts or ["Accurate conceptual definition"],
            "suggested_answer_points": expected_concepts or ["State the verified definition and operational model of the concept."],
            "identified_keywords": [],
            "ideal_answer": "Provide a factually correct definition and explain its operational role.",
        }
        
    return None

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
    question_id_or_dict: Any = None,
    question: Optional[str] = None,
    answer: Optional[str] = None,
    category: Optional[str] = None,
    round_number: Optional[int] = 1,
    company: Optional[str] = "Google",
    role: Optional[str] = "Software Engineer",
    difficulty: Optional[str] = "Medium",
    interview_type: Optional[str] = "Technical Interview",
    domain: Optional[str] = "General Software Engineering",
    expected_key_points: Optional[List[str]] = None,
    test_results: Optional[dict] = None,
    status: Optional[str] = None,
    question_id: Optional[int] = None,
) -> Dict[str, Any]:
    """Evaluates a single question answer with strict zero-credit gating and honest rubric analysis."""
    # Allow calling with a single dict: evaluate_single_question(q_dict, company, role, difficulty, domain)
    if isinstance(question_id_or_dict, dict):
        q_obj = question_id_or_dict
        q_id = q_obj.get("question_id", q_obj.get("id", question_id or 1))
        q_text = q_obj.get("question", "")
        q_ans = q_obj.get("answer", q_obj.get("candidate_answer", ""))
        q_cat = q_obj.get("category")
        q_round = q_obj.get("round_number", 1)
        q_domain = q_obj.get("domain", domain)
        q_exp = q_obj.get("expected_key_points", expected_key_points)
        q_tr = q_obj.get("test_results", test_results)
        q_status = q_obj.get("status", status)
        q_company = question or company
        q_role = answer or role
        q_diff = category or difficulty
    else:
        q_id = int(question_id or question_id_or_dict or 1)
        q_text = str(question or "")
        q_ans = str(answer or "")
        q_cat = category
        q_round = round_number or 1
        q_domain = domain
        q_exp = expected_key_points
        q_tr = test_results
        q_status = status
        q_company = company
        q_role = role
        q_diff = difficulty

    trimmed_ans = str(q_ans or "").strip()

    # 1. Zero-Credit Gate Check (Skipped, Empty, 'I don't know', Gibberish, Keyword Stuffing, Off-topic, Contradicted)
    gate_eval = evaluate_zero_credit_gate(
        question=q_text,
        answer=trimmed_ans,
        status=q_status,
        expected_concepts=q_exp,
        domain=q_domain,
        question_id=q_id,
    )
    if gate_eval:
        return gate_eval

    # 2. Aptitude Evaluation (Round 1)
    apt_eval = evaluate_aptitude_answer(q_text, trimmed_ans)
    if apt_eval:
        apt_score = max(0, min(100, int(apt_eval["score"])))
        return {
            "question_id": q_id,
            "question": q_text,
            "candidate_answer": trimmed_ans,
            "score": apt_score,
            "status": "CORRECT" if apt_score >= 70 else "PARTIAL" if apt_score >= 30 else "INCORRECT",
            "relevance": 90,
            "technical_accuracy": apt_eval.get("technical_accuracy", apt_score),
            "completeness": apt_eval.get("technical_accuracy", apt_score),
            "technical_depth": apt_eval.get("problem_solving", apt_score),
            "communication_clarity": apt_eval.get("communication_clarity", 80),
            "verdict": apt_eval["verdict"],
            "feedback": apt_eval["feedback"],
            "strengths": ["Correctly solved numerical/logical deduction problem."] if apt_score >= 70 else [],
            "weaknesses": [] if apt_score >= 70 else ["Calculation error or missing formula steps."],
            "missing_concepts": [] if apt_score >= 70 else ["Exact numerical deduction"],
            "suggested_answer_points": apt_eval.get("suggested_answer_points", []),
            "identified_keywords": apt_eval.get("keywords", []),
            "ideal_answer": "Provide step-by-step arithmetic deduction and final numerical solution.",
        }

    # 3. DSA Automated Test Case Evaluation (Round 2)
    if q_tr and isinstance(q_tr, dict) and q_tr.get("totalCount", 0) > 0:
        total = q_tr.get("totalCount", 1)
        passed = q_tr.get("passedCount", 0)
        ratio = passed / total
        base_score = round(ratio * 80)
        has_complexity = any(c in trimmed_ans.lower() for c in ["o(", "o (", "complexity", "big-o", "big o", "runtime"])
        complexity_bonus = 15 if has_complexity else 0
        final_score = min(base_score + complexity_bonus + 5, 100) if ratio > 0 else 0
        status_str = "CORRECT" if final_score >= 70 else "PARTIAL" if final_score >= 30 else "INCORRECT"
        verdict = f"{'Accepted' if ratio == 1 else 'Partially Accepted' if ratio > 0 else 'Failed'} • {final_score}/100"
        feedback = f"Automated test runner: {passed}/{total} test cases passed ({q_tr.get('executionTimeMs', 10)}ms). "
        if ratio == 1:
            feedback += "Outstanding solution! Code passed all edge cases."
        elif ratio > 0:
            feedback += f"{total - passed} test case(s) failed. Check boundary conditions."
        else:
            feedback += "All test cases failed. Code failed to meet requirements."

        return {
            "question_id": q_id,
            "question": q_text,
            "candidate_answer": trimmed_ans,
            "score": final_score,
            "status": status_str,
            "relevance": 90 if ratio > 0 else 30,
            "technical_accuracy": round(ratio * 100),
            "completeness": round(ratio * 100),
            "technical_depth": final_score,
            "communication_clarity": 80,
            "verdict": verdict,
            "feedback": feedback,
            "strengths": ["Automated test cases passed successfully."] if ratio >= 0.7 else [],
            "weaknesses": [f"{total - passed} automated test cases failed."] if ratio < 1.0 else [],
            "missing_concepts": ["Edge case handling"] if ratio < 1.0 else [],
            "suggested_answer_points": [
                f"Ensure correct function output matching expected assertions ({passed}/{total} passed)",
                "Optimize runtime time and memory space complexities",
            ],
            "identified_keywords": ["test cases", "runtime execution"],
            "ideal_answer": "Complete bug-free implementation passing all boundary and performance test cases.",
        }

    # 4. Strict Semantic Rubric Evaluation (Rounds 3 & 4 or General)
    rubric = find_rubric_for_question(q_text, domain=q_domain, expected_key_points=q_exp)
    lower_ans = trimmed_ans.lower()
    words = trimmed_ans.split()
    word_count = len(words)

    all_keywords = rubric["keywords"] if rubric else [
        "complexity", "trade-off", "performance", "architecture", "data structure", "concurrency"
    ]
    matched_kw = [kw for kw in all_keywords if kw in lower_ans]
    has_complexity = any(c in lower_ans for c in ["o(", "o (", "complexity", "big-o", "big o", "runtime", "auxiliary space", "time complexity"])
    has_tradeoffs = any(t in lower_ans for t in ["trade-off", "tradeoff", "advantage", "disadvantage", "pros", "cons", "scale", "bottleneck", "edge case", "versus", "vs"])
    has_structure = any(s in trimmed_ans for s in ["1.", "2.", "-", "•", "\n\n", "step", "first", "second", "finally"])
    has_code = any(f in lower_ans for f in ["function", "const", "def ", "class ", "return", "select", "import", "async", "await", "()", "{}"])

    # Strict 5-factor scoring
    # 1. Relevance (25%)
    # 2. Technical Correctness (30%)
    # 3. Completeness (20%)
    # 4. Technical Depth / Reasoning (15%)
    # 5. Communication (10%)

    # Calculate relevance
    core_concepts = rubric["coreConcepts"] if rubric else (q_exp or [])
    concepts_hit = [c for c in core_concepts if any(w in lower_ans for w in re.findall(r'[a-z]{4,}', c.lower()))]
    
    if len(matched_kw) == 0 and len(concepts_hit) == 0:
        relevance = 25
        tech_acc = min(15 + word_count * 0.3, 30)
        completeness = 15
        depth = 15
        comm = min(20 + (10 if has_structure else 0), 40)
    elif len(matched_kw) <= 2:
        relevance = 65
        tech_acc = min(35 + len(matched_kw) * 12 + word_count * 0.2, 60)
        completeness = 40 + len(concepts_hit) * 15
        depth = 30 + (15 if has_complexity else 0) + (10 if has_tradeoffs else 0)
        comm = min(50 + (10 if has_structure else 0), 75)
    else:
        relevance = 90
        tech_acc = min(60 + len(matched_kw) * 8 + (10 if has_code else 0), 95)
        completeness = min(50 + len(concepts_hit) * 20, 95)
        depth = min(50 + (20 if has_complexity else 5) + (20 if has_tradeoffs else 5), 95)
        comm = min(65 + (15 if has_structure else 5) + (15 if word_count >= 50 else 5), 95)

    if word_count < 12:
        tech_acc = max(tech_acc - 25, 0)
        comm = max(comm - 20, 0)
        depth = max(depth - 20, 0)
        completeness = max(completeness - 20, 0)

    # Weighted calculation
    weighted_score = (
        0.25 * relevance +
        0.30 * tech_acc +
        0.20 * completeness +
        0.15 * depth +
        0.10 * comm
    )

    # Overriding gate: If relevance is near zero, entire score MUST be 0
    if relevance < 20.0:
        q_score = 0
    else:
        q_score = max(0, min(100, round(weighted_score)))

    status_str = "CORRECT" if q_score >= 70 else "PARTIAL" if q_score >= 30 else "INCORRECT"
    verdict = f"{'Strong Answer' if q_score >= 80 else 'Solid Answer' if q_score >= 70 else 'Partially Correct' if q_score >= 40 else 'Needs Work' if q_score > 0 else 'Zero Credit'} • {q_score}/100"

    feedback = ""
    if q_score >= 80:
        feedback = f"Outstanding technical execution! Covered key concepts ({', '.join(matched_kw[:3]) or 'principles'}) with clear reasoning."
        strengths = [f"Strong explanation of {', '.join(matched_kw[:3]) or 'core concepts'}."]
        weaknesses = []
        missing = []
    elif q_score >= 65:
        feedback = f"Solid understanding demonstrated. Covered {len(matched_kw)} key concepts. Elaborate more on failure modes and runtime complexity."
        strengths = [f"Good grasp of {', '.join(matched_kw[:2]) or 'fundamentals'}."]
        weaknesses = ["Could provide deeper trade-off analysis and failure handling."]
        missing = [c for c in core_concepts if c not in concepts_hit][:2]
    elif q_score >= 30:
        feedback = "Basic conceptual awareness. Lacks architectural depth, concrete examples, or complexity trade-offs."
        strengths = ["Attempted explanation of foundational concepts."]
        weaknesses = ["Answer was high-level or missed critical underlying mechanisms."]
        missing = [c for c in core_concepts if c not in concepts_hit][:3]
    else:
        feedback = "Answer lacked required technical depth or failed to address the core problem. Review the reference points below."
        strengths = []
        weaknesses = ["Lacked substantive technical accuracy or was too superficial."]
        missing = core_concepts[:3] if core_concepts else ["Technical explanation"]

    return {
        "question_id": q_id,
        "question": q_text,
        "candidate_answer": trimmed_ans,
        "score": q_score,
        "status": status_str,
        "relevance": round(relevance),
        "technical_accuracy": round(tech_acc),
        "completeness": round(completeness),
        "technical_depth": round(depth),
        "communication_clarity": round(comm),
        "verdict": verdict,
        "feedback": feedback,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "missing_concepts": missing,
        "suggested_answer_points": rubric["coreConcepts"] if rubric else [
            "State fundamental system constraints and assumptions upfront",
            "Detail asymptotic time and space complexities (Big-O)",
            "Explain architectural failure modes and mitigation strategies",
        ],
        "identified_keywords": matched_kw[:6],
        "ideal_answer": "A complete response addresses core theoretical principles, internal data structures, asymptotic complexities, and operational trade-offs.",
    }

def evaluate_with_local_rubric(
    company: str,
    role: str,
    difficulty: str,
    answers: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Intelligent question-specific semantic & NLP rubric evaluator.
    Strictly follows zero-credit gating rules and 5-factor scoring.
    """
    detailed_feedback = []
    all_matched_keywords = set()
    all_strengths = []
    all_weaknesses = []
    all_missing_concepts = set()

    for item in answers:
        q_id = item.get("question_id", 1)
        q_text = item.get("question", "")
        answer_text = str(item.get("answer", "")).strip()
        status_hint = item.get("status")
        expected_points = item.get("expected_key_points")
        domain_val = item.get("domain")

        eval_res = evaluate_single_question(
            question_id=q_id,
            question=q_text,
            answer=answer_text,
            company=company,
            role=role,
            difficulty=difficulty,
            domain=domain_val,
            expected_key_points=expected_points,
            status=status_hint,
        )

        detailed_feedback.append(eval_res)
        all_matched_keywords.update(eval_res.get("identified_keywords", []))

        # Only accumulate strengths from answers that achieved >= 70%
        if eval_res.get("score", 0) >= 70:
            all_strengths.extend(eval_res.get("strengths", []))
        elif eval_res.get("score", 0) < 70 and eval_res.get("status") not in ("SKIPPED", "EMPTY"):
            all_weaknesses.extend(eval_res.get("weaknesses", []))

        all_missing_concepts.update(eval_res.get("missing_concepts", []))

    num_answers = len(answers) if answers else 1
    total_possible = num_answers * 100
    total_score_sum = sum(df["score"] for df in detailed_feedback)

    # Authoritative Final Score calculated over ALL questions:
    final_score = round(total_score_sum / total_possible * 100) if total_possible > 0 else 0
    final_score = max(0, min(100, final_score))

    avg_tech = round(sum(df.get("technical_accuracy", 0) for df in detailed_feedback) / num_answers)
    avg_comm = round(sum(df.get("communication_clarity", 0) for df in detailed_feedback) / num_answers)
    avg_prob = round(sum(df.get("technical_depth", 0) for df in detailed_feedback) / num_answers)

    # Authoritative Question Counts:
    skipped_count = sum(1 for df in detailed_feedback if df.get("status") in ("SKIPPED", "EMPTY", "NO_ANSWER"))
    correct_count = sum(1 for df in detailed_feedback if df.get("score", 0) >= 70 and df.get("status") not in ("SKIPPED", "EMPTY", "NO_ANSWER"))
    partially_correct_count = sum(1 for df in detailed_feedback if 30 <= df.get("score", 0) < 70 and df.get("status") not in ("SKIPPED", "EMPTY", "NO_ANSWER"))
    incorrect_count = sum(1 for df in detailed_feedback if df.get("score", 0) < 30 and df.get("status") not in ("SKIPPED", "EMPTY", "NO_ANSWER"))
    answered_count = num_answers - skipped_count

    grade = (
        "A+ (Strong Hire • Outstanding)" if final_score >= 90
        else "A (Hire • Strong Performance)" if final_score >= 80
        else "B+ (Leaning Hire • Good Fundamentals)" if final_score >= 70
        else "B- (Borderline • Needs Practice)" if final_score >= 50
        else "C (Needs Significant Preparation)" if final_score >= 30
        else "F (Incomplete / Unsatisfactory • 0-29%)"
    )

    # Deduplicate strengths and weaknesses
    clean_strengths = list(dict.fromkeys(all_strengths))[:4]
    clean_improvements = list(dict.fromkeys(all_weaknesses))[:4]

    if not clean_strengths:
        if final_score == 0:
            clean_strengths.append("No technical competencies demonstrated in submitted answers.")
        else:
            clean_strengths.append(f"Basic familiarity with {role} concepts.")

    if not clean_improvements:
        if final_score < 100:
            clean_improvements.append("Deepen asymptotic Big-O runtime analysis and edge-case handling.")

    overall_summary = (
        f"Candidate achieved an authoritative score of {final_score}/100 ({grade}) for {company}'s {role} position across {num_answers} questions. "
        f"Questions breakdown: {correct_count} Correct, {partially_correct_count} Partially Correct, {incorrect_count} Incorrect, {skipped_count} Skipped."
    )

    analysis_payload = {
        "overall_performance": {
            "overall_score": final_score,
            "performance_level": grade,
            "completion_rate": f"{round((answered_count / num_answers) * 100)}%",
            "total_questions": num_answers,
            "answered_count": answered_count,
            "skipped_count": skipped_count,
        },
        "technical_performance": {
            "technical_score": avg_tech,
            "problem_solving_score": avg_prob,
            "conceptual_understanding": "High" if avg_tech >= 75 else "Moderate" if avg_tech >= 45 else "Low",
        },
        "communication": {
            "communication_score": avg_comm,
            "clarity": "Strong" if avg_comm >= 75 else "Adequate" if avg_comm >= 45 else "Needs Improvement",
        },
        "strengths": clean_strengths,
        "weaknesses": clean_improvements,
        "missing_concepts": list(all_missing_concepts)[:6],
    }

    return {
        "score": final_score,
        "overall_score": final_score,
        "technical_score": avg_tech,
        "communication_score": avg_comm,
        "problem_solving_score": avg_prob,
        "grade": grade,
        "question_count": num_answers,
        "total_questions": num_answers,
        "answered_count": answered_count,
        "skipped_count": skipped_count,
        "correct_count": correct_count,
        "partial_count": partially_correct_count,
        "partially_correct_count": partially_correct_count,
        "incorrect_count": incorrect_count,
        "overall_summary": overall_summary,
        "strengths": clean_strengths,
        "improvements": clean_improvements,
        "missing_concepts": list(all_missing_concepts)[:6],
        "identified_keywords": list(all_matched_keywords),
        "detailed_feedback": detailed_feedback,
        "analysis": analysis_payload,
    }

def evaluate_with_gemini(
    company: str,
    role: str,
    difficulty: str,
    answers: List[Dict[str, Any]],
    api_key: str,
) -> Optional[Dict[str, Any]]:
    """Evaluates candidate answers strictly using Google Gemini REST API with zero-credit gating."""
    # Pre-process answers with Zero-Credit Gate
    # Any skipped, empty, non-answer, or gibberish answer is locked at score = 0
    pre_evaluated = {}
    answers_to_send_to_gemini = []

    for idx, item in enumerate(answers):
        q_id = item.get("question_id", idx + 1)
        q_text = item.get("question", "")
        a_text = str(item.get("answer", "")).strip()
        status_hint = item.get("status")

        gate_res = evaluate_zero_credit_gate(
            question=q_text,
            answer=a_text,
            status=status_hint,
            question_id=q_id,
        )
        if gate_res:
            pre_evaluated[q_id] = gate_res
        else:
            answers_to_send_to_gemini.append((q_id, item))

    # If all answers were caught by the gate (e.g. all skipped or all random/empty)
    if len(answers_to_send_to_gemini) == 0:
        return evaluate_with_local_rubric(company, role, difficulty, answers)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    questions_and_answers_text = ""
    for q_id, item in answers_to_send_to_gemini:
        questions_and_answers_text += f"\n--- Question (ID: {q_id}) ---\n"
        questions_and_answers_text += f"Question: {item.get('question')}\n"
        questions_and_answers_text += f"Candidate Answer: {item.get('answer')}\n"

    system_instruction = (
        f"You are a strict, professional Staff Technical Interviewer evaluating candidate answers for {company}'s {role} position ({difficulty} difficulty).\n\n"
        "CRITICAL EVALUATION RULES:\n"
        "1. ZERO-CREDIT FOR IRRELEVANT OR NON-ANSWERS:\n"
        "   - If the candidate's answer is completely off-topic, random, or discusses personal topics (e.g. cricket, sports, weather, movies, food) unrelated to the question, give score = 0, status = 'IRRELEVANT', relevance = 0.\n"
        "   - If the answer is keyword stuffing (an unpunctuated list of technical terms with no sentences or grammar), give score = 0, status = 'IRRELEVANT'.\n"
        "   - If the candidate says they do not know, give score = 0, status = 'NO_ANSWER'.\n"
        "   - If the answer contradicts core technical facts, penalize heavily (score 0-10, status = 'INCORRECT').\n"
        "   - NEVER give points merely because some text exists or because keywords are present. Zero credit must be strictly 0/100.\n\n"
        "2. STRICT 5-DIMENSION RUBRIC FOR LEGITIMATE ATTEMPTS:\n"
        "   - Relevance (25% weight): Directly addresses this question? If relevance < 20, overall score MUST be 0.\n"
        "   - Technical Correctness (30% weight): Factual accuracy of technical mechanisms.\n"
        "   - Completeness (20% weight): Covers expected concepts and constraints.\n"
        "   - Technical Depth / Reasoning (15% weight): Demonstrates understanding of trade-offs, Big-O, internal algorithms.\n"
        "   - Communication Clarity (10% weight): Logical structure and clarity.\n\n"
        "3. HONEST REPORTING:\n"
        "   - Strengths must only reflect demonstrated competence in actual answers.\n"
        "   - Weaknesses and missing concepts must detail specific gaps.\n\n"
        "Return ONLY a valid JSON object matching this structure (no markdown fences around it):\n"
        "{\n"
        '  "overall_summary": "Executive summary...",\n'
        '  "strengths": ["Strength 1", "Strength 2"],\n'
        '  "improvements": ["Improvement 1", "Improvement 2"],\n'
        '  "missing_concepts": ["concept1", "concept2"],\n'
        '  "identified_keywords": ["keyword1", "keyword2"],\n'
        '  "detailed_feedback": [\n'
        "    {\n"
        '      "question_id": 1,\n'
        '      "question": "Question text",\n'
        '      "candidate_answer": "Answer text",\n'
        '      "status": "CORRECT",\n'
        '      "score": 85,\n'
        '      "relevance": 90,\n'
        '      "technical_accuracy": 85,\n'
        '      "completeness": 80,\n'
        '      "technical_depth": 80,\n'
        '      "communication_clarity": 85,\n'
        '      "feedback": "Honest critique...",\n'
        '      "strengths": ["..."],\n'
        '      "weaknesses": ["..."],\n'
        '      "missing_concepts": ["..."],\n'
        '      "suggested_answer_points": ["Point 1", "Point 2"],\n'
        '      "ideal_answer": "Model answer..."\n'
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
            "temperature": 0.1,
            "responseMimeType": "application/json",
        },
    }

    try:
        response = requests.post(url, json=payload, timeout=25)
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

            gemini_feedback_map = {
                df.get("question_id"): df for df in parsed.get("detailed_feedback", [])
            }

            # Merge pre-evaluated gate results with Gemini results in exact order
            merged_detailed = []
            for idx, item in enumerate(answers):
                q_id = item.get("question_id", idx + 1)
                if q_id in pre_evaluated:
                    merged_detailed.append(pre_evaluated[q_id])
                elif q_id in gemini_feedback_map:
                    gf = gemini_feedback_map[q_id]
                    q_score = int(gf.get("score", 0))
                    status_val = str(gf.get("status", "CORRECT")).upper()
                    relevance_val = int(gf.get("relevance", 80))

                    # Post-validate AI output: zero-credit overrides
                    if status_val in ("SKIPPED", "EMPTY", "NO_ANSWER", "IRRELEVANT") or relevance_val < 20:
                        gf["score"] = 0
                        gf["relevance"] = 0
                        gf["technical_accuracy"] = 0
                        gf["completeness"] = 0
                        gf["technical_depth"] = 0
                        gf["communication_clarity"] = 0
                        gf["status"] = status_val if status_val in ("SKIPPED", "EMPTY", "NO_ANSWER", "IRRELEVANT") else "IRRELEVANT"
                    else:
                        gf["score"] = max(0, min(100, q_score))

                    merged_detailed.append(gf)
                else:
                    # Fallback for single question
                    fallback_df = evaluate_single_question(
                        question_id=q_id,
                        question=item.get("question", ""),
                        answer=item.get("answer", ""),
                        company=company,
                        role=role,
                        difficulty=difficulty,
                    )
                    merged_detailed.append(fallback_df)

            num_answers = len(answers)
            total_possible = num_answers * 100
            total_score_sum = sum(df["score"] for df in merged_detailed)

            authoritative_final_score = round(total_score_sum / total_possible * 100) if total_possible > 0 else 0
            authoritative_final_score = max(0, min(100, authoritative_final_score))

            skipped_count = sum(1 for df in merged_detailed if df.get("status") in ("SKIPPED", "EMPTY", "NO_ANSWER"))
            correct_count = sum(1 for df in merged_detailed if df.get("score", 0) >= 70 and df.get("status") not in ("SKIPPED", "EMPTY", "NO_ANSWER"))
            partially_correct_count = sum(1 for df in merged_detailed if 30 <= df.get("score", 0) < 70 and df.get("status") not in ("SKIPPED", "EMPTY", "NO_ANSWER"))
            incorrect_count = sum(1 for df in merged_detailed if df.get("score", 0) < 30 and df.get("status") not in ("SKIPPED", "EMPTY", "NO_ANSWER"))
            answered_count = num_answers - skipped_count

            avg_tech = round(sum(df.get("technical_accuracy", 0) for df in merged_detailed) / num_answers)
            avg_comm = round(sum(df.get("communication_clarity", 0) for df in merged_detailed) / num_answers)
            avg_prob = round(sum(df.get("technical_depth", 0) for df in merged_detailed) / num_answers)

            grade = (
                "A+ (Strong Hire • Outstanding)" if authoritative_final_score >= 90
                else "A (Hire • Strong Performance)" if authoritative_final_score >= 80
                else "B+ (Leaning Hire • Good Fundamentals)" if authoritative_final_score >= 70
                else "B- (Borderline • Needs Practice)" if authoritative_final_score >= 50
                else "C (Needs Significant Preparation)" if authoritative_final_score >= 30
                else "F (Incomplete / Unsatisfactory • 0-29%)"
            )

            return {
                "overall_score": authoritative_final_score,
                "technical_score": avg_tech,
                "communication_score": avg_comm,
                "problem_solving_score": avg_prob,
                "grade": grade,
                "total_questions": num_answers,
                "answered_count": answered_count,
                "skipped_count": skipped_count,
                "correct_count": correct_count,
                "partially_correct_count": partially_correct_count,
                "incorrect_count": incorrect_count,
                "overall_summary": parsed.get("overall_summary") or f"Candidate completed {num_answers} questions with final score {authoritative_final_score}/100 ({grade}).",
                "strengths": parsed.get("strengths", []),
                "improvements": parsed.get("improvements", []),
                "missing_concepts": parsed.get("missing_concepts", []),
                "identified_keywords": parsed.get("identified_keywords", []),
                "detailed_feedback": merged_detailed,
                "analysis": {
                    "overall_performance": {
                        "overall_score": authoritative_final_score,
                        "performance_level": grade,
                        "completion_rate": f"{round((answered_count / num_answers) * 100)}%",
                        "total_questions": num_answers,
                        "answered_count": answered_count,
                        "skipped_count": skipped_count,
                    },
                    "technical_performance": {
                        "technical_score": avg_tech,
                        "problem_solving_score": avg_prob,
                    },
                    "communication": {
                        "communication_score": avg_comm,
                    },
                    "strengths": parsed.get("strengths", []),
                    "weaknesses": parsed.get("improvements", []),
                    "missing_concepts": parsed.get("missing_concepts", []),
                },
            }
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
    Evaluates candidate's stored answers deferred after interview completion.
    Checks environment for GEMINI_API_KEY, and falls back to question-specific rubric evaluator.
    """
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key and len(gemini_key) > 10:
        result = evaluate_with_gemini(company, role, difficulty, answers, gemini_key)
        if result and "overall_score" in result:
            return result

    return evaluate_with_local_rubric(company, role, difficulty, answers)
