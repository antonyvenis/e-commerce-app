# from django.urls import path
# from .views import (
#     register,
#     LoginView,
#     profile,
#     update_profile,
#     add_like,
#     get_likes,
#     remove_like,
#     add_to_cart,
#     get_cart,
#     remove_cart,
#     update_quantity,
#     clear_cart,
#     place_order,
#     get_orders,
#     send_otp,
#     verify_otp,
#     reset_password,
#     forgot_password_send_otp,
#     get_products,
#     load_products,
#     add_products_bulk,
#     verify_register_otp,
#     test_email,
#     place_order,
#     generate_invoice
# )

# urlpatterns = [

#     # =========================
#     # 🔐 AUTH
#     # =========================
#     path('register/', register),
#     path('login/', LoginView.as_view()),
#     path('send-otp/', send_otp),
#     path('verify-otp/', verify_otp),
#     path('verify-register-otp/', verify_register_otp),
#     path('reset-password/', reset_password),
#     path('forgot-password-otp/', forgot_password_send_otp),
#     path('test-email/', test_email),
#     path('place-order/', place_order),
#     path('invoice/<int:order_id>/', views.generate_invoice, name='invoice'),

#     # =========================
#     # 👤 PROFILE
#     # =========================
#     path('profile/', profile),
#     path('update-profile/', update_profile),

#     # =========================
#     # ❤️ LIKES
#     # =========================
#     path('add-like/', add_like),
#     path('likes/', get_likes),
#     path('remove-like/', remove_like),

#     # =========================
#     # 🛒 CART
#     # =========================
#     path('add-cart/', add_to_cart),
#     path('cart/', get_cart),
#     path('remove-cart/', remove_cart),
#     path('update-quantity/', update_quantity),
#     path('clear-cart/', clear_cart),

#     # =========================
#     # 📦 ORDERS
#     # =========================
#     path('order/', place_order),
#     path('orders/', get_orders),

#     # =========================
#     # 📦 PRODUCTS
#     # =========================
#     path("products/", get_products),
#     path("load-products/", load_products),
#     path("add-products/", add_products_bulk),
# ]

# from django.urls import path
# from .views import (
#     register,
#     LoginView,
#     profile,
#     update_profile,
#     add_like,
#     get_likes,
#     remove_like,
#     add_to_cart,
#     get_cart,
#     remove_cart,
#     update_quantity,
#     clear_cart,
#     place_order,
#     get_orders,
#     send_otp,
#     verify_otp,
#     reset_password,
#     forgot_password_send_otp,
#     get_products,
#     load_products,
#     add_products_bulk,
#     verify_register_otp,
#     test_email,
#     generate_invoice,   # ✅ directly import
# )

# urlpatterns = [

#     # =========================
#     # 🔐 AUTH
#     # =========================
#     path('register/', register),
#     path('login/', LoginView.as_view()),
#     path('send-otp/', send_otp),
#     path('verify-otp/', verify_otp),
#     path('verify-register-otp/', verify_register_otp),
#     path('reset-password/', reset_password),
#     path('forgot-password-otp/', forgot_password_send_otp),
#     path('test-email/', test_email),

#     # =========================
#     # 👤 PROFILE
#     # =========================
#     path('profile/', profile),
#     path('update-profile/', update_profile),

#     # =========================
#     # ❤️ LIKES
#     # =========================
#     path('add-like/', add_like),
#     path('likes/', get_likes),
#     path('remove-like/', remove_like),

#     # =========================
#     # 🛒 CART
#     # =========================
#     path('add-cart/', add_to_cart),
#     path('cart/', get_cart),
#     path('remove-cart/', remove_cart),
#     path('update-quantity/', update_quantity),
#     path('clear-cart/', clear_cart),

#     # =========================
#     # 📦 ORDERS
#     # =========================
#     path('order/', place_order),       # ✅ ஒரே ஒரு place_order
#     path('orders/', get_orders),
#     path('invoice/<int:order_id>/', generate_invoice, name='invoice'),  # ✅ fixed

#     # =========================
#     # 📦 PRODUCTS
#     # =========================
#     path("products/", get_products),
#     path("load-products/", load_products),
#     path("add-products/", add_products_bulk),
# ]

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
    verify_register_otp,
    test_email,
    generate_invoice,
    health_check,
)

urlpatterns = [
    path('register/', register),
    path('login/', LoginView.as_view()),
    path('send-otp/', send_otp),
    path('verify-otp/', verify_otp),
    path('verify-register-otp/', verify_register_otp),
    path('reset-password/', reset_password),
    path('forgot-password-otp/', forgot_password_send_otp),
    path('test-email/', test_email),
    path('profile/', profile),
    path('update-profile/', update_profile),
    path('add-like/', add_like),
    path('likes/', get_likes),
    path('remove-like/', remove_like),
    path('add-cart/', add_to_cart),
    path('cart/', get_cart),
    path('remove-cart/', remove_cart),
    path('update-quantity/', update_quantity),
    path('clear-cart/', clear_cart),
    path('order/', place_order),
    path('orders/', get_orders),
    path('invoice/<int:order_id>/', generate_invoice, name='invoice'),  # ✅
    path("products/", get_products),
    path("load-products/", load_products),
    path("add-products-bulk/", add_products_bulk),
    path("health/", health_check)
]