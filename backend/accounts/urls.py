from django.urls import path
from .views import (
    register,
    LoginView,
    profile,
    update_profile,
    add_like,
    get_likes,
    remove_like,
    add_to_cart,
    get_cart,
    remove_cart,
    update_quantity,
    clear_cart,
    place_order,
    get_orders,
    send_otp,
    verify_otp,
    reset_password,
    forgot_password_send_otp,
    get_products,
    load_products,
    add_products_bulk,
)

urlpatterns = [

    # =========================
    # 🔐 AUTH
    # =========================
    path('api/register/', register),
    path('api/login/', LoginView.as_view()),
    path('api/send-otp/', send_otp),
    path('api/verify-otp/', verify_otp),
    path('api/reset-password/', reset_password),
    path('api/forgot-password-otp/', forgot_password_send_otp),

    # =========================
    # 👤 PROFILE
    # =========================
    path('api/profile/', profile),
    path('api/update-profile/', update_profile),

    # =========================
    # ❤️ LIKES
    # =========================
    path('api/add-like/', add_like),
    path('api/likes/', get_likes),
    path('api/remove-like/', remove_like),

    # =========================
    # 🛒 CART
    # =========================
    path('add-cart/', add_to_cart),
    path('cart/', get_cart),
    path('remove-cart/', remove_cart),
    path('update-quantity/', update_quantity),
    path('clear-cart/', clear_cart),

    # =========================
    # 📦 ORDERS
    # =========================
    path('order/', place_order),
    path('orders/', get_orders),

    # =========================
    # 📦 PRODUCTS
    # =========================
    path("products/", get_products),
    path("load-products/", load_products),
    path("add-products/", add_products_bulk),
]