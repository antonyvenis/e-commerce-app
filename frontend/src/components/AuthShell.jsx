import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../pages/auth.css";

const STEPS = ["Pending", "Preparing", "Out for delivery", "Delivered"];

function BrandMark() {
  return (
    <Link to="/" className="au-brand" aria-label="Legend home">
      <span className="au-brand-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      </span>
      Legend
    </Link>
  );
}

/** Split layout used by Login and Register: form on the left, live-order panel on the right. */
function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="au-page">
      <section className="au-form-side">
        <BrandMark />

        <motion.div
          className="au-form-wrap"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="au-title">{title}</h1>
          <p className="au-sub">{subtitle}</p>
          {children}
          {footer && <p className="au-switch">{footer}</p>}
        </motion.div>

        <p className="au-legal">© 2026 Legend. All rights reserved.</p>
      </section>

      <aside className="au-hero-side" aria-hidden="true">
        <div className="au-glow" />
        <div className="au-hero-copy">
          <h2>Hot food, tracked to your door.</h2>
          <p>Order from your favourite kitchens and follow every step until it arrives.</p>
        </div>

        <div className="au-tracker">
          <div className="au-tracker-head">
            <div>
              <span className="au-tracker-label">Order</span>
              <strong>#1042</strong>
            </div>
            <div className="au-eta">
              <span className="au-tracker-label">Arrives in</span>
              <strong>12 min</strong>
            </div>
          </div>

          <ol className="au-steps">
            {STEPS.map((s, i) => (
              <li key={s} style={{ "--i": i }}>
                <span className="au-dot" />
                {s}
              </li>
            ))}
          </ol>
          <span className="au-rail"><span className="au-rail-fill" /></span>
        </div>

        <div className="au-chip">Free delivery above ₹199</div>
      </aside>
    </div>
  );
}

export default AuthShell;
