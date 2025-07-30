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


# ----- Score Models -----

class ScoreBase(BaseModel):
    user_id: str
    score: float
    grade: Optional[str] = None
    breakdown: Optional[dict] = None

class ScoreOut(ScoreBase):
    id: int
    created_at: str  # timestamp from DB

class ScoreProgressEntry(BaseModel):
    score: int
    breakdown: dict
    created_at: str

class ScoreProgress(BaseModel):
    scores: List[ScoreProgressEntry]


# ----- Forecast Model -----

class ForecastDataOut(BaseModel):
    month: str
    income: float
    expenses: float
    savings: float


# ----- Settings Model -----
class SettingsOut(BaseModel):
    email_notifications: bool
    dark_mode: bool

class SettingsIn(SettingsOut):
    pass


# ----- Gamification Models -----


class GamificationBase(BaseModel):
    level: int
    points: int
    badges: List[str]

class GamificationIn(GamificationBase):
    pass  # used when inserting or updating

class GamificationOut(BaseModel):
    level: int
    points: int
    badges: List[str]

