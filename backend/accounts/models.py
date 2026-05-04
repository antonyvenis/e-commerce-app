from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


# ============================
# 👤 Custom User
# ============================
class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    image = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username


# ============================
# 🔐 OTP MODEL
# ============================
class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    otp_type = models.CharField(max_length=20, default="register")  # register / forgot_password

    # 🔥 NEW FIELDS (ANTI-SPAM)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    send_count = models.IntegerField(default=0)

    def __str__(self):
        return self.email         

# ============================
# ❤️ Likes
# ============================
class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    image = models.URLField()
    price = models.FloatField(default=0) 
    product_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ❤️ {self.item_name}"


# ============================
# 🛒 Cart Items
# ============================
class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    price = models.FloatField()
    quantity = models.IntegerField(default=1)
    image = models.URLField()

    def __str__(self):
        return f"{self.user.username} 🛒 {self.item_name}"


# ============================
# 📦 ORDER (Parent 🔥)
# ============================
class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    total_price = models.FloatField(default=0)

    # 🔥 ADD HERE 👇
    address = models.TextField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} 📦 Order #{self.id}"


# ============================
# 📦 ORDER ITEMS (Child 🔥🔥🔥)
# ============================
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"   # 🔥 VERY IMPORTANT (frontend use pannuvom)
    )

    item_name = models.CharField(max_length=200)
    price = models.FloatField()
    quantity = models.IntegerField()
    image = models.URLField()

    def __str__(self):
        return f"{self.item_name} x {self.quantity}"


# ============================
# 🍔 PRODUCT MODEL
# ============================
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    category = models.CharField(max_length=100)
    rating = models.FloatField(default=0)
    image = models.ImageField(upload_to="products/", null=True, blank=True)
    stock = models.IntegerField(default=10)

    def __str__(self):
        return self.name
      
