import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user_optional
from app.services.llm_evaluator import evaluate_interview_submission
from app.services.pdf_generator import generate_interview_pdf_report

router = APIRouter(prefix="/api/interviews", tags=["Mock Interviews & AI Evaluation"])

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
    # 1. Run LLM & Rubric Evaluation
    answers_dicts = [
        {
            "question_id": a.question_id,
            "question": a.question,
            "answer": a.answer,
        }
        for a in payload.answers
    ]
    eval_result = evaluate_interview_submission(
        company=payload.company,
        role=payload.role,
        difficulty=payload.difficulty,
        answers=answers_dicts,
    )

    final_score = int(eval_result.get("overall_score", 75))
    tech_score = int(eval_result.get("technical_score", final_score))
    comm_score = int(eval_result.get("communication_score", final_score))
    prob_score = int(eval_result.get("problem_solving_score", final_score))
    grade = eval_result.get("grade", "A (Strong Performance)")
    strengths = eval_result.get("strengths", [])
    improvements = eval_result.get("improvements", [])
    overall_summary = eval_result.get("overall_summary", "")
    identified_keywords = eval_result.get("identified_keywords", [])
    raw_detailed = eval_result.get("detailed_feedback", [])

    detailed_feedback = [
        schemas.QuestionFeedback(
            question_id=qf.get("question_id", idx + 1),
            question=qf.get("question", f"Question {idx + 1}"),
            score=int(qf.get("score", 75)),
            feedback=qf.get("feedback", "Good answer."),
            suggested_answer_points=qf.get("suggested_answer_points", []),
            identified_keywords=qf.get("identified_keywords", []),
            technical_accuracy=int(qf.get("technical_accuracy", tech_score)),
            communication_clarity=int(qf.get("communication_clarity", comm_score)),
        )
        for idx, qf in enumerate(raw_detailed)
    ]

    user_id = current_user.id if current_user else None

    # 2. Persist Full Evaluation in Database
    interview = models.Interview(
        user_id=user_id,
        role=payload.role,
        company=payload.company,
        score=f"{final_score}%",
        score_num=final_score,
        technical_score=tech_score,
        communication_score=comm_score,
        problem_solving_score=prob_score,
        grade=grade,
        duration_minutes=payload.duration_minutes or 45,
        status="Completed",
        date=datetime.now().strftime("%d %b %Y"),
        time=datetime.now().strftime("%I:%M %p"),
        mode="Virtual",
        feedback=overall_summary,
        report_data=json.dumps({
            "strengths": strengths,
            "improvements": improvements,
            "detailed_feedback": [df.dict() for df in detailed_feedback],
            "identified_keywords": identified_keywords,
        }),
    )
    db.add(interview)
    db.flush()

    # 3. Add Activity Feed Record
    activity = models.Activity(
        user_id=user_id,
        title=f"Mock Interview Completed: {payload.company}",
        company=f"Score: {final_score}% ({grade}) • {payload.role}",
        time="Just now",
        color="#22c55e",
    )
    db.add(activity)

    # 4. Add Notification Record
    notif = models.Notification(
        user_id=user_id,
        title=f"{payload.company} Evaluation Report Ready",
        desc=f"You scored {final_score}% ({grade}) on {payload.role}",
        color="#22c55e",
        time="Just now",
        is_read=False,
    )
    db.add(notif)

    # 5. Increment XP and readiness progress
    if current_user:
        current_user.xp = (current_user.xp or 0) + 100
        current_user.progress = min((current_user.progress or 0) + 5, 100)

    # 6. Update Weekly Performance Chart Record
    day_abbr = datetime.now().strftime("%a")
    perf_filter = (models.WeeklyPerformance.user_id == user_id) if user_id else models.WeeklyPerformance.user_id.is_(None)
    perf = db.query(models.WeeklyPerformance).filter(
        perf_filter,
        models.WeeklyPerformance.day_name == day_abbr,
    ).first()

    if perf:
        perf.score = round((perf.score + final_score) / 2)
    else:
        db.add(models.WeeklyPerformance(
            user_id=user_id,
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
        technical_score=tech_score,
        communication_score=comm_score,
        problem_solving_score=prob_score,
        identified_keywords=identified_keywords,
    )

@router.get("/{interview_id}/pdf")
def download_interview_pdf(
    interview_id: int,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Generates and downloads the Official PDF Assessment Report for a completed interview."""
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview record not found.")

    report_payload = {}
    if interview.report_data:
        try:
            report_payload = json.loads(interview.report_data)
        except Exception:
            report_payload = {}

    interview_data = {
        "id": interview.id,
        "company": interview.company,
        "role": interview.role,
        "score_num": interview.score_num or int(interview.score.replace("%", "")) if interview.score else 75,
        "score": interview.score or f"{interview.score_num}%",
        "technical_score": interview.technical_score or interview.score_num or 80,
        "communication_score": interview.communication_score or interview.score_num or 80,
        "problem_solving_score": interview.problem_solving_score or interview.score_num or 80,
        "grade": interview.grade or "A (Strong Performance)",
        "duration_minutes": interview.duration_minutes or 45,
        "date": interview.date or datetime.now().strftime("%d %b %Y"),
        "feedback": interview.feedback,
        "strengths": report_payload.get("strengths", []),
        "improvements": report_payload.get("improvements", []),
        "detailed_feedback": report_payload.get("detailed_feedback", []),
    }

    candidate_name = current_user.name if current_user else "Interview Candidate"
    pdf_buffer = generate_interview_pdf_report(interview_data, candidate_name=candidate_name)

    safe_company = interview.company.replace(" ", "_")
    safe_role = interview.role.replace(" ", "_")
    filename = f"Intervista_AI_Report_{safe_company}_{safe_role}_{interview.id}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
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
