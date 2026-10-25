"""
Run:  python manage.py test accounts -v 2
Covers: email login, JWT + refresh rotation, role-based access (RBAC),
Google login, protected endpoints, data isolation between users,
server-side order pricing, invoice ownership, OTP + register flow.
"""
from datetime import timedelta
from unittest.mock import patch

from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from . import views
from .models import CartItem, CustomUser, Like, OTP, Order, OrderItem, Product

PASSWORD = "Test@1234"


def make_user(username="antony", email="antony@example.com", role="customer", **extra):
    return CustomUser.objects.create_user(
        username=username, email=email, password=PASSWORD, role=role, **extra
    )


def make_product(name="Biryani", price=300, offer=0, **extra):
    return Product.objects.create(
        name=name, price=price, offer=offer, category="Food", **extra
    )


class BaseAPITest(TestCase):
    def setUp(self):
        cache.clear()  # throttle + OTP rate-limit + cart cache live in cache
        self.client = APIClient()

    def login(self, email="antony@example.com", password=PASSWORD):
        return self.client.post("/api/login/", {"email": email, "password": password}, format="json")

    def auth_as(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        return client

    def bearer(self, access):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        return client


# ------------------------------------------------------------------ login / JWT
class LoginTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.user = make_user()

    def test_login_with_email_returns_tokens_and_role(self):
        res = self.login()
        self.assertEqual(res.status_code, 200)
        for key in ("access", "refresh", "username", "email", "role"):
            self.assertIn(key, res.data)
        self.assertEqual(res.data["role"], "customer")

    def test_login_email_is_case_insensitive(self):
        self.assertEqual(self.login(email="ANTONY@Example.com").status_code, 200)

    def test_login_wrong_password(self):
        res = self.login(password="nope")
        self.assertEqual(res.status_code, 400)
        self.assertNotIn("access", res.data)

    def test_login_unknown_email_gives_same_error(self):
        wrong_pw = self.login(password="nope").data["error"]
        unknown = self.login(email="ghost@example.com").data["error"]
        self.assertEqual(wrong_pw, unknown)  # does not reveal which emails exist

    def test_login_requires_both_fields(self):
        res = self.client.post("/api/login/", {"email": "antony@example.com"}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_login_still_accepts_username(self):
        res = self.client.post("/api/login/", {"username": "antony", "password": PASSWORD}, format="json")
        self.assertEqual(res.status_code, 200)

    def test_login_is_rate_limited(self):
        codes = [self.login(password="bad").status_code for _ in range(25)]
        self.assertIn(429, codes)

    def test_admin_role_in_login_payload(self):
        make_user("boss", "boss@example.com", role="admin")
        self.assertEqual(self.login(email="boss@example.com").data["role"], "admin")


class TokenTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        make_user()
        self.tokens = self.login().data

    def test_protected_endpoint_needs_token(self):
        self.assertEqual(self.client.get("/api/cart/").status_code, 401)

    def test_protected_endpoint_works_with_token(self):
        res = self.bearer(self.tokens["access"]).get("/api/profile/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["username"], "antony")

    def test_garbage_token_rejected(self):
        self.assertEqual(self.bearer("not.a.token").get("/api/cart/").status_code, 401)

    def test_refresh_rotates_and_old_refresh_is_blacklisted(self):
        first = self.client.post("/api/token/refresh/", {"refresh": self.tokens["refresh"]}, format="json")
        self.assertEqual(first.status_code, 200)
        self.assertIn("access", first.data)
        self.assertNotEqual(first.data["refresh"], self.tokens["refresh"])

        reuse = self.client.post("/api/token/refresh/", {"refresh": self.tokens["refresh"]}, format="json")
        self.assertEqual(reuse.status_code, 401)  # rotation + blacklist

    def test_logout_blacklists_refresh_token(self):
        client = self.bearer(self.tokens["access"])
        self.assertEqual(client.post("/api/logout/", {"refresh": self.tokens["refresh"]}, format="json").status_code, 200)
        res = self.client.post("/api/token/refresh/", {"refresh": self.tokens["refresh"]}, format="json")
        self.assertEqual(res.status_code, 401)

    def test_login_ignores_stale_authorization_header(self):
        client = self.bearer("expired.or.garbage")
        res = client.post("/api/login/", {"email": "antony@example.com", "password": PASSWORD}, format="json")
        self.assertEqual(res.status_code, 200)


# ------------------------------------------------------------------ RBAC
class RoleBasedAccessTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.customer = make_user()
        self.admin = make_user("boss", "boss@example.com", role="admin")

    def test_is_admin_role_property(self):
        self.assertFalse(self.customer.is_admin_role)
        self.assertTrue(self.admin.is_admin_role)
        root = CustomUser.objects.create_superuser("root", "root@example.com", PASSWORD)
        self.assertTrue(root.is_admin_role)

    def test_anonymous_cannot_use_admin_endpoint(self):
        res = self.client.post("/api/add-products-bulk/", {"products": []}, format="json")
        self.assertEqual(res.status_code, 401)

    def test_customer_gets_403_on_admin_endpoints(self):
        client = self.auth_as(self.customer)
        self.assertEqual(client.post("/api/add-products-bulk/", {"products": []}, format="json").status_code, 403)
        self.assertEqual(client.post("/api/load-products/").status_code, 403)
        self.assertEqual(client.get("/api/test-email/").status_code, 403)

    def test_admin_can_add_products(self):
        payload = {"products": [{"name": "Dosa", "price": 80, "category": "Food", "rating": 4.4, "image": ""}]}
        res = self.auth_as(self.admin).post("/api/add-products-bulk/", payload, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(Product.objects.filter(name="Dosa").exists())

    def test_new_users_default_to_customer(self):
        self.assertEqual(CustomUser.objects.create_user("x", "x@example.com", PASSWORD).role, "customer")


# ------------------------------------------------------------------ Google login
class GoogleLoginTests(BaseAPITest):
    claims = {"email": "new.person@gmail.com", "email_verified": True,
              "name": "New Person", "picture": "https://img.example/p.png"}

    def post(self, credential="token"):
        return self.client.post("/api/google-login/", {"credential": credential}, format="json")

    def test_missing_credential(self):
        self.assertEqual(self.post(credential=None).status_code, 400)

    @patch.object(views, "_verify_google_token", side_effect=ValueError("bad"))
    def test_invalid_google_token(self, _):
        res = self.post()
        self.assertEqual(res.status_code, 401)
        self.assertNotIn("access", res.data)

    @patch.object(views, "_verify_google_token")
    def test_creates_account_for_new_google_user(self, mock_verify):
        mock_verify.return_value = self.claims
        res = self.post()
        self.assertEqual(res.status_code, 200)
        user = CustomUser.objects.get(email="new.person@gmail.com")
        self.assertEqual(user.role, "customer")
        self.assertFalse(user.has_usable_password())  # cannot be logged into with a password
        self.assertIsNone(user.phone)
        self.assertIn("access", res.data)

    @patch.object(views, "_verify_google_token")
    def test_existing_email_logs_into_same_account(self, mock_verify):
        existing = make_user("sam", "new.person@gmail.com")
        mock_verify.return_value = self.claims
        res = self.post()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["username"], existing.username)
        self.assertEqual(CustomUser.objects.filter(email="new.person@gmail.com").count(), 1)

    @patch.object(views, "_verify_google_token")
    def test_unverified_google_email_rejected(self, mock_verify):
        mock_verify.return_value = {**self.claims, "email_verified": False}
        self.assertEqual(self.post().status_code, 400)
        self.assertFalse(CustomUser.objects.filter(email="new.person@gmail.com").exists())

    @patch.object(views, "_verify_google_token")
    def test_username_collision_gets_suffix(self, mock_verify):
        make_user("NewPerson", "someone@example.com")
        mock_verify.return_value = self.claims
        self.post()
        self.assertEqual(CustomUser.objects.get(email="new.person@gmail.com").username, "NewPerson1")

    def test_not_configured_returns_401(self):
        with self.settings(GOOGLE_CLIENT_ID=""):
            self.assertEqual(self.post().status_code, 401)


# ------------------------------------------------------------------ data isolation
class IsolationTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.alice = make_user("alice", "alice@example.com")
        self.bob = make_user("bob", "bob@example.com")
        self.product = make_product()

    def test_cart_is_scoped_to_token_user_not_to_a_username_param(self):
        self.auth_as(self.alice).post("/api/add-cart/", {"product_id": self.product.id}, format="json")
        # Bob asks for alice's cart by name - the param is ignored
        res = self.auth_as(self.bob).get("/api/cart/", {"username": "alice"})
        self.assertEqual(res.data, [])

    def test_likes_are_private(self):
        self.auth_as(self.alice).post("/api/add-like/", {"id": self.product.id}, format="json")
        self.assertEqual(len(self.auth_as(self.alice).get("/api/likes/").data), 1)
        self.assertEqual(self.auth_as(self.bob).get("/api/likes/", {"username": "alice"}).data, [])

    def test_cannot_remove_someone_elses_cart_item(self):
        self.auth_as(self.alice).post("/api/add-cart/", {"product_id": self.product.id}, format="json")
        item = CartItem.objects.get(user=self.alice)
        self.auth_as(self.bob).post("/api/remove-cart/", {"id": item.id}, format="json")
        self.assertTrue(CartItem.objects.filter(id=item.id).exists())

    def test_cannot_change_someone_elses_quantity(self):
        self.auth_as(self.alice).post("/api/add-cart/", {"product_id": self.product.id}, format="json")
        item = CartItem.objects.get(user=self.alice)
        res = self.auth_as(self.bob).post("/api/update-quantity/", {"id": item.id, "quantity": 9}, format="json")
        self.assertEqual(res.status_code, 404)
        item.refresh_from_db()
        self.assertEqual(item.quantity, 1)

    def test_profile_update_changes_only_own_account(self):
        self.auth_as(self.bob).post("/api/update-profile/", {"username": "alice", "email": "hacked@example.com"}, format="json")
        self.alice.refresh_from_db()
        self.assertEqual(self.alice.email, "alice@example.com")

    def test_orders_are_private(self):
        Order.objects.create(user=self.alice, total_price=100)
        self.assertEqual(len(self.auth_as(self.alice).get("/api/orders/").data), 1)
        self.assertEqual(self.auth_as(self.bob).get("/api/orders/", {"username": "alice"}).data, [])


# ------------------------------------------------------------------ cart + orders
class CartAndOrderTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.user = make_user()
        self.client = self.auth_as(self.user)
        self.biryani = make_product("Biryani", price=300, offer=10)  # final price 270

    def test_add_to_cart_applies_offer_and_increments(self):
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        item = CartItem.objects.get(user=self.user)
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.price, 270.0)

    def test_add_unknown_product_404(self):
        self.assertEqual(self.client.post("/api/add-cart/", {"product_id": 9999}, format="json").status_code, 404)

    def test_quantity_must_be_positive(self):
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        item = CartItem.objects.get(user=self.user)
        self.assertEqual(self.client.post("/api/update-quantity/", {"id": item.id, "quantity": 0}, format="json").status_code, 400)

    def test_place_order_uses_database_prices_not_browser_prices(self):
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        tampered = {
            "items": [{"item_name": "Biryani", "price": 1, "quantity": 1}],  # browser claims Rs.1
            "address": "Chennai", "phone": "9000000000", "payment_method": "COD", "name": "Antony",
        }
        res = self.client.post("/api/order/", tampered, format="json")
        self.assertEqual(res.status_code, 200)
        order = Order.objects.get(id=res.data["order_id"])
        # 270 subtotal + 5% GST (13.5), free delivery (> 199)
        self.assertEqual(order.total_price, 283.5)
        self.assertEqual(order.items.get().price, 270.0)
        self.assertFalse(CartItem.objects.filter(user=self.user).exists())

    def test_delivery_charge_below_threshold(self):
        cheap = make_product("Tea", price=50)
        self.client.post("/api/add-cart/", {"product_id": cheap.id}, format="json")
        res = self.client.post("/api/order/", {"address": "x"}, format="json")
        order = Order.objects.get(id=res.data["order_id"])
        self.assertEqual(order.total_price, 92.5)  # 50 + 2.5 GST + 40 delivery

    def test_order_with_empty_cart_fails(self):
        self.assertEqual(self.client.post("/api/order/", {"items": []}, format="json").status_code, 400)

    def test_fallback_to_posted_items_still_prices_from_db(self):
        res = self.client.post("/api/order/", {"items": [{"item_name": "Biryani", "price": 1, "quantity": 2}]}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Order.objects.get(id=res.data["order_id"]).items.get().price, 270.0)

    def test_absurd_quantity_rejected(self):
        res = self.client.post("/api/order/", {"items": [{"item_name": "Biryani", "quantity": 100000}]}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_order_requires_login(self):
        self.assertEqual(APIClient().post("/api/order/", {"items": []}, format="json").status_code, 401)


# ------------------------------------------------------------------ invoice
class InvoiceTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.alice = make_user("alice", "alice@example.com")
        self.bob = make_user("bob", "bob@example.com")
        self.admin = make_user("boss", "boss@example.com", role="admin")
        self.order = Order.objects.create(user=self.alice, total_price=105, address="Chennai", payment_method="COD")
        OrderItem.objects.create(order=self.order, item_name="Biryani", price=100, quantity=1, image="")

    def url(self):
        return f"/api/invoice/{self.order.id}/"

    def test_owner_downloads_pdf(self):
        res = self.auth_as(self.alice).get(self.url())
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res["Content-Type"], "application/pdf")
        self.assertTrue(res.content.startswith(b"%PDF"))

    def test_other_customer_gets_404(self):
        self.assertEqual(self.auth_as(self.bob).get(self.url()).status_code, 404)

    def test_anonymous_gets_401(self):
        self.assertEqual(APIClient().get(self.url()).status_code, 401)

    def test_admin_can_download_any_invoice(self):
        self.assertEqual(self.auth_as(self.admin).get(self.url()).status_code, 200)

    def test_invoice_has_no_personal_phone_number(self):
        res = self.auth_as(self.alice).get(self.url())
        self.assertNotIn(b"97517", res.content)


# ------------------------------------------------------------------ OTP + register
class RegisterFlowTests(BaseAPITest):
    data = {"email": "new@example.com", "username": "newuser", "phone": "9000000002"}

    @patch.object(views, "send_email_otp", return_value=True)
    def test_send_otp_creates_otp_and_rate_limits(self, mock_send):
        self.assertEqual(self.client.post("/api/send-otp/", self.data, format="json").status_code, 200)
        self.assertTrue(OTP.objects.filter(email="new@example.com", otp_type="register").exists())
        mock_send.assert_called_once()
        self.assertEqual(self.client.post("/api/send-otp/", self.data, format="json").status_code, 429)

    def test_send_otp_missing_fields(self):
        self.assertEqual(self.client.post("/api/send-otp/", {}, format="json").status_code, 400)

    def test_phone_is_optional_for_otp(self):
        with patch.object(views, "send_email_otp", return_value=True):
            res = self.client.post("/api/send-otp/", {"email": "a@example.com", "username": "aa"}, format="json")
        self.assertEqual(res.status_code, 200)

    def test_send_otp_duplicate_username(self):
        make_user("newuser", "other@example.com")
        res = self.client.post("/api/send-otp/", self.data, format="json")
        self.assertEqual(res.status_code, 400)

    def test_verify_wrong_otp(self):
        res = self.client.post("/api/verify-register-otp/", {"email": "new@example.com", "otp": "000000"}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_verify_expired_otp(self):
        OTP.objects.create(email="new@example.com", otp="123456", otp_type="register",
                           last_sent_at=timezone.now() - timedelta(minutes=30))
        res = self.client.post("/api/verify-register-otp/", {"email": "new@example.com", "otp": "123456"}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_register_requires_verified_otp(self):
        res = self.client.post("/api/register/", {**self.data, "password": PASSWORD}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertFalse(CustomUser.objects.filter(email="new@example.com").exists())

    def test_register_rejects_weak_password(self):
        res = self.client.post("/api/register/", {**self.data, "password": "test@1234"}, format="json")  # no uppercase
        self.assertEqual(res.status_code, 400)

    @patch.object(views, "send_welcome_email")
    def test_full_register_then_login(self, _):
        OTP.objects.create(email="new@example.com", otp="123456", otp_type="register",
                           is_verified=True, last_sent_at=timezone.now())
        res = self.client.post("/api/register/", {**self.data, "password": PASSWORD}, format="json")
        self.assertEqual(res.status_code, 200)
        user = CustomUser.objects.get(email="new@example.com")
        self.assertEqual(user.role, "customer")           # nobody can self-register as admin
        self.assertTrue(user.check_password(PASSWORD))    # stored hashed
        self.assertEqual(self.login(email="new@example.com").status_code, 200)

    @patch.object(views, "send_welcome_email")
    def test_cannot_self_register_as_admin(self, _):
        OTP.objects.create(email="new@example.com", otp="123456", otp_type="register",
                           is_verified=True, last_sent_at=timezone.now())
        self.client.post("/api/register/", {**self.data, "password": PASSWORD, "role": "admin", "is_staff": True}, format="json")
        user = CustomUser.objects.get(email="new@example.com")
        self.assertEqual(user.role, "customer")
        self.assertFalse(user.is_staff)

    @patch.object(views, "send_welcome_email")
    def test_register_without_phone(self, _):
        OTP.objects.create(email="n@example.com", otp="123456", otp_type="register",
                           is_verified=True, last_sent_at=timezone.now())
        res = self.client.post("/api/register/", {"email": "n@example.com", "username": "nn", "password": PASSWORD}, format="json")
        self.assertEqual(res.status_code, 200)


# ------------------------------------------------------------------ public endpoints
class PublicEndpointTests(BaseAPITest):
    def test_products_are_public(self):
        make_product()
        res = self.client.get("/api/products/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["products"]), 1)

    def test_health_is_public(self):
        self.assertEqual(self.client.get("/api/health/").status_code, 200)


# ------------------------------------------------------------------ admin dashboard
class AdminDashboardTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.customer = make_user()
        self.admin = make_user("boss", "boss@example.com", role="admin")
        self.biryani = make_product("Biryani", price=300)
        self.dosa = make_product("Dosa", price=80, is_active=False)
        self.order1 = Order.objects.create(user=self.customer, total_price=300, status="Pending")
        self.order2 = Order.objects.create(user=self.customer, total_price=100, status="Delivered")
        OrderItem.objects.create(order=self.order1, item_name="Biryani", price=300, quantity=2, image="")

    # ---- access control
    def test_every_admin_endpoint_blocks_customers_and_anonymous(self):
        urls = [
            ("get", "/api/admin/stats/"),
            ("get", "/api/admin/orders/"),
            ("get", "/api/admin/products/"),
            ("post", f"/api/admin/orders/{self.order1.id}/status/"),
            ("post", f"/api/admin/products/{self.biryani.id}/toggle/"),
        ]
        for method, url in urls:
            anon = getattr(APIClient(), method)(url, format="json")
            cust = getattr(self.auth_as(self.customer), method)(url, format="json")
            self.assertEqual(anon.status_code, 401, url)
            self.assertEqual(cust.status_code, 403, url)

    # ---- stats
    def test_stats_numbers(self):
        res = self.auth_as(self.admin).get("/api/admin/stats/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["users"], 2)
        self.assertEqual(res.data["products"], 1)          # inactive dish not counted
        self.assertEqual(res.data["orders"], 2)
        self.assertEqual(res.data["revenue"], 400)
        self.assertEqual(res.data["by_status"]["Pending"], 1)
        self.assertEqual(res.data["by_status"]["Delivered"], 1)
        self.assertEqual(res.data["by_status"]["Preparing"], 0)

    # ---- orders
    def test_orders_list_and_filter(self):
        client = self.auth_as(self.admin)
        res = client.get("/api/admin/orders/")
        self.assertEqual(len(res.data["orders"]), 2)
        self.assertEqual(res.data["orders"][0]["customer"], "antony")
        only = client.get("/api/admin/orders/", {"status": "Delivered"})
        self.assertEqual([o["id"] for o in only.data["orders"]], [self.order2.id])

    def test_orders_ignores_unknown_status_filter_and_bad_page(self):
        res = self.auth_as(self.admin).get("/api/admin/orders/", {"status": "Hacked", "page": "abc"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["orders"]), 2)

    def test_items_count_sums_quantities(self):
        rows = self.auth_as(self.admin).get("/api/admin/orders/", {"status": "Pending"}).data["orders"]
        self.assertEqual(rows[0]["items_count"], 2)

    def test_update_order_status(self):
        res = self.auth_as(self.admin).post(
            f"/api/admin/orders/{self.order1.id}/status/", {"status": "Preparing"}, format="json")
        self.assertEqual(res.status_code, 200)
        self.order1.refresh_from_db()
        self.assertEqual(self.order1.status, "Preparing")

    def test_update_order_status_rejects_invalid_value(self):
        res = self.auth_as(self.admin).post(
            f"/api/admin/orders/{self.order1.id}/status/", {"status": "Teleported"}, format="json")
        self.assertEqual(res.status_code, 400)
        self.order1.refresh_from_db()
        self.assertEqual(self.order1.status, "Pending")

    def test_update_unknown_order_404(self):
        res = self.auth_as(self.admin).post("/api/admin/orders/9999/status/", {"status": "Pending"}, format="json")
        self.assertEqual(res.status_code, 404)

    # ---- products
    def test_admin_products_include_inactive_and_search(self):
        client = self.auth_as(self.admin)
        names = [p["name"] for p in client.get("/api/admin/products/").data["products"]]
        self.assertCountEqual(names, ["Biryani", "Dosa"])
        found = client.get("/api/admin/products/", {"q": "dos"}).data
        self.assertEqual([p["name"] for p in found["products"]], ["Dosa"])

    def test_toggle_product_hides_and_shows_it_publicly(self):
        client = self.auth_as(self.admin)
        res = client.post(f"/api/admin/products/{self.biryani.id}/toggle/", format="json")
        self.assertFalse(res.data["is_active"])
        public = APIClient().get("/api/products/").data["products"]
        self.assertNotIn("Biryani", [p["name"] for p in public])
        client.post(f"/api/admin/products/{self.biryani.id}/toggle/", format="json")
        public = APIClient().get("/api/products/").data["products"]
        self.assertIn("Biryani", [p["name"] for p in public])


class InvoiceRobustnessTests(BaseAPITest):
    def test_invoice_survives_markup_characters_in_user_input(self):
        user = make_user()
        order = Order.objects.create(
            user=user, total_price=100, name="Tom & <b>Jerry</b>",
            address="12 <Main> St & 3rd Ave", payment_method="UPI", status="Delivered",
        )
        OrderItem.objects.create(order=order, item_name="Chicken <65> & Fries", price=100, quantity=1, image="")
        res = self.auth_as(user).get(f"/api/invoice/{order.id}/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.content.startswith(b"%PDF"))

    def test_invoice_with_many_items_paginates(self):
        user = make_user()
        order = Order.objects.create(user=user, total_price=100, address="x")
        for i in range(60):
            OrderItem.objects.create(order=order, item_name=f"Dish number {i} with a fairly long descriptive name", price=10, quantity=1, image="")
        res = self.auth_as(user).get(f"/api/invoice/{order.id}/")
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.content.count(b"/Type /Page\n"), 2)


class DjangoAdminSiteTests(BaseAPITest):
    """The themed Django admin (/legend-admin/) still renders."""

    def test_login_page_renders(self):
        self.assertEqual(self.client.get("/legend-admin/login/").status_code, 200)

    def test_superuser_can_open_main_lists(self):
        root = CustomUser.objects.create_superuser("root", "root@example.com", PASSWORD)
        self.client.force_login(root)
        for path in ("/legend-admin/", "/legend-admin/accounts/order/",
                     "/legend-admin/accounts/product/", "/legend-admin/accounts/customuser/"):
            self.assertEqual(self.client.get(path).status_code, 200, path)


# ------------------------------------------------------------------ buy now, product detail, profile photo
class BuyNowAndDetailTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.user = make_user()
        self.client = self.auth_as(self.user)
        self.biryani = make_product("Biryani", price=300)
        self.dosa = make_product("Dosa", price=100)

    def test_buy_now_orders_only_the_posted_dish_and_keeps_the_rest_of_the_cart(self):
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        res = self.client.post("/api/order/", {
            "items": [{"product_id": self.dosa.id, "item_name": "Dosa", "price": 1, "quantity": 2}],
            "address": "Chennai",
        }, format="json")
        self.assertEqual(res.status_code, 200)
        order = Order.objects.get(id=res.data["order_id"])
        self.assertEqual([(i.item_name, i.quantity) for i in order.items.all()], [("Dosa", 2)])
        self.assertEqual(order.total_price, 210.0)  # 200 + 5% GST, free delivery above 199
        self.assertTrue(CartItem.objects.filter(user=self.user, product_id=self.biryani.id).exists())

    def test_ordering_cart_items_removes_only_those_from_the_cart(self):
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        self.client.post("/api/add-cart/", {"product_id": self.dosa.id}, format="json")
        self.client.post("/api/order/", {"items": [{"product_id": self.biryani.id, "quantity": 1}]}, format="json")
        left = CartItem.objects.filter(user=self.user)
        self.assertEqual([c.product_id for c in left], [self.dosa.id])

    def test_product_id_beats_item_name(self):
        res = self.client.post("/api/order/", {"items": [{"product_id": self.dosa.id, "item_name": "Biryani", "quantity": 1}]}, format="json")
        self.assertEqual(Order.objects.get(id=res.data["order_id"]).items.get().item_name, "Dosa")

    def test_inactive_dish_cannot_be_ordered(self):
        self.dosa.is_active = False
        self.dosa.save()
        res = self.client.post("/api/order/", {"items": [{"product_id": self.dosa.id, "quantity": 1}]}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_cart_payload_includes_product_id(self):
        self.client.post("/api/add-cart/", {"product_id": self.biryani.id}, format="json")
        self.assertEqual(self.client.get("/api/cart/").data[0]["product_id"], self.biryani.id)

    def test_product_detail_is_public(self):
        res = APIClient().get(f"/api/products/{self.biryani.id}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["name"], "Biryani")

    def test_product_detail_404_for_missing_or_inactive(self):
        self.dosa.is_active = False
        self.dosa.save()
        self.assertEqual(APIClient().get(f"/api/products/{self.dosa.id}/").status_code, 404)
        self.assertEqual(APIClient().get("/api/products/99999/").status_code, 404)


class ProfilePhotoTests(BaseAPITest):
    def test_oversized_photo_rejected(self):
        user = make_user()
        res = self.auth_as(user).post("/api/update-profile/", {"image": "data:image/jpeg;base64," + "A" * 250_000}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_small_photo_saved(self):
        user = make_user()
        res = self.auth_as(user).post("/api/update-profile/", {"image": "data:image/jpeg;base64,AAAA"}, format="json")
        self.assertEqual(res.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.image.startswith("data:image/jpeg"))

    def test_login_payload_never_carries_a_big_photo(self):
        user = make_user()
        user.image = "data:image/jpeg;base64," + "A" * 5000
        user.save()
        self.assertIsNone(self.login().data["image"])


class AddToCartQuantityTests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.user = make_user()
        self.client = self.auth_as(self.user)
        self.dish = make_product("Biryani", price=300)

    def test_quantity_is_added(self):
        self.client.post("/api/add-cart/", {"product_id": self.dish.id, "quantity": 3}, format="json")
        self.client.post("/api/add-cart/", {"product_id": self.dish.id, "quantity": 2}, format="json")
        self.assertEqual(CartItem.objects.get(user=self.user).quantity, 5)

    def test_quantity_defaults_to_one_and_is_capped(self):
        self.client.post("/api/add-cart/", {"product_id": self.dish.id}, format="json")
        self.assertEqual(CartItem.objects.get(user=self.user).quantity, 1)
        self.client.post("/api/add-cart/", {"product_id": self.dish.id, "quantity": 9999}, format="json")
        self.assertEqual(CartItem.objects.get(user=self.user).quantity, 50)

    def test_garbage_quantity_falls_back_to_one(self):
        self.client.post("/api/add-cart/", {"product_id": self.dish.id, "quantity": "lots"}, format="json")
        self.assertEqual(CartItem.objects.get(user=self.user).quantity, 1)


class PublicEndpointsIgnoreStaleTokenTests(BaseAPITest):
    """An expired or garbage token must never break pages that do not need a login."""

    def test_product_list_and_detail_work_with_a_garbage_token(self):
        dish = make_product("Biryani")
        client = self.bearer("expired.or.garbage")
        self.assertEqual(client.get("/api/products/").status_code, 200)
        self.assertEqual(client.get(f"/api/products/{dish.id}/").status_code, 200)
