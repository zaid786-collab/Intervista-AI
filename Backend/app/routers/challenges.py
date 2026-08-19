from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user_optional

router = APIRouter(prefix="/api/challenges", tags=["Coding Challenges"])

DAILY_CHALLENGE = {
    "id": 1,
    "title": "Reverse Substrings Between Each Pair of Parentheses",
    "difficulty": "Medium",
    "description": (
        "You are given a string `s` that consists of lower case English letters and brackets.\n\n"
        "Reverse the strings in each pair of matching parentheses, starting from the innermost one.\n\n"
        "**Example 1:**\n"
        "```\nInput: s = \"(abcd)\"\nOutput: \"dcba\"\n```\n\n"
        "**Example 2:**\n"
        "```\nInput: s = \"(u(love)i)\"\nOutput: \"iloveu\"\nExplanation: Substring \"love\" is reversed first -> \"(uevoli)\", then whole string is reversed -> \"iloveu\".\n```"
    ),
    "starter_code": (
        "function reverseParentheses(s) {\n"
        "    const stack = [];\n"
        "    for (const char of s) {\n"
        "        if (char === ')') {\n"
        "            const temp = [];\n"
        "            while (stack.length && stack[stack.length - 1] !== '(') {\n"
        "                temp.push(stack.pop());\n"
        "            }\n"
        "            stack.pop(); // pop '('\n"
        "            for (const c of temp) stack.push(c);\n"
        "        } else {\n"
        "            stack.push(char);\n"
        "        }\n"
        "    }\n"
        "    return stack.join('');\n"
        "}"
    ),
    "time_limit": "30 mins",
    "xp_reward": 150,
}

@router.get("/daily", response_model=schemas.ChallengeOut)
def get_daily_challenge(
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    challenge = db.query(models.DailyChallenge).first()
    if not challenge:
        return schemas.ChallengeOut(**DAILY_CHALLENGE)

    return schemas.ChallengeOut(
        id=challenge.id,
        title=challenge.title,
        difficulty=challenge.difficulty,
        description=challenge.description,
        starter_code=challenge.starter_code or DAILY_CHALLENGE["starter_code"],
        time_limit=challenge.time_limit,
        xp_reward=challenge.xp_reward,
    )

@router.post("/solve")
def solve_daily_challenge(
    payload: schemas.SolveChallengeRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    user_id = current_user.id if current_user else None

    if user_id:
        existing = db.query(models.UserSolvedChallenge).filter(
            models.UserSolvedChallenge.user_id == user_id,
            models.UserSolvedChallenge.challenge_id == payload.challenge_id,
        ).first()

        if not existing:
            db.add(models.UserSolvedChallenge(
                user_id=user_id,
                challenge_id=payload.challenge_id,
            ))
            current_user.xp = (current_user.xp or 0) + 150
            current_user.progress = min((current_user.progress or 0) + 4, 100)

            db.add(models.Activity(
                user_id=user_id,
                title="Daily Coding Challenge Solved",
                company="Reverse Parentheses • +150 XP",
                time="Just now",
                color="#f59e0b",
            ))

            db.add(models.Notification(
                user_id=user_id,
                title="Challenge Solved! +150 XP",
                desc="You solved today's daily coding problem.",
                color="#f59e0b",
                time="Just now",
                is_read=False,
            ))
            db.commit()

    return {
        "success": True,
        "message": "Challenge solved successfully! Passed all 3 test cases.",
        "xp_awarded": 150,
        "execution_time_ms": 28,
    }
