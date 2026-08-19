from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user_optional

router = APIRouter(prefix="/api/companies", tags=["Company Intelligence"])

COMPANIES_LIST = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple",
    "Netflix", "Adobe", "Salesforce", "IBM", "Oracle",
    "NVIDIA", "Infosys", "TCS", "Wipro", "Accenture"
]

COMPANY_PREP_DATA = {
    "Google": {
        "tagline": "Search, Cloud, AI & Distributed Systems",
        "description": "Google interviews heavily test clean algorithmic thinking, Big-O optimization, and scalable system design.",
        "difficulty": "Hard",
        "topics": ["Dynamic Programming", "Graph BFS/DFS", "Distributed Systems", "Trie & Prefix Trees"],
        "common_questions": [
            "Median of Two Sorted Arrays",
            "Word Ladder II",
            "Design Google Drive / File Storage",
            "Design Google Auto-Complete / Typeahead",
        ],
    },
    "Microsoft": {
        "tagline": "Azure Cloud, Enterprise Platforms & AI",
        "description": "Microsoft interviews focus on object-oriented system design, concurrency, and balanced tree algorithms.",
        "difficulty": "Medium-Hard",
        "topics": ["Binary Search Trees", "Linked Lists", "OOP Architecture", "System Design"],
        "common_questions": [
            "LRU Cache",
            "Reverse Nodes in k-Group",
            "Design a Cloud File Sharing System",
            "Serialize and Deserialize Binary Tree",
        ],
    },
    "Amazon": {
        "tagline": "E-Commerce, AWS & Leadership Principles",
        "description": "Amazon places 50% weight on Leadership Principles (LP) and 50% on Data Structures and High-Scale System Design.",
        "difficulty": "Medium-Hard",
        "topics": ["Two Pointers", "Sliding Window", "Monotonic Stack", "Behavioral LP"],
        "common_questions": [
            "Course Schedule II",
            "Trapping Rain Water",
            "Design Amazon Locker Delivery System",
            "Design Scalable Recommendation Engine",
        ],
    },
    "Meta": {
        "tagline": "Social Graphs, Real-Time Messaging & High Throughput",
        "description": "Meta speed coding interviews require writing bug-free code for 2 medium problems in 45 minutes.",
        "difficulty": "Hard",
        "topics": ["Graph Traversals", "Binary Trees", "HashMap Optimization", "Intervals"],
        "common_questions": [
            "Lowest Common Ancestor of a Binary Tree",
            "Merge Intervals",
            "Design Facebook NewsFeed / Live Comments",
            "Kth Largest Element in an Array",
        ],
    },
}

@router.get("")
def get_all_companies():
    return {"companies": COMPANIES_LIST}

@router.get("/{name}")
def get_company_details(
    name: str,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    comp_key = next((c for c in COMPANIES_LIST if c.lower() == name.lower()), name)
    details = COMPANY_PREP_DATA.get(comp_key, {
        "tagline": f"Technical Interview Preparation for {comp_key}",
        "description": f"Master data structures, algorithms, and system design tailored for {comp_key}.",
        "difficulty": "Medium",
        "topics": ["Algorithms", "Data Structures", "System Design", "Behavioral Questions"],
        "common_questions": [
            "Two Sum / 3Sum",
            "LRU Cache Implementation",
            "Design Scalable API Backend",
            "Valid Parentheses & String Parsing",
        ],
    })

    solved_topics = []
    if current_user:
        records = db.query(models.CompanyTopicSolved).filter(
            models.CompanyTopicSolved.user_id == current_user.id,
            models.CompanyTopicSolved.company == comp_key,
        ).all()
        solved_topics = [r.topic for r in records]

    return {
        "name": comp_key,
        **details,
        "solved_topics": solved_topics,
    }

@router.post("/{name}/toggle-solved")
def toggle_company_topic(
    name: str,
    payload: schemas.ToggleSolvedRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    if not current_user:
        return {"company": name, "topic": payload.title, "is_solved": True, "solved_topics": [payload.title]}

    comp_key = next((c for c in COMPANIES_LIST if c.lower() == name.lower()), name)
    existing = db.query(models.CompanyTopicSolved).filter(
        models.CompanyTopicSolved.user_id == current_user.id,
        models.CompanyTopicSolved.company == comp_key,
        models.CompanyTopicSolved.topic == payload.title,
    ).first()

    if existing:
        db.delete(existing)
        is_solved = False
    else:
        db.add(models.CompanyTopicSolved(
            user_id=current_user.id,
            company=comp_key,
            topic=payload.title,
        ))
        is_solved = True

    db.commit()

    records = db.query(models.CompanyTopicSolved).filter(
        models.CompanyTopicSolved.user_id == current_user.id,
        models.CompanyTopicSolved.company == comp_key,
    ).all()

    return {
        "company": comp_key,
        "topic": payload.title,
        "is_solved": is_solved,
        "solved_topics": [r.topic for r in records],
    }
