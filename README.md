# <p align="center">⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡</p>
<p align="center">
  <b>A Production-Grade, Multi-Vendor Food Delivery Web Application</b>
</p>

<div align="center">
  <a href="https://e-commerce-app-food.vercel.app/profile"><img src="https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-brightgreen?style=for-the-badge" alt="Live Demo"></a>
  <a href="https://github.com/antonyvenis/food-delivery-app"><img src="https://img.shields.io/github/stars/antonyvenis/food-delivery-app?style=for-the-badge&logo=github&color=ffcb2b" alt="GitHub stars"></a>
  <a href="https://github.com/antonyvenis/food-delivery-app/network/members"><img src="https://img.shields.io/github/forks/antonyvenis/food-delivery-app?style=for-the-badge&logo=github&color=ffcb2b" alt="GitHub forks"></a>
  <a href="https://github.com/antonyvenis/food-delivery-app/blob/main/LICENSE"><img src="https://img.shields.io/github/license/antonyvenis/food-delivery-app?style=for-the-badge&color=ffcb2b" alt="License"></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel"></a>
  <a href="https://render.com"><img src="https://img.shields.io/badge/Backend-Render-000000?style=for-the-badge&logo=render" alt="Render"></a>
</div>

---

## 🖼️ Hero Banner

<p align="center">
  <img src="./assets/hero.png" alt="⚡Legend💫 Food Delivery App Banner" width="85%"/>
</p>

---

## 📚 Project Overview

**⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡** is a high-performance, multi-vendor food delivery web application designed to emulate industry leaders such as Swiggy and Zomato. The project features a responsive, mobile-first frontend built with **React**, **Vite**, and **Tailwind CSS**, communicating with a robust **Django REST Framework (DRF)** backend. 

Key technical highlights include secure JWT-based authentication, interactive order states, and a scalable database architecture supporting SQLite for development and PostgreSQL for production. The backend is fully containerised using Docker, and the application benefits from an automated CI/CD pipeline built with GitHub Actions, enabling seamless deployment to Vercel (frontend) and Render (backend).

---

## ✨ Features

### 👤 User Features
* **Multi-Vendor Browsing:** Explore a wide directory of registered restaurants, filtering by cuisine types, customer ratings, and price ranges.
* **Smart Search:** Retrieve dishes and restaurants instantaneously using optimized search queries.
* **Seamless Checkout Flow:** Manage items inside a dynamic cart, select preferred delivery addresses, and initiate payments.
* **Payment Gateway Mocking:** Integrated checkout simulation supporting Razorpay and Stripe interfaces.
* **Real-Time Order Status:** View active order updates (Pending, Preparing, Out for Delivery, Delivered) via interactive tracking components.
* **Comprehensive Order History:** Look up detailed invoice structures and reorder from historical entries.
* **Profile Management:** Edit personal credentials, phone details, avatar references, and address books.

### 🛠️ Admin Features
* **Vendor Approval System:** Review and authorise or decline incoming restaurant registration requests.
* **Menu Control (CRUD):** Complete control over dish creation, pricing strategies, offers, and categories.
* **Order Orchestration:** Monitor and modify order statuses across the platform.
* **Payment Dashboard:** Retrieve transactional logs and examine purchase records.
* **User Administration:** Activate or deactivate user profiles to ensure safety and system policy compliance.

### ⚙️ Technical Highlights
* **Secure Session Management:** Cryptographically signed JSON Web Tokens (JWT) for authentication and auto-refresh mechanisms.
* **Containerised Architecture:** Dockerised environments to maintain configuration parity between development, testing, and staging environments.
* **Automated CI/CD:** GitHub Actions workflows for continuous linting, building, and deployments.
* **Responsive Styling:** Mobile-first user interfaces designed with utility-first Tailwind CSS classes.

---

## 🛠️ Tech Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | **React (v18)**, **Vite**, **Tailwind CSS** | Declarative components, lightning-fast HMR, and utility-first styling. |
| **Backend** | **Django**, **Django REST Framework (DRF)** | Python-based web framework optimizing database interaction and REST API designs. |
| **Auth** | **JWT (dj-rest-auth / SimpleJWT)** | Secure token exchange, stateless authorization, and token refreshing. |
| **Database** | **PostgreSQL** (Prod), **SQLite** (Dev) | Enterprise-ready database in production; lightweight relational DB locally. |
| **Payment** | **Razorpay**, **Stripe** | Robust checkout and payment gateway integrations. |
| **Deployment** | **Vercel** (Frontend), **Render** (Backend) | Globally distributed CDN hosting and automated web service platforms. |
| **CI/CD** | **GitHub Actions** | Pipeline automation for automated code verification and delivery. |
| **Container** | **Docker** | Consistent application virtualization across platforms. |

### 🔐 Authentication Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as React Client (Frontend)
    actor Backend as Django REST API (Backend)
    
    User->>Backend: POST /api/auth/login/ (Credentials)
    Note over Backend: Validate Credentials & Generate Tokens
    Backend-->>User: 200 OK (Access Token & Refresh Token)
    Note over User: Save Tokens in Local Storage / State
    
    User->>Backend: GET /api/profile/ (Authorization: Bearer <access_token>)
    Backend-->>User: 200 OK (User Details)
    
    Note over User: Access Token Expires
    User->>Backend: POST /api/auth/token/refresh/ (Refresh Token)
    Backend-->>User: 200 OK (New Access Token)
```

### 🔄 Order & Payment Lifecycle Flow
```mermaid
graph TD
    A[🛒 Browse Products] --> B{Add to Cart?}
    B -- Yes --> C[Update CartContext State]
    B -- No --> A
    C --> D[Go to Cart & Review]
    D --> E{User Authenticated?}
    E -- No --> F[Redirect to Login/Register]
    F --> G[Verify OTP Code]
    G --> E
    E -- Yes --> H[Proceed to Checkout]
    H --> I[Input Delivery Address & Contact]
    I --> J[Submit Order: POST /api/order/]
    J --> K[Backend Creates Order & Items in Pending State]
    K --> L[Initiate Mock Payment Gateway]
    L --> M{Payment Successful?}
    M -- Yes --> N[Backend Updates Status to Preparing & Generates Invoice]
    N --> O[Redirect to Success Page]
    O --> P[Track Live Status Updates on Orders Page]
    M -- No --> Q[Display Error & Retain Cart Items]
    Q --> I
```

---

## 📁 Folder Structure

```text
legend-food-app/
├─ backend/                      # Django REST backend application
│  ├─ manage.py                  # Django CLI management utility
│  ├─ db.sqlite3                 # Local SQLite database (development environment)
│  ├─ requirements.txt           # Python backend dependencies
│  ├─ runtime.txt                # Python runtime specification (for deployment)
│  ├─ Procfile                   # Process file for web runner (Gunicorn)
│  ├─ staticfiles/               # Collected static files directory
│  ├─ backend/                   # Core Django configurations settings
│  │  ├─ settings.py             # Global configurations & app registrations
│  │  ├─ urls.py                 # Core routing configurations
│  │  └─ wsgi.py / asgi.py       # WSGI/ASGI entrypoints
│  └─ accounts/                  # Primary backend feature application
│     ├─ models.py               # DB schemas (CustomUser, OTP, Like, CartItem, Order, OrderItem, Product)
│     ├─ views.py                # Main request handlers & business logic
│     ├─ urls.py                 # Route maps for endpoints under /api/
│     ├─ serializers.py          # Data validation & serialization layers
│     ├─ utils.py                # OTP helpers & invoice generation tools
│     ├─ products.json           # Database seeding products data
│     ├─ load_products.py        # Seed automation script
│     └─ uploadProducts.js       # Node automation script
└─ frontend/                     # React + Vite frontend application
   ├─ index.html                 # HTML main entrypoint
   ├─ package.json               # Frontend dependencies & npm script configurations
   ├─ vercel.json                # Single page app routing configs for Vercel
   └─ src/                       # Source directory
      ├─ main.jsx                # Render mount entrypoint
      ├─ App.jsx                 # Routes management & global states
      ├─ App.css / index.css     # Global styles & layout properties
      └─ pages/                  # Unified component views & state context
         ├─ Home.jsx             # Dashboard & item display page
         ├─ Menu.jsx / Food.jsx  # Restaurant lists and food display views
         ├─ Cart.jsx             # Shopping cart panel
         ├─ CartContext.jsx      # Global cart context state provider
         ├─ Payment.jsx          # Stripe / Razorpay simulated checkout screen
         ├─ Orders.jsx           # Order tracking list & dynamic statuses
         ├─ Profile.jsx          # Profile details & update forms
         ├─ Login.jsx / Register.jsx # Authentication views
         └─ OTP.jsx              # OTP code confirmation page
```


---

## ⚙️ Installation Guide

Follow these steps to run a local instance of the application:

### 📋 Prerequisites
* Python 3.10+
* Node.js v18+
* Docker Desktop (optional, for containerized runtimes)

### 📥 Repository Setup
```bash
# Clone the repository
git clone https://github.com/antonyvenis/food-delivery-app.git
cd food-delivery-app
```

### 📦 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite local development server:
   ```bash
   npm run dev
   ```
   *The client will run on: **http://localhost:5173***

### 🐍 Backend Setup
1. Open a new terminal in the backend directory:
   ```bash
   cd backend
   ```
2. Set up and activate a Python virtual environment:
   ```bash
   # Linux/macOS
   python -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install package dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations:
   ```bash
   python manage.py migrate
   ```
5. Create an administrator (superuser) profile:
   ```bash
   python manage.py createsuperuser
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```
   *The backend REST API will run on: **http://127.0.0.1:8000***

### 🌱 Environment Variables

Construct local `.env` files in their respective folders to secure API secrets and access URLs:

**`backend/.env`**
```env
DJANGO_SECRET_KEY=your_django_production_secret_key
DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/legend_db
JWT_ACCESS_LIFETIME=5
JWT_REFRESH_LIFETIME=1
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**`frontend/.env`**
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 📡 API Endpoints

All core endpoints are exposed under the `/api` prefix path.

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/register/` | Register a new user profile | No |
| **Authentication** | `POST` | `/api/auth/login/` | Validate credentials & issue JWT tokens | No |
| **Authentication** | `POST` | `/api/auth/token/refresh/` | Renew an expired access JWT token | Yes (Refresh) |
| **Directory** | `GET` | `/api/vendors/` | Retrieve a listing of all active vendors | No |
| **Menu Items** | `GET` | `/api/foods/` | Retrieve details for all menu dishes | No |
| **Menu Items** | `GET` | `/api/foods/?vendor=1` | Filter menu items of a specific vendor | No |
| **Orders** | `POST` | `/api/orders/` | Place a food order from cart configuration | Yes |
| **Orders** | `GET` | `/api/orders/my/` | List order history of the logged-in user | Yes |
| **Orders** | `PATCH`| `/api/orders/:id/` | Modify status of an order (Admin/Vendor) | Yes (Admin) |
| **Payments** | `POST` | `/api/payments/initiate/` | Initialise payment gateway workflows | Yes |

---

## 📸 Screenshots

<div align="center">
  <table border="0">
    <tr>
      <td align="center" width="33%">
        <img src="./assets/home.png" alt="Home Screen" width="100%"/><br/>
        <b>🏠 Home Screen</b>
      </td>
      <td align="center" width="33%">
        <img src="./assets/restaurants.png" alt="Restaurant List" width="100%"/><br/>
        <b>🏪 Restaurant Directory</b>
      </td>
      <td align="center" width="33%">
        <img src="./assets/menu.png" alt="Menu Listing" width="100%"/><br/>
        <b>🍔 Food Menus</b>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <img src="./assets/cart.png" alt="Cart view" width="100%"/><br/>
        <b>🛒 Cart & Checkout</b>
      </td>
      <td align="center" width="33%">
        <img src="./assets/order-tracking.png" alt="Order Tracking" width="100%"/><br/>
        <b>📦 Live Order Tracker</b>
      </td>
      <td align="center" width="33%">
        <img src="./assets/admin.png" alt="Admin Dashboard" width="100%"/><br/>
        <b>📊 Admin Panel</b>
      </td>
    </tr>
  </table>
</div>

---

## 🚀 Deployment Guide

### 📱 Frontend Deployment (Vercel)
1. Register/Login to [Vercel](https://vercel.com) and link your GitHub account.
2. Select **New Project** and import the `food-delivery-app` repository.
3. Configure the **Root Directory** as `frontend`.
4. Select `Vite` under the **Framework Preset**.
5. Add the necessary Environment Variables:
   * `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
6. Click **Deploy**. Vercel will build and route the production bundle automatically.

### ⚙️ Backend Deployment (Render)
1. Log in to [Render](https://render.com) and navigate to the dashboard.
2. Click **New +** and select **Web Service**.
3. Link the backend repository, specifying the **Root Directory** as `backend`.
4. Choose `Python 3` as the runtime environment.
5. Set the build and start commands:
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `gunicorn core.wsgi:application` *(Update to match your wsgi configurations)*
6. Provision a managed **PostgreSQL Database** on Render.
7. Configure all environment variables in the **Environment** tab:
   * Set `DJANGO_SECRET_KEY`, `DEBUG=False`, and bind the `DATABASE_URL` connection string.
8. Run the service deployment.

### 🤖 CI/CD Automation (GitHub Actions)
The repository contains a pre-configured workflow at [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml).
* On every code push or pull request to the `main` branch, the runner performs syntax validation, code testing, and bundle tests.
* Upon successful status checks, deployment webhooks are fired to trigger live updates on Render and Vercel automatically.

---

## 🔮 Future Improvements

- [ ] **🗺️ Real-time GPS Tracking:** Integrate Google Maps API to track delivery partners dynamically on a live map.
- [ ] **🤖 AI recommendations:** Train neural networks on user consumption patterns to suggest personalized dishes.
- [ ] **💬 In-App Support Chat:** Establish real-time communication networks between customers, vendors, and delivery agents using WebSockets.
- [ ] **📲 PWA Integration:** Provide cross-platform mobile installation capabilities using Progressive Web App standardizations.
- [ ] **🌐 Multi-Language localization:** Expand accessibility with native language selections (English, Tamil, Hindi).
- [ ] **📊 Vendor Business Analytics:** Visualise performance metrics, revenue growth charts, and item frequency logs on vendor consoles.

---

## 🤝 Contributing

Contributions are welcomed to improve the features of **⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡**:

1. Fork the Project Repository.
2. Create your Feature Branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push code to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Initiate a **Pull Request** detailing changes for developer review.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) file details for terms of use.

---

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/antonyvenis">Antony Venis T</a> &nbsp;•&nbsp; <a href="https://e-commerce-app-food.vercel.app/profile">Live Demo</a> &nbsp;•&nbsp; <a href="https://antony-venis-t-portfolio.vercel.app">Portfolio</a></sub>
</div>