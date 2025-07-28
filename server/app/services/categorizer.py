import io
import csv
import pdfplumber
import json
import os
from typing import List, Dict

# Absolute path to category_map.json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CATEGORY_FILE = os.path.join(BASE_DIR, "../../../common/category_map.json")

# Load category map once
with open(CATEGORY_FILE, "r", encoding="utf-8") as f:
    CATEGORY_MAP = json.load(f)


def categorize(description: str) -> str:
    desc = description.lower()
    for keyword, category in CATEGORY_MAP.items():
        if keyword.lower() in desc:
            return category
    return "Uncategorized"


def parse_csv_transactions(file_bytes: bytes) -> List[Dict]:
    transactions = []
    try:
        decoded = file_bytes.decode()
        reader = csv.DictReader(io.StringIO(decoded))
        for row in reader:
            try:
                date = row["date"]
                description = row["description"]
                amount = float(row["amount"])
                txn_type = "debit" if amount < 0 else "credit"
                category = categorize(description)

                transactions.append({
                    "date": date,
                    "description": description,
                    "amount": amount,
                    "type": txn_type,
                    "category": category
                })
            except (KeyError, ValueError):
                continue  # Skip bad rows
    except Exception as e:
        raise ValueError(f"Failed to parse CSV: {str(e)}")
    
    return transactions


def parse_pdf_transactions(file_bytes: bytes) -> List[Dict]:
    transactions = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                table = page.extract_table()
                if not table:
                    continue
                for row in table[1:]:  # Skip headers
                    try:
                        date = row[0]
                        description = row[1]
                        amount = float(
                            row[2]
                            .replace(",", "")
                            .replace("₹", "")
                            .replace("Rs.", "")
                            .strip()
                        )
                        txn_type = "debit" if amount < 0 else "credit"
                        category = categorize(description)

                        transactions.append({
                            "date": date,
                            "description": description,
                            "amount": amount,
                            "type": txn_type,
                            "category": category
                        })
                    except (IndexError, ValueError):
                        continue  # Skip malformed rows
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")

    return transactions
