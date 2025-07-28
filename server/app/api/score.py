from fastapi import APIRouter, Query
from app.models.schemas import ScoreOut
from datetime import datetime
import random

router = APIRouter()

@router.get("/score", response_model=ScoreOut)
def get_score(user_id: str = Query(...)):
    # TODO: In future, calculate real score from transactions
    score = round(random.uniform(0, 100), 2)
    grade = (
        "A+" if score >= 80 else
        "B" if score >= 60 else
        "C" if score >= 40 else
        "D"
    )

    return {
        "user_id": user_id,
        "score": score,
        "grade": grade,
        "updated_at": datetime.utcnow().isoformat()
    }
