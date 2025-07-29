import io
from fastapi import APIRouter, File, UploadFile, Form
import pandas as pd
from datetime import datetime
from app.services.categorizer import categorize
from app.db.connection import get_connection
import json

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user_id: str = Form(...)):
    print("🔥 /api/upload hit")

    try:
        if not file.filename.endswith(".csv"):
            print("❌ Invalid file format:", file.filename)
            return {"error": "Only CSV files are supported at this stage."}

        print(f"[INFO] Reading file: {file.filename}")
        content = await file.read()

        try:
            df = pd.read_csv(io.StringIO(content.decode()))
            print(f"[INFO] CSV Read Success. Total rows: {len(df)}")
        except Exception as csv_err:
            print(f"[ERROR] Failed to read CSV: {csv_err}")
            return {"error": "Failed to parse CSV file."}

        required_columns = {"date", "description", "amount"}
        if not required_columns.issubset(df.columns):
            print("❌ Missing required columns in CSV")
            return {"error": "Missing one or more required columns: date, description, amount"}

        conn = get_connection()
        cursor = conn.cursor()
        inserted_rows = 0

        print("[INFO] Starting transaction insertion...")
        for index, row in df.iterrows():
            try:
                description = str(row["description"]).strip()
                amount = float(row["amount"])
                date = pd.to_datetime(row["date"]).date()
                txn_type = "debit" if amount < 0 else "credit"
                category = categorize(description)

                cursor.execute("""
                    INSERT INTO transactions (user_id, date, description, amount, type, category)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, date, description, amount, txn_type, category))

                inserted_rows += 1

            except Exception as row_error:
                print(f"[WARN] Row {index} skipped: {row_error}")
                continue

        conn.commit()
        print(f"[INFO] ✅ {inserted_rows} transactions inserted for user {user_id}")

        print("[INFO] Calculating score...")
        cursor.execute("""
            SELECT amount FROM transactions
            WHERE user_id = %s
        """, (user_id,))
        rows = cursor.fetchall()

        if not rows:
            print("[ERROR] No transactions found for score calculation")
            return {"error": "No transactions found for score calculation."}

        amounts = [row[0] for row in rows]
        income = sum(a for a in amounts if a > 0)
        expenses = sum(a for a in amounts if a < 0)
        transaction_count = len(amounts)

        savings_rate = (income + expenses) / (income + 1) * 100  # expenses are negative
        resilience_score = round(max(0, 100 + (expenses / (income + 1)) * 100), 2)
        resilience_score = float(resilience_score)

        breakdown = {
            "income": float(round(income, 2)),
            "expenses": float(round(expenses, 2)),
            "savings_rate": float(round(savings_rate, 2)),
            "transaction_count": transaction_count
        }

        print(f"[INFO] Score calculated: {resilience_score}")
        print(f"[INFO] Breakdown: {breakdown}")

        cursor.execute("""
            INSERT INTO scores (user_id, score, breakdown)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET score = EXCLUDED.score,
                breakdown = EXCLUDED.breakdown
        """, (user_id, resilience_score, json.dumps(breakdown)))

        conn.commit()
        print(f"[INFO] ✅ Score {resilience_score} inserted/updated for user {user_id}")

        cursor.close()
        conn.close()
        print("[INFO] 🔄 Upload process complete")

        return {
            "status": "success",
            "rows_inserted": int(inserted_rows),
            "calculated_score": float(resilience_score),
            "breakdown": breakdown
        }

    except Exception as e:
        print(f"[FATAL ERROR] {e}")
        return {"error": str(e)}
