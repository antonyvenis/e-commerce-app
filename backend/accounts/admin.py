from django.contrib import admin
from .models import CustomUser, OTP, Like, CartItem, Order, OrderItem
from .models import Product
from rest_framework.decorators import api_view
from rest_framework.response import Response



# ============================
# 👤 CUSTOM USER ADMIN
# ============================
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "phone", "is_staff")
    search_fields = ("username", "email", "phone")
    list_filter = ("is_staff",)
    ordering = ("-id",)


# ============================
# 🔐 OTP ADMIN
# ============================
@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ("email", "otp", "is_verified", "created_at")
    search_fields = ("email",)
    list_filter = ("is_verified",)
    ordering = ("-created_at",)


# ============================
# ❤️ LIKE ADMIN
# ============================
@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "item_name", "price")
    search_fields = ("user__username", "item_name")


# ============================
# 🛒 CART ADMIN
# ============================
@admin.register(CartItem)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "item_name", "price", "quantity")
    search_fields = ("user__username", "item_name")


# ============================
# 📦 ORDER ADMIN
# ============================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_price", "status", "created_at")
    search_fields = ("user__username", "status")
    list_filter = ("status",)
    ordering = ("-created_at",)


# ============================
# 📦 ORDER ITEM ADMIN
# ============================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "item_name", "price", "quantity")
    search_fields = ("item_name",)

# ============================
# 📦 PRODUCTS ITEM ADMIN
# ============================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "stock", "rating")
    
    search_fields = ("name", "category")

    list_filter = ("category",)


    # 🔥 THIS IS IMPORTANT
    list_display_links = ("name",)

    # 🔥 image preview
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="60" />'
        return "No Image"
    
    image_preview.allow_tags = True


# ============================
# 📦 PRODUCTS ADD ITEM ADMIN
# ============================
@api_view(['POST'])
def add_products_bulk(request):

    products = request.data  # list வரும்

    for p in products:
        Product.objects.update_or_create(
            name=p["name"],  # duplicate avoid
            defaults={
                "price": p["price"],
                "category": p["category"],
                "rating": p["rating"],
                "image": p["image"],
                "stock": 10
            }
        )

    return Response({"message": "Products saved to DB ✅"})