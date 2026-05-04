import requests
import random
from django.core.mail import send_mail
from django.conf import settings

import os
import re
import traceback
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth import authenticate

from .serializers import RegisterSerializer
from .models import CustomUser, Like, CartItem, Order, OrderItem, OTP

from datetime import timedelta
from django.utils import timezone

# ================================
# 📧 SEND OTP (DB 🔥)
#=================================


# 🔹 function
def send_email_otp(email, otp):
    try:
        message = Mail(
            from_email='antonyvenis1212@gmail.com',
            to_emails=email,
            subject='Your OTP Code',
            html_content=f"""
            <strong>⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡ Login</strong>
            <p>Your ⚡𝓛𝓮𝓰𝓮𝓷𝓭⚡ OTP is:</p>
            <h1>{otp}</h1>
            <p>Do not share this OTP with anyone ❌</p>
            """
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        sg.send(message)

    except Exception as e:
        print("EMAIL ERROR 👉", str(e))

@api_view(['POST'])
def send_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")
    phone = request.data.get("phone")

    # ❌ EMPTY CHECK
    if not email or not username or not phone:
        return Response({"error": "All fields required ❌"}, status=400)

    # ❌ DUPLICATE CHECK
    if CustomUser.objects.filter(username__iexact=username).exists():
        return Response({"error": "Username already exists ❌"}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists ❌"}, status=400)

    if CustomUser.objects.filter(phone=phone).exists():
        return Response({"error": "Phone number already exists ❌"}, status=400)

    # 🔍 CHECK EXISTING OTP RECORD
    otp_obj = OTP.objects.filter(email=email).first()

    # 🔥 COOLDOWN (30 sec)
    if otp_obj and otp_obj.last_sent_at:
        if otp_obj.last_sent_at > timezone.now() - timedelta(seconds=30):
            return Response({
                "error": "Wait 30 seconds before retry ⏱️"
            }, status=429)

    # 🔥 DAILY LIMIT (max 5 OTP)
    if otp_obj:
        if otp_obj.send_count >= 5:
            return Response({
                "error": "OTP limit exceeded today 🚫"
            }, status=429)

    # 🔢 GENERATE OTP
    otp = str(random.randint(100000, 999999))

    # 💾 SAVE / UPDATE
    OTP.objects.update_or_create(
        email=email,
        otp_type="register",
        defaults={
            "otp": otp,
            "is_verified": False,
            "last_sent_at": timezone.now(),
            "send_count": (otp_obj.send_count + 1) if otp_obj else 1
        }
    )

    # 📧 SEND EMAIL
    send_email_otp(email, otp)

    return Response({"message": "OTP sent 📧"})


# ================================
# ✅ FORGOT_PASSWORD VERIFY OTP
# ================================

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    otp = str(request.data.get("otp")).strip()
    otp_type = request.data.get("type")  # 🔥 important

    if not otp:
        return Response({"error": "Enter OTP ❌"}, status=400)

    # 🔥 get latest OTP (with type)
    record = OTP.objects.filter(
        email=email,
        otp_type="forgot_password",
    ).order_by('-created_at').first()

    if not record:
        return Response({"error": "OTP not found ❌"}, status=400)

    # 🔥 expiry check
    diff = timezone.now() - record.created_at

    if diff.total_seconds() > 300:
        return Response({"error": "OTP expired ⏰"}, status=400)

    # 🔥 match OTP
    if record.otp != otp:
        return Response({"error": "Invalid OTP ❌"}, status=400)

    record.is_verified = True
    record.save()

    # 🔥 cleanup old OTPs
    OTP.objects.filter(email=email).delete()

    return Response({"message": "OTP verified ✅"})

# ================================
# 📧 WELCOME EMAIL FUNCTION
# ================================
def send_welcome_email(email, username):
    try:
        message = Mail(
            from_email='antonyvenis1212@gmail.com',
            to_emails=email,
            subject='Welcome 🎉',
            html_content=f"""
                <strong>⚡💫𝓛𝓮𝓰𝓮𝓷𝓭💫⚡</strong>
                <h2>Welcome {username} 🎉</h2>
                <p>Your account has been created successfully 🚀</p>
                <p>Start exploring now 😍</p>
                <p>Thank You ❤️</p>
                <a href="https://e-commerce-app-food.vercel.app/" target="_blank">Visit Again 🚀</a>
            """
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)

        print("WELCOME EMAIL STATUS 👉", response.status_code)

    except Exception as e:
        print("WELCOME EMAIL ERROR 👉", str(e))


# ================================
# 🧑 REGISTER
# # ================================
@api_view(['POST'])
def register(request):
    try:
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        phone = request.data.get("phone")   # 🔥 FIX

        # 🔥 DEBUG
        print("DATA 👉", request.data)

        # 🔥 PASSWORD VALIDATION
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

        # 🔥 OTP CHECK
        try:
            otp = OTP.objects.get(email=email, otp_type="register", is_verified=True)
        except OTP.DoesNotExist:
            return Response({"error": "Verify OTP first ❌"})

        # 🔥 DUPLICATE CHECK
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists ❌"})

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists ❌"})

        if CustomUser.objects.filter(phone=phone).exists():
            return Response({"error": "Phone number already exists ❌"}, status=400)

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # 🔥 SEND EMAIL (optional debug)
            try:
                send_welcome_email(user.email, user.username)
            except Exception as e:
                print("EMAIL ERROR 👉", str(e))

            otp.delete()

            return Response({"message": "Registered Successfully ✅"})

        # 🔥 DEBUG
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

    record.is_verified = True
    record.save()

    return Response({"message": "Register OTP verified ✅"})      

# ================================
# 🔁 RESET PASSWORD
# # ================================
# @api_view(['POST'])
# def reset_password(request):
#     email = request.data.get("email")
#     password = request.data.get("password")

#     if not email:
#         return Response({"error": "Email required ❌"}, status=400)

#     if not password:
#         return Response({"error": "Password required ❌"}, status=400)

#     # 🔥 PASSWORD VALIDATION
#     if len(password) < 6:
#         return Response({"error": "Password Min 6 characters ❌"}, status=400)

#     if not re.search(r"[A-Z]", password):
#         return Response({"error": "Password Add atleast 1 uppercase ❌"}, status=400)

#     if not re.search(r"[a-z]", password):
#         return Response({"error": "Password Add atleast 1 lowercase ❌"}, status=400)

#     if not re.search(r"[0-9]", password):
#         return Response({"error": "Password Add atleast 1 number ❌"}, status=400)

#     if not re.search(r"[!@#$%^&*]", password):
#         return Response({"error": "Password Add atleast 1 special character ❌"}, status=400)

#     try:
#         otp = OTP.objects.get(email=email, otp_type="forgot_password", is_verified=True)

#         user = CustomUser.objects.get(email=email)

#         user.set_password(password)
#         user.save()

#         otp.delete()

#         return Response({"message": "Password updated ✅"})

#     except OTP.DoesNotExist:
#         return Response({"error": "Verify OTP first ❌"}, status=400)

#     except CustomUser.DoesNotExist:
#         return Response({"error": "User not found ❌"}, status=404)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email:
        return Response({"error": "Email required ❌"}, status=400)

    if not password:
        return Response({"error": "Password required ❌"}, status=400)

    # 🔥 PASSWORD VALIDATION
    if len(password) < 6:
        return Response({"error": "Password Min 6 characters ❌"}, status=400)

    if not re.search(r"[A-Z]", password):
        return Response({"error": "Password Add atleast 1 uppercase ❌"}, status=400)

    if not re.search(r"[a-z]", password):
        return Response({"error": "Password Add atleast 1 lowercase ❌"}, status=400)

    if not re.search(r"[0-9]", password):
        return Response({"error": "Password Add atleast 1 number ❌"}, status=400)

    if not re.search(r"[!@#$%^&*]", password):
        return Response({"error": "Password Add atleast 1 special character ❌"}, status=400)

    # 🔥 FIX → latest verified OTP
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
# 🔑 LOGIN
# ================================
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # ❌ USERNAME CHECK
        if not CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username not found ❌"}, status=400)

        user = authenticate(username=username, password=password)

        # ❌ PASSWORD WRONG
        if not user:
            return Response({"error": "Wrong password ❌"}, status=400)

        return Response({
            "message": "Login Success",
            "username": user.username
        })

# ================================
# 👤 PROFILE
# ================================
@api_view(['GET'])
def profile(request):
    try:
        user = CustomUser.objects.get(username=request.GET.get("username"))

        return Response({
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "image": user.image
        })

    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"})


# ================================
# ✏️ UPDATE PROFILE
# ================================
@api_view(['POST'])
def update_profile(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))

        user.email = request.data.get("email", user.email)
        user.phone = request.data.get("phone", user.phone)
        user.image = request.data.get("image", user.image)

        user.save()

        return Response({"message": "Profile updated ✅"})

    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"})


# ================================
# ❤️ LIKE
# ================================
@api_view(['POST'])
def add_like(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))
        item_id = request.data.get("id")

        if Like.objects.filter(user=user, product_id=item_id).exists():
            return Response({"message": "Already liked"})

        Like.objects.create(
            user=user,
            item_name=request.data.get("item_name"),
            image=request.data.get("image"),
            price=request.data.get("price"),
            product_id=item_id
        )

        return Response({"message": "Liked ❤️"})

    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"})


@api_view(['GET'])
def get_likes(request):
    try:
        user = CustomUser.objects.get(username=request.GET.get("username"))
        likes = Like.objects.filter(user=user)

        return Response([
            {
                "id": l.product_id,
                "item_name": l.item_name,
                "image": l.image,
                "price": l.price
            } for l in likes
        ])

    except:
        return Response([])


@api_view(['POST'])
def remove_like(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))

        Like.objects.filter(
            user=user,
            product_id=request.data.get("id")
        ).delete()

        return Response({"message": "Removed ❤️"})

    except:
        return Response({"error": "User not found"})


# ================================
# 🛒 CART
# ================================
@api_view(['POST'])
def add_to_cart(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))

        item, created = CartItem.objects.get_or_create(
            user=user,
            item_name=request.data.get("item_name"),
            defaults={
                "price": request.data.get("price"),
                "quantity": 1,
                "image": request.data.get("image")
            }
        )

        if not created:
            item.quantity += 1
            item.save()

        return Response({"message": "Added 🛒"})

    except:
        return Response({"error": "User not found"})


@api_view(['GET'])
def get_cart(request):
    try:
        user = CustomUser.objects.get(username=request.GET.get("username"))
        cart = CartItem.objects.filter(user=user)

        return Response([
            {
                "id": c.id,
                "item_name": c.item_name,
                "price": c.price,
                "quantity": c.quantity,
                "image": c.image
            } for c in cart
        ])

    except:
        return Response([])


@api_view(['POST'])
def remove_cart(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))

        CartItem.objects.filter(
            id=request.data.get("id"),
            user=user
        ).delete()

        return Response({"message": "Removed ❌"})

    except:
        return Response({"error": "Error"})


@api_view(['POST'])
def update_quantity(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))

        item = CartItem.objects.get(
            id=request.data.get("id"),
            user=user
        )

        qty = int(request.data.get("quantity"))

        if qty < 1:
            return Response({"error": "Minimum 1 required"})

        item.quantity = qty
        item.save()

        return Response({"message": "Updated 🔢"})

    except Exception as e:
        return Response({"error": str(e)})


# ================================
# 📦 ORDER
# ================================
@api_view(['POST'])
def place_order(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))
        items = request.data.get("items")

        if not items:
            return Response({"error": "Cart empty ❌"})

        total = sum(item["price"] * item["quantity"] for item in items)

        order = Order.objects.create(
            user=user,
            total_price=total,
            address=request.data.get("address"),
            phone=request.data.get("phone"),
            payment_method=request.data.get("payment_method"),
            name=request.data.get("name")
        )

        for item in items:
            OrderItem.objects.create(
                order=order,
                item_name=item["item_name"],
                price=item["price"],
                quantity=item["quantity"],
                image=item.get("image", "")
            )

        # 🔥 CLEAR CART AFTER ORDER
        CartItem.objects.filter(user=user).delete()

        return Response({
            "message": "Order placed ✅",
            "order_id": order.id
        })

    except:
        return Response({"error": "User not found"})


# ================================
# 📦 GET ORDERS
# ================================
@api_view(['GET'])
def get_orders(request):
    try:
        user = CustomUser.objects.get(username=request.GET.get("username"))

        orders = Order.objects.filter(user=user).order_by('-created_at')

        data = []

        for order in orders:
            items = [
                {
                    "item_name": i.item_name,
                    "price": i.price,
                    "quantity": i.quantity,
                    "image": i.image
                }
                for i in order.items.all()
            ]

            data.append({
                "id": order.id,
                "total": order.total_price,
                "status": order.status,
                "address": order.address,
                "phone": order.phone,
                "payment_method": order.payment_method,
                "created_at": order.created_at,
                "items": items
            })

        return Response(data)

    except:
        return Response([])


# ================================
# 🧹 CLEAR CART
# ================================
@api_view(['POST'])
def clear_cart(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))
        CartItem.objects.filter(user=user).delete()
        return Response({"message": "Cart cleared 🧹"})
    except:
        return Response({"error": "Error"})

# ================================
# 🔁 // FORGOT PASSWORD SEND OTP //
# ================================
def send_forgot_email_otp(email, otp):
    try:
        message = Mail(
            from_email='antonyvenis1212@gmail.com',  # verified sender
            to_emails=email,
            subject='Reset Password OTP 🔐',
            html_content=f"""
                <h2>Password Reset 🔐</h2>
                <p>Your ⚡𝓛𝓮𝓰𝓮𝓷𝓭⚡ OTP is:</p>
                <h1>{otp}</h1>
                <p>Do not share this OTP with anyone ❌</p>
            """
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)

        print("FORGOT OTP STATUS 👉", response.status_code)

    except Exception as e:
        print("FORGOT OTP ERROR 👉", str(e))


@api_view(['POST'])
def forgot_password_send_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")

    if not email or not username:
        return Response({"error": "Enter username & email ❌"}, status=400)

    # 🔥 MATCH CHECK
    if not CustomUser.objects.filter(email=email, username=username).exists():
        return Response({"error": "Invalid username or email ❌"}, status=400)

    now = timezone.now()

    # 🔥 GET LAST OTP
    last_otp = OTP.objects.filter(email=email, otp_type="forgot_password").order_by('-created_at').first()

    if last_otp:
        # ⏱ COOLDOWN (60 sec)
        if last_otp.last_sent_at and (now - last_otp.last_sent_at).total_seconds() < 60:
            return Response({"error": "Wait 60 seconds ⏳"}, status=400)

        # 🚫 DAILY LIMIT (5 times)
        if last_otp.send_count >= 5:
            return Response({"error": "Too many OTP requests ❌"}, status=400)

    # 🔥 CREATE NEW OTP
    otp = str(random.randint(100000, 999999))

    otp_record = OTP.objects.create(
        email=email,
        otp=otp,
        otp_type="forgot_password",
        is_verified=False,
        last_sent_at=now,
        send_count=(last_otp.send_count + 1) if last_otp else 1
    )

    # 📧 SEND EMAIL
    send_forgot_email_otp(email, otp)

    return Response({"message": "OTP sent 📧"})

    # =========================
    # 🔒 COOLDOWN (60 sec)
    # =========================
    if otp_record.last_sent_at:
        diff = (now - otp_record.last_sent_at).total_seconds()

        if diff < 60:
            return Response({
                "error": f"Wait {int(60 - diff)} seconds ⏱️"
            }, status=429)

    # =========================
    # 🔥 LIMIT (5 per 10 min)
    # =========================
    if otp_record.last_sent_at and otp_record.last_sent_at > now - timedelta(minutes=10):
        if otp_record.send_count >= 5:
            return Response({
                "error": "Too many OTP requests 🚫 Try again later"
            }, status=429)
    else:
        # 🔄 RESET COUNT AFTER WINDOW
        otp_record.send_count = 0

    # =========================
    # 🔢 GENERATE OTP
    # =========================
    otp = str(random.randint(100000, 999999))

    otp_record.otp = otp
    otp_record.is_verified = False
    otp_record.last_sent_at = now
    otp_record.send_count += 1
    otp_record.save()

    # 🔥 SEND EMAIL (YOUR FUNCTION SAME)
    send_forgot_email_otp(email, otp)

    return Response({"message": "OTP sent 📧"})


# ================================
# 📦 GET PRODUCTS
# ================================
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()

    category = request.GET.get("category")

    if category:
        products = products.filter(category=category)

    data = [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image": p.image.url if p.image else "",
            "category": p.category,
            "rating": p.rating,
            "stock": p.stock
        }
        for p in products
    ]

    return Response(data)

# ================================
# 📦 LOAD PRODUCTS
# ================================
@api_view(['POST'])
def load_products(request):
    url = "https://dummyjson.com/recipes"
    res = requests.get(url).json()

    for item in res["recipes"]:
        Product.objects.create(
            name=item["name"],
            price=100,  # dummy
            image=item["image"],
            category="Food",
            stock=10
        )

    return Response({"message": "Products loaded 🔥"})


# ================================
# 📦 ADD PRODUCTS
# ================================
@api_view(['POST'])
def add_products_bulk(request):

    print("🔥 DATA RECEIVED 👉", request.data)   # DEBUG

    products = request.data.get("products")

    if not products:
        return Response({"error": "No products received ❌"}, status=400)

    for p in products:
        Product.objects.update_or_create(
            name=p.get("name"),
            defaults={
                "price": p.get("price", 0),
                "category": p.get("category", ""),
                "rating": float(p.get("rating", 0)),
                "image": p.get("image", ""),
                "stock": 10
            }
        )

    return Response({"message": "Products saved successfully ✅"})


@api_view(['POST'])
def add_product(request):
    Product.objects.create(
        name=request.data['name'],
        price=request.data['price'],
        category=request.data['category'],
        rating=request.data['rating'],
        image=request.data['image']
    )
    return Response({"message": "added"})   