import "./HeroBanner.css";

function HeroBanner() {
  return (
    <div className="hero">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>
      <div className="bg-glow glow3"></div>
      <div className="grid-lines"></div>

      <div className="content">
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

          <div className="stats">
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
              <span className="stat-label">Delivery</span>
            </div>
          </div>

          <div className="cta-row">
            <a
              href="https://e-commerce-app-food.vercel.app/profile"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Live Demo
            </a>

            <a
              href="https://github.com/antonyvenis"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;

