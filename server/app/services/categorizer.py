import json
import re
import os

CATEGORY_FILE = os.path.join("common", "category_map.json")

with open(CATEGORY_FILE) as f:
    CATEGORY_MAP = json.load(f)

def categorize(description: str) -> str:
    desc = description.lower()
    for keyword, category in CATEGORY_MAP.items():
        if re.search(keyword, desc):
            return category
    return "Uncategorized"
