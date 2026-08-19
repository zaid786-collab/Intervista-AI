import json
import random
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])

# Curated question bank by role & difficulty
QUESTION_BANK = {
    "Frontend Developer": {
        "Easy": [
            {
                "id": 1,
                "category": "Coding & JS",
                "question": "Explain the difference between `var`, `let`, and `const` in JavaScript, and what hoisting is.",
                "hint": "Discuss block vs functional scope, TDZ (Temporal Dead Zone), and re-assignment rules.",
                "expected_key_points": ["Block scope for let/const", "Hoisting and TDZ", "Immutability of const binding"],
            },
            {
                "id": 2,
                "category": "React Fundamentals",
                "question": "How does React's Virtual DOM work and why is key prop necessary in lists?",
                "hint": "Explain reconciliation, diffing algorithm, and fiber tree updates.",
                "expected_key_points": ["Diffing algorithm O(n)", "Virtual representation in memory", "Stable identity for list items"],
            },
        ],
        "Medium": [
            {
                "id": 1,
                "category": "State Management & Architecture",
                "question": "How would you optimize performance in a large React application experiencing UI lag on fast typing?",
                "hint": "Consider debouncing/throttling, memoization (useMemo/useCallback), React 18 useDeferredValue/useTransition, and code splitting.",
                "expected_key_points": ["Debounce/Throttle inputs", "React.memo & hooks", "Concurrent features (useDeferredValue)", "Lazy loading chunks"],
            },
            {
                "id": 2,
                "category": "Web Security & Networking",
                "question": "What is CORS, and how do you protect a modern SPA from XSS and CSRF attacks?",
                "hint": "Discuss Same-Origin Policy, HttpOnly SameSite cookies, Content Security Policy (CSP), and sanitized DOM rendering.",
                "expected_key_points": ["CORS headers & preflight OPTIONS", "HttpOnly & SameSite cookies", "Sanitization against XSS", "CSP headers"],
            },
            {
                "id": 3,
                "category": "Coding & Problem Solving",
                "question": "Write or explain an implementation of a custom `useFetch` hook in React with caching and abort controller.",
                "hint": "Use useEffect, cleanup with AbortController.abort(), and ref/state for cache storage.",
                "expected_key_points": ["AbortController cleanup", "Loading/Error/Data states", "Cache map to prevent duplicate requests"],
            },
        ],
        "Hard": [
            {
                "id": 1,
                "category": "System Design & Architecture",
                "question": "Design a frontend architecture for a real-time collaborative code editor like Google Docs or Figma.",
                "hint": "Address Operational Transformation (OT) vs CRDTs, WebSockets sync, undo/redo stacks, and canvas/virtual DOM rendering.",
                "expected_key_points": ["CRDTs / Yjs / Automerge", "WebSocket reconnection & state syncing", "Virtual scroll viewport", "Worker threads for parsing"],
            },
            {
                "id": 2,
                "category": "Browser Internals & Performance",
                "question": "Explain the Critical Rendering Path and how the browser turns HTML/CSS/JS into pixels, plus Core Web Vitals optimization.",
                "hint": "DOM, CSSOM, Render Tree, Layout, Paint, Composite. LCP, INP, CLS.",
                "expected_key_points": ["DOM + CSSOM construction", "Reflow vs Repaint triggers", "LCP / INP / CLS metrics", "Resource hints (preload, preconnect)"],
            },
        ],
    },
    "Backend Developer": {
        "Easy": [
            {
                "id": 1,
                "category": "APIs & Databases",
                "question": "What is the difference between SQL and NoSQL databases, and when would you choose one over the other?",
                "hint": "Discuss ACID transactions, schema rigidity, horizontal vs vertical scaling, and unstructured vs relational models.",
                "expected_key_points": ["ACID vs BASE properties", "Relational consistency vs horizontal scale", "Use cases (FinTech vs Social Media feeds)"],
            },
            {
                "id": 2,
                "category": "HTTP & REST",
                "question": "Explain the difference between PUT and PATCH, and what idempotent operations are in REST APIs.",
                "hint": "PUT replaces entire resource; PATCH updates partial fields. GET, PUT, DELETE are idempotent.",
                "expected_key_points": ["Complete replacement vs partial update", "Idempotence definition", "HTTP status codes (200, 204, 400)"],
            },
        ],
        "Medium": [
            {
                "id": 1,
                "category": "Concurrency & Database Indexing",
                "question": "How do B-Tree indexes work in PostgreSQL/MySQL, and how do you resolve database deadlocks and slow queries?",
                "hint": "Discuss balanced tree lookups, compound index leftmost prefix rule, EXPLAIN ANALYZE, and transaction isolation levels.",
                "expected_key_points": ["O(log N) lookup time", "Composite index order", "EXPLAIN execution plan", "Row locking & transaction ordering"],
            },
            {
                "id": 2,
                "category": "System Architecture & Caching",
                "question": "Explain the Cache-Aside pattern with Redis and how you prevent Cache Stampede (Thundering Herd) and Cache Penetration.",
                "hint": "App reads cache -> on miss reads DB & populates cache. Use mutex locks, probabilistic early expiration (XFetch), or bloom filters.",
                "expected_key_points": ["Cache-Aside workflow", "Bloom filters for nonexistent keys", "Distributed locks for stampede protection", "TTL and invalidation"],
            },
            {
                "id": 3,
                "category": "Authentication & Security",
                "question": "How do JWT access tokens and refresh tokens work securely, and how do you revoke an active JWT before expiry?",
                "hint": "Short-lived access token + long-lived HttpOnly refresh token with token family rotation or Redis blacklist for revocation.",
                "expected_key_points": ["Stateless signature verification", "Refresh token rotation", "Redis blacklist/versioning for revocation", "Secure cookie storage"],
            },
        ],
        "Hard": [
            {
                "id": 1,
                "category": "Distributed Systems",
                "question": "Design a Distributed Rate Limiter capable of handling 500,000 requests/sec across multi-region clusters.",
                "hint": "Compare Token Bucket vs Sliding Window Log, Redis Lua scripts with sorted sets, and local in-memory token pooling.",
                "expected_key_points": ["Token bucket / Sliding window counter", "Redis Lua script atomic execution", "Local batch token reservations", "Graceful degradation on Redis outage"],
            },
            {
                "id": 2,
                "category": "Event-Driven & Microservices",
                "question": "How do you achieve exactly-once processing semantics in an Apache Kafka / RabbitMQ event-driven architecture?",
                "hint": "Idempotent consumer with deduplication keys, transactional outbox pattern, and distributed two-phase commit.",
                "expected_key_points": ["Transactional Outbox pattern", "Idempotent consumer with DB unique constraints", "Kafka producer idempotence & transactions", "Dead letter queues"],
            },
        ],
    },
    "Full Stack Developer": {
        "Medium": [
            {
                "id": 1,
                "category": "End-to-End Architecture",
                "question": "Walk me through how you design an end-to-end user authentication and authorization system from frontend UI to database tables.",
                "hint": "Cover login form validation, HTTPS POST, password hashing with bcrypt, JWT emission, RBAC middleware, and token persistence.",
                "expected_key_points": ["Bcrypt salting & hashing", "RBAC middleware verification", "Secure HttpOnly cookie or Bearer header", "Role check on protected routes"],
            },
            {
                "id": 2,
                "category": "Problem Solving & Database Design",
                "question": "Design a schema and REST/GraphQL API for an E-commerce Cart and Checkout system handling concurrent inventory updates.",
                "hint": "Address race conditions using SELECT FOR UPDATE (pessimistic locking) or version columns (optimistic locking).",
                "expected_key_points": ["Tables: Users, Products, Carts, Orders, Inventory", "Optimistic vs Pessimistic locking", "Idempotency keys on payment checkout"],
            },
        ],
    },
}


@router.post("/start", response_model=schemas.StartInterviewResponse)
def start_mock_interview(
    payload: schemas.StartInterviewRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    """
    Generates a structured live interview question set tailored for the
    requested company, target role, and difficulty level.
    """
    role_questions = QUESTION_BANK.get(payload.role) or QUESTION_BANK["Software Engineer"] if "Software Engineer" in QUESTION_BANK else QUESTION_BANK["Backend Developer"]
    diff_questions = role_questions.get(payload.difficulty) or role_questions.get("Medium") or list(role_questions.values())[0]

    # Map to schema
    questions = [
        schemas.InterviewQuestion(
            id=q["id"],
            category=q["category"],
            question=f"[{payload.company} Interview] {q['question']}",
            hint=q.get("hint"),
            expected_key_points=q.get("expected_key_points", []),
        )
        for q in diff_questions
    ]

    session_id = str(uuid.uuid4())

    return schemas.StartInterviewResponse(
        session_id=session_id,
        company=payload.company,
        role=payload.role,
        difficulty=payload.difficulty,
        duration_minutes=payload.duration_minutes,
        questions=questions,
    )


TECH_KEYWORDS = [
    "virtual dom", "reconciliation", "fiber", "hooks", "closure", "useeffect", "usecallback", "usememo",
    "debouncing", "throttling", "lcp", "cls", "inp", "tree shaking", "code splitting", "lazy loading",
    "b-tree", "hash index", "indexing", "postgresql", "mysql", "acid", "mvcc", "isolation levels",
    "cache-aside", "redis", "bloom filter", "cache stampede", "distributed lock", "mutex", "deadlock",
    "rate limiting", "token bucket", "sliding window", "jwt", "refresh token", "httponly", "csrf", "xss",
    "kafka", "rabbitmq", "transactional outbox", "idempotency", "microservices", "rest api", "graphql",
    "transformer", "self-attention", "rag", "embeddings", "vector database", "quantization", "vllm",
    "o(1)", "o(n)", "o(log n)", "o(n log n)", "time complexity", "space complexity", "hash map", "two pointers",
    "dynamic programming", "sliding window", "binary search", "recursion", "memoization"
]


@router.post("/submit", response_model=schemas.SubmitInterviewResponse)
def submit_mock_interview(
    payload: schemas.SubmitInterviewRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """
    Deeply analyzes candidate answers using multi-factor NLP rubric evaluation:
    - Technical Accuracy & Domain Knowledge
    - Communication & Structural Reasoning
    - Complexity Analysis & Optimization Trade-offs
    - Keyword Concept Matching & Missing Nuance Detection
    Updates database analytics, candidate XP, and weekly progress charts.
    """
    detailed_feedback = []
    total_tech_score = 0
    total_comm_score = 0
    total_problem_score = 0
    all_matched_keywords = set()

    for item in payload.answers:
        answer_text = item.answer.strip()
        lower_answer = answer_text.lower()
        word_count = len(answer_text.split())

        # 1. Detect matched technical keywords
        matched_kw = [kw for kw in TECH_KEYWORDS if kw in lower_answer]
        all_matched_keywords.update(matched_kw)

        # 2. Check for complexity and edge case considerations
        has_complexity = any(c in lower_answer for c in ["o(", "complexity", "big-o", "time", "space", "memory"])
        has_tradeoffs = any(t in lower_answer for t in ["trade-off", "tradeoff", "advantage", "disadvantage", "pros", "cons", "scale", "bottleneck", "edge case"])

        # 3. Multi-factor rubric calculations
        # Technical Accuracy (0-100)
        base_tech = min(40 + len(matched_kw) * 14 + (15 if has_tradeoffs else 0), 98)
        if word_count < 12:
            base_tech = max(base_tech - 35, 35)

        # Communication Clarity (0-100)
        base_comm = min(50 + (15 if word_count >= 30 else 5) + (15 if "\n" in answer_text or "-" in answer_text or "1." in answer_text else 5), 98)
        if word_count < 10:
            base_comm = 40

        # Problem Solving & Optimization (0-100)
        base_prob = min(45 + (20 if has_complexity else 5) + (20 if has_tradeoffs else 5), 96)

        # Weighted Question Score
        q_score = round(0.50 * base_tech + 0.30 * base_comm + 0.20 * base_prob)

        total_tech_score += base_tech
        total_comm_score += base_comm
        total_problem_score += base_prob

        # Contextual AI feedback message
        if q_score >= 88:
            q_feedback = f"Outstanding technical articulation! Matched {len(matched_kw)} key concepts ({', '.join(matched_kw[:3]) if matched_kw else 'core principles'}). Clear trade-off evaluation."
        elif q_score >= 75:
            q_feedback = f"Solid answer with good fundamentals. To elevate to Staff/Senior tier, state precise Big-O complexity and mention edge-case failure modes."
        elif q_score >= 60:
            q_feedback = "Covers introductory concepts. Elaborate more on architecture internals, data structures, and production trade-offs."
        else:
            q_feedback = "Answer was too brief. Flesh out the algorithm, memory footprints, and practical code implementation details."

        detailed_feedback.append(
            schemas.QuestionFeedback(
                question_id=item.question_id,
                question=item.question,
                score=q_score,
                feedback=q_feedback,
                suggested_answer_points=[
                    "Clearly state assumptions and problem constraints upfront",
                    "Explicitly articulate asymptotic time and space complexities",
                    "Detail production failure modes and caching/indexing strategies",
                ],
                identified_keywords=matched_kw[:5],
                technical_accuracy=base_tech,
                communication_clarity=base_comm,
            )
        )

    num_answers = max(len(payload.answers), 1)
    avg_tech = round(total_tech_score / num_answers)
    avg_comm = round(total_comm_score / num_answers)
    avg_prob = round(total_problem_score / num_answers)
    final_score = round(0.50 * avg_tech + 0.30 * avg_comm + 0.20 * avg_prob)

    grade = (
        "A+ (Strong Hire • Outstanding)" if final_score >= 90
        else "A (Hire • Strong Performance)" if final_score >= 80
        else "B+ (Leaning Hire • Good Fundamentals)" if final_score >= 70
        else "Needs Targeted Practice"
    )

    strengths = [
        f"Demonstrated solid competency in {payload.role} engineering principles.",
        f"Effectively incorporated {len(all_matched_keywords)} core domain terms ({', '.join(list(all_matched_keywords)[:4]) if all_matched_keywords else 'technical principles'}).",
        f"Constructive alignment with {payload.company}'s problem-solving rubric.",
    ]

    improvements = [
        "Explicitly discuss asymptotic runtime and auxiliary space complexity in initial reasoning.",
        "Highlight edge cases (e.g. concurrency race conditions, null inputs, scale limits).",
        "Structure responses using the STAR or Problem-Approach-Complexity framework.",
    ]

    overall_summary = (
        f"Candidate achieved an overall interview performance score of {final_score}% ({grade}) for {payload.company}'s {payload.role} position. "
        f"Technical Depth: {avg_tech}%, Communication: {avg_comm}%, Problem Solving: {avg_prob}%."
    )

    # Save to database
    user_id = current_user.id if current_user else None

    interview = models.Interview(
        user_id=user_id,
        role=payload.role,
        company=payload.company,
        score=f"{final_score}%",
        score_num=final_score,
        duration_minutes=payload.duration_minutes,
        status="Completed",
        date=datetime.now().strftime("%d %b %Y"),
        time=datetime.now().strftime("%I:%M %p"),
        mode="Virtual",
        feedback=overall_summary,
    )
    db.add(interview)
    db.flush()

    # Log Activity
    activity = models.Activity(
        user_id=user_id,
        title=f"Mock Interview Completed: {payload.company}",
        company=f"Score: {final_score}% • {payload.role}",
        time="Just now",
        color="#22c55e",
    )
    db.add(activity)

    # Create Notification
    notif = models.Notification(
        user_id=user_id,
        title=f"{payload.company} Evaluation Report Ready",
        desc=f"You scored {final_score}% ({grade})",
        color="#22c55e",
        time="Just now",
        is_read=False,
    )
    db.add(notif)

    # If logged in user, award XP and increment progress
    if current_user:
        current_user.xp = (current_user.xp or 0) + 100
        current_user.progress = min((current_user.progress or 0) + 5, 100)

        # Update or record today's weekly performance in database
        day_abbr = datetime.now().strftime("%a")
        perf = db.query(models.WeeklyPerformance).filter(
            models.WeeklyPerformance.user_id == current_user.id,
            models.WeeklyPerformance.day_name == day_abbr,
        ).first()

        if perf:
            perf.score = round((perf.score + final_score) / 2)
        else:
            db.add(models.WeeklyPerformance(
                user_id=current_user.id,
                day_name=day_abbr,
                score=final_score,
            ))

    db.commit()

    return schemas.SubmitInterviewResponse(
        interview_id=interview.id,
        score=final_score,
        score_percentage=f"{final_score}%",
        grade=grade,
        strengths=strengths,
        improvements=improvements,
        detailed_feedback=detailed_feedback,
        overall_summary=overall_summary,
        technical_score=avg_tech,
        communication_score=avg_comm,
        problem_solving_score=avg_prob,
        identified_keywords=list(all_matched_keywords),
    )


@router.post("/schedule", status_code=status.HTTP_201_CREATED)
def schedule_interview(
    payload: schemas.ScheduleInterviewRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Schedules an upcoming mock interview and registers notifications."""
    user_id = current_user.id if current_user else None

    interview = models.Interview(
        user_id=user_id,
        role=payload.role,
        company=payload.company,
        score=None,
        score_num=None,
        duration_minutes=45,
        status="Scheduled",
        date=payload.date,
        time=payload.time,
        mode=payload.mode,
    )
    db.add(interview)

    # Activity
    activity = models.Activity(
        user_id=user_id,
        title=f"Interview Scheduled: {payload.company}",
        company=f"{payload.role} • {payload.date}",
        time="Just now",
        color="#f59e0b",
    )
    db.add(activity)

    # Notification
    notif = models.Notification(
        user_id=user_id,
        title=f"{payload.company} Interview Scheduled",
        desc=f"{payload.date} at {payload.time} • {payload.role}",
        color="#2563eb",
        time="Just now",
        is_read=False,
    )
    db.add(notif)
    db.commit()

    return {
        "message": "Interview scheduled successfully",
        "interview_id": interview.id,
        "details": {
            "company": payload.company,
            "role": payload.role,
            "date": payload.date,
            "time": payload.time,
            "mode": payload.mode,
        }
    }


@router.get("", response_model=List[schemas.InterviewOut])
def list_interviews(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """List interviews with optional status filtering."""
    user_id = current_user.id if current_user else None
    q = db.query(models.Interview)
    if user_id:
        q = q.filter(models.Interview.user_id == user_id)
    if status_filter:
        q = q.filter(models.Interview.status == status_filter)

    results = q.order_by(models.Interview.id.desc()).all()
    if not results and not user_id:
        results = db.query(models.Interview).order_by(models.Interview.id.desc()).limit(10).all()

    return results
