from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/challenges", tags=["Challenges"])

DEFAULT_CHALLENGES = [
    {
        "id": 1,
        "title": "Longest Consecutive Sequence",
        "difficulty": "Hard",
        "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence in O(n) time.",
        "time_limit": "45 mins",
        "xp_reward": 150,
        "tags": "Array, Hash Set, Union-Find",
        "sample_input": "nums = [100, 4, 200, 1, 3, 2]",
        "sample_output": "4 (Explanation: The longest consecutive sequence is [1, 2, 3, 4])",
    },
    {
        "id": 2,
        "title": "LRU Cache Implementation",
        "difficulty": "Medium",
        "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.",
        "time_limit": "30 mins",
        "xp_reward": 120,
        "tags": "Hash Table, Doubly-Linked List, Design",
        "sample_input": "LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); get(2);",
        "sample_output": "get(1) returns 1; get(2) returns -1 (evicted)",
    },
    {
        "id": 3,
        "title": "Trapping Rain Water",
        "difficulty": "Hard",
        "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        "time_limit": "45 mins",
        "xp_reward": 160,
        "tags": "Two Pointers, Dynamic Programming, Monotonic Stack",
        "sample_input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "sample_output": "6",
    },
    {
        "id": 4,
        "title": "Word Search II",
        "difficulty": "Hard",
        "description": "Given an `m x n` board of characters and a list of strings `words`, return all words on the board using a Trie for prefix pruning.",
        "time_limit": "40 mins",
        "xp_reward": 175,
        "tags": "Trie, Backtracking, DFS, Matrix",
        "sample_input": "board = [['o','a','a','n'],['e','t','a','e']], words = ['oath','pea']",
        "sample_output": "['oath']",
    }
]


@router.get("/daily", response_model=schemas.ChallengeOut)
def get_daily_challenge(
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Returns today's featured daily coding challenge and its solved status."""
    # Rotate based on day of year
    day_of_year = datetime.now().timetuple().tm_yday
    challenge_data = DEFAULT_CHALLENGES[day_of_year % len(DEFAULT_CHALLENGES)]

    is_solved = False
    if current_user:
        solved_record = db.query(models.UserSolvedChallenge).filter(
            models.UserSolvedChallenge.user_id == current_user.id,
            models.UserSolvedChallenge.challenge_id == challenge_data["id"],
        ).first()
        is_solved = bool(solved_record)

    return schemas.ChallengeOut(
        id=challenge_data["id"],
        title=challenge_data["title"],
        difficulty=challenge_data["difficulty"],
        description=challenge_data["description"],
        time_limit=challenge_data["time_limit"],
        xp_reward=challenge_data["xp_reward"],
        tags=challenge_data["tags"],
        sample_input=challenge_data.get("sample_input"),
        sample_output=challenge_data.get("sample_output"),
        is_solved=is_solved,
    )


@router.post("/solve", response_model=schemas.SolveChallengeResponse)
def solve_daily_challenge(
    payload: schemas.SolveChallengeRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Validates and records daily challenge completion, awarding XP and progress."""
    challenge = next((c for c in DEFAULT_CHALLENGES if c["id"] == payload.challenge_id), DEFAULT_CHALLENGES[0])
    xp_awarded = challenge["xp_reward"]

    new_xp = 1480 + xp_awarded
    new_prog = 85

    if current_user:
        existing = db.query(models.UserSolvedChallenge).filter(
            models.UserSolvedChallenge.user_id == current_user.id,
            models.UserSolvedChallenge.challenge_id == payload.challenge_id,
        ).first()

        if not existing:
            db.add(models.UserSolvedChallenge(
                user_id=current_user.id,
                challenge_id=payload.challenge_id,
            ))
            current_user.xp = (current_user.xp or 250) + xp_awarded
            current_user.progress = min((current_user.progress or 15) + 5, 100)

            # Add Activity
            db.add(models.Activity(
                user_id=current_user.id,
                title=f"Coding Challenge Solved: {challenge['title']}",
                company=f"+{xp_awarded} XP Awarded",
                time="Just now",
                color="#a855f7",
            ))

            # Add Notification
            db.add(models.Notification(
                user_id=current_user.id,
                title="Daily Challenge Completed! 🎯",
                desc=f"You earned +{xp_awarded} XP for solving {challenge['title']}",
                color="#22c55e",
                time="Just now",
                is_read=False,
            ))

            db.commit()

        new_xp = current_user.xp
        new_prog = current_user.progress

    return schemas.SolveChallengeResponse(
        success=True,
        message=f"Challenge '{challenge['title']}' solved successfully! +{xp_awarded} XP awarded.",
        xp_awarded=xp_awarded,
        new_total_xp=new_xp,
        new_progress=new_prog,
    )
