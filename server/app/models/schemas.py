from pydantic import BaseModel, Field
from typing import List, Optional


# ----- Transaction Models -----

class TransactionBase(BaseModel):
    date: str  # In ISO or YYYY-MM-DD format
    description: str
    amount: float
    type: str  # "credit" or "debit"
    category: str


class TransactionIn(TransactionBase):
    user_id: str  # For insert operations


class TransactionOut(TransactionBase):
    id: Optional[int] = None  # From DB if fetched
    user_id: str


# ----- Upload Response Model -----

class UploadResponse(BaseModel):
    status: str = "success"
    rows: int
    transactions: Optional[List[TransactionOut]] = None


# ----- Score Model -----

class ScoreOut(BaseModel):
    user_id: str
    score: float
    grade: str
    updated_at: Optional[str] = None


# ----- Forecast Model -----

class ForecastPoint(BaseModel):
    month: str
    projected_score: float


class ForecastOut(BaseModel):
    user_id: str
    forecast: List[ForecastPoint]
