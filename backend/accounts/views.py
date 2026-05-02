import requests
import random
from django.core.mail import send_mail
from django.conf import settings

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .utils import send_email_otp

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth import authenticate

from .serializers import RegisterSerializer
from .models import CustomUser, Like, CartItem, Order, OrderItem, OTP


# ================================
# 📧 SEND OTP (DB 🔥)
#================================
# @api_view(['POST'])
# def send_otp(request):
#     email = request.data.get("email")
#     username = request.data.get("username")  # 🔥 ADD THIS
#     phone = request.data.get("phone")  # 🔥 ADD THIS

#     # 🔥 USERNAME CHECK
#     if CustomUser.objects.filter(username__iexact=username).exists():
#         return Response({"error": "Username already exists ❌"}, status=400)

#     if CustomUser.objects.filter(email=email).exists():
#         return Response({"error": "Email already exists ❌"}, status=400)

#     if CustomUser.objects.filter(phone=phone).exists():
#         return Response({"error": "Phone number already exists ❌"}, status=400)

#     otp = str(random.randint(100000, 999999))

#     OTP.objects.update_or_create(
#         email=email,
#         defaults={"otp": otp, "is_verified": False}
#     )

#     send_mail(
#         "Your OTP Code",
#         f"Your ⚡𝓛𝓮𝓰𝓮𝓷𝓭⚡ OTP is {otp}",
#         settings.DEFAULT_FROM_EMAIL,
#         [email],
#         fail_silently=True,
#     )

#     return Response({"message": "OTP sent 📧"})

# @api_view(['POST'])
# def send_otp(request):
#     email = request.data.get("email")
#     username = request.data.get("username")
#     phone = request.data.get("phone")

#     if CustomUser.objects.filter(username__iexact=username).exists():
#         return Response({"error": "Username already exists ❌"}, status=400)

#     if CustomUser.objects.filter(email=email).exists():
#         return Response({"error": "Email already exists ❌"}, status=400)

#     if CustomUser.objects.filter(phone=phone).exists():
#         return Response({"error": "Phone number already exists ❌"}, status=400)

#     otp = str(random.randint(100000, 999999))

#     OTP.objects.update_or_create(
#         email=email,
#         defaults={"otp": otp, "is_verified": False}
#     )

#     # 🔥 USE API (NOT SMTP)
#     send_email_otp(email, otp)

#     return Response({"message": "OTP sent 📧"})


# ================================
# ✅ VERIFY OTP
# ================================
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not otp:
        return Response({"error": "Enter OTP ❌"}, status=400)

    try:
        record = OTP.objects.get(email=email, otp=otp)

        record.is_verified = True
        record.save()

        return Response({"message": "OTP verified ✅"})

    except OTP.DoesNotExist:
        return Response({"error": "Invalid OTP ❌"}, status=400)

# ================================
# 🧑 REGISTER (OTP REQUIRED 🔥)
# ================================
@api_view(['POST'])
def register(request):
    email = request.data.get("email")
    username = request.data.get("username")

    # 🔥 OTP CHECK
    try:
        otp = OTP.objects.get(email=email, is_verified=True)
    except OTP.DoesNotExist:
        return Response({"error": "Verify OTP first ❌"})

    # 🔥 DUPLICATE CHECK
    if CustomUser.objects.filter(username=username).exists():
        return Response({"error": "Username already exists ❌"})

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists ❌"})

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        # 🎉 SUCCESS EMAIL
        send_mail(
              "Welcome 🎉",
            f"""
           ⚡💫𝓛𝓮𝓰𝓮𝓷𝓭💫⚡

            Hi {user.username},

            Your account has been created successfully! 🚀

            Start exploring now 😍

                    Thank You ❤️
            """,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        otp.delete()  # 🧹 cleanup

        return Response({"message": "Registered Successfully ✅"})

        
     # 🔥 DEBUG ERROR
        print(serializer.errors)


    return Response(serializer.errors, status=400)

# ================================
# 🔁 FORGOT PASSWORD
# ================================
@api_view(['POST'])
def forgot_password_send_otp(request):
    email = request.data.get("email")

    # ❌ EMAIL இல்ல
    if not email:
        return Response({"error": "Enter email ❌"}, status=400)

    # ❌ EMAIL DBல இல்ல
    if not CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email not found ❌"}, status=400)

    otp = str(random.randint(100000, 999999))

    OTP.objects.update_or_create(
        email=email,
        defaults={"otp": otp, "is_verified": False}
    )

    send_mail(
        "Reset Password OTP",
        f"Your ⚡𝓛𝓮𝓰𝓮𝓷𝓭⚡ OTP is {otp}",
        settings.EMAIL_HOST_USER,
        [email],
    )

    return Response({"message": "OTP sent 📧"})



# ================================
# 🔁 RESET PASSWORD
# ================================
@api_view(['POST'])
def reset_password(request):
    email = request.data.get("email")
    password = request.data.get("password")

    # ❌ EMPTY CHECK
    if not password:
        return Response({"error": "Enter new password ❌"}, status=400)

    try:
        otp = OTP.objects.get(email=email, is_verified=True)
        user = CustomUser.objects.get(email=email)

        user.set_password(password)   # 🔥 OLD PASSWORD REPLACE
        user.save()

        otp.delete()

        return Response({"message": "Password updated ✅"})

    except OTP.DoesNotExist:
        return Response({"error": "Verify OTP first ❌"}, status=400)

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

    except:
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
@api_view(['POST'])
def forgot_password_send_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")

    if not email or not username:
        return Response({"error": "Enter username & email ❌"}, status=400)

    # 🔥 MATCH CHECK
    if not CustomUser.objects.filter(email=email, username=username).exists():
        return Response({"error": "Invalid username or email ❌"}, status=400)

    otp = str(random.randint(100000, 999999))

    OTP.objects.update_or_create(
        email=email,
        defaults={"otp": otp, "is_verified": False}
    )

    send_mail(
        "Reset Password OTP",
        f"Your ⚡𝓛𝓮𝓰𝓮𝓷𝓭⚡ OTP is {otp}",
        settings.EMAIL_HOST_USER,
        [email],
    )

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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product

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


# ================================
# OTP RELATED FUNCTION
# ================================
# 🔹 function
def send_email_otp(email, otp):
    try:
        message = Mail(
            from_email='antonyvenis1212@gmail.com',
            to_emails=email,
            subject='Your OTP Code',
            html_content=f'<strong>Your OTP is {otp}</strong>'
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        sg.send(message)

    except Exception as e:
        print("EMAIL ERROR 👉", str(e))


# 🔹 API (THIS IS YOUR CODE)
@api_view(['POST'])
def send_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")
    phone = request.data.get("phone")

    if CustomUser.objects.filter(username__iexact=username).exists():
        return Response({"error": "Username already exists ❌"}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists ❌"}, status=400)

    if CustomUser.objects.filter(phone=phone).exists():
        return Response({"error": "Phone number already exists ❌"}, status=400)

    otp = str(random.randint(100000, 999999))

    OTP.objects.update_or_create(
        email=email,
        defaults={"otp": otp, "is_verified": False}
    )

    # 🔥 IMPORTANT
    send_email_otp(email, otp)

    return Response({"message": "OTP sent 📧"})
