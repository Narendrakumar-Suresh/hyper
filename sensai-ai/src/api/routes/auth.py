from fastapi import APIRouter, Depends, HTTPException
from typing import Dict
from api.db.user import insert_or_return_user
from api.utils.db import get_new_db_connection
from api.models import UserLoginData
from google.oauth2 import id_token
from google.auth.transport import requests
from api.settings import settings

router = APIRouter()

@router.post("/login")
async def login_or_signup_user(user_data: UserLoginData) -> Dict:
    try:
        if not settings.google_client_id:
            raise HTTPException(
                status_code=500, detail="Google Client ID not configured"
            )

        # Verify the token
        id_info = id_token.verify_oauth2_token(
            user_data.id_token, requests.Request(), settings.google_client_id
        )

        # Validate email
        if id_info["email"] != user_data.email:
            raise HTTPException(
                status_code=401, detail="Email in token doesn't match provided email"
            )

        # ✅ Extract Google user ID (sub)
        google_user_id = id_info["sub"]

    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    # ✅ Call with correct order: cursor, email, user_id, given_name, family_name
    async with get_new_db_connection() as conn:
        cursor = await conn.cursor()
        user = await insert_or_return_user(
            cursor=cursor,
            email=user_data.email,
            user_id=google_user_id,  # ← Correct: pass sub
            given_name=user_data.given_name,
            family_name=user_data.family_name,
        )
        await conn.commit()

    return user