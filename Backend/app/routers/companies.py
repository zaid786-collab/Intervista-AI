from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/companies", tags=["Companies"])

COMPANIES_LIST = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix",
    "Adobe", "Salesforce", "IBM", "Oracle", "NVIDIA", "Infosys",
    "TCS", "Wipro", "Accenture"
]

COMPANY_DATA_DB = {
    "Google": {
        "stats": ["150+", "100+", "30+"],
        "questions": [
            {"title": "Minimum Time Difference", "topic": "Array, Sorting, Math", "difficulty": "Hard", "frequency": "Very High", "leetcode": "https://leetcode.com/problems/minimum-time-difference/"},
            {"title": "Longest Substring Without Repeating Characters", "topic": "Strings • Sliding Window", "difficulty": "Medium", "frequency": "Very High", "leetcode": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"},
            {"title": "LRU Cache", "topic": "Design • Hash Map", "difficulty": "Medium", "frequency": "High", "leetcode": "https://leetcode.com/problems/lru-cache/"},
            {"title": "Merge k Sorted Lists", "topic": "Linked List • Heap", "difficulty": "Hard", "frequency": "High", "leetcode": "https://leetcode.com/problems/merge-k-sorted-lists/"},
            {"title": "Trapping Rain Water", "topic": "Two Pointers • Stack", "difficulty": "Hard", "frequency": "High", "leetcode": "https://leetcode.com/problems/trapping-rain-water/"},
        ],
        "mostAsked": [
            "Explain the internal implementation of HashMap in Java/C++.",
            "How does Google Search indexing work at high level?",
            "What is the difference between BFS and DFS in graph traversal?",
            "How would you design a distributed URL shortener?",
            "Explain process vs thread and virtual memory management.",
        ],
        "preparation": {
            "overview": "Google places immense value on strong algorithmic foundations, writing clean bug-free code, and clear thought articulation.",
            "topics": "Arrays, Strings, Trees, Graphs, Dynamic Programming, Hashing, Binary Search and System Design.",
            "strategy": "Practice writing code on blank editors without autocomplete. Emphasize Big-O complexity and edge-case testing.",
            "tips": "Clarify all constraints upfront, think out loud, and dry-run code with a test case before declaring it finished.",
        },
        "rounds": [
            {"round": "Round 1", "title": "Online Assessment (OA)", "focus": "2 LeetCode Medium/Hard DSA problems (90 mins)", "tips": "Focus on passing all hidden corner test cases within time limit."},
            {"round": "Round 2 & 3", "title": "Technical Interviews (Coding)", "focus": "Data Structures, Algorithms, Complexity Analysis", "tips": "Communicate your thought process clearly before coding."},
            {"round": "Round 4", "title": "System Design / Architecture", "focus": "Scalability, Latency, Data Storage, Sharding", "tips": "Start with High Level Diagram then dive into bottlenecks."},
            {"round": "Round 5", "title": "Googliness & Leadership", "focus": "Behavioral STAR method, cultural alignment, navigating ambiguity", "tips": "Show humility, collaboration, and learning from failure."},
        ]
    },
    "Microsoft": {
        "stats": ["130+", "90+", "25+"],
        "questions": [
            {"title": "Reverse Linked List", "topic": "Linked List", "difficulty": "Easy", "frequency": "Very High", "leetcode": "https://leetcode.com/problems/reverse-linked-list/"},
            {"title": "Binary Tree Level Order Traversal", "topic": "Trees • BFS", "difficulty": "Medium", "frequency": "High", "leetcode": "https://leetcode.com/problems/binary-tree-level-order-traversal/"},
            {"title": "Search in Rotated Sorted Array", "topic": "Binary Search", "difficulty": "Medium", "frequency": "High", "leetcode": "https://leetcode.com/problems/search-in-rotated-sorted-array/"},
            {"title": "Serialize and Deserialize Binary Tree", "topic": "Trees • Design", "difficulty": "Hard", "frequency": "Medium", "leetcode": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"},
        ],
        "mostAsked": [
            "Explain Object-Oriented Programming (OOP) principles with practical examples.",
            "How does Garbage Collection work in managed runtimes (.NET / Java)?",
            "Explain SQL indexing vs full table scan.",
            "How would you design Microsoft Teams chat notification system?",
        ],
        "preparation": {
            "overview": "Microsoft assesses coding excellence, solid CS fundamentals (OOP, OS, DBMS), and growth mindset.",
            "topics": "Trees, Graphs, Linked Lists, Strings, System Design, OOPs concepts.",
            "strategy": "Balance LeetCode practice with deep revision of core CS subjects like OS and DBMS.",
            "tips": "Demonstrate curiosity and how you align with Microsoft's customer-obsessed culture.",
        },
        "rounds": [
            {"round": "Round 1", "title": "Codility Online Assessment", "focus": "2-3 algorithmic problems (60-90 mins)", "tips": "Write modular code and handle empty/negative inputs."},
            {"round": "Round 2 & 3", "title": "DSA & Core CS Technical Rounds", "focus": "Data structures, OOP design patterns, DBMS", "tips": "Explain class hierarchies and SOLID principles."},
            {"round": "Round 4", "title": "System Design & AA (As Appropriate)", "focus": "System architecture and behavioral fit", "tips": "Be ready to defend your architectural decisions."},
        ]
    },
    "Amazon": {
        "stats": ["200+", "120+", "35+"],
        "questions": [
            {"title": "Two Sum", "topic": "Arrays • Hash Map", "difficulty": "Easy", "frequency": "Very High", "leetcode": "https://leetcode.com/problems/two-sum/"},
            {"title": "Number of Islands", "topic": "Graphs • BFS/DFS", "difficulty": "Medium", "frequency": "Very High", "leetcode": "https://leetcode.com/problems/number-of-islands/"},
            {"title": "K Closest Points to Origin", "topic": "Heap • Priority Queue", "difficulty": "Medium", "frequency": "High", "leetcode": "https://leetcode.com/problems/k-closest-points-to-origin/"},
            {"title": "Word Ladder", "topic": "Graphs • BFS", "difficulty": "Hard", "frequency": "Medium", "leetcode": "https://leetcode.com/problems/word-ladder/"},
        ],
        "mostAsked": [
            "Give an example of a time when you showed 'Customer Obsession' and 'Ownership'.",
            "How do you resolve thread deadlocks in multithreaded applications?",
            "Design an Amazon Locker delivery system (HLD/LLD).",
            "Explain database transactions and ACID properties.",
        ],
        "preparation": {
            "overview": "Amazon places 50% weight on technical coding and 50% weight on the 16 Amazon Leadership Principles (LPs).",
            "topics": "Trees, Graphs, Heaps, Hash Tables, System Design, Leadership Principles.",
            "strategy": "Write 2 distinct STAR stories for EACH of Amazon's top leadership principles.",
            "tips": "Always use 'I' instead of 'we' when explaining actions you took in your STAR stories.",
        },
        "rounds": [
            {"round": "Round 1", "title": "Amazon OA (Online Assessment)", "focus": "2 DSA questions + Work Style Assessment", "tips": "Answer work simulation questions aligned strictly with LPs."},
            {"round": "Round 2 to 5", "title": "The Onsite Loop (4 rounds)", "focus": "1 LP behavioral deep-dive + 1 DSA/System Design per round", "tips": "The Bar Raiser round evaluates whether you raise the team's average."},
        ]
    },
}

DEFAULT_GENERIC_PREPARATION = {
    "overview": "Focus on core computer science subjects, problem solving, data structures, algorithms, and behavioral communication.",
    "topics": "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, SQL, System Design.",
    "strategy": "Practice standard problems, understand Big-O time and space complexity, and prepare concise STAR answers.",
    "tips": "Communicate clearly, test edge cases, and ask clarifying questions before writing code.",
}


@router.get("", response_model=List[str])
def list_companies():
    """Returns list of all supported companies."""
    return COMPANIES_LIST


@router.get("/{company_name}", response_model=schemas.CompanyDetailOut)
def get_company_details(
    company_name: str,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Returns comprehensive company interview details, questions, rounds, and user solved stats."""
    matched_name = next((c for c in COMPANIES_LIST if c.lower() == company_name.lower()), company_name.title())

    data = COMPANY_DATA_DB.get(matched_name)
    if not data:
        # Fallback generic company structure
        data = {
            "stats": ["50+", "30+", "10+"],
            "questions": [
                {"title": "Two Sum", "topic": "Arrays • Hash Map", "difficulty": "Easy", "frequency": "High", "leetcode": "https://leetcode.com/problems/two-sum/"},
                {"title": "Valid Parentheses", "topic": "Stack", "difficulty": "Easy", "frequency": "High", "leetcode": "https://leetcode.com/problems/valid-parentheses/"},
                {"title": "Longest Palindromic Substring", "topic": "Dynamic Programming", "difficulty": "Medium", "frequency": "Medium", "leetcode": "https://leetcode.com/problems/longest-palindromic-substring/"},
                {"title": "Course Schedule", "topic": "Graphs • Topological Sort", "difficulty": "Medium", "frequency": "Medium", "leetcode": "https://leetcode.com/problems/course-schedule/"},
            ],
            "mostAsked": [
                "Explain the difference between process and thread.",
                "How does indexing improve database query performance?",
                "Explain the four pillars of OOP with examples.",
                "How to design a scalable notification service?",
            ],
            "preparation": DEFAULT_GENERIC_PREPARATION,
            "rounds": [
                {"round": "Round 1", "title": "Online Coding Assessment", "focus": "Data Structures & Problem Solving", "tips": "Test edge cases before submitting."},
                {"round": "Round 2", "title": "Technical Interview", "focus": "DSA, OOP, and Database Querying", "tips": "Explain your approach clearly."},
                {"round": "Round 3", "title": "Managerial & HR Round", "focus": "Behavioral fit, projects, and motivation", "tips": "Use the STAR method."},
            ]
        }

    # Fetch solved questions if user is logged in
    solved_titles = []
    if current_user:
        solved_db = db.query(models.UserCompanySolved.question_title).filter(
            models.UserCompanySolved.user_id == current_user.id,
            models.UserCompanySolved.company_name == matched_name,
        ).all()
        solved_titles = [s[0] for s in solved_db]

    return schemas.CompanyDetailOut(
        name=matched_name,
        stats=data["stats"],
        questions=[schemas.CompanyQuestionOut(**q) for q in data["questions"]],
        mostAsked=data["mostAsked"],
        preparation=schemas.CompanyPreparationOut(**data["preparation"]),
        rounds=[schemas.CompanyRoundOut(**r) for r in data["rounds"]],
        solved_count=len(solved_titles),
        solved_titles=solved_titles,
    )


@router.get("/{company_name}/solved", response_model=List[str])
def get_company_solved(
    company_name: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get list of solved question titles for this company."""
    matched_name = next((c for c in COMPANIES_LIST if c.lower() == company_name.lower()), company_name.title())
    solved = db.query(models.UserCompanySolved.question_title).filter(
        models.UserCompanySolved.user_id == current_user.id,
        models.UserCompanySolved.company_name == matched_name,
    ).all()
    return [s[0] for s in solved]


@router.post("/{company_name}/toggle-solved", response_model=schemas.ToggleSolvedResponse)
def toggle_company_question_solved(
    company_name: str,
    payload: schemas.ToggleSolvedRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle solved state for a company-specific interview question."""
    matched_name = next((c for c in COMPANIES_LIST if c.lower() == company_name.lower()), company_name.title())

    existing = db.query(models.UserCompanySolved).filter(
        models.UserCompanySolved.user_id == current_user.id,
        models.UserCompanySolved.company_name == matched_name,
        models.UserCompanySolved.question_title == payload.title,
    ).first()

    if existing:
        db.delete(existing)
        is_solved = False
    else:
        db.add(models.UserCompanySolved(
            user_id=current_user.id,
            company_name=matched_name,
            question_title=payload.title,
        ))
        is_solved = True
        # Award small XP
        current_user.xp = (current_user.xp or 250) + 25
        current_user.progress = min((current_user.progress or 15) + 1, 100)

    db.commit()

    all_solved = db.query(models.UserCompanySolved.question_title).filter(
        models.UserCompanySolved.user_id == current_user.id,
        models.UserCompanySolved.company_name == matched_name,
    ).all()

    return schemas.ToggleSolvedResponse(
        title=payload.title,
        is_solved=is_solved,
        solved_titles=[s[0] for s in all_solved],
    )
