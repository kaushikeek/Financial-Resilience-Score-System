from fastapi import APIRouter, Query
from app.db.connection import get_connection
import json
from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
from app.models.schemas import ScoreOut, ScoreProgress
import os


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
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

@router.get("/progress/{user_id}", response_model=ScoreProgress)
def get_score_progress(user_id: str):
    try:
        response = (
            supabase
            .table("scores")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )

        scores = response.data  # In v2, `.data` works correctly

        return {"scores": scores}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
