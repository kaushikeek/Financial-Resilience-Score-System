from fastapi import APIRouter, Query
from app.db.connection import get_connection
from app.models.schemas import TransactionOut
from typing import List

router = APIRouter()

@router.get("/transactions", response_model=List[TransactionOut])
def get_transactions(user_id: str = Query(...)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, user_id, date, description, amount, type, category
        FROM transactions
        WHERE user_id = %s
        ORDER BY date DESC
    """, (user_id,))
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Map rows to list of dicts
    transactions = []
    for row in rows:
        transactions.append({
            "id": row[0],
            "user_id": row[1],
            "date": row[2],
            "description": row[3],
            "amount": row[4],
            "type": row[5],
            "category": row[6]
        })

    return transactions
