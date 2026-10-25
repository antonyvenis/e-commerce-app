import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { money } from "./shopUtils";
import "./shop.css";
import "./store.css";

const COLORS = ["#ff6a1a", "#f43f5e", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed"];

function Success() {
  const { state } = useLocation();

  // confetti: random but stable for this render
  const pieces = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      size: 6 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 220,
      color: COLORS[i % COLORS.length],
      round: i % 3 === 0,
    })),
    []
  );

  return (
    <div className="sh-page sh-narrow co-success">
      <div className="co-confetti" aria-hidden="true">
        {pieces.map((p, i) => (
          <span key={i} style={{ left: `${p.left}%`, width: p.size, height: p.round ? p.size : p.size * 1.6, background: p.color, borderRadius: p.round ? "50%" : 2, animationDelay: `${p.delay}s`, "--drift": `${p.drift}px` }} />
        ))}
      </div>

      <motion.div className="co-done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <svg className="co-check" viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          <circle className="co-check-ring" cx="60" cy="60" r="52" />
          <path className="co-check-tick" d="M36 62l16 16 32-34" />
        </svg>

        <h1>Order placed!</h1>
        <p className="co-lead">Thank you. The kitchen has your order and it will be on its way soon.</p>

        <dl className="co-facts">
          {state?.orderId && <div><dt>Order</dt><dd>#{state.orderId}</dd></div>}
          {state?.total != null && <div><dt>Total</dt><dd>{money(state.total, 2)}</dd></div>}
          {state?.method && <div><dt>Payment</dt><dd>{state.method}</dd></div>}
          <div><dt>Arrives in</dt><dd>about 30 min</dd></div>
        </dl>

        <ol className="sh-track co-mini-track" aria-label="What happens next">
          <li className="is-now"><span className="sh-dot">1</span><em>Placed</em></li>
          <li><span className="sh-dot">2</span><em>Preparing</em></li>
          <li><span className="sh-dot">3</span><em>On the way</em></li>
          <li><span className="sh-dot">4</span><em>Delivered</em></li>
        </ol>

        <div className="co-done-actions">
          <Link className="sh-btn sh-btn-primary" to="/orders">Track my order</Link>
          <Link className="sh-btn sh-btn-ghost" to="/menu">Order something else</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Success;
