import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user_optional

router = APIRouter(prefix="/api", tags=["AI Coach & Resume"])

TECH_SKILLS = [
    "react", "javascript", "typescript", "python", "fastapi", "django", "node.js", "express",
    "html", "css", "sql", "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws", "gcp",
    "system design", "rest api", "graphql", "microservices", "git", "ci/cd", "tailwind", "redux",
    "next.js", "data structures", "algorithms", "c++", "java", "linux", "testing", "jest", "pytest"
]

@router.post("/ai/chat", response_model=schemas.AIChatResponse)
def ai_chat(
    payload: schemas.AIChatRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    msg = payload.message.lower().strip()
    category = payload.category or "general"

    if "star" in msg or "behavioral" in msg:
        resp = (
            "The STAR method is the gold standard for behavioral interviews:\n\n"
            "1. **Situation**: Set the context (Company, team, challenge).\n"
            "2. **Task**: What was your specific responsibility?\n"
            "3. **Action**: Exactly what technical/leadership actions did YOU take?\n"
            "4. **Result**: Quantifiable business impact (e.g. 'reduced latency by 35%')."
        )
        followups = ["Give an example STAR answer for conflict resolution", "How do I explain a failure?"]
    elif "system design" in msg or "scale" in msg or "microservice" in msg:
        resp = (
            "For System Design rounds, always structure your 45 minutes into 4 stages:\n\n"
            "1. **Requirements & Scope (5m)**: Functional/Non-functional constraints, DAU, RPS, storage estimates.\n"
            "2. **High-Level Design (15m)**: Client → CDN/LB → API Gateway → Stateless Services → DB (Read/Write split).\n"
            "3. **Deep Dive (15m)**: Caching (Redis Cache-Aside), Database Sharding/Indexing, Message Queues (Kafka).\n"
            "4. **Bottlenecks & Fault Tolerance (10m)**: Single points of failure, rate limiting, circuit breakers."
        )
        followups = ["How to design a URL shortener like TinyURL?", "How to design a distributed rate limiter?"]
    elif "dsa" in msg or "algorithm" in msg or "leetcode" in msg or "dynamic programming" in msg:
        resp = (
            "Top strategies for Technical DSA Interviews:\n\n"
            "• **Clarify Edge Cases**: Empty inputs, integer overflow, duplicates, negative numbers.\n"
            "• **State Brute Force**: Start with the naive $O(N^2)$ solution and state its complexity.\n"
            "• **Optimize with Patterns**: Two-Pointers, Sliding Window, HashMap lookup, BFS/DFS, or DP Memoization.\n"
            "• **Dry Run with Examples**: Trace through your code manually before hitting submit!"
        )
        followups = ["What are the most common Graph interview patterns?", "Explain DP memoization vs tabulation."]
    else:
        resp = (
            f"Hello! I am your **Intervista AI Career & Technical Coach**.\n\n"
            f"I can help you prepare for technical coding rounds, system design architectures, "
            f"mock interview questions, and behavioral rounds for Google, Meta, Amazon, and top tier firms.\n\n"
            f"What topic would you like to drill down on today?"
        )
        followups = ["Explain React Fiber reconciliation", "How to prepare for Google L4 interview", "Review my behavioral answer"]

    return schemas.AIChatResponse(
        response=resp,
        suggested_followups=followups,
    )

@router.post("/resume/analyze", response_model=schemas.ResumeAnalysisResponse)
def analyze_resume(
    payload: schemas.ResumeAnalysisRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    text_lower = payload.resume_text.lower()
    matched = [s for s in TECH_SKILLS if s in text_lower]
    missing = [s for s in ["system design", "docker", "redis", "postgresql", "ci/cd", "testing", "microservices"] if s not in matched][:4]

    word_count = len(text_lower.split())
    has_metrics = any(c in text_lower for c in ["%", "$", "ms", "x", "reduced", "improved", "optimized", "increased"])

    base_score = min(40 + len(matched) * 6 + (15 if has_metrics else 0) + (10 if word_count > 150 else 0), 96)
    ats_score = max(base_score, 45)

    verdict = (
        "Strong ATS Match • Ready for Top Tier Applications" if ats_score >= 85
        else "Good Foundation • Minor Skill Optimization Recommended" if ats_score >= 70
        else "Needs Structural Optimization & Quantifiable Metrics"
    )

    strengths = [
        f"Found {len(matched)} relevant technical competencies aligned with {payload.target_role}.",
        "Good structural flow and clean technical phrasing." if word_count > 100 else "Concise summary.",
    ]
    if has_metrics:
        strengths.append("Strong usage of quantifiable metrics and business impact numbers.")

    suggestions = [
        f"Incorporate missing high-demand keywords: {', '.join(missing)}." if missing else "Continue emphasizing architectural trade-offs.",
        "Add measurable impact to bullet points (e.g. 'Improved query performance by 40% using Redis caching').",
        "Highlight end-to-end ownership and cross-functional leadership in past projects.",
    ]

    record = models.ResumeAnalysisRecord(
        user_id=current_user.id if current_user else None,
        target_role=payload.target_role or "Software Engineer",
        ats_score=ats_score,
        verdict=verdict,
        matched_skills=",".join(matched),
        missing_skills=",".join(missing),
    )
    db.add(record)
    db.commit()

    return schemas.ResumeAnalysisResponse(
        ats_score=ats_score,
        target_role=payload.target_role or "Software Engineer",
        verdict=verdict,
        keywords=schemas.KeywordAnalysis(
            matched=matched,
            missing=missing,
        ),
        strengths=strengths,
        suggestions=suggestions,
        formatting_score=88,
        technical_depth_score=ats_score,
    )
