from fastapi import APIRouter, Query
from app.db.connection import get_connection
import json

router = APIRouter()

@router.get("/score")
def get_score(user_id: str = Query(...)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT score, breakdown, created_at
        FROM scores
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))
    row = cursor.fetchone()

    if row:
        score, breakdown, created_at = row
        return {
            "user_id": user_id,
            "score": score,
            "created_at": created_at,
            "breakdown": breakdown  # already stored as JSON
        }

    return {
        "user_id": user_id,
        "score": None,
        "created_at": None,
        "breakdown": None
    }
