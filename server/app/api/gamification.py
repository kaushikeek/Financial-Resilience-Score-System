from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from typing import List
from app.models.schemas import GamificationOut
from datetime import datetime
router = APIRouter(prefix="/gamification", tags=["Gamification"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def safe_parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except:
        return None


def calculate_gamification(score: float, transaction_count: int, transactions: List[dict], score_history: List[dict]) -> dict:
    points = int(score * 10 + transaction_count * 2)
    level = 1 + points // 100
    badges: List[str] = []

    # ---- Foundational Badges ----
    if score >= 85:
        badges.append("Resilience Master")
    if transaction_count >= 50:
        badges.append("Financial Explorer")
    if points >= 300:
        badges.append("High Achiever")

    # ---- Financial Behavior Badges ----
    total_income = 0
    total_expense = 0
    savings = 0
    debt_payments = 0
    income_sources_set = set()
    uploaded_months = set()

    for tx in transactions:
        try:
            amount = float(tx.get("amount", 0))
            t_type = tx.get("type", "").lower()
            category = tx.get("category", "").lower()
            date_str = tx.get("date", "")

            # Count unique months of upload
            dt = safe_parse_date(date_str)
            if dt:
                uploaded_months.add((dt.year, dt.month))

            if t_type == "credit":
                total_income += amount
                if category:
                    income_sources_set.add(category)
            elif t_type == "debit":
                total_expense += amount
                if "saving" in category:
                    savings += amount
                if any(term in category for term in ["loan", "debt", "emi"]):
                    debt_payments += 1
        except Exception as e:
            continue  # skip malformed transaction

    savings_ratio = savings / total_income if total_income else 0
    expense_ratio = total_expense / total_income if total_income else 1
    income_sources = len(income_sources_set)

    if savings_ratio >= 0.2:
        badges.append("Saver")
    if expense_ratio <= 0.5:
        badges.append("Smart Spender")
    if debt_payments >= 5:
        badges.append("Debt Crusher")
    if income_sources >= 3:
        badges.append("Diverse Earner")

    # ---- Score Progress Badges ----
    if len(score_history) >= 2:
        try:
            score_diff = score_history[-1]["score"] - score_history[-2]["score"]
            if score_diff > 0:
                badges.append("Score Improver")
        except:
            pass

    if len(uploaded_months) >= 3:
        badges.append("Streak Keeper")

    return {
        "level": level,
        "points": points,
        "badges": badges
    }


@router.get("/{user_id}", response_model=GamificationOut)
def get_gamification(user_id: str):
    try:
        print(f"Fetching gamification data for user: {user_id}")
        
        # Score history
        score_resp = supabase.table("scores") \
            .select("score, timestamp") \
            .eq("user_id", user_id) \
            .order("timestamp", desc=False) \
            .execute()

        if not score_resp.data:
            raise HTTPException(status_code=404, detail="Score not found")

        latest_score = score_resp.data[-1]["score"]

        # Transactions
        tx_resp = supabase.table("transactions") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()
        
        transactions = tx_resp.data or []
        transaction_count = len(transactions)

        gamification_data = calculate_gamification(
            latest_score,
            transaction_count,
            transactions,
            score_resp.data
        )

        print("Gamification data calculated:", gamification_data)
        return gamification_data

    except Exception as e:
        print("Error in /gamification route:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
