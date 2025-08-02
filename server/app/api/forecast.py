from fastapi import APIRouter, Depends, HTTPException, Request
from app.db.connection import get_connection
from app.models.schemas import ForecastDataOut
from datetime import datetime, timedelta
from collections import defaultdict
import calendar

router = APIRouter()

@router.get("/forecast", response_model=list[ForecastDataOut])
def get_forecast(request: Request, conn=Depends(get_connection)):
    user_id = request.headers.get("user-id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user_id in headers")

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT date, amount, type
            FROM transactions
            WHERE user_id = %s
        """, (user_id,))
        rows = cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    if not rows:
        raise HTTPException(status_code=404, detail="No transaction data found")

    monthly = defaultdict(lambda: {"income": 0, "expenses": 0})

    for row in rows:
        date_str, amount, txn_type = row
        if isinstance(date_str, str):
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        else:
            date = date_str

        key = date.strftime("%Y-%m")
        if txn_type == "credit":
            monthly[key]["income"] += amount
        elif txn_type == "debit":
            monthly[key]["expenses"] += amount

    total_months = len(monthly)
    if total_months == 0:
        raise HTTPException(status_code=404, detail="No valid transactions found")

    avg_income = sum(m["income"] for m in monthly.values()) / total_months
    avg_expenses = sum(m["expenses"] for m in monthly.values()) / total_months

    forecast = []
    today = datetime.today()

    for i in range(4):
        future = today.replace(day=1) + timedelta(days=32 * i)
        month_name = calendar.month_abbr[future.month]
        year = future.year

        income = round(avg_income, 2)
        expenses = round(avg_expenses, 2)
        savings = round(income + expenses, 2)

        forecast.append({
            "month": f"{month_name} {year}",
            "income": income,
            "expenses": expenses,
            "savings": savings
        })

    return forecast
