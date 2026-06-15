import "./HeroBanner.css";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <div className="hero-banner-page-top">
    <div className="hero-banner-page">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>
      <div className="bg-glow glow3"></div>
      <div className="grid-lines"></div>

      <div className="content">
        {/* LEFT */}
        <div className="left">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Multi-vendor food delivery platform
          </div>

          <div className="brand">⚡𝓛𝓮𝓰𝓮𝓷𝓭💫⚡</div>

          <p className="tagline">
            Order from the <span>best restaurants</span> around you.
            <br />
            Fast delivery. Real flavours. One platform.
          </p>

          <div className="herobanner-stats">
            <div className="stat">
              <span className="stat-num">50+</span>
              <span className="stat-label">Restaurants</span>
            </div>

            <div className="stat">
              <span className="stat-num">200+</span>
              <span className="stat-label">Menu Items</span>
            </div>

            <div className="stat">
              <span className="stat-num">30 min</span>
              <span className="stat-label">Avg Delivery</span>
            </div>

            <div className="stat">
              <span className="stat-num">4.9★</span>
              <span className="stat-label">App Rating</span>
            </div>
          </div>

          <div className="stack-row">
            <span className="stack-tag hot">React</span>
            <span className="stack-tag hot">Django</span>
            <span className="stack-tag">JWT Auth</span>
            <span className="stack-tag">PostgreSQL</span>
            <span className="stack-tag">Tailwind CSS</span>
            <span className="stack-tag">Vercel</span>
          </div>

          <div className="cta-row">
            <a
              href="https://e-commerce-app-food.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              ▶ Live Demo
            </a>

            <a
              href="https://github.com/antonyvenis"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              ⌥ View on GitHub
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="herobanner-card main-card">
            <span className="popular-badge">⭐ Popular</span>

            <span className="food-emoji">🍗</span>

            <div className="food-name">
              Crispy Fried Chicken
            </div>

            <div className="food-rest">
              ChennaiKFC · 2.1 km away
            </div>

            <div className="rating-row">
              <span className="stars">★★★★★</span>
              <span className="rating-num">
                4.8 (320 ratings)
              </span>
            </div>

            <div className="tags">
              <span className="tag">Spicy</span>
              <span className="tag">Bestseller</span>
              <span className="tag">Non-veg</span>
            </div>

            <div className="card-footer">
              <span className="hero-price">₹249</span>

              <button className="herobanner-add-btn"><Link to="/menu" id="Link-text">+ Add to cart</Link></button>
            </div>
          </div>

          <div className="row-cards">
            <div className="mini-card">
              <span className="mini-emoji">🍕</span>
              <div className="mini-name">
                Pepperoni Pizza
              </div>
              <div className="mini-price">
                ₹349
              </div>
            </div>

            <div className="mini-card">
              <span className="mini-emoji">🍔</span>
              <div className="mini-name">
                Smash Burger
              </div>
              <div className="mini-price">
                ₹199
              </div>
            </div>

            <div className="hero-order-card">
              <span className="order-icon">🛵</span>

              <div className="order-title">
                Order on the way!
              </div>

              <div className="order-sub">
                ETA: 12 min
              </div>

              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bottom-item">
  <span className="bottom-dot"></span>
  <span>Built with React + Django</span>
</div>

<div className="bottom-item">
  <span className="bottom-dot"></span>
  <span>Deployed on Vercel + Render</span>
</div>

<div className="bottom-item">
  <span className="bottom-dot"></span>
  <span>by Antony Venis T</span>
</div>
      </div>
    </div>
    </div>
  );
}

export default HeroBanner;