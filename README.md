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

<style>
.hero-banner-body * {
  margin: 0; padding: 0; box-sizing: border-box;
}
.hero-banner-body {
  background: #0A0A0F;
  font-family: 'Inter', sans-serif;
}
.hero-banner-body .hero {
  background: #0A0A0F;
  min-height: 560px;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 56px 56px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.hero-banner-body .bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
.hero-banner-body .glow1 { background: rgba(255, 69, 0, 0.2); width: 500px; height: 500px; top: -120px; left: -80px; }
.hero-banner-body .glow2 { background: rgba(255, 184, 0, 0.1); width: 380px; height: 380px; bottom: -80px; right: 60px; }
.hero-banner-body .glow3 { background: rgba(255, 69, 0, 0.07); width: 240px; height: 240px; top: 50%; right: 28%; transform: translateY(-50%); }
.hero-banner-body .grid-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
}
.hero-banner-body .content {
  position: relative; z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 40px;
}
.hero-banner-body .left { flex: 1; max-width: 540px; }
.hero-banner-body .eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255, 69, 0, 0.12);
  border: 1px solid rgba(255, 69, 0, 0.28);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #FF6B35;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 22px;
}
.hero-banner-body .eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #FF4500;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.4; transform: scale(0.75) } }
.hero-banner-body .brand {
  font-family: 'Syne', sans-serif;
  font-size: clamp(40px, 5.5vw, 64px);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 18px;
  background: linear-gradient(135deg, #FFFFFF 0%, #FFD166 35%, #FF4500 65%, #FF6B35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 220% auto;
  animation: shimmer 4.5s linear infinite;
}
@keyframes shimmer { 0% { background-position: 0% center } 100% { background-position: 220% center } }
.hero-banner-body .tagline {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 400px;
}
.hero-banner-body .tagline span { color: rgba(255, 184, 0, 0.9); font-weight: 600; }
.hero-banner-body .stats {
  display: flex; gap: 32px; margin-bottom: 36px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.hero-banner-body .stat { display: flex; flex-direction: column; gap: 3px; }
.hero-banner-body .stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 24px; font-weight: 700;
  color: #fff;
}
.hero-banner-body .stat-label { font-size: 11px; color: rgba(255, 255, 255, 0.3); letter-spacing: 0.06em; text-transform: uppercase; }
.hero-banner-body .stack-row {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 28px; flex-wrap: wrap;
}
.hero-banner-body .stack-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px; font-weight: 500;
  padding: 4px 10px; border-radius: 100px;
}
.hero-banner-body .stack-tag.hot {
  background: rgba(255, 69, 0, 0.1);
  border-color: rgba(255, 69, 0, 0.2);
  color: #FF6B35;
}
.hero-banner-body .cta-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.hero-banner-body .btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #FF4500, #FF6B35);
  color: #fff !important;
  border: none;
  padding: 13px 26px;
  border-radius: 10px;
  font-size: 14px; font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 24px rgba(255, 69, 0, 0.38);
  font-family: 'Inter', sans-serif;
}
.hero-banner-body .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255, 69, 0, 0.52); }
.hero-banner-body .btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 13px 22px;
  border-radius: 10px;
  font-size: 14px; font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  font-family: 'Inter', sans-serif;
}
.hero-banner-body .btn-secondary:hover { background: rgba(255, 255, 255, 0.09); border-color: rgba(255, 255, 255, 0.2); }
.hero-banner-body .right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-end;
}
.hero-banner-body .card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 18px;
  backdrop-filter: blur(16px);
  position: relative;
}
.hero-banner-body .main-card { width: 250px; }
.hero-banner-body .food-emoji { font-size: 38px; margin-bottom: 12px; display: block; line-height: 1; }
.hero-banner-body .food-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 3px; }
.hero-banner-body .food-rest { font-size: 11px; color: rgba(255, 255, 255, 0.3); margin-bottom: 10px; }
.hero-banner-body .rating-row { display: flex; align-items: center; gap: 5px; margin-bottom: 10px; }
.hero-banner-body .stars { color: #FFB800; font-size: 12px; letter-spacing: 1px; }
.hero-banner-body .rating-num { font-size: 11px; color: rgba(255, 255, 255, 0.35); }
.hero-banner-body .tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
.hero-banner-body .tag {
  font-size: 10px; font-weight: 500;
  padding: 3px 9px; border-radius: 100px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.38);
}
.hero-banner-body .card-footer { display: flex; align-items: center; justify-content: space-between; }
.hero-banner-body .price { font-size: 18px; font-weight: 700; color: #FFB800; font-family: 'Syne', sans-serif; }
.hero-banner-body .add-btn {
  background: linear-gradient(135deg, #FF4500, #FF6B35);
  color: #fff; border: none;
  font-size: 11px; font-weight: 600;
  padding: 6px 12px; border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.hero-banner-body .popular-badge {
  position: absolute; top: 14px; right: 14px;
  background: rgba(255, 184, 0, 0.15);
  border: 1px solid rgba(255, 184, 0, 0.25);
  color: #FFB800;
  font-size: 10px; font-weight: 600;
  padding: 3px 9px; border-radius: 100px;
  letter-spacing: 0.04em;
}
.hero-banner-body .row-cards { display: flex; gap: 12px; }
.hero-banner-body .mini-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 14px;
  width: 116px;
}
.hero-banner-body .mini-emoji { font-size: 26px; margin-bottom: 8px; display: block; }
.hero-banner-body .mini-name { font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.8); margin-bottom: 4px; }
.hero-banner-body .mini-price { font-size: 13px; font-weight: 700; color: #FFB800; font-family: 'Syne', sans-serif; }
.hero-banner-body .order-card {
  background: rgba(255, 184, 0, 0.05);
  border: 1px solid rgba(255, 184, 0, 0.12);
  border-radius: 14px;
  padding: 14px 16px;
  width: 116px;
  display: flex; flex-direction: column; gap: 6px;
}
.hero-banner-body .order-icon { font-size: 22px; }
.hero-banner-body .order-title { font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.75); }
.hero-banner-body .order-sub { font-size: 10px; color: rgba(255, 255, 255, 0.28); }
.hero-banner-body .progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 2px;
}
.hero-banner-body .progress-fill {
  height: 100%; width: 65%;
  background: linear-gradient(90deg, #FF4500, #FFB800);
  border-radius: 10px;
  animation: prog 3s ease-in-out infinite alternate;
}
@keyframes prog { 0% { width: 45% } 100% { width: 78% } }
.hero-banner-body .bottom-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px 56px;
  display: flex; align-items: center; gap: 32px;
  z-index: 3;
}
.hero-banner-body .bottom-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: rgba(255, 255, 255, 0.3);
}
.hero-banner-body .bottom-dot { width: 5px; height: 5px; border-radius: 50%; background: #FF4500; }
@media (max-width: 760px) {
  .hero-banner-body .right { display: none; }
  .hero-banner-body .hero { padding: 40px 28px 72px; }
}
</style>

<div class="hero-banner-body">
  <div class="hero">
    <div class="bg-glow glow1"></div>
    <div class="bg-glow glow2"></div>
    <div class="bg-glow glow3"></div>
    <div class="grid-lines"></div>

    <div class="content">
      <!-- LEFT -->
      <div class="left">
        <div class="eyebrow">
          <span class="eyebrow-dot"></span>
          Multi-vendor food delivery platform
        </div>
        <div class="brand">⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡</div>
        <p class="tagline">
          Order from the <span>best restaurants</span> around you.<br>
          Fast delivery. Real flavours. One platform.
        </p>
        <div class="stats">
          <div class="stat">
            <span class="stat-num">50+</span>
            <span class="stat-label">Restaurants</span>
          </div>
          <div class="stat">
            <span class="stat-num">200+</span>
            <span class="stat-label">Menu items</span>
          </div>
          <div class="stat">
            <span class="stat-num">30 min</span>
            <span class="stat-label">Avg delivery</span>
          </div>
          <div class="stat">
            <span class="stat-num">4.9★</span>
            <span class="stat-label">App rating</span>
          </div>
        </div>
        <div class="stack-row">
          <span class="stack-tag hot">React</span>
          <span class="stack-tag hot">Django</span>
          <span class="stack-tag">JWT Auth</span>
          <span class="stack-tag">PostgreSQL</span>
          <span class="stack-tag">Tailwind CSS</span>
          <span class="stack-tag">Vercel</span>
        </div>
        <div class="cta-row">
          <a href="https://e-commerce-app-food.vercel.app/profile" class="btn-primary">
            ▶ &nbsp;Live Demo
          </a>
          <a href="https://github.com/antonyvenis" class="btn-secondary">
            ⌥ &nbsp;View on GitHub
          </a>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="right">
        <div class="card main-card">
          <span class="popular-badge">⭐ Popular</span>
          <span class="food-emoji">🍗</span>
          <div class="food-name">Crispy Fried Chicken</div>
          <div class="food-rest">ChennaiKFC · 2.1 km away</div>
          <div class="rating-row">
            <span class="stars">★★★★★</span>
            <span class="rating-num">4.8 (320 ratings)</span>
          </div>
          <div class="tags">
            <span class="tag">Spicy</span>
            <span class="tag">Bestseller</span>
            <span class="tag">Non-veg</span>
          </div>
          <div class="card-footer">
            <span class="price">₹249</span>
            <button class="add-btn">+ Add to cart</button>
          </div>
        </div>
        <div class="row-cards">
          <div class="mini-card">
            <span class="mini-emoji">🍕</span>
            <div class="mini-name">Pepperoni Pizza</div>
            <div class="mini-price">₹349</div>
          </div>
          <div class="mini-card">
            <span class="mini-emoji">🍔</span>
            <div class="mini-name">Smash Burger</div>
            <div class="mini-price">₹199</div>
          </div>
          <div class="order-card">
            <span class="order-icon">🛵</span>
            <div class="order-title">Order on the way!</div>
            <div class="order-sub">ETA: 12 min</div>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="bottom-bar">
      <div class="bottom-item"><span class="bottom-dot"></span>Built with React + Django</div>
      <div class="bottom-item"><span class="bottom-dot"></span>Deployed on Vercel + Render</div>
      <div class="bottom-item"><span class="bottom-dot"></span>by Antony Venis T</div>
    </div>
  </div>
</div>


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

## 🏗️ System Architecture & Component Hierarchy

The following diagram maps the frontend component views, state management provider relationships, routing, and api communication flows.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'background': '#0f172a',
    'primaryColor': '#312e81',
    'primaryTextColor': '#f8fafc',
    'primaryBorderColor': '#4338ca',
    'lineColor': '#94a3b8',
    'secondaryColor': '#1e293b',
    'tertiaryColor': '#0f172a',
    'mainBkg': '#1e293b',
    'nodeBorder': '#334155',
    'textColor': '#f1f5f9'
  }
}}%%
flowchart TD
  %% Frontend Architecture Subgraph
  subgraph Client ["Frontend Architecture (React + Vite)"]
    direction TB
    App["App.jsx (React Router)"] --> Shell["Layout Shell"]
    
    Shell --> Navbar["Navbar.jsx (Header)"]
    Shell --> Footer["Footer.jsx (Footer)"]
    Shell --> Toaster["Toaster (Notifications)"]
    
    App --> Public["Public & Info Pages"]
    subgraph Public ["Public & Info Pages"]
      Home["Home.jsx (Landing Page)"] --> Hero["Hero Banner Section"]
      Home --> Featured["Featured Products / Promos"]
      About["About.jsx (Company Info)"]
      Contact["Contact.jsx (Support Form)"]
    end
    
    App --> Catalog["Product Catalog & Discovery"]
    subgraph Catalog ["Product Catalog & Discovery"]
      Menu["Menu.jsx / ProductDetails.jsx"]
      Food["Food.jsx (Food Category)"]
      Food2["Food2.jsx (Menu List 2)"]
    end
    
    App --> Auth["Identity & Access Management"]
    subgraph Auth ["Identity & Access Management"]
      Login["Login.jsx"] --> OTP["OTP.jsx (Verification)"]
      Register["Register.jsx"]
      Forgot["ForgotPassword.jsx"]
      Logout["Logout.jsx"]
    end
    
    App --> Transact["Checkout & User Space"]
    subgraph Transact ["Checkout & User Space"]
      Cart["Cart.jsx (Shopping Cart)"]
      Liked["Liked.jsx (Wishlist)"]
      Payment["Payment.jsx (Stripe/Gateway)"] --> Success["Success.jsx (Receipt)"]
      Orders["Orders.jsx (History)"]
      Profile["Profile.jsx (Dashboard)"] --> ProfileChange["Profilechance.jsx"]
    end
    
    App --> Admin["Administration"]
    subgraph Admin ["Administration"]
      Upload["AdminUpload.jsx (Add Items)"]
    end

    CartContext["CartContext.jsx (Context API)"] -.->|Provides Cart State| Cart
    CartContext -.->|Provides Cart State| Menu
    CartContext -.->|Provides Cart State| Navbar
  end

  %% Backend System Subgraph
  subgraph Server ["Backend Services (Django REST Framework)"]
    direction TB
    Django["Django REST API (Backend)"]
    DB[("PostgreSQL / SQLite Database")]
    Django --> DB
  end

  %% API Interactions
  Catalog -->|HTTP GET /api/products/| Django
  Auth -->|HTTP POST /api/login/| Django
  Transact -->|HTTP POST /api/order/| Django
  Admin -->|HTTP POST /api/add-products-bulk/| Django

  %% Styling Definitions
  classDef appNode fill:#4f46e5,stroke:#4338ca,stroke-width:2px,color:#ffffff;
  classDef contextNode fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#ffffff;
  classDef dbNode fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff;
  classDef shellNode fill:#64748b,stroke:#475569,stroke-width:2px,color:#ffffff;
  classDef apiNode fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff;

  class App appNode;
  class CartContext contextNode;
  class DB dbNode;
  class Django apiNode;
  class Navbar,Footer,Toaster shellNode;
```

---

## 🔄 End-to-End User Journey

This flow outlines the user lifecycle checkout journey, from initial landing to final transaction fulfillment:

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'background': '#0f172a',
    'primaryColor': '#3b82f6',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#1d4ed8',
    'lineColor': '#64748b',
    'secondaryColor': '#1e293b',
    'tertiaryColor': '#0f172a',
    'mainBkg': '#1e293b',
    'nodeBorder': '#334155',
    'textColor': '#f1f5f9'
  }
}}%%
flowchart TD
  Start([Start Session]) --> Home[1. Enter Store Homepage]
  
  Home -->|Interact| Hero[Hero Banner Actions]
  Home -->|Navigate| Menu[2. Browse Catalog / Menu]
  
  Menu -->|Filter Category| CategoryFilter[Food / General Products]
  Menu -->|Select Item| Details[3. View Product Details]
  
  Details -->|Save for Later| Wishlist[Add to Liked / Wishlist]
  Details -->|Add to Basket| Cart[4. Add to Shopping Cart]
  
  Cart --> ReviewCart[5. Review Order Subtotal]
  ReviewCart -->|Modify Qty / Remove| ReviewCart
  
  ReviewCart --> CheckoutAuth{Is User Logged In?}
  
  CheckoutAuth -->|No| Login[6. Redirect to Login / Signup]
  Login --> VerifyOTP{OTP Verification Required?}
  VerifyOTP -->|Yes| OTP[OTP Code Verification]
  VerifyOTP -->|No| CheckDone[Login Successful]
  OTP --> CheckDone
  CheckDone --> Payment[7. Secure Payment Gateway]
  
  CheckoutAuth -->|Yes| Payment
  
  Payment --> ExecutePay{Charge Authorized?}
  ExecutePay -->|Failed / Declined| AlertPay[Display Alert / Retry Payment]
  AlertPay --> Payment
  
  ExecutePay -->|Succeeded| SuccessPage[8. Order Success / Confirmation]
  
  SuccessPage --> OrderHistory[9. View Active Order Details]
  OrderHistory --> ProfilePage[10. Manage Profile / Settings]
  
  ProfilePage --> End([End Session])

  %% Styling Definitions
  classDef startEnd fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff;
  classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#ffffff;
  classDef process fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#ffffff;
  classDef aux fill:#64748b,stroke:#475569,stroke-width:2px,color:#ffffff;

  class Start,End startEnd;
  class CheckoutAuth,VerifyOTP,ExecutePay decision;
  class Home,Menu,Details,Cart,ReviewCart,Login,OTP,Payment,SuccessPage,OrderHistory,ProfilePage process;
  class Hero,CategoryFilter,Wishlist,AlertPay,CheckDone aux;
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