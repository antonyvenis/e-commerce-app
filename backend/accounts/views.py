import requests
import random
from django.core.mail import send_mail
from django.conf import settings
import os
import re
import traceback
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.db import IntegrityError, transaction
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from .permissions import IsAdminRole
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .models import CustomUser, Like, CartItem, Order, OrderItem, OTP
from datetime import timedelta
from django.utils import timezone
from .models import Product
from django.core.mail import EmailMessage
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.units import inch
from django.http import HttpResponse
import datetime
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.core.cache import cache
from django.core.paginator import Paginator
from django.db.models import Prefetch
from django.views.decorators.cache import cache_page
# from .tasks import (
#     send_email_otp_task,
#     send_forgot_email_otp_task,
#     send_welcome_email_task
# )

# # ================================
# # 📧 SEND OTP
# # ================================
def send_email_otp(email, otp):
    try:
        url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": os.getenv("BREVO_API_KEY")
        }

        payload = {
            "sender": {
                "name": "Legend",
                "email": "antonyvenis1212@gmail.com"
            },
            "to": [
                {
                    "email": email
                }
            ],
            "subject": "⚡Legend Register OTP",

            "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
                <h1>⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡ Register 🎉</h1>

                <p>Your OTP is:</p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:5px;
                    color:#ff6600;
                    margin:20px 0;
                ">
                    {otp}
                </div>

                <p>Do not share this OTP with anyone ❌</p>

                <hr>

                <small>
                    This OTP is valid for a limited time.
                </small>
            </div>
            """
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=30
        )

        print("BREVO RESPONSE 👉", response.status_code)
        print("BREVO BODY 👉", response.text)

        if response.status_code == 201:
            print("OTP EMAIL SENT ✅")
            return True

        return False

    except Exception as e:
        print("EMAIL ERROR 👉", str(e))
        return False


@api_view(['POST'])
def send_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")
    phone = request.data.get("phone")

    if not email or not username:
        return Response({"error": "All fields required ❌"}, status=400)

    if CustomUser.objects.filter(username__iexact=username).exists():
        return Response({"error": "Username already exists ❌"}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists ❌"}, status=400)

    if phone and CustomUser.objects.filter(phone=phone).exists():
        return Response({"error": "Phone number already exists ❌"}, status=400)

    # =====================================
    # CACHE RATE LIMIT (30 SEC)
    # =====================================
    cache_key = f"otp_limit_{email}"

    if cache.get(cache_key):
        return Response(
            {"error": "Wait 30 seconds before retry ⏱️"},
            status=429
        )

    otp_obj = OTP.objects.filter(
        email=email,
        otp_type="register"
    ).first()

    now = timezone.now()

    if otp_obj and otp_obj.last_sent_at:
        if otp_obj.last_sent_at.date() != now.date():
            otp_obj.send_count = 0
            otp_obj.save()

    if otp_obj and otp_obj.send_count >= 5:
        return Response(
            {"error": "OTP limit exceeded today 🚫"},
            status=429
        )

    otp = str(
        random.randint(
            100000,
            999999
        )
    )

    OTP.objects.update_or_create(
        email=email,
        otp_type="register",
        defaults={
            "otp": otp,
            "is_verified": False,
            "last_sent_at": now,
            "send_count": (
                otp_obj.send_count + 1
                if otp_obj else 1
            )
        }
    )

    # =====================================
    # CELERY EMAIL SEND
    # =====================================
    send_email_otp(
        email,
        otp
    )

    # =====================================
    # CACHE LOCK
    # =====================================
    cache.set(
        cache_key,
        True,
        timeout=30
    )

    return Response({
        "message": "OTP sent 📧"
    })

# ================================
# 📧 WELCOME EMAIL (BREVO SMTP)
# ================================
def send_welcome_email(email, username):
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": os.getenv("BREVO_API_KEY")
        }
        payload = {
            "sender": {"name": "Legend", "email": "antonyvenis1212@gmail.com"},
            "to": [{"email": email}],
            "subject": "Welcome 🎉",
            "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
                <h1>⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡</h1>
                <h2>Welcome {username} 🎉</h2>
                <p>Your account has been created successfully 🚀</p>
                <p>Start exploring now 😍</p>
                <p>Thank You ❤️</p>
                <a href="https://e-commerce-app-food.vercel.app/">Visit Again 🚀</a>
            </div>
            """
        }
        response = requests.post(url, json=payload, headers=headers)
        print("WELCOME EMAIL 👉", response.status_code, response.text)
    except Exception as e:
        print("WELCOME EMAIL ERROR 👉", str(e))


# ================================
# 🧑 REGISTER
# ================================
@api_view(['POST'])
def register(request):
    try:
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        phone = request.data.get("phone")


        if not password:
            return Response({"error": "Password required ❌"}, status=400)
        if len(password) < 6:
            return Response({"error": "Password Min 6 characters ❌"}, status=400)
        if not re.search(r"[A-Z]", password):
            return Response({"error": "Password Add atleast 1 uppercase letter ❌"}, status=400)
        if not re.search(r"[a-z]", password):
            return Response({"error": "Password Add atleast 1 lowercase letter ❌"}, status=400)
        if not re.search(r"[0-9]", password):
            return Response({"error": "Password Add atleast 1 number ❌"}, status=400)
        if not re.search(r"[!@#$%^&*]", password):
            return Response({"error": "Password Add atleast 1 special character ❌"}, status=400)

        try:
            otp = OTP.objects.get(email=email, otp_type="register", is_verified=True)
        except OTP.DoesNotExist:
            return Response({"error": "Verify OTP first ❌"}, status=400)

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists ❌"}, status=400)
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists ❌"}, status=400)
        if phone and CustomUser.objects.filter(phone=phone).exists():
            return Response({"error": "Phone number already exists ❌"}, status=400)

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            try:
                send_welcome_email(user.email, user.username)
            except Exception as e:
                print("EMAIL ERROR 👉", str(e))
            otp.delete()
            return Response({"message": "Registered Successfully ✅"})

        print("ERROR 👉", serializer.errors)
        return Response(serializer.errors, status=400)

    except Exception as e:
        print("CRASH 👉", str(e))
        traceback.print_exc()
        return Response({"error": "Server crash ❌"}, status=500)


@api_view(['POST'])
def verify_register_otp(request):
    email = request.data.get("email")
    otp = str(request.data.get("otp")).strip()

    record = OTP.objects.filter(
        email=email,
        otp=otp,
        otp_type="register"
    ).order_by('-created_at').first()

    if not record:
        return Response({"error": "Invalid OTP ❌"}, status=400)

    sent_at = record.last_sent_at or record.created_at
    if timezone.now() - sent_at > timedelta(minutes=10):
        return Response({"error": "OTP expired ⏰"}, status=400)

    record.is_verified = True
    record.save()
    return Response({"message": "Register OTP verified ✅"})


# ================================
# ✅ VERIFY OTP
# ================================
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email").strip()
    otp = str(request.data.get("otp")).strip()
    otp_type = request.data.get("type")

    if not otp:
        return Response({"error": "Enter OTP ❌"}, status=400)

    record = OTP.objects.filter(
        email=email,
        otp_type=otp_type
    ).order_by('-created_at').first()

    if not record:
        return Response({"error": "OTP not found ❌"}, status=400)

    diff = timezone.now() - record.created_at
    if diff.total_seconds() > 300:
        return Response({"error": "OTP expired ⏰"}, status=400)

    if record.otp != otp:
        return Response({"error": "Invalid OTP ❌"}, status=400)

    record.is_verified = True
    record.save()
    return Response({"message": "OTP verified ✅"})


# # ================================
# # 🔁 FORGOT PASSWORD SEND OTP
# # ================================
def send_forgot_email_otp(email, otp):
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": os.getenv("BREVO_API_KEY")
        }
        payload = {
            "sender": {"name": "Legend", "email": "antonyvenis1212@gmail.com"},
            "to": [{"email": email}],
            "subject": "Reset Password OTP 🔐",
            "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
                <h2>Password Reset 🔐</h2>
                <p>Your ⚡𝓛𝓮𝓰𝓮𝓷𝓭⚡ OTP is:</p>
                <h1>{otp}</h1>
                <p>Do not share this OTP with anyone ❌</p>
            </div>
            """
        }
        response = requests.post(url, json=payload, headers=headers)
        print("FORGOT OTP 👉", response.status_code, response.text)
    except Exception as e:
        print("FORGOT OTP ERROR 👉", str(e))
        

@api_view(['POST'])
def forgot_password_send_otp(request):
    email = request.data.get("email", "").strip()
    username = request.data.get("username", "").strip()

    if not email or not username:
        return Response({"error": "Enter username & email ❌"}, status=400)

    if not CustomUser.objects.filter(email=email, username=username).exists():
        return Response({"error": "Invalid username or email ❌"}, status=400)

    now = timezone.now()
    today = now.date()

    last_otp = OTP.objects.filter(
        email=email,
        otp_type="forgot_password"
    ).order_by('-last_sent_at').first()

    if last_otp and last_otp.last_sent_at:
        diff = (now - last_otp.last_sent_at).total_seconds()
        if diff < 60:
            return Response({"error": f"Wait {int(60 - diff)} seconds ⏳"}, status=400)

    total_sent_today = OTP.objects.filter(
        email=email,
        otp_type="forgot_password",
        last_sent_at__date=today
    ).count()

    if total_sent_today >= 5:
        return Response({"error": "Too many OTP requests today ❌"}, status=400)

    otp = str(random.randint(100000, 999999))

    OTP.objects.create(
        email=email,
        otp=otp,
        otp_type="forgot_password",
        is_verified=False,
        last_sent_at=now
    )

    send_forgot_email_otp(email, otp)
    return Response({"message": "OTP sent 📧"})


# ================================
# 🔒 RESET PASSWORD
# ================================
@api_view(['POST'])
def reset_password(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email:
        return Response({"error": "Email required ❌"}, status=400)
    if not password:
        return Response({"error": "Password required ❌"}, status=400)
    if len(password) < 6:
        return Response({"error": "Password Min 6 characters ❌"}, status=400)
    if not re.search(r"[A-Z]", password):
        return Response({"error": "Add 1 uppercase ❌"}, status=400)
    if not re.search(r"[a-z]", password):
        return Response({"error": "Add 1 lowercase ❌"}, status=400)
    if not re.search(r"[0-9]", password):
        return Response({"error": "Add 1 number ❌"}, status=400)
    if not re.search(r"[!@#$%^&*]", password):
        return Response({"error": "Add special character ❌"}, status=400)

    otp = OTP.objects.filter(
        email=email,
        otp_type="forgot_password",
        is_verified=True
    ).order_by('-created_at').first()

    if not otp:
        return Response({"error": "Verify OTP first ❌"}, status=400)

    try:
        user = CustomUser.objects.get(email=email)
        user.set_password(password)
        user.save()
        otp.delete()
        return Response({"message": "Password updated ✅"})
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found ❌"}, status=404)


# ================================
# 🔐 AUTH HELPERS (JWT)
# ================================
class AuthThrottle(AnonRateThrottle):
    """Login / Google login: max N tries per minute per IP (rate in settings: auth)."""
    scope = "auth"


def _auth_payload(user, message="Login Success"):
    refresh = RefreshToken.for_user(user)
    return {
        "message": message,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
        "email": user.email,
        "role": "admin" if user.is_admin_role else user.role,
        "is_staff": user.is_staff,
        "image": user.image if user.image and len(user.image) < 500 else None,
    }


def _verify_google_token(token):
    """Returns Google's verified claims for an ID token. Raises ValueError if invalid."""
    client_id = getattr(settings, "GOOGLE_CLIENT_ID", "")
    if not client_id:
        raise ValueError("Google login is not configured")
    return google_id_token.verify_oauth2_token(
        token, google_requests.Request(), client_id
    )


# ================================
# 🔑 LOGIN (email + password -> JWT)
# ================================
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AuthThrottle]

    def post(self, request):
        identifier = str(
            request.data.get("email") or request.data.get("username") or ""
        ).strip()
        password = request.data.get("password") or ""

        if not identifier or not password:
            return Response({"error": "Enter email & password ⚠️"}, status=400)

        account = (
            CustomUser.objects.filter(email__iexact=identifier).first()
            or CustomUser.objects.filter(username__iexact=identifier).first()
        )
        user = (
            authenticate(request, username=account.username, password=password)
            if account else None
        )

        if not user:
            return Response({"error": "Invalid email or password ❌"}, status=400)

        return Response(_auth_payload(user))


# ================================
# 🔵 GOOGLE LOGIN (Google ID token -> JWT)
# ================================
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthThrottle])
def google_login(request):
    credential = request.data.get("credential")
    if not credential:
        return Response({"error": "Google token missing ❌"}, status=400)

    try:
        info = _verify_google_token(credential)
    except ValueError:
        return Response({"error": "Google sign-in failed ❌"}, status=401)

    email = (info.get("email") or "").strip().lower()
    if not email or not info.get("email_verified"):
        return Response({"error": "Google email is not verified ❌"}, status=400)

    user = CustomUser.objects.filter(email__iexact=email).first()

    if not user:
        base = re.sub(r"[^A-Za-z0-9_.]", "", info.get("name") or email.split("@")[0])[:30] or "user"
        username, n = base, 1
        while CustomUser.objects.filter(username__iexact=username).exists():
            username = f"{base}{n}"
            n += 1
        user = CustomUser(username=username, email=email, image=info.get("picture"))
        user.set_unusable_password()
        user.save()

    return Response(_auth_payload(user))


# ================================
# 🚪 LOGOUT (blacklist the refresh token)
# ================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        RefreshToken(request.data.get("refresh")).blacklist()
    except TokenError:
        pass
    return Response({"message": "Logged out ✅"})


# ================================
# 👤 PROFILE
# ================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "image": user.image,
        "role": "admin" if user.is_admin_role else user.role,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    image = request.data.get("image", user.image)
    if image and len(str(image)) > 200_000:
        return Response({"error": "Photo is too large. Use a smaller image. ❌"}, status=400)

    user.email = request.data.get("email", user.email)
    user.phone = request.data.get("phone", user.phone) or None
    user.image = image
    try:
        user.save()
    except IntegrityError:
        return Response({"error": "Email or phone already used ❌"}, status=400)
    return Response({"message": "Profile updated ✅"})


# ================================
# ❤️ LIKES
# ================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_like(request):
    user = request.user
    item_id = request.data.get("id")

    if Like.objects.filter(user=user, product_id=item_id).exists():
        return Response({"message": "Already liked"})

    try:
        product = Product.objects.get(id=item_id)
    except (Product.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Product not found"}, status=404)

    Like.objects.create(
        user=user,
        item_name=product.name,
        image=(product.image.url if product.image else ""),
        price=product.price,
        product_id=product.id
    )
    cache.delete(f"likes_{user.username}")
    return Response({"message": "Liked ❤️"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_likes(request):
    user = request.user
    cache_key = f"likes_{user.username}"

    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return Response(cached_data)

    likes = list(Like.objects.filter(user=user))
    products = Product.objects.in_bulk([like.product_id for like in likes])

    data = []
    for like in likes:
        product = products.get(like.product_id)
        if not product:
            continue
        data.append({
            "id": product.id,
            "item_name": product.name,
            "image": product.image.url if product.image else "",
            "price": product.price,
            "offer": product.offer,
            "category": product.category,
            "rating": product.rating,
            "is_active": product.is_active
        })

    cache.set(cache_key, data, timeout=300)
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_like(request):
    user = request.user
    Like.objects.filter(user=user, product_id=request.data.get("id")).delete()
    cache.delete(f"likes_{user.username}")
    return Response({"message": "Removed ❤️"})


# ================================
# 🛒 CART
# ================================
def _final_price(product):
    price = float(product.price)
    offer = product.offer or 0
    if offer > 0:
        price = price - (price * offer / 100)
    return round(price, 2)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user

    try:
        product = Product.objects.get(id=request.data.get("product_id"))
    except (Product.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Product not found"}, status=404)

    final_price = _final_price(product)

    try:
        qty = int(request.data.get("quantity", 1))
    except (TypeError, ValueError):
        qty = 1
    qty = max(1, min(qty, 50))

    item, created = CartItem.objects.get_or_create(
        user=user,
        product_id=product.id,
        defaults={
            "item_name": product.name,
            "price": final_price,
            "quantity": qty,
            "image": product.image.url if product.image else ""
        }
    )

    if not created:
        item.quantity = min(item.quantity + qty, 50)
        item.price = final_price
        item.save()

    cache.delete(f"cart_{user.username}")
    return Response({"message": "Added 🛒"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    user = request.user
    cache_key = f"cart_{user.username}"

    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return Response(cached_data)

    cart = list(CartItem.objects.filter(user=user))
    products = Product.objects.in_bulk([c.product_id for c in cart])

    data = []
    for c in cart:
        product = products.get(c.product_id)
        if not product:
            continue

        data.append({
            "id": c.id,
            "product_id": product.id,
            "item_name": product.name,
            "original_price": round(float(product.price), 2),
            "price": _final_price(product),
            "quantity": c.quantity,
            "image": product.image.url if product.image else "",
            "rating": product.rating,
            "category": product.category,
            "offer": product.offer or 0
        })

    cache.set(cache_key, data, timeout=300)
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_cart(request):
    user = request.user
    CartItem.objects.filter(id=request.data.get("id"), user=user).delete()
    cache.delete(f"cart_{user.username}")
    return Response({"message": "Removed ❌"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_quantity(request):
    user = request.user
    try:
        qty = int(request.data.get("quantity"))
    except (TypeError, ValueError):
        return Response({"error": "Invalid quantity"}, status=400)

    if qty < 1:
        return Response({"error": "Minimum 1 required"}, status=400)

    item = get_object_or_404(CartItem, id=request.data.get("id"), user=user)
    item.quantity = qty
    item.save()
    cache.delete(f"cart_{user.username}")
    return Response({"message": "Updated 🔢"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    user = request.user
    CartItem.objects.filter(user=user).delete()
    cache.delete(f"cart_{user.username}")
    return Response({"message": "Cart cleared 🧹"})


# ================================
# 📦 PLACE ORDER
# Prices are ALWAYS taken from the database (never from the browser),
# so nobody can edit a request and pay Rs.1 for a Rs.300 dish.
# ================================
def _order_lines(user, posted_items):
    """
    [(product, quantity, unit_price)].
    Items the browser posts decide WHAT is ordered (so "Buy now" orders only that dish),
    but the PRICE always comes from the database. With nothing posted, the server cart is used.
    """
    def clean_qty(value):
        try:
            qty = int(value)
        except (TypeError, ValueError):
            return 0
        return qty if 1 <= qty <= 50 else 0

    lines = []

    if posted_items:
        for item in posted_items:
            if not isinstance(item, dict):
                continue

            product = None
            try:
                product_id = int(item.get("product_id"))
            except (TypeError, ValueError):
                product_id = None

            if product_id is not None:
                product = Product.objects.filter(id=product_id, is_active=True).first()
            if product is None and item.get("item_name"):
                product = Product.objects.filter(name=item.get("item_name"), is_active=True).first()

            qty = clean_qty(item.get("quantity", 1))
            if product and qty:
                lines.append((product, qty, _final_price(product)))
        return lines

    cart_items = list(CartItem.objects.filter(user=user))
    products = Product.objects.in_bulk([c.product_id for c in cart_items])
    for c in cart_items:
        product = products.get(c.product_id)
        qty = clean_qty(c.quantity)
        if product and product.is_active and qty:
            lines.append((product, qty, _final_price(product)))
    return lines


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    lines = _order_lines(user, request.data.get("items"))

    if not lines:
        return Response({"error": "Cart empty ❌"}, status=400)

    subtotal = sum(unit_price * qty for _, qty, unit_price in lines)
    tax_amount = subtotal * 0.05
    delivery = 0 if subtotal > 199 else 40
    grand_total = subtotal + tax_amount + delivery

    with transaction.atomic():
        order = Order.objects.create(
            user=user,
            total_price=round(grand_total, 2),
            address=request.data.get("address"),
            phone=request.data.get("phone"),
            payment_method=request.data.get("payment_method"),
            name=request.data.get("name")
        )

        for product, qty, unit_price in lines:
            OrderItem.objects.create(
                order=order,
                item_name=product.name,
                price=unit_price,
                quantity=qty,
                image=product.image.url if product.image else ""
            )

        CartItem.objects.filter(
            user=user, product_id__in=[product.id for product, _, _ in lines]
        ).delete()

    cache.delete(f"cart_{user.username}")

    return Response({
        "message": "Order placed ✅",
        "order_id": order.id
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = (
        Order.objects
        .filter(user=request.user)
        .prefetch_related("items")
        .order_by("-created_at")
    )

    data = []
    for order in orders:
        data.append({
            "id": order.id,
            "total": order.total_price,
            "status": order.status,
            "address": order.address,
            "phone": order.phone,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
            "items": [
                {
                    "item_name": i.item_name,
                    "price": i.price,
                    "quantity": i.quantity,
                    "image": i.image
                }
                for i in order.items.all()
            ]
        })

    return Response(data)



# ================================
# 📦 GET PRODUCTS
# ================================
@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_active=True)
    return Response({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "image": product.image.url if product.image else "",
        "category": product.category,
        "rating": product.rating,
        "stock": product.stock,
        "offer": product.offer,
    })


@cache_page(60 * 5)
@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_products(request):

    category = request.GET.get("category")
    page = int(request.GET.get("page", 1))

    cache_key = f"products_{category}_{page}"

    cached_data = cache.get(cache_key)

    if cached_data:
        return Response(cached_data)

    # products = Product.objects.filter(
    #     is_active=True
    # )
    products = (
    Product.objects
    .filter(is_active=True)
    .only(
        "id",
        "name",
        "price",
        "image",
        "category",
        "rating",
        "stock",
        "offer"
    )
    .order_by("id")
)

    if category:
        products = products.filter(
            category=category
        )

    paginator = Paginator(products, 100)

    page_obj = paginator.get_page(page)

    data = [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            # "image": request.build_absolute_uri(
            #     p.image.url
            # ) if p.image else "",
            "image": p.image.url if p.image else "",
            "category": p.category,
            "rating": p.rating,
            "stock": p.stock,
            "offer": p.offer
        }
        for p in page_obj
    ]

    response_data = {
        "page": page,
        "total_pages": paginator.num_pages,
        "products": data
    }

    cache.set(
        cache_key,
        response_data,
        300
    )

    return Response(response_data)


# ================================
# 📦 LOAD PRODUCTS
# ================================
@api_view(['POST'])
@permission_classes([IsAdminRole])
def load_products(request):
    url = "https://dummyjson.com/recipes"
    res = requests.get(url).json()
    for item in res["recipes"]:
        Product.objects.create(
            name=item["name"],
            price=100,
            image=item["image"],
            category="Food",
            stock=10
        )
    cache.clear()
    return Response({"message": "Products loaded 🔥"})


# ================================
# 📦 ADD PRODUCTS BULK
# ================================
@api_view(['POST'])
@permission_classes([IsAdminRole])
def add_products_bulk(request):
    print("🔥 DATA RECEIVED 👉", request.data)
    products = request.data.get("products", [])

    if not isinstance(products, list) or len(products) == 0:
        return Response({"error": "No products received ❌"}, status=400)

    for p in products:
        try:
            Product.objects.update_or_create(
                name=p.get("name", ""),
                defaults={
                    "price": int(p.get("price", 0)),
                    "category": p.get("category", ""),
                    "rating": float(p.get("rating", 0) or 0),
                    "image": p.get("image", ""),
                    "stock": 10
                }
            )
        except Exception as e:
            print("❌ PRODUCT ERROR 👉", p)
            return Response({
                "error": "Failed while inserting product ❌",
                "details": str(e)
            }, status=500)
    cache.clear()
    return Response({"message": "Products saved successfully ✅"})


# ================================
# 📦 ADD SINGLE PRODUCT
# ================================
@api_view(['POST'])
@permission_classes([IsAdminRole])
def add_product(request):
    try:
        Product.objects.create(
            name=request.data.get('name', ''),
            price=int(request.data.get('price', 0)),
            category=request.data.get('category', ''),
            rating=float(request.data.get('rating', 0)),
            image=request.data.get('image', '')
        )
        cache.clear()
        return Response({"message": "added ✅"})
    except Exception as e:
        print("❌ ERROR 👉", str(e))
        return Response({"error": str(e)}, status=500)


# ================================
# 📧 TEST EMAIL
# ================================
@api_view(['GET'])
@permission_classes([IsAdminRole])
def test_email(request):
    send_mail(
        "Test Email",
        "Brevo working successfully 🔥",
        "antonyvenis1212@gmail.com",
        ["customer@gmail.com"],
        fail_silently=False,
    )
    return Response({"message": "Email sent"})

# ================================
# 🧾 GENERATE INVOICE PDF
# ================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_invoice(request, order_id):
    from xml.sax.saxutils import escape
    from zoneinfo import ZoneInfo
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.enums import TA_RIGHT, TA_CENTER

    orders = Order.objects.all() if request.user.is_admin_role else Order.objects.filter(user=request.user)
    order = get_object_or_404(orders, id=order_id)

    # Everything shown on the invoice is in Indian Standard Time
    created_ist = order.created_at.astimezone(ZoneInfo("Asia/Kolkata"))
    formatted_time = created_ist.strftime('%d %b %Y, %I:%M %p')
    invoice_date = created_ist.strftime('%d %b %Y')
    invoice_no = f"INV-{order.id:04d}"

    NAVY = colors.HexColor('#0f1b3d')
    ORANGE = colors.HexColor('#ff6a1a')
    SOFT = colors.HexColor('#f5f6fb')
    LINE = colors.HexColor('#e3e6f0')
    INK = colors.HexColor('#1b2240')
    MUTED = colors.HexColor('#6b7391')

    STATUS_COLORS = {
        'Pending': '#b45309',
        'Preparing': '#1d4ed8',
        'Out for Delivery': '#7c3aed',
        'Delivered': '#15803d',
    }

    base = getSampleStyleSheet()['Normal']

    def style(name, **kw):
        options = {'fontName': 'Helvetica', 'textColor': INK}
        options.update(kw)
        return ParagraphStyle(name, parent=base, **options)

    s_body = style('body', fontSize=9.5, leading=14)
    s_small = style('small', fontSize=8.5, leading=12, textColor=MUTED)
    s_label = style('label', fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=ORANGE)
    s_right = style('right', fontSize=9.5, leading=14, alignment=TA_RIGHT)
    s_center = style('center', fontSize=9.5, leading=14, alignment=TA_CENTER)
    s_head = style('head', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=colors.white)
    s_head_r = style('headr', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=colors.white, alignment=TA_RIGHT)
    s_head_c = style('headc', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=colors.white, alignment=TA_CENTER)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice_{order.id}.pdf"'

    doc = SimpleDocTemplate(
        response, pagesize=A4,
        rightMargin=36, leftMargin=36, topMargin=32, bottomMargin=36,
        title=f"Legend {invoice_no}", author="Legend",
    )
    W = A4[0] - 72
    elements = []

    # ===== HEADER BAND =====
    header = Table([[
        Paragraph(
            "<font name='Helvetica-Bold' size=24 color='white'>LEGEND</font><br/>"
            "<font size=9 color='#b9c2e6'>Premium food delivery</font>", base),
        Paragraph(
            "<font name='Helvetica-Bold' size=20 color='white'>INVOICE</font><br/>"
            f"<font size=9 color='#b9c2e6'>{invoice_no}  |  {invoice_date}</font>",
            ParagraphStyle('hr', parent=base, alignment=TA_RIGHT, leading=16)),
    ]], colWidths=[W * 0.55, W * 0.45])
    header.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), NAVY),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
    ]))
    elements.append(header)

    accent = Table([['']], colWidths=[W], rowHeights=[4])
    accent.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), ORANGE)]))
    elements.append(accent)
    elements.append(Spacer(1, 18))

    # ===== BILL TO / ORDER DETAILS =====
    status_color = STATUS_COLORS.get(order.status, '#1b2240')
    bill_to = [
        Paragraph("BILL TO", s_label),
        Paragraph(f"<b>{escape(order.name or order.user.username)}</b>", s_body),
        Paragraph(escape(order.user.email or ''), s_small),
        Paragraph(escape(order.phone or ''), s_small),
        Paragraph(escape(order.address or 'No address given'), s_small),
    ]
    details = [
        Paragraph("ORDER DETAILS", s_label),
        Paragraph(f"Order <b>#{order.id}</b>", s_body),
        Paragraph(f"Payment: <b>{escape(order.payment_method or 'N/A')}</b>", s_body),
        Paragraph(f"Status: <font color='{status_color}'><b>{escape(order.status)}</b></font>", s_body),
        Paragraph(f"Placed: {formatted_time} IST", s_small),
    ]
    info = Table([[bill_to, details]], colWidths=[W * 0.5, W * 0.5])
    info.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SOFT),
        ('BOX', (0, 0), (-1, -1), 0.8, LINE),
        ('LINEAFTER', (0, 0), (0, -1), 0.8, LINE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(info)
    elements.append(Spacer(1, 18))

    # ===== ITEMS =====
    rows = [[
        Paragraph('#', s_head_c), Paragraph('ITEM', s_head), Paragraph('QTY', s_head_c),
        Paragraph('UNIT PRICE', s_head_r), Paragraph('AMOUNT', s_head_r),
    ]]
    subtotal = 0
    for i, item in enumerate(order.items.all(), 1):
        line_total = item.quantity * float(item.price)
        subtotal += line_total
        rows.append([
            Paragraph(str(i), s_center),
            Paragraph(escape(item.item_name), s_body),
            Paragraph(str(item.quantity), s_center),
            Paragraph(f"Rs.{float(item.price):,.2f}", s_right),
            Paragraph(f"<b>Rs.{line_total:,.2f}</b>", s_right),
        ])

    items = Table(rows, colWidths=[W * 0.07, W * 0.45, W * 0.10, W * 0.19, W * 0.19], repeatRows=1)
    items.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, SOFT]),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, LINE),
        ('BOX', (0, 0), (-1, -1), 0.8, LINE),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(items)
    elements.append(Spacer(1, 14))

    # ===== TOTALS =====
    tax_amount = subtotal * 0.05
    delivery = 0 if subtotal > 199 else 40
    grand_total = subtotal + tax_amount + delivery

    s_free = style('free', fontName='Helvetica-Bold', fontSize=9.5, leading=14, textColor=colors.HexColor('#15803d'), alignment=TA_RIGHT)
    totals = Table([
        [Paragraph('Subtotal', s_body), Paragraph(f"Rs.{subtotal:,.2f}", s_right)],
        [Paragraph('GST (5%)', s_body), Paragraph(f"Rs.{tax_amount:,.2f}", s_right)],
        [Paragraph('Delivery', s_body),
         Paragraph('FREE', s_free) if delivery == 0 else Paragraph(f"Rs.{delivery:,.2f}", s_right)],
        [Paragraph("<font color='white'><b>GRAND TOTAL</b></font>", s_body),
         Paragraph(f"<font color='white' size=12><b>Rs.{grand_total:,.2f}</b></font>", s_right)],
    ], colWidths=[W * 0.20, W * 0.20])
    totals.setStyle(TableStyle([
        ('BACKGROUND', (0, 3), (-1, 3), ORANGE),
        ('LINEBELOW', (0, 0), (-1, 1), 0.5, LINE),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 3), (-1, 3), 10),
        ('BOTTOMPADDING', (0, 3), (-1, 3), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    wrapper = Table([['', totals]], colWidths=[W * 0.60, W * 0.40])
    wrapper.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(wrapper)
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("All amounts are in Indian Rupees (INR). Delivery is free above Rs.199.", s_small))

    # ===== FOOTER =====
    elements.append(Spacer(1, 26))
    elements.append(HRFlowable(width="100%", thickness=0.8, color=LINE))
    elements.append(Spacer(1, 10))
    footer = Table([[
        Paragraph("<b>Thank you for ordering from Legend!</b><br/>We hope you enjoy your meal.", s_body),
        Paragraph("<b>Support</b><br/>support@legend.com<br/>+91 98765 43210",
                  ParagraphStyle('fr', parent=s_small, alignment=TA_RIGHT)),
    ]], colWidths=[W * 0.6, W * 0.4])
    footer.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    elements.append(footer)

    doc.build(elements)
    return response


# ================================
# 🛠️ ADMIN DASHBOARD (role = admin only)
# ================================
ORDER_STATUSES = [value for value, _ in Order.STATUS_CHOICES]


@api_view(['GET'])
@permission_classes([IsAdminRole])
def admin_stats(request):
    by_status = {status: 0 for status in ORDER_STATUSES}
    for status, count in Order.objects.values_list("status").annotate(n=Count("id")):
        by_status[status] = count

    revenue = Order.objects.aggregate(total=Sum("total_price"))["total"] or 0

    return Response({
        "users": CustomUser.objects.count(),
        "products": Product.objects.filter(is_active=True).count(),
        "orders": Order.objects.count(),
        "revenue": round(revenue, 2),
        "by_status": by_status,
    })


@api_view(['GET'])
@permission_classes([IsAdminRole])
def admin_orders(request):
    orders = (
        Order.objects
        .select_related("user")
        .prefetch_related("items")
        .order_by("-created_at")
    )

    status = request.GET.get("status")
    if status in ORDER_STATUSES:
        orders = orders.filter(status=status)

    paginator = Paginator(orders, 15)
    page = paginator.get_page(request.GET.get("page", 1))

    rows = [
        {
            "id": order.id,
            "customer": order.user.username,
            "email": order.user.email,
            "total": order.total_price,
            "status": order.status,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
            "items_count": sum(i.quantity for i in order.items.all()),
        }
        for order in page
    ]

    return Response({
        "page": page.number,
        "total_pages": paginator.num_pages,
        "orders": rows,
    })


@api_view(['POST'])
@permission_classes([IsAdminRole])
def admin_update_order_status(request, order_id):
    status = request.data.get("status")
    if status not in ORDER_STATUSES:
        return Response({"error": "Invalid status ❌"}, status=400)

    order = get_object_or_404(Order, id=order_id)
    order.status = status
    order.save(update_fields=["status"])
    return Response({"id": order.id, "status": order.status})


@api_view(['GET'])
@permission_classes([IsAdminRole])
def admin_products(request):
    products = Product.objects.order_by("-id")

    query = (request.GET.get("q") or "").strip()
    if query:
        products = products.filter(name__icontains=query)

    paginator = Paginator(products, 15)
    page = paginator.get_page(request.GET.get("page", 1))

    rows = [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "offer": p.offer,
            "stock": p.stock,
            "is_active": p.is_active,
            "image": p.image.url if p.image else "",
        }
        for p in page
    ]

    return Response({
        "page": page.number,
        "total_pages": paginator.num_pages,
        "total": paginator.count,
        "products": rows,
    })


@api_view(['POST'])
@permission_classes([IsAdminRole])
def admin_toggle_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    product.is_active = not product.is_active
    product.save(update_fields=["is_active"])
    cache.clear()  # the public product list is cached
    return Response({"id": product.id, "is_active": product.is_active})


# ================================
# ✅ HEALTH CHECK
# ================================
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})    

# ================================
# 🏓 DB PING - Supabase Active வை
# ================================
def db_ping(request):
    try:
        # ✅ Lightest possible DB query
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({"db": "ok"})
    except Exception as e:
        return JsonResponse({"db": "error", "msg": str(e)}, status=500)    