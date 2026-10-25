import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import "./shop.css";
import "./HeroBanner.css";

// Honest facts about the project instead of made-up business numbers
const FACTS = [
  { value: "JWT", label: "login with roles" },
  { value: "80+", label: "automated tests" },
  { value: "REST", label: "Django API" },
  { value: "Live", label: "Vercel + Render" },
];

const STACK = ["React", "Django REST", "PostgreSQL", "JWT", "Redis", "Cloudinary", "Brevo", "Vercel", "Render"];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

function HeroBanner() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="hm hb" aria-label="About this project">
        <span className="hb-glow hb-glow-a" aria-hidden="true" />
        <span className="hb-glow hb-glow-b" aria-hidden="true" />
        <span className="hb-grid" aria-hidden="true" />

        <div className="hb-inner">
          <motion.div className="hb-copy" {...fade()}>
            <p className="hb-eyebrow"><span /> Full-stack food delivery project</p>

            <h2 className="hb-brand">Legend</h2>
            <p className="hb-tagline">Order from the <b>best kitchens</b> around you. Fast delivery, real flavours, one platform.</p>

            <ul className="hb-facts">
              {FACTS.map((f) => <li key={f.label}><b>{f.value}</b><span>{f.label}</span></li>)}
            </ul>

            <ul className="hb-stack" aria-label="Tech stack">
              {STACK.map((s, i) => <li key={s} className={i < 2 ? "is-hot" : ""}>{s}</li>)}
            </ul>

            <div className="hb-cta">
              <a className="sh-btn sh-btn-primary" href="https://e-commerce-app-food.vercel.app/" target="_blank" rel="noopener noreferrer">Live demo</a>
              <a className="sh-btn hb-ghost" href="https://github.com/antonyvenis" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            </div>
          </motion.div>

          <motion.div className="hb-visual" {...fade(0.12)}>
            <article className="hb-main">
              <span className="hb-badge">Popular</span>
              <span className="hb-emoji" aria-hidden="true">🍗</span>
              <h3>Crispy Fried Chicken</h3>
              <p className="hb-sub">Sample dish · 2.1 km away</p>
              <p className="hb-rate"><span>★★★★★</span> 4.8</p>
              <div className="hb-tags"><i>Spicy</i><i>Bestseller</i><i>Non-veg</i></div>
              <div className="hb-foot">
                <b>₹249</b>
                <Link className="sh-btn sh-btn-primary" to="/menu">Add to cart</Link>
              </div>
            </article>

            <div className="hb-row">
              <article className="hb-mini"><span aria-hidden="true">🍕</span><h4>Pepperoni Pizza</h4><b>₹349</b></article>
              <article className="hb-mini"><span aria-hidden="true">🍔</span><h4>Smash Burger</h4><b>₹199</b></article>
              <article className="hb-order">
                <span aria-hidden="true">🛵</span>
                <h4>Order on the way</h4>
                <small>ETA 12 min</small>
                <div className="hb-bar"><i /></div>
              </article>
            </div>
          </motion.div>
        </div>

        <ul className="hb-credits">
          <li>Built with React + Django</li>
          <li>Deployed on Vercel + Render</li>
          <li>Crafted by Antony Venis T</li>
        </ul>
      </section>
    </MotionConfig>
  );
}

export default HeroBanner;
