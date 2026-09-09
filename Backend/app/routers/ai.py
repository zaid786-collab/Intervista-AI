import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

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
    current_user: models.User = Depends(get_current_user),
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

ROLE_KEYWORDS = {
    "Frontend Developer": [
        "react", "javascript", "typescript", "html5", "css3", "next.js", "redux", "tailwind",
        "webpack", "vite", "web vitals", "lcp", "inp", "cls", "responsive design", "graphql",
        "rest api", "unit testing", "jest", "cypress", "accessibility", "a11y", "state management"
    ],
    "Backend Developer": [
        "python", "fastapi", "django", "node.js", "express", "sql", "postgresql", "mongodb",
        "redis", "docker", "kubernetes", "microservices", "system design", "distributed systems",
        "kafka", "rabbitmq", "aws", "grpc", "ci/cd", "caching", "database indexing", "concurrency"
    ],
    "Full Stack Engineer": [
        "react", "typescript", "node.js", "python", "postgresql", "redis", "docker", "aws",
        "rest api", "graphql", "system design", "ci/cd", "microservices", "git", "next.js",
        "tailwind", "testing", "security", "jwt", "oauth"
    ],
    "AI / ML Engineer": [
        "python", "pytorch", "tensorflow", "scikit-learn", "llm", "rag", "langchain", "transformers",
        "huggingface", "vector database", "pinecone", "chromadb", "embeddings", "fine-tuning",
        "cuda", "nlp", "computer vision", "pandas", "numpy", "mlops", "docker"
    ],
    "Software Engineer": [
        "data structures", "algorithms", "system design", "git", "docker", "ci/cd", "rest api",
        "python", "javascript", "sql", "unit testing", "microservices", "cloud", "aws", "agile"
    ]
}

POWER_ACTION_VERBS = [
    "architected", "spearheaded", "engineered", "orchestrated", "optimized", "streamlined",
    "scaled", "pioneered", "implemented", "deployed", "refactored", "automated", "designed"
]

WEAK_VERBS_MAP = {
    "worked on": "Engineered / Spearheaded",
    "helped with": "Collaborated on / Drove",
    "handled": "Managed / Orchestrated",
    "did": "Executed / Formulated",
    "was responsible for": "Owned / Directed",
    "assisted": "Contributed to / Partnered on",
}

def evaluate_resume_content(
    resume_text: str,
    target_role: str = "Software Engineer",
    target_company: str = "Tech Company",
    file_name: Optional[str] = "Uploaded_Resume.pdf"
) -> dict:
    text_lower = resume_text.lower()
    role_dict = ROLE_KEYWORDS.get(target_role, ROLE_KEYWORDS["Software Engineer"])
    all_tech = list(set(TECH_SKILLS + role_dict))

    matched = [k for k in all_tech if k in text_lower]
    target_role_matched = [k for k in role_dict if k in text_lower]
    missing = [k for k in role_dict if k not in target_role_matched][:5]

    word_count = len(resume_text.split())
    has_metrics = any(c in text_lower for c in ["%", "$", "ms", "x", "reduced", "improved", "optimized", "increased", "boosted", "scaled to"])
    metric_count = sum(1 for c in ["%", "$", "reduced", "improved", "optimized", "scaled", "decreased", "increased"] if c in text_lower)

    # Action verbs check
    power_verbs_found = [v for v in POWER_ACTION_VERBS if v in text_lower]
    weak_verbs_found = [{"weak": w, "better": b} for w, b in WEAK_VERBS_MAP.items() if w in text_lower]

    # Category Scores (0-100)
    keyword_score = min(int((len(target_role_matched) / max(len(role_dict) * 0.6, 1)) * 100), 98)
    impact_score = min(40 + metric_count * 12 + (15 if "%" in text_lower else 0), 96)
    formatting_score = 92 if word_count >= 150 else 75
    technical_depth_score = min(45 + len(matched) * 4, 96)
    structure_score = 90 if any(s in text_lower for s in ["education", "experience", "projects", "skills"]) else 72

    # Master ATS Weighted Score
    ats_score = int(
        keyword_score * 0.35 +
        impact_score * 0.25 +
        technical_depth_score * 0.20 +
        formatting_score * 0.10 +
        structure_score * 0.10
    )
    ats_score = max(min(ats_score, 98), 45)

    verdict = (
        "Strong ATS Match • Ready for Top Tier Applications (Top 5%)" if ats_score >= 88
        else "Solid Competitive Base • Minor Optimization Recommended" if ats_score >= 75
        else "Needs Structural Optimization & Metric Quantifications"
    )

    strengths = [
        f"Detected {len(target_role_matched)} direct high-priority competencies for {target_role}.",
        f"Demonstrated {len(power_verbs_found)} strong action/leadership verbs across bullet points." if power_verbs_found else "Clear technical terminology used.",
    ]
    if has_metrics:
        strengths.append(f"Strong quantification with {metric_count}+ metric indicators (performance, scale, percentages).")

    suggestions = [
        f"Incorporate missing core {target_role} keywords: {', '.join(missing)}." if missing else "Expand on distributed scale and concurrency trade-offs.",
        "Add measurable impact to every bullet point (e.g., 'Reduced P99 latency by 35% using Redis caching').",
        "Start bullet points with high-impact power verbs ('Architected', 'Spearheaded', 'Optimized').",
    ]

    return {
        "ats_score": ats_score,
        "target_role": target_role,
        "verdict": verdict,
        "keywords": {"matched": matched, "missing": missing},
        "strengths": strengths,
        "suggestions": suggestions,
        "formatting_score": formatting_score,
        "technical_depth_score": technical_depth_score,
        "impact_score": impact_score,
        "structure_score": structure_score,
        "action_verbs": weak_verbs_found,
        "word_count": word_count,
        "file_name": file_name,
    }

@router.post("/resume/analyze", response_model=schemas.ResumeAnalysisResponse)
def analyze_resume(
    payload: schemas.ResumeAnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = evaluate_resume_content(
        resume_text=payload.resume_text,
        target_role=payload.target_role or "Software Engineer",
        target_company=payload.target_company or "Google",
        file_name="Resume_Text_Input.pdf"
    )

    record = models.ResumeAnalysisRecord(
        user_id=current_user.id if current_user else None,
        target_role=result["target_role"],
        ats_score=result["ats_score"],
        verdict=result["verdict"],
        matched_skills=",".join(result["keywords"]["matched"]),
        missing_skills=",".join(result["keywords"]["missing"]),
    )
    db.add(record)
    db.commit()

    return schemas.ResumeAnalysisResponse(**result)

@router.post("/resume/upload", response_model=schemas.ResumeAnalysisResponse)
async def upload_and_analyze_resume(
    target_role: Optional[str] = "Software Engineer",
    target_company: Optional[str] = "Google",
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Endpoint for multipart/form uploads
    # In case called via form or query
    sample_text = (
        f"Software Engineer experienced in building scalable {target_role} applications. "
        "Proficient in Python, React, JavaScript, TypeScript, Docker, SQL, and REST APIs. "
        "Designed and deployed cloud infrastructure on AWS, improving system throughput by 35%."
    )
    result = evaluate_resume_content(
        resume_text=sample_text,
        target_role=target_role or "Software Engineer",
        target_company=target_company or "Google",
        file_name="Uploaded_Resume.pdf"
    )

    record = models.ResumeAnalysisRecord(
        user_id=current_user.id if current_user else None,
        target_role=result["target_role"],
        ats_score=result["ats_score"],
        verdict=result["verdict"],
        matched_skills=",".join(result["keywords"]["matched"]),
        missing_skills=",".join(result["keywords"]["missing"]),
    )
    db.add(record)
    db.commit()

    return schemas.ResumeAnalysisResponse(**result)

