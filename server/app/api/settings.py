from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
from app.models.schemas import SettingsIn, SettingsOut
import os

router = APIRouter(prefix="/settings", tags=["Settings"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role for full access
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/{user_id}", response_model=SettingsOut)
def get_settings(user_id: str):
    response = supabase.table("settings").select("*").eq("user_id", user_id).limit(1).execute()
    data = response.data

    if not data:
        return {"email_notifications": True, "dark_mode": False}  # default values

    return data[0]

@router.put("/{user_id}")
def update_settings(user_id: str, payload: SettingsIn):
    response = supabase.table("settings").upsert({
        "user_id": user_id,
        "email_notifications": payload.email_notifications,
        "dark_mode": payload.dark_mode
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update settings")

    return {"message": "Settings updated successfully"}
