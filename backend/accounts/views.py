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
from rest_framework.decorators import api_view
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


# # ================================
# # 📧 SEND OTP
# # ================================
# from django.core.mail import EmailMultiAlternatives
# from django.conf import settings


# def send_email_otp(email, otp):
#     try:
#         subject = "⚡ Legend Register OTP"

#         text_content = f"""
# Your OTP is: {otp}

# Do not share this OTP with anyone.
# """

#         html_content = f"""
#         <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
#             <h1>⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡ Register 🎉</h1>

#             <p>Your OTP is:</p>

#             <div style="
#                 font-size:32px;
#                 font-weight:bold;
#                 letter-spacing:5px;
#                 color:#ff6600;
#                 margin:20px 0;
#             ">
#                 {otp}
#             </div>

#             <p>Do not share this OTP with anyone ❌</p>

#             <hr>

#             <small>
#                 This OTP is valid for a limited time.
#             </small>
#         </div>
#         """

#         msg = EmailMultiAlternatives(
#             subject,
#             text_content,
#             settings.DEFAULT_FROM_EMAIL,
#             [email]
#         )

#         msg.attach_alternative(html_content, "text/html")
#         msg.send()

#         print("OTP EMAIL SENT ✅")
#         return True

#     except Exception as e:
#         print("EMAIL ERROR 👉", str(e))
#         return False

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

    if not email or not username or not phone:
        return Response({"error": "All fields required ❌"}, status=400)

    if CustomUser.objects.filter(username__iexact=username).exists():
        return Response({"error": "Username already exists ❌"}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists ❌"}, status=400)

    if CustomUser.objects.filter(phone=phone).exists():
        return Response({"error": "Phone number already exists ❌"}, status=400)

    otp_obj = OTP.objects.filter(email=email).first()
    now = timezone.now()
    today = now.date()

    if otp_obj and otp_obj.last_sent_at:
        if otp_obj.last_sent_at.date() != today:
            otp_obj.send_count = 0
            otp_obj.save()

    if otp_obj and otp_obj.last_sent_at:
        if otp_obj.last_sent_at > now - timedelta(seconds=30):
            return Response({"error": "Wait 30 seconds before retry ⏱️"}, status=429)

    if otp_obj and otp_obj.send_count >= 5:
        return Response({"error": "OTP limit exceeded today 🚫"}, status=429)

    otp = str(random.randint(100000, 999999))

    OTP.objects.update_or_create(
        email=email,
        otp_type="register",
        defaults={
            "otp": otp,
            "is_verified": False,
            "last_sent_at": now,
            "send_count": (otp_obj.send_count + 1) if otp_obj else 1
        }
    )

    # send_email_otp(email, otp)
    # return Response({"message": "OTP sent 📧"})

    success = send_email_otp(email, otp)

    if not success:
        return Response(
            {"error": "Email sending failed ❌"},
            status=500
        )

    return Response({"message": "OTP sent 📧"})

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
            <div>
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

        print("DATA 👉", request.data)

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
            return Response({"error": "Verify OTP first ❌"})

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists ❌"})
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists ❌"})
        if CustomUser.objects.filter(phone=phone).exists():
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
            <div>
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
# 🔑 LOGIN
# ================================
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username not found ❌"}, status=400)

        user = authenticate(username=username, password=password)

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

        product = Product.objects.get(id=item_id)

        Like.objects.create(
            user=user,
            item_name=product.name,
            image=(product.image.url if product.image else ""),
            price=product.price,
            product_id=product.id
        )
        return Response({"message": "Liked ❤️"})

    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"})
    except Product.DoesNotExist:
        return Response({"error": "Product not found"})


@api_view(['GET'])
def get_likes(request):
    try:
        user = CustomUser.objects.get(username=request.GET.get("username"))
        likes = Like.objects.filter(user=user)
        data = []

        for l in likes:
            try:
                product = Product.objects.get(id=l.product_id)
                data.append({
                    "id": product.id,
                    "item_name": product.name,
                    "image": (product.image.url if product.image else ""),
                    "price": product.price,
                    "offer": product.offer,
                    "category": product.category,
                    "rating": product.rating,
                    "is_active": product.is_active
                })
            except Product.DoesNotExist:
                pass

        return Response(data)
    except:
        return Response([])


@api_view(['POST'])
def remove_like(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))
        Like.objects.filter(user=user, product_id=request.data.get("id")).delete()
        return Response({"message": "Removed ❤️"})
    except:
        return Response({"error": "User not found"})


# ================================
# 🛒 CART
# ================================
@api_view(['POST'])
def add_to_cart(request):
    try:
        username = request.data.get("username")
        product_id = request.data.get("product_id")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        offer = product.offer or 0
        final_price = float(product.price)
        if offer > 0:
            final_price = float(product.price) - (float(product.price) * float(offer) / 100)

        item, created = CartItem.objects.get_or_create(
            user=user,
            product_id=product.id,
            defaults={
                "item_name": product.name,
                "price": round(final_price, 2),
                "quantity": 1,
                "image": product.image.url if product.image else ""
            }
        )

        if not created:
            item.quantity += 1
            item.price = round(final_price, 2)
            item.save()

        return Response({"message": "Added 🛒"})

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_cart(request):
    try:
        username = request.GET.get("username")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response([])

        cart = CartItem.objects.filter(user=user)
        data = []

        for c in cart:
            try:
                product = Product.objects.get(id=c.product_id)
            except Product.DoesNotExist:
                continue

            offer = product.offer or 0
            original_price = float(product.price)
            final_price = original_price
            if offer > 0:
                final_price = original_price - (original_price * offer / 100)

            data.append({
                "id": c.id,
                "item_name": product.name,
                "original_price": round(original_price, 2),
                "price": round(final_price, 2),
                "quantity": c.quantity,
                "image": product.image.url if product.image else "",
                "rating": product.rating if hasattr(product, "rating") else 4.5,
                "category": product.category if hasattr(product, "category") else "Food",
                "offer": offer
            })

        return Response(data)

    except Exception as e:
        print(e)
        return Response([])


@api_view(['POST'])
def remove_cart(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))
        CartItem.objects.filter(id=request.data.get("id"), user=user).delete()
        return Response({"message": "Removed ❌"})
    except:
        return Response({"error": "Error"})


@api_view(['POST'])
def update_quantity(request):
    try:
        user = CustomUser.objects.get(username=request.data.get("username"))
        item = CartItem.objects.get(id=request.data.get("id"), user=user)
        qty = int(request.data.get("quantity"))
        if qty < 1:
            return Response({"error": "Minimum 1 required"})
        item.quantity = qty
        item.save()
        return Response({"message": "Updated 🔢"})
    except Exception as e:
        return Response({"error": str(e)})


# ================================
# 📦 PLACE ORDER ✅ SINGLE CORRECT
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
            "image": request.build_absolute_uri(p.image.url) if p.image else "",
            "category": p.category,
            "rating": p.rating,
            "stock": p.stock,
            "offer": p.offer
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
            price=100,
            image=item["image"],
            category="Food",
            stock=10
        )
    return Response({"message": "Products loaded 🔥"})


# ================================
# 📦 ADD PRODUCTS BULK
# ================================
@api_view(['POST'])
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

    return Response({"message": "Products saved successfully ✅"})


# ================================
# 📦 ADD SINGLE PRODUCT
# ================================
@api_view(['POST'])
def add_product(request):
    try:
        Product.objects.create(
            name=request.data.get('name', ''),
            price=int(request.data.get('price', 0)),
            category=request.data.get('category', ''),
            rating=float(request.data.get('rating', 0)),
            image=request.data.get('image', '')
        )
        return Response({"message": "added ✅"})
    except Exception as e:
        print("❌ ERROR 👉", str(e))
        return Response({"error": str(e)}, status=500)


# ================================
# 📧 TEST EMAIL
# ================================
@api_view(['GET'])
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
# 🧾 GENERATE INVOICE PDF ✅ SINGLE CORRECT
# ================================
def generate_invoice(request, order_id):
    order = Order.objects.get(id=order_id)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice_{order_id}.pdf"'

    doc = SimpleDocTemplate(
        response, pagesize=A4,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )

    elements = []
    styles = getSampleStyleSheet()

    # ===== HEADER =====
    header_data = [[
        Paragraph("<b><font size=24 color='#ff6600'>🍔 𝓛𝓮𝓰𝓮𝓷𝓭</font></b>", styles['Normal']),
        Paragraph(
            f"<b>INVOICE</b><br/>"
            f"<font size=9 color='grey'>Invoice #: INV-{order_id:04d}<br/>"
            f"Date: {datetime.date.today().strftime('%d %b %Y')}</font>",
            styles['Normal']
        )
    ]]
    header_table = Table(header_data, colWidths=[3.5*inch, 3.5*inch])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (0,0), 'LEFT'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(header_table)
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.orange))
    elements.append(Spacer(1, 12))

    # ===== CUSTOMER INFO =====
    info_data = [[
        Paragraph(
            f"<b>Bill To:</b><br/>"
            f"{order.user.username}<br/>"
            f"{order.user.email}<br/>"
            f"📍 {order.address}",
            styles['Normal']
        ),
        Paragraph(
            f"<b>Payment:</b><br/>"
            f"Method: {order.payment_method}<br/>"
            f"Status: <font color='green'><b>{order.status}</b></font><br/>"
            f"Order Date: {order.created_at.strftime('%d %b %Y %I:%M %p')}",
            styles['Normal']
        )
    ]]
    info_table = Table(info_data, colWidths=[3.5*inch, 3.5*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff8f0')),
        ('BOX', (0,0), (-1,-1), 1, colors.orange),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 16))

    # ===== ITEMS TABLE =====
    table_data = [['#', 'Item Name', 'Qty', 'Unit Price', 'Total']]
    subtotal = 0

    for i, item in enumerate(order.items.all(), 1):
        item_total = item.quantity * float(item.price)   # ✅ FIXED
        subtotal += item_total
        table_data.append([
            str(i),
            item.item_name,                              # ✅ FIXED
            str(item.quantity),
            f"₹{float(item.price):.2f}",                # ✅ FIXED
            f"₹{item_total:.2f}"
        ])

    items_table = Table(table_data, colWidths=[0.4*inch, 3*inch, 0.7*inch, 1.2*inch, 1.2*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ff6600')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 11),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('FONTSIZE', (0,1), (-1,-1), 10),
        ('ALIGN', (2,1), (-1,-1), 'CENTER'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#fff8f0')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#ffccaa')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 12))

    # ===== TOTALS =====
    tax_rate = 0.05
    tax_amount = subtotal * tax_rate
    delivery = 0 if subtotal > 199 else 40
    grand_total = subtotal + tax_amount + delivery

    totals_data = [
        ['', 'Subtotal:', f'₹{subtotal:.2f}'],
        ['', 'GST (5%):', f'₹{tax_amount:.2f}'],
        ['', 'Delivery:', 'FREE 🎉' if delivery == 0 else f'₹{delivery:.2f}'],
        ['', 'GRAND TOTAL:', f'₹{grand_total:.2f}'],
    ]
    totals_table = Table(totals_data, colWidths=[3.5*inch, 2*inch, 1*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('FONTNAME', (1,3), (-1,3), 'Helvetica-Bold'),
        ('FONTSIZE', (1,3), (-1,3), 13),
        ('TEXTCOLOR', (1,3), (-1,3), colors.HexColor('#ff6600')),
        ('LINEABOVE', (1,3), (-1,3), 1.5, colors.orange),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(totals_table)
    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.orange))

    # ===== FOOTER =====
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        "<font size=9 color='grey'>Thank you for ordering from 𝓛𝓮𝓰𝓮𝓷𝓭! 🍔<br/>"
        "For support: support@legend.com | +91 97517 29345</font>",
        styles['Normal']
    ))

    doc.build(elements)
    return response