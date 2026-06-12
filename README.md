# <p align="center">⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡ — Full Stack Food Delivery App</p>

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
  <img src="./assets/hero.png" alt="⚡Legend💫 Hero Banner" width="85%"/>
</p>

---

## 📚 Project Overview

**⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡** is a **production-grade, multi-vendor food delivery web application** inspired by platforms like Swiggy and Zomato. Built with a modern **React + Vite** frontend and a powerful **Django + DRF** backend, it supports multiple restaurants, real-time order tracking, JWT authentication, and seamless CI/CD via **GitHub Actions** — deployed on **Vercel** (frontend) and **Render** (backend).

> 🔗 **Live App:** [https://e-commerce-app-food.vercel.app/profile](https://e-commerce-app-food.vercel.app/profile)

---

## ✨ Features

### 👤 User Side
- 🍽️ **Multi-vendor menu** — browse restaurants & filter by cuisine, rating, price
- 🔍 **Smart search** — search dishes or restaurants instantly
- 🛒 **Cart & Checkout** — add items from multiple vendors, seamless checkout flow
- 💳 **Payment Integration** — Razorpay / Stripe mock payment gateway
- 📦 **Order Tracking** — real-time order status updates
- 🕒 **Order History** — view and reorder past orders
- 👤 **User Profile** — manage personal info, addresses, preferences

### 🛠️ Admin Side
- 🏪 **Vendor Management** — approve/reject restaurant registrations
- 🍔 **Menu Management** — CRUD for food items, categories, pricing
- 📋 **Order Management** — view, filter, update order statuses
- 💰 **Payment Dashboard** — transaction history, export CSV
- 👥 **User Management** — suspend/activate users

### ⚙️ Technical
- 🔐 **JWT Authentication** — secure login, signup, token refresh
- 🚀 **CI/CD Pipeline** — auto lint, test, build & deploy via GitHub Actions
- 🐳 **Dockerised** — containerised backend for consistent environments
- 📱 **Responsive Design** — mobile-first UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Django, Django REST Framework |
| **Authentication** | JWT (djangorestframework-simplejwt) |
| **Database** | PostgreSQL (prod) • SQLite (dev) |
| **Payment** | Razorpay / Stripe |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel (frontend) • Render (backend) |
| **Containerisation** | Docker |

---

## 📁 Project Folder Structure

```text
legend-food-app/
├─ .github/                  # GitHub Actions workflows
│   └─ ci.yml
├─ backend/                  # Django project
│   ├─ manage.py
│   ├─ core/
│   │   ├─ settings.py
│   │   ├─ urls.py
│   │   └─ wsgi.py
│   ├─ apps/
│   │   ├─ users/            # User auth & profiles
│   │   ├─ vendors/          # Restaurant / vendor management
│   │   ├─ foods/            # Menu items & categories
│   │   ├─ orders/           # Order processing
│   │   └─ payments/         # Payment handling
│   ├─ Dockerfile
│   └─ requirements.txt
└─ frontend/                 # React + Vite
    ├─ index.html
    ├─ src/
    │   ├─ App.jsx
    │   ├─ main.jsx
    │   ├─ routes/
    │   ├─ components/
    │   │   ├─ Navbar/
    │   │   ├─ RestaurantCard/
    │   │   ├─ Cart/
    │   │   └─ OrderTracker/
    │   └─ services/
    │       └─ api.js
    ├─ tailwind.config.js
    ├─ vite.config.js
    └─ package.json
```

---

## ⚙️ Installation Guide

```bash
# Clone the repository
git clone https://github.com/antonyvenis/food-delivery-app.git
cd food-delivery-app
```

### 📦 Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev   # → http://localhost:5173
```

### 🐍 Backend Setup

```bash
cd ../backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
source venv/Scripts/activate    # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver   # → http://127.0.0.1:8000
```

### 🌱 Environment Variables

Create a `.env` file inside `backend/` and `frontend/`:

**`backend/.env`**
```env
DJANGO_SECRET_KEY=your_secret_key_here
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=legend_food_db
JWT_ACCESS_LIFETIME=5
JWT_REFRESH_LIFETIME=1
```

**`frontend/.env`**
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | User registration |
| `POST` | `/api/auth/login/` | Login & get JWT tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh access token |
| `GET` | `/api/vendors/` | List all restaurants |
| `GET` | `/api/foods/` | List all menu items |
| `GET` | `/api/foods/?vendor=1` | Filter menu by restaurant |
| `POST` | `/api/orders/` | Place a new order |
| `GET` | `/api/orders/my/` | Get user's order history |
| `PATCH` | `/api/orders/:id/` | Update order status (admin) |
| `POST` | `/api/payments/initiate/` | Initiate payment |

> 📄 Full API docs available at `/api/docs/` (Swagger UI) after running the backend.

---

## 📸 Screenshots

<p align="center">
  <img src="./assets/home.png" alt="Home Page" width="30%"/>
  &nbsp;
  <img src="./assets/restaurants.png" alt="Restaurants Page" width="30%"/>
  &nbsp;
  <img src="./assets/menu.png" alt="Menu Page" width="30%"/>
</p>
<p align="center">
  <b>Home</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>Restaurants</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>Menu</b>
</p>

<p align="center">
  <img src="./assets/cart.png" alt="Cart Page" width="30%"/>
  &nbsp;
  <img src="./assets/order-tracking.png" alt="Order Tracking" width="30%"/>
  &nbsp;
  <img src="./assets/admin.png" alt="Admin Dashboard" width="30%"/>
</p>
<p align="center">
  <b>Cart</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>Order Tracking</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>Admin Dashboard</b>
</p>

---

## 🚀 Deployment Guide

### Frontend — Vercel
1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set **Framework Preset** → `Vite`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Click **Deploy** ✅

### Backend — Render
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect GitHub repo → select `backend/` as root directory
3. Set **Runtime** → `Python 3`
4. Add a **PostgreSQL** instance and link it
5. Add all environment variables from `backend/.env`
6. Enable **Auto-Deploy** from `main` branch ✅

### CI/CD — GitHub Actions
- On every push to `main`: lint → test → build → deploy
- Docker image is built and pushed to Render automatically

---

## 🔮 Future Improvements

- [ ] 🗺️ Live GPS delivery tracking (Google Maps API)
- [ ] 🤖 AI-powered food recommendations
- [ ] 💬 In-app chat between customer & restaurant
- [ ] 📲 PWA — installable mobile app
- [ ] 🌐 Multi-language support (Tamil, Hindi, English)
- [ ] 📊 Analytics dashboard for vendors

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/awesome-feature`
3. Commit your changes: `git commit -m "Add awesome feature"`
4. Push to branch: `git push origin feat/awesome-feature`
5. Open a **Pull Request** with a clear description ✅

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/antonyvenis">Antony Venis T</a> &nbsp;•&nbsp; <a href="https://e-commerce-app-food.vercel.app/profile">Live Demo</a> &nbsp;•&nbsp; <a href="https://antony-venis-t-portfolio.vercel.app">Portfolio</a></sub>
</div>