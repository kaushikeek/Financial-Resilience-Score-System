

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # Loads from server/.env


print("DB URL:", os.getenv("SUPABASE_DB_URL"))


def get_connection():
    return psycopg2.connect(os.getenv("SUPABASE_DB_URL"))



