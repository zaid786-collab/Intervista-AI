import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user_optional

router = APIRouter(prefix="/api/interviews", tags=["Mock Interviews"])

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

DEFAULT_QUESTION_BANK = {
    "Frontend Developer": [
        {
            "id": 1,
            "category": "Coding & Architecture",
            "question": "How does React Fiber reconciliation work, and how does React optimize DOM diffing with keys?",
            "hint": "Mention Virtual DOM, heuristic O(n) diffing, fiber node hierarchy, work loop, and component identity.",
        },
        {
            "id": 2,
            "category": "Performance & CWV",
            "question": "Explain how to diagnose and optimize Core Web Vitals (LCP, INP, CLS) in a large single-page app.",
            "hint": "Discuss fetchpriority, critical rendering path, code-splitting, layout stability, and long task decomposition.",
        },
        {
            "id": 3,
            "category": "JavaScript & Web APIs",
            "question": "Explain JavaScript closures, event loop macro/microtask queue ordering, and memory leak prevention.",
            "hint": "Mention lexical scoping, garbage collection retainers, Promise microtasks, and cleanup in useEffect.",
        },
    ],
    "Backend Developer": [
        {
            "id": 1,
            "category": "System Design",
            "question": "How do you architect a high-throughput, low-latency distributed caching layer using Redis?",
            "hint": "Address cache-aside, cache penetration, bloom filters, cache stampede, eviction policies, and cluster replication.",
        },
        {
            "id": 2,
            "category": "Databases & Concurrency",
            "question": "Compare PostgreSQL B-Tree vs Hash indexing and explain transaction isolation levels and deadlocks.",
            "hint": "Mention read committed, repeatable read, serializable, MVCC, row locking, and deadlock detection graphs.",
        },
        {
            "id": 3,
            "category": "Distributed Systems",
            "question": "How do you guarantee idempotency in distributed payment transactions across microservices?",
            "hint": "Discuss Idempotency-Key headers, transactional outbox pattern, distributed locks, and two-phase commit.",
        },
    ],
    "Full Stack Engineer": [
        {
            "id": 1,
            "category": "Full Stack Architecture",
            "question": "Design a secure, real-time collaboration canvas (like Figma/Google Docs) supporting conflict resolution.",
            "hint": "Mention WebSockets, Operational Transformation (OT) vs CRDTs, JWT token refresh, and delta compression.",
        },
        {
            "id": 2,
            "category": "Security & Auth",
            "question": "Explain OAuth2 PKCE flow, JWT storage best practices, and preventing CSRF/XSS in modern web apps.",
            "hint": "Compare HttpOnly cookies vs localStorage, SameSite cookie attributes, Content Security Policy, and token rotation.",
        },
        {
            "id": 3,
            "category": "Data & Performance",
            "question": "How do you implement pagination, rate limiting, and database connection pooling at scale?",
            "hint": "Compare cursor-based vs offset pagination, Token Bucket vs Sliding Window log, and PgBouncer connection pooling.",
        },
    ],
    "AI / ML Engineer": [
        {
            "id": 1,
            "category": "LLM & RAG Systems",
            "question": "Design a high-accuracy, production-ready Retrieval-Augmented Generation (RAG) system with hybrid search.",
            "hint": "Discuss chunking strategies, dense vector embeddings, sparse BM25 reranking, cross-encoders, and vector DB indexing.",
        },
        {
            "id": 2,
            "category": "Model Serving & Inference",
            "question": "How do you optimize LLM inference throughput and latency in production (vLLM, quantization, KV caching)?",
            "hint": "Mention PagedAttention, continuous batching, FP8/AWQ quantization, prefix caching, and speculative decoding.",
        },
    ],
}

@router.post("/start", response_model=schemas.StartInterviewResponse)
def start_mock_interview(
    payload: schemas.StartInterviewRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    role_key = payload.role if payload.role in DEFAULT_QUESTION_BANK else "Frontend Developer"
    questions_raw = DEFAULT_QUESTION_BANK.get(role_key, DEFAULT_QUESTION_BANK["Frontend Developer"])
    
    questions = [
        schemas.InterviewQuestion(
            id=q["id"],
            category=q["category"],
            question=f"[{payload.company}] {q['question']}",
            hint=q.get("hint"),
        )
        for q in questions_raw
    ]

    session_id = f"intv_{payload.company.lower()}_{int(datetime.now().timestamp())}"

    return schemas.StartInterviewResponse(
        session_id=session_id,
        company=payload.company,
        role=payload.role,
        difficulty=payload.difficulty,
        duration_minutes=payload.duration_minutes,
        questions=questions,
    )

@router.post("/submit", response_model=schemas.SubmitInterviewResponse)
def submit_mock_interview(
    payload: schemas.SubmitInterviewRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
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

        # 2. Check complexity and trade-off considerations
        has_complexity = any(c in lower_answer for c in ["o(", "complexity", "big-o", "time", "space", "memory"])
        has_tradeoffs = any(t in lower_answer for t in ["trade-off", "tradeoff", "advantage", "disadvantage", "pros", "cons", "scale", "bottleneck", "edge case"])

        # 3. Multi-factor rubric calculations
        base_tech = min(40 + len(matched_kw) * 14 + (15 if has_tradeoffs else 0), 98)
        if word_count < 12:
            base_tech = max(base_tech - 35, 35)

        base_comm = min(50 + (15 if word_count >= 30 else 5) + (15 if "\n" in answer_text or "-" in answer_text or "1." in answer_text else 5), 98)
        if word_count < 10:
            base_comm = 40

        base_prob = min(45 + (20 if has_complexity else 5) + (20 if has_tradeoffs else 5), 96)

        q_score = round(0.50 * base_tech + 0.30 * base_comm + 0.20 * base_prob)

        total_tech_score += base_tech
        total_comm_score += base_comm
        total_problem_score += base_prob

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

    activity = models.Activity(
        user_id=user_id,
        title=f"Mock Interview Completed: {payload.company}",
        company=f"Score: {final_score}% • {payload.role}",
        time="Just now",
        color="#22c55e",
    )
    db.add(activity)

    notif = models.Notification(
        user_id=user_id,
        title=f"{payload.company} Evaluation Report Ready",
        desc=f"You scored {final_score}% ({grade})",
        color="#22c55e",
        time="Just now",
        is_read=False,
    )
    db.add(notif)

    if current_user:
        current_user.xp = (current_user.xp or 0) + 100
        current_user.progress = min((current_user.progress or 0) + 5, 100)

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
    user_id = current_user.id if current_user else None

    interview = models.Interview(
        user_id=user_id,
        role=payload.role,
        company=payload.company,
        score="Upcoming",
        duration_minutes=45,
        status="Scheduled",
        date=payload.date,
        time=payload.time,
        mode=payload.mode or "Virtual",
        feedback="Scheduled upcoming technical interview session.",
    )
    db.add(interview)

    notif = models.Notification(
        user_id=user_id,
        title=f"Interview Scheduled: {payload.company}",
        desc=f"{payload.role} on {payload.date} at {payload.time}",
        color="#3b82f6",
        time="Just now",
        is_read=False,
    )
    db.add(notif)
    db.commit()

    return {
        "message": f"Successfully scheduled interview for {payload.company} ({payload.role}) on {payload.date} at {payload.time}.",
        "interview_id": interview.id,
    }
