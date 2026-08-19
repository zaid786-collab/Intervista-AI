import random
import re
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/ai", tags=["AI"])


# ---------- Knowledge Base & Heuristics for AI Chat Assistant ----------

KNOWLEDGE_RESPONSES = {
    "star": (
        "### ⭐ The STAR Method Framework\n\n"
        "The STAR method is the gold standard for answering behavioral interview questions:\n\n"
        "1. **Situation**: Set the context. Describe the specific challenge, project, or environment (20% of time).\n"
        "2. **Task**: Clearly explain your exact responsibility and what goal had to be accomplished (10% of time).\n"
        "3. **Action**: Describe the specific steps **you** took. Focus on technical decisions, collaboration, and leadership (60% of time).\n"
        "4. **Result**: Quantify the outcome! (e.g., 'reduced API latency by 45%', 'onboarded 12k new users') (10% of time).\n\n"
        "💡 *Pro-tip*: Always prepare 5-6 versatile stories from your past projects covering leadership, conflict resolution, technical failure, and tight deadlines."
    ),
    "dsa": (
        "### 🧠 Data Structures & Algorithms Strategy\n\n"
        "When tackling DSA questions in tech interviews:\n\n"
        "1. **Clarify & Listen**: Restate the problem, check edge cases (empty input, negatives, large bounds), and ask about memory vs time priorities.\n"
        "2. **Brute Force First**: Briefly explain the naive approach and analyze its Big-O time and space complexity.\n"
        "3. **Optimize with Key Patterns**:\n"
        "   - Two Pointers / Sliding Window for array/substring problems.\n"
        "   - Hash Maps for O(1) lookups and frequency counting.\n"
        "   - Monotonic Stack for next greater/smaller element problems.\n"
        "   - BFS/DFS for graph and tree traversals.\n"
        "   - Dynamic Programming for overlapping subproblems (Top-down memoization or Bottom-up tabulation).\n"
        "4. **Dry Run with Examples**: Trace your logic manually before writing code to catch off-by-one errors."
    ),
    "system_design": (
        "### 🏗️ System Design Interview Blueprint\n\n"
        "Follow this 4-step framework for High-Level System Design:\n\n"
        "1. **Scope the System (5 mins)**: Clarify functional requirements (e.g. create URL, redirect) and non-functional requirements (high availability, latency < 50ms, 100M DAU).\n"
        "2. **Capacity Estimation (5 mins)**: Calculate QPS (queries per second), bandwidth, and 5-year storage requirements.\n"
        "3. **High-Level Architecture (15 mins)**: Draw Clients -> DNS/CDN -> API Gateway/Load Balancer -> Microservices -> Cache (Redis/Memcached) -> DB (SQL vs NoSQL with sharding/replication).\n"
        "4. **Deep Dive & Bottlenecks (15 mins)**: Address concurrency, caching strategies (Cache-aside, Write-through), data partitioning, and database indexing."
    ),
    "salary": (
        "### 💼 Salary Negotiation Strategy\n\n"
        "1. **Never state a number first**: Let the recruiter share their band or state 'I'm looking for a competitive package aligned with market rates and my experience level.'\n"
        "2. **Benchmark with real data**: Use Levels.fyi, Glassdoor, and Blind for accurate compensation breakdowns (Base + RSUs/Stock + Bonus + Signing Bonus).\n"
        "3. **Leverage competing offers**: Always negotiate politely using value propositions and other timeline pressures.\n"
        "4. **Negotiate the total package**: If base salary has a hard ceiling, ask for a higher signing bonus, additional equity grants, or flexible remote arrangements."
    ),
}


def generate_ai_chat_response(query: str, history: List[schemas.ChatMessage]) -> schemas.AIChatResponse:
    lower_query = query.lower()

    if any(k in lower_query for k in ["star", "behavioral", "situation", "conflict", "tell me about a time"]):
        return schemas.AIChatResponse(
            response=KNOWLEDGE_RESPONSES["star"],
            suggested_followups=[
                "Give me a sample STAR answer for a technical failure",
                "How to answer 'What is your biggest weakness?'",
                "How to describe a disagreement with a team member?"
            ]
        )
    elif any(k in lower_query for k in ["dsa", "leetcode", "algorithm", "data structure", "array", "graph", "tree", "dynamic programming", "dp"]):
        return schemas.AIChatResponse(
            response=KNOWLEDGE_RESPONSES["dsa"],
            suggested_followups=[
                "How do I master Dynamic Programming?",
                "What are the top 50 LeetCode patterns for Google?",
                "Explain Sliding Window technique with an example"
            ]
        )
    elif any(k in lower_query for k in ["system design", "hld", "architecture", "scalability", "load balancer", "microservices", "redis", "database sharding"]):
        return schemas.AIChatResponse(
            response=KNOWLEDGE_RESPONSES["system_design"],
            suggested_followups=[
                "How to design a URL Shortener (like TinyURL)?",
                "SQL vs NoSQL: When to use which in system design?",
                "How does Redis caching and Cache Invalidation work?"
            ]
        )
    elif any(k in lower_query for k in ["salary", "negotiate", "compensation", "offer", "package", "hike"]):
        return schemas.AIChatResponse(
            response=KNOWLEDGE_RESPONSES["salary"],
            suggested_followups=[
                "How to ask for a 30% hike politely?",
                "What should I do if the recruiter asks my current salary?",
                "How do Stock Options (RSUs) and vesting schedules work?"
            ]
        )
    elif any(k in lower_query for k in ["google", "meta", "amazon", "microsoft", "apple", "netflix"]):
        company_name = next((c for c in ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"] if c.lower() in lower_query), "Top Tech")
        return schemas.AIChatResponse(
            response=(
                f"### 🎯 Preparing for {company_name} Interviews\n\n"
                f"For **{company_name}**, the hiring bar focuses on 4 key evaluation pillars:\n\n"
                f"1. **Coding & Problem Solving**: Expect 2-3 technical rounds with Medium/Hard LeetCode problems. Focus heavily on Trees, Graphs, DP, and clean modular code.\n"
                f"2. **System Architecture**: Expect 1-2 System Design rounds focusing on distributed systems, latency tradeoffs, and scalability.\n"
                f"3. **Leadership & Cultural Fit**: High emphasis on collaboration, dealing with ambiguity, and technical ownership.\n"
                f"4. **Speed & Clean Execution**: Practice writing syntactically correct code on a whiteboard or online IDE without autocomplete.\n\n"
                f"👉 Visit the **Companies** section in Intervista AI for dedicated round-by-round breakdown and previous questions for {company_name}!"
            ),
            suggested_followups=[
                f"Show top 10 interview questions for {company_name}",
                f"How is the behavioral round evaluated at {company_name}?",
                "Can you conduct a 15-minute mock interview for this company?"
            ]
        )
    else:
        # Contextual Intelligent Response
        return schemas.AIChatResponse(
            response=(
                f"Hello! As your **Intervista AI Coach**, I can help you prepare for technical, behavioral, and system design interviews.\n\n"
                f"**Here are ways I can assist you right now:**\n"
                f"• 🎯 **Mock Interview Practice**: Give me your target role and company (e.g. *'Interview me for a Frontend role at Microsoft'*).\n"
                f"• 💻 **DSA Concept Explanations**: Ask me about Two Pointers, Dynamic Programming, Graphs, or Trie.\n"
                f"• 🏗️ **System Design Walkthroughs**: Learn how to design Instagram, Uber, Netflix, or Rate Limiters.\n"
                f"• 📄 **Resume Bullet Improvements**: Paste a bullet point from your resume and I'll rewrite it using high-impact metrics.\n"
                f"• ⭐ **STAR Behavioral Coaching**: Practice answers to tough leadership and situational questions."
            ),
            suggested_followups=[
                "Test me with a Medium Coding Question",
                "Explain the STAR method with an example",
                "How to prepare for System Design in 30 days?",
                "Give me 5 common behavioral questions"
            ]
        )


@router.post("/chat", response_model=schemas.AIChatResponse)
def ai_chat(payload: schemas.AIChatRequest, current_user: Optional[models.User] = Depends(get_current_user_optional)):
    """Conversational AI interview coach that answers technical, behavioral, and architectural queries."""
    response = generate_ai_chat_response(payload.message, payload.history or [])
    return response


# ---------- AI Resume Analyzer Engine ----------

resume_router = APIRouter(prefix="/api/resume", tags=["Resume"])

TARGET_ROLE_KEYWORDS = {
    "Frontend Developer": ["react", "javascript", "typescript", "html5", "css3", "next.js", "tailwind", "redux", "performance", "webpack", "responsive", "testing", "rest api", "git"],
    "Backend Developer": ["python", "fastapi", "django", "node.js", "java", "spring boot", "postgresql", "sql", "redis", "docker", "kubernetes", "rest api", "microservices", "kafka", "aws", "git"],
    "Full Stack Developer": ["react", "node.js", "javascript", "typescript", "python", "postgresql", "mongodb", "docker", "aws", "rest api", "system design", "git", "ci/cd", "graphql"],
    "AI / ML Engineer": ["python", "pytorch", "tensorflow", "scikit-learn", "nlp", "llm", "transformers", "numpy", "pandas", "data preprocessing", "model evaluation", "fastapi", "docker", "aws"],
    "Software Engineer": ["dsa", "algorithms", "data structures", "system design", "python", "java", "javascript", "sql", "git", "ci/cd", "unit testing", "rest api", "problem solving"],
}


@router.post("/resume/analyze", response_model=schemas.ResumeAnalysisResponse)
@resume_router.post("/analyze", response_model=schemas.ResumeAnalysisResponse)
def analyze_resume(
    payload: schemas.ResumeAnalysisRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """
    Analyzes resume text against target role keywords, metrics presence,
    formatting signals, and provides ATS score breakdown with actionable suggestions.
    """
    text = payload.resume_text.lower()
    role = payload.target_role or "Full Stack Developer"
    
    # Pick keywords for matching
    keywords_list = TARGET_ROLE_KEYWORDS.get(role, TARGET_ROLE_KEYWORDS["Software Engineer"])
    
    matched_keywords = []
    missing_keywords = []
    
    for kw in keywords_list:
        if re.search(r'\b' + re.escape(kw) + r'\b', text):
            matched_keywords.append(kw.title())
        else:
            missing_keywords.append(kw.title())

    keyword_score = int((len(matched_keywords) / max(len(keywords_list), 1)) * 50)  # Max 50 points

    # Quantifiable metrics check (numbers, percentages, metrics like $ / ms / %)
    metric_matches = len(re.findall(r'\b(?:\d+[\.,]?\d*[%kKmMbB]?|\$\d+|\b\d+\b)\b', payload.resume_text))
    metric_score = min(metric_matches * 3, 20)  # Max 20 points

    # Action verbs check (Architected, Engineered, Developed, Spearheaded, Optimized, Deployed)
    action_verbs = ["developed", "engineered", "architected", "built", "implemented", "optimized", "spearheaded", "designed", "deployed", "reduced", "increased", "scaled", "led"]
    verb_matches = sum(1 for verb in action_verbs if verb in text)
    verb_score = min(verb_matches * 2, 15)  # Max 15 points

    # Contact & links presence (GitHub, LinkedIn, Email, Portfolio)
    links_score = 0
    if "github" in text:
        links_score += 5
    if "linkedin" in text:
        links_score += 5
    if "@" in text:
        links_score += 5

    total_score = min(max(keyword_score + metric_score + verb_score + links_score, 45), 98)

    # Strengths
    strengths = []
    if len(matched_keywords) >= 6:
        strengths.append(f"Strong keyword alignment with {role} (found: {', '.join(matched_keywords[:4])}).")
    if metric_matches >= 4:
        strengths.append("Effective use of quantifiable impact and data points in project descriptions.")
    if "github" in text or "linkedin" in text:
        strengths.append("Professional profile links (GitHub/LinkedIn) included.")
    if not strengths:
        strengths.append("Clear project summaries and technology overview.")

    # Suggestions
    suggestions = []
    if missing_keywords:
        suggestions.append(f"Add key technical skills for {role}: {', '.join(missing_keywords[:4])}.")
    if metric_matches < 4:
        suggestions.append("Quantify your achievements using metrics (e.g. 'Optimized latency by 35%', 'Handled 50k+ DAU').")
    if "github" not in text:
        suggestions.append("Add your active GitHub profile link demonstrating production-grade code.")
    if "system design" not in text and role in ["Backend Developer", "Full Stack Developer", "Software Engineer"]:
        suggestions.append("Highlight System Design, Scalability, and Database optimization experience.")
    if len(suggestions) < 3:
        suggestions.append("Include a 2-line impactful summary emphasizing your domain expertise and years of experience.")

    verdict = "Excellent Candidate" if total_score >= 85 else "Strong Potential - Needs Minor Polish" if total_score >= 70 else "Needs Optimization for ATS"

    # Log to DB if user is logged in
    if current_user:
        record = models.ResumeAnalysisRecord(
            user_id=current_user.id,
            target_role=role,
            ats_score=total_score,
            strengths="; ".join(strengths),
            suggestions="; ".join(suggestions),
        )
        db.add(record)

        # Log Activity
        activity = models.Activity(
            user_id=current_user.id,
            title="AI Resume Analysis Complete",
            company=f"ATS Score: {total_score}% ({role})",
            time="Just now",
            color="#8b5cf6",
        )
        db.add(activity)

        # Add notification
        notif = models.Notification(
            user_id=current_user.id,
            title="AI Resume Score Updated",
            desc=f"Your resume scored {total_score}% for {role}",
            color="#8b5cf6",
            time="Just now",
            is_read=False,
        )
        db.add(notif)
        db.commit()

    return schemas.ResumeAnalysisResponse(
        ats_score=total_score,
        target_role=role,
        verdict=verdict,
        keywords=schemas.KeywordAnalysis(
            matched=matched_keywords,
            missing=missing_keywords,
        ),
        strengths=strengths,
        suggestions=suggestions,
        formatting_score=min(total_score + 5, 100),
        technical_depth_score=min(keyword_score * 2, 100),
    )
