from fastapi import APIRouter, Query
from app.models.schemas import ForecastOut, ForecastPoint
from datetime import datetime
import random

router = APIRouter()

@router.get("/forecast", response_model=ForecastOut)
def get_forecast(user_id: str = Query(...)):
    current_month = datetime.now().month
    forecast = []

    for i in range(6):
        month = (current_month + i - 1) % 12 + 1
        forecast.append(ForecastPoint(
            month=datetime(2025, month, 1).strftime("%B"),
            projected_score=round(random.uniform(40, 100), 2)
        ))

    return {
        "user_id": user_id,
        "forecast": forecast
    }
