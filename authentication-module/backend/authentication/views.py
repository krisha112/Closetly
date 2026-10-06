import os
import json
import secrets
import hashlib
import re

import jwt
import resend

from datetime import datetime, timedelta, timezone

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password

from bson import ObjectId

from .mongodb import users_collection, password_reset_tokens


# =========================================================
# RESEND CONFIGURATION
# =========================================================

resend.api_key = settings.RESEND_API_KEY


# =========================================================
# CREATE RESET TOKEN
# =========================================================

def create_reset_token():

    token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        token.encode()
    ).hexdigest()

    return token, token_hash


# =========================================================
# REGISTER USER
# =========================================================

@csrf_exempt
def register_user(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        full_name = data.get(
            "fullName",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        confirm_password = data.get(
            "confirmPassword",
            ""
        )

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if (
            not full_name
            or not email
            or not password
            or not confirm_password
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "All fields are required."
                },
                status=400
            )

        if len(password) < 8:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Password must be at least 8 characters long."
                },
                status=400
            )

        if password != confirm_password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Passwords do not match."
                },
                status=400
            )

        if (
            "@" not in email
            or "." not in email.split("@")[-1]
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Please enter a valid email address."
                },
                status=400
            )

        # -------------------------------------------------
        # CHECK DUPLICATE EMAIL
        # -------------------------------------------------

        existing_user = users_collection.find_one(
            {
                "email": email
            }
        )

        if existing_user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Email is already registered."
                },
                status=409
            )

        # -------------------------------------------------
        # CREATE USER
        # -------------------------------------------------

        current_time = datetime.now(
            timezone.utc
        )

        user = {
            "fullName": full_name,
            "email": email,
            "password": make_password(password),
            "profilePicture": None,
            "pronouns": "",
            "createdAt": current_time,
            "updatedAt": current_time
        }

        result = users_collection.insert_one(
            user
        )

        # -------------------------------------------------
        # CREATE JWT TOKEN
        # -------------------------------------------------

        payload = {
            "userId": str(result.inserted_id),
            "email": email,
            "exp": datetime.now(
                timezone.utc
            ) + timedelta(days=7)
        }

        token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        # -------------------------------------------------
        # SUCCESS RESPONSE
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,
                "message": "Registration successful.",
                "token": token,

                "user": {
                    "userId": str(result.inserted_id),
                    "fullName": full_name,
                    "email": email,
                    "profilePicture": None,
                    "pronouns": ""
                }
            },
            status=201
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Registration error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )


# =========================================================
# FORGOT PASSWORD
# =========================================================

@csrf_exempt
def forgot_password(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        email = data.get(
            "email",
            ""
        ).strip().lower()

        if not email:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Email is required."
                },
                status=400
            )

        # -------------------------------------------------
        # FIND USER
        # -------------------------------------------------

        user = users_collection.find_one(
            {
                "email": email
            }
        )

        if not user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "No account found with this email address."
                },
                status=404
            )

        # -------------------------------------------------
        # CREATE SECURE RESET TOKEN
        # -------------------------------------------------

        token, token_hash = create_reset_token()

        # Remove previous reset tokens
        password_reset_tokens.delete_many(
            {
                "userId": user["_id"]
            }
        )

        # Store hashed token
        password_reset_tokens.insert_one(
            {
                "userId": user["_id"],
                "tokenHash": token_hash,
                "expiresAt": datetime.now(
                    timezone.utc
                ) + timedelta(minutes=15),
                "used": False,
                "createdAt": datetime.now(
                    timezone.utc
                )
            }
        )

        # -------------------------------------------------
        # CREATE RESET LINK
        # -------------------------------------------------

        reset_link = (
            "http://localhost:4200/reset-password"
            f"?token={token}"
        )

        # -------------------------------------------------
        # EMAIL HTML
        # -------------------------------------------------

        email_html = f"""
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Reset Your Closetly Password</title>
</head>

<body style="
    margin: 0;
    padding: 20px;
    background-color: #FFF9F3;
    font-family: Arial, sans-serif;
    color: #443223;
">

    <div style="
        max-width: 500px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 8px;
    ">

        <h1 style="
            margin: 0 0 16px 0;
            font-size: 22px;
            color: #443223;
        ">
            Reset Your Closetly Password
        </h1>

        <p style="
            margin: 0 0 10px 0;
        ">
            Hello {user['fullName']},
        </p>

        <p style="
            margin: 0 0 10px 0;
        ">
            We received a request to reset your Closetly password.
        </p>

        <p style="
            margin: 0 0 14px 0;
        ">
            Click the button below to create a new password:
        </p>

        <a href="{reset_link}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #443223;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 14px;
        ">
            Reset Password
        </a>

        <p style="
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #7C7960;
        ">
            This link will expire in 15 minutes and can only be used once.
        </p>

        <p style="
            margin: 0 0 14px 0;
            font-size: 12px;
        ">
            If you did not request a password reset, you can safely ignore this email.
        </p>

        <p style="
            margin: 0;
            font-size: 13px;
        ">
            — Closetly Team
        </p>

    </div>

</body>

</html>
"""

        # -------------------------------------------------
        # SEND EMAIL
        # -------------------------------------------------

        resend.Emails.send(
            {
                "from": "Closetly <onboarding@resend.dev>",
                "to": [email],
                "subject": "Reset Your Closetly Password",
                "html": email_html
            }
        )

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,
                "message": "Password reset link has been sent to your email."
            },
            status=200
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Forgot password error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )


# =========================================================
# LOGIN USER
# =========================================================

@csrf_exempt
def login_user(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not email or not password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Email and password are required."
                },
                status=400
            )

        # -------------------------------------------------
        # FIND USER
        # -------------------------------------------------

        user = users_collection.find_one(
            {
                "email": email
            }
        )

        if not user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid email or password."
                },
                status=401
            )

        # -------------------------------------------------
        # CHECK PASSWORD
        # -------------------------------------------------

        if not check_password(
            password,
            user["password"]
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid email or password."
                },
                status=401
            )

        # -------------------------------------------------
        # CREATE JWT TOKEN
        # -------------------------------------------------

        payload = {
            "userId": str(user["_id"]),
            "email": user["email"],
            "exp": datetime.now(
                timezone.utc
            ) + timedelta(days=7)
        }

        token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        # -------------------------------------------------
        # SUCCESS RESPONSE
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,
                "message": "Login successful.",
                "token": token,

                "user": {
                    "userId": str(user["_id"]),
                    "fullName": user["fullName"],
                    "email": user["email"],
                    "profilePicture": user.get(
                        "profilePicture"
                    ),
                    "pronouns": user.get(
                        "pronouns",
                        ""
                    )
                }
            },
            status=200
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Login error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )


# =========================================================
# RESET PASSWORD
# =========================================================

@csrf_exempt
def reset_password(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        token = data.get(
            "token",
            ""
        ).strip()

        new_password = data.get(
            "newPassword",
            ""
        )

        confirm_password = data.get(
            "confirmPassword",
            ""
        )

        # -------------------------------------------------
        # VALIDATE TOKEN
        # -------------------------------------------------

        if not token:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid or missing reset token."
                },
                status=400
            )

        # -------------------------------------------------
        # VALIDATE NEW PASSWORD
        # -------------------------------------------------

        if not new_password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Please enter a new password."
                },
                status=400
            )

        if len(new_password) < 8:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Password must be at least 8 characters long."
                },
                status=400
            )

        if not confirm_password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Please confirm your new password."
                },
                status=400
            )

        if new_password != confirm_password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Passwords do not match."
                },
                status=400
            )

        # -------------------------------------------------
        # HASH TOKEN
        # -------------------------------------------------

        token_hash = hashlib.sha256(
            token.encode()
        ).hexdigest()

        # -------------------------------------------------
        # FIND RESET TOKEN
        # -------------------------------------------------

        reset_record = password_reset_tokens.find_one(
            {
                "tokenHash": token_hash
            }
        )

        if not reset_record:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid or expired reset link."
                },
                status=400
            )

        # -------------------------------------------------
        # CHECK IF TOKEN WAS USED
        # -------------------------------------------------

        if reset_record.get(
            "used",
            False
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "This reset link has already been used."
                },
                status=400
            )

        # -------------------------------------------------
        # CHECK TOKEN EXPIRY
        # -------------------------------------------------

        expires_at = reset_record.get(
            "expiresAt"
        )

        if not expires_at:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid reset link."
                },
                status=400
            )

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(
                tzinfo=timezone.utc
            )

        if datetime.now(
            timezone.utc
        ) > expires_at:

            return JsonResponse(
                {
                    "success": False,
                    "message": "This reset link has expired."
                },
                status=400
            )

        # -------------------------------------------------
        # GET USER
        # -------------------------------------------------

        user_id = reset_record.get(
            "userId"
        )

        user = users_collection.find_one(
            {
                "_id": user_id
            }
        )

        if not user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User account not found."
                },
                status=404
            )

        # -------------------------------------------------
        # PREVENT SAME PASSWORD
        # -------------------------------------------------

        if check_password(
            new_password,
            user.get(
                "password",
                ""
            )
        ):

            return JsonResponse(
                {
                    "success": False,
                    "message": "New password must be different from your current password."
                },
                status=400
            )

        # -------------------------------------------------
        # UPDATE PASSWORD
        # -------------------------------------------------

        current_time = datetime.now(
            timezone.utc
        )

        users_collection.update_one(
            {
                "_id": user_id
            },
            {
                "$set": {
                    "password": make_password(
                        new_password
                    ),
                    "updatedAt": current_time
                }
            }
        )

        # -------------------------------------------------
        # MARK TOKEN AS USED
        # -------------------------------------------------

        password_reset_tokens.update_one(
            {
                "_id": reset_record["_id"]
            },
            {
                "$set": {
                    "used": True
                }
            }
        )

        # -------------------------------------------------
        # CREATE JWT
        # -------------------------------------------------

        payload = {
            "userId": str(user["_id"]),
            "email": user["email"],
            "exp": datetime.now(
                timezone.utc
            ) + timedelta(days=7)
        }

        jwt_token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        # -------------------------------------------------
        # SUCCESS RESPONSE
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,
                "message": "Password reset successfully.",
                "token": jwt_token,

                "user": {
                    "userId": str(user["_id"]),
                    "fullName": user.get(
                        "fullName",
                        ""
                    ),
                    "email": user.get(
                        "email",
                        ""
                    ),
                    "profilePicture": user.get(
                        "profilePicture"
                    ),
                    "pronouns": user.get(
                        "pronouns",
                        ""
                    )
                }
            },
            status=200
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid request data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Reset password error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Unable to reset password."
            },
            status=500
        )


# =========================================================
# GET USER PROFILE
# =========================================================

@csrf_exempt
def get_profile(request):

    if request.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "message": "Only GET method is allowed."
            },
            status=405
        )

    try:

        # -------------------------------------------------
        # GET JWT TOKEN
        # -------------------------------------------------

        auth_header = request.headers.get(
            "Authorization",
            ""
        )

        if not auth_header.startswith(
            "Bearer "
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Authorization token is required."
                },
                status=401
            )

        token = auth_header.split(
            " ",
            1
        )[1]

        # -------------------------------------------------
        # VERIFY JWT
        # -------------------------------------------------

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = payload.get(
            "userId"
        )

        if not user_id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid token."
                },
                status=401
            )

        # -------------------------------------------------
        # FIND USER
        # -------------------------------------------------

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User not found."
                },
                status=404
            )

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,

                "user": {
                    "userId": str(
                        user["_id"]
                    ),

                    "fullName": user.get(
                        "fullName",
                        ""
                    ),

                    "email": user.get(
                        "email",
                        ""
                    ),

                    "profilePicture": user.get(
                        "profilePicture"
                    ),

                    "pronouns": user.get(
                        "pronouns",
                        ""
                    ),

                    "createdAt":
                        user.get(
                            "createdAt"
                        ).isoformat()
                        if user.get(
                            "createdAt"
                        )
                        else None,

                    "updatedAt":
                        user.get(
                            "updatedAt"
                        ).isoformat()
                        if user.get(
                            "updatedAt"
                        )
                        else None
                }
            },
            status=200
        )

    except jwt.ExpiredSignatureError:

        return JsonResponse(
            {
                "success": False,
                "message": "Token has expired."
            },
            status=401
        )

    except jwt.InvalidTokenError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid token."
            },
            status=401
        )

    except Exception as e:

        print(
            "Get profile error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )


# =========================================================
# UPDATE USER PROFILE
# =========================================================

@csrf_exempt
def update_profile(request):

    if request.method != "PUT":
        return JsonResponse(
            {
                "success": False,
                "message": "Only PUT method is allowed."
            },
            status=405
        )

    try:

        # -------------------------------------------------
        # GET JWT TOKEN
        # -------------------------------------------------

        auth_header = request.headers.get(
            "Authorization",
            ""
        )

        if not auth_header.startswith(
            "Bearer "
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Authorization token is required."
                },
                status=401
            )

        token = auth_header.split(
            " ",
            1
        )[1]

        # -------------------------------------------------
        # VERIFY JWT
        # -------------------------------------------------

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = payload.get(
            "userId"
        )

        if not user_id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid token."
                },
                status=401
            )

        # -------------------------------------------------
        # READ DATA
        # -------------------------------------------------

        data = json.loads(
            request.body
        )

        full_name = data.get(
            "fullName",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        ).strip().lower()

        pronouns = data.get(
            "pronouns",
            ""
        ).strip()

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not full_name or not email:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Full name and email are required."
                },
                status=400
            )

        email_pattern = (
            r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
        )

        if not re.match(
            email_pattern,
            email
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Please enter a valid email address."
                },
                status=400
            )

        # -------------------------------------------------
        # CHECK DUPLICATE EMAIL
        # -------------------------------------------------

        existing_user = users_collection.find_one(
            {
                "email": email,
                "_id": {
                    "$ne": ObjectId(user_id)
                }
            }
        )

        if existing_user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Email is already registered."
                },
                status=409
            )

        # -------------------------------------------------
        # UPDATE USER
        # -------------------------------------------------

        current_time = datetime.now(
            timezone.utc
        )

        users_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "fullName": full_name,
                    "email": email,
                    "pronouns": pronouns,
                    "updatedAt": current_time
                }
            }
        )

        # -------------------------------------------------
        # GET UPDATED USER
        # -------------------------------------------------

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        return JsonResponse(
            {
                "success": True,
                "message": "Profile updated successfully.",

                "user": {
                    "userId": str(
                        user["_id"]
                    ),

                    "fullName": user.get(
                        "fullName",
                        ""
                    ),

                    "email": user.get(
                        "email",
                        ""
                    ),

                    "profilePicture": user.get(
                        "profilePicture"
                    ),

                    "pronouns": user.get(
                        "pronouns",
                        ""
                    ),

                    "createdAt":
                        user.get(
                            "createdAt"
                        ).isoformat()
                        if user.get(
                            "createdAt"
                        )
                        else None,

                    "updatedAt":
                        user.get(
                            "updatedAt"
                        ).isoformat()
                        if user.get(
                            "updatedAt"
                        )
                        else None
                }
            },
            status=200
        )

    except jwt.ExpiredSignatureError:

        return JsonResponse(
            {
                "success": False,
                "message": "Token has expired."
            },
            status=401
        )

    except jwt.InvalidTokenError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid token."
            },
            status=401
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Update profile error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )


# =========================================================
# CHANGE PASSWORD
# =========================================================

@csrf_exempt
def change_password(request):

    if request.method != "PUT":
        return JsonResponse(
            {
                "success": False,
                "message": "Only PUT method is allowed."
            },
            status=405
        )

    try:

        # -------------------------------------------------
        # GET JWT TOKEN
        # -------------------------------------------------

        auth_header = request.headers.get(
            "Authorization",
            ""
        )

        if not auth_header.startswith(
            "Bearer "
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Authorization token is required."
                },
                status=401
            )

        token = auth_header.split(
            " ",
            1
        )[1]

        # -------------------------------------------------
        # VERIFY JWT
        # -------------------------------------------------

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = payload.get(
            "userId"
        )

        if not user_id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid token."
                },
                status=401
            )

        # -------------------------------------------------
        # READ DATA
        # -------------------------------------------------

        data = json.loads(
            request.body
        )

        current_password = data.get(
            "currentPassword",
            ""
        )

        new_password = data.get(
            "newPassword",
            ""
        )

        confirm_password = data.get(
            "confirmPassword",
            ""
        )

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if (
            not current_password
            or not new_password
            or not confirm_password
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "All password fields are required."
                },
                status=400
            )

        if len(new_password) < 8:
            return JsonResponse(
                {
                    "success": False,
                    "message": "New password must be at least 8 characters long."
                },
                status=400
            )

        if new_password != confirm_password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "New passwords do not match."
                },
                status=400
            )

        # -------------------------------------------------
        # FIND USER
        # -------------------------------------------------

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User not found."
                },
                status=404
            )

        # -------------------------------------------------
        # CHECK CURRENT PASSWORD
        # -------------------------------------------------

        if not check_password(
            current_password,
            user["password"]
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Current password is incorrect."
                },
                status=401
            )

        # -------------------------------------------------
        # PREVENT SAME PASSWORD
        # -------------------------------------------------

        if check_password(
            new_password,
            user["password"]
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "New password must be different from the current password."
                },
                status=400
            )

        # -------------------------------------------------
        # UPDATE PASSWORD
        # -------------------------------------------------

        current_time = datetime.now(
            timezone.utc
        )

        users_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "password": make_password(
                        new_password
                    ),
                    "updatedAt": current_time
                }
            }
        )

        return JsonResponse(
            {
                "success": True,
                "message": "Password changed successfully."
            },
            status=200
        )

    except jwt.ExpiredSignatureError:

        return JsonResponse(
            {
                "success": False,
                "message": "Token has expired."
            },
            status=401
        )

    except jwt.InvalidTokenError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid token."
            },
            status=401
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Change password error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )


# =========================================================
# UPDATE PROFILE PHOTO
# =========================================================

@csrf_exempt
def update_profile_photo(request):

    if request.method != "PUT":
        return JsonResponse(
            {
                "success": False,
                "message": "Only PUT method is allowed."
            },
            status=405
        )

    try:

        # -------------------------------------------------
        # GET JWT TOKEN
        # -------------------------------------------------

        auth_header = request.headers.get(
            "Authorization",
            ""
        )

        if not auth_header.startswith(
            "Bearer "
        ):
            return JsonResponse(
                {
                    "success": False,
                    "message": "Authorization token is required."
                },
                status=401
            )

        token = auth_header.split(
            " ",
            1
        )[1]

        # -------------------------------------------------
        # VERIFY JWT
        # -------------------------------------------------

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = payload.get(
            "userId"
        )

        if not user_id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid token."
                },
                status=401
            )

        # -------------------------------------------------
        # READ DATA
        # -------------------------------------------------

        data = json.loads(
            request.body
        )

        profile_picture = data.get(
            "profilePicture"
        )

        # -------------------------------------------------
        # UPDATE PHOTO
        # -------------------------------------------------

        current_time = datetime.now(
            timezone.utc
        )

        users_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "profilePicture": profile_picture,
                    "updatedAt": current_time
                }
            }
        )

        # -------------------------------------------------
        # GET UPDATED USER
        # -------------------------------------------------

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        return JsonResponse(
            {
                "success": True,
                "message": "Profile photo updated successfully.",

                "user": {
                    "userId": str(
                        user["_id"]
                    ),

                    "fullName": user.get(
                        "fullName",
                        ""
                    ),

                    "email": user.get(
                        "email",
                        ""
                    ),

                    "profilePicture": user.get(
                        "profilePicture"
                    ),

                    "pronouns": user.get(
                        "pronouns",
                        ""
                    ),

                    "createdAt":
                        user.get(
                            "createdAt"
                        ).isoformat()
                        if user.get(
                            "createdAt"
                        )
                        else None,

                    "updatedAt":
                        user.get(
                            "updatedAt"
                        ).isoformat()
                        if user.get(
                            "updatedAt"
                        )
                        else None
                }
            },
            status=200
        )

    except jwt.ExpiredSignatureError:

        return JsonResponse(
            {
                "success": False,
                "message": "Token has expired."
            },
            status=401
        )

    except jwt.InvalidTokenError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid token."
            },
            status=401
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )

    except Exception as e:

        print(
            "Update profile photo error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": "Something went wrong."
            },
            status=500
        )