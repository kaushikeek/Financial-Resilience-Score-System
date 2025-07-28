import io
from fastapi import APIRouter, File, UploadFile, Form
import pandas as pd
import pdfplumber
import os
from app.services.categorizer import categorize
from app.db.connection import get_connection

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user_id: str = Form(...)):
    if not file.filename.endswith(".csv"):
        return {"error": "Only CSV files are supported at this stage."}

    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode()))

    conn = get_connection()
    cursor = conn.cursor()

    for _, row in df.iterrows():
        description = str(row["description"])
        category = categorize(description)
        txn_type = "debit" if row["amount"] < 0 else "credit"

        cursor.execute("""
            INSERT INTO transactions (user_id, date, description, amount, type, category)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            user_id,
            row["date"],
            description,
            row["amount"],
            txn_type,
            category
        ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"status": "success", "rows": len(df)}
