from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin, get_current_user, get_current_user_optional
from app import models, schemas

router = APIRouter(prefix="/api/resources", tags=["Resources"])

DEFAULT_DSA_TOPICS = [
    {
        "icon": "▣",
        "title": "Arrays",
        "description": "Searching, sorting, prefix sums, hashing and two-pointer problems.",
        "problemCount": 75,
        "problems": [
            {
                "name": "Two Sum",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/two-sum/",
            },
            {
                "name": "Best Time to Buy and Sell Stock",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
            },
            {
                "name": "Maximum Subarray",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/maximum-subarray/",
            },
            {
                "name": "Product of Array Except Self",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/product-of-array-except-self/",
            },
            {
                "name": "First Missing Positive",
                "difficulty": "Hard",
                "leetcode": "https://leetcode.com/problems/first-missing-positive/",
            },
        ],
    },
    {
        "icon": "Aa",
        "title": "Strings",
        "description": "String manipulation, hashing, patterns, anagrams and sliding window.",
        "problemCount": 65,
        "problems": [
            {
                "name": "Valid Anagram",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/valid-anagram/",
            },
            {
                "name": "Valid Palindrome",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/valid-palindrome/",
            },
            {
                "name": "Longest Substring Without Repeating Characters",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
            },
            {
                "name": "Group Anagrams",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/group-anagrams/",
            },
            {
                "name": "Minimum Window Substring",
                "difficulty": "Hard",
                "leetcode": "https://leetcode.com/problems/minimum-window-substring/",
            },
        ],
    },
    {
        "icon": "↗",
        "title": "Linked List",
        "description": "Reversal, cycle detection, merging, fast-slow pointers and more.",
        "problemCount": 55,
        "problems": [
            {
                "name": "Reverse Linked List",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/reverse-linked-list/",
            },
            {
                "name": "Merge Two Sorted Lists",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/merge-two-sorted-lists/",
            },
            {
                "name": "Linked List Cycle",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/linked-list-cycle/",
            },
            {
                "name": "Add Two Numbers",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/add-two-numbers/",
            },
            {
                "name": "Merge k Sorted Lists",
                "difficulty": "Hard",
                "leetcode": "https://leetcode.com/problems/merge-k-sorted-lists/",
            },
        ],
    },
    {
        "icon": "◫",
        "title": "Stack & Queue",
        "description": "Monotonic stacks, queues, expressions and implementation problems.",
        "problemCount": 50,
        "problems": [
            {
                "name": "Valid Parentheses",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/valid-parentheses/",
            },
            {
                "name": "Min Stack",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/min-stack/",
            },
            {
                "name": "Evaluate Reverse Polish Notation",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
            },
            {
                "name": "Daily Temperatures",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/daily-temperatures/",
            },
            {
                "name": "Largest Rectangle in Histogram",
                "difficulty": "Hard",
                "leetcode": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
            },
        ],
    },
    {
        "icon": "◇",
        "title": "Trees",
        "description": "Traversal, BST, recursion, depth, views and tree-based problems.",
        "problemCount": 80,
        "problems": [
            {
                "name": "Maximum Depth of Binary Tree",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
            },
            {
                "name": "Invert Binary Tree",
                "difficulty": "Easy",
                "leetcode": "https://leetcode.com/problems/invert-binary-tree/",
            },
            {
                "name": "Binary Tree Level Order Traversal",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
            },
            {
                "name": "Validate Binary Search Tree",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/validate-binary-search-tree/",
            },
            {
                "name": "Binary Tree Maximum Path Sum",
                "difficulty": "Hard",
                "leetcode": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
            },
        ],
    },
    {
        "icon": "◎",
        "title": "Graphs",
        "description": "BFS, DFS, shortest paths, connected components and graph algorithms.",
        "problemCount": 75,
        "problems": [
            {
                "name": "Number of Islands",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/number-of-islands/",
            },
            {
                "name": "Clone Graph",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/clone-graph/",
            },
            {
                "name": "Course Schedule",
                "difficulty": "Medium",
                "leetcode": "https://leetcode.com/problems/course-schedule/",
            },
            {
                "name": "Word Ladder",
                "difficulty": "Hard",
                "leetcode": "https://leetcode.com/problems/word-ladder/",
            },
        ],
    },
]


@router.get("", response_model=list[schemas.TopicOut])
def get_topics(
    search: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Fetch all DSA topics and problems, applying search/difficulty filtering if specified."""
    db_topics = db.query(models.DSATopic).all()

    if not db_topics:
        # Fallback to structured static data if database is not yet seeded
        result = []
        for topic in DEFAULT_DSA_TOPICS:
            filtered_problems = []
            for prob in topic["problems"]:
                if search and search.lower() not in prob["name"].lower():
                    continue
                if difficulty and difficulty != "All" and prob["difficulty"].lower() != difficulty.lower():
                    continue
                filtered_problems.append(prob)
            
            result.append(
                {
                    "icon": topic["icon"],
                    "title": topic["title"],
                    "description": topic["description"],
                    "problemCount": topic["problemCount"],
                    "problems": filtered_problems,
                }
            )
        return result

    result = []
    for topic in db_topics:
        prob_query = db.query(models.Resource).filter(models.Resource.topic_id == topic.id)
        if difficulty and difficulty != "All":
            prob_query = prob_query.filter(models.Resource.difficulty == difficulty)
        
        problems = prob_query.all()
        prob_list = []
        for p in problems:
            if search and search.lower() not in p.title.lower():
                continue
            prob_list.append(
                {
                    "id": p.id,
                    "name": p.title,
                    "difficulty": p.difficulty,
                    "leetcode": p.leetcode_url,
                }
            )

        result.append(
            {
                "id": topic.id,
                "icon": topic.icon,
                "title": topic.title,
                "description": topic.description,
                "problemCount": topic.problem_count,
                "problems": prob_list,
            }
        )

    return result


@router.get("/solved", response_model=list[str])
def get_solved_resources(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get list of solved problem titles for the current user."""
    solved = (
        db.query(models.UserSolvedResource.resource_title)
        .filter(models.UserSolvedResource.user_id == current_user.id)
        .all()
    )
    return [s[0] for s in solved]


@router.post("/toggle-solved", response_model=schemas.ToggleSolvedResponse)
def toggle_solved_resource(
    body: schemas.ToggleSolvedRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle a resource/problem as solved or unsolved for current user."""
    existing = (
        db.query(models.UserSolvedResource)
        .filter(
            models.UserSolvedResource.user_id == current_user.id,
            models.UserSolvedResource.resource_title == body.title,
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        is_solved = False
    else:
        new_solved = models.UserSolvedResource(
            user_id=current_user.id,
            resource_title=body.title,
        )
        db.add(new_solved)
        db.commit()
        is_solved = True

    all_solved = (
        db.query(models.UserSolvedResource.resource_title)
        .filter(models.UserSolvedResource.user_id == current_user.id)
        .all()
    )
    solved_titles = [s[0] for s in all_solved]

    return {
        "title": body.title,
        "is_solved": is_solved,
        "solved_titles": solved_titles,
    }


# ---------- Admin CRUD Endpoints ----------

@router.post("", status_code=status.HTTP_201_CREATED)
def create_resource(
    body: schemas.ProblemOut,
    topic_title: str = "Arrays",
    current_user: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    topic = db.query(models.DSATopic).filter(models.DSATopic.title == topic_title).first()
    resource = models.Resource(
        topic_id=topic.id if topic else None,
        topic_title=topic_title,
        title=body.name,
        difficulty=body.difficulty,
        leetcode_url=body.leetcode,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return {"message": "Resource created successfully", "id": resource.id}


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    current_user: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
    return {"message": "Resource deleted successfully"}
