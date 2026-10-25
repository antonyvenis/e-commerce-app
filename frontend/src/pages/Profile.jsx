import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api";
import { money } from "./shopUtils";
import "./shop.css";
import "./store.css";

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setValue(target); return undefined; }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return Math.round(value);
}

function Stat({ label, value, to }) {
  const shown = useCountUp(value);
  return (
    <Link className="ac-stat" to={to}>
      <b>{shown}</b><span>{label}</span>
    </Link>
  );
}

const when = (iso) => new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" });

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [likes, setLikes] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([api.get("/profile/"), api.get("/orders/"), api.get("/likes/"), api.get("/cart/")]).then(([p, o, l, c]) => {
      if (!alive) return;
      if (p.status !== "fulfilled") { setError(true); toast.error("Could not load your profile"); return; }
      setProfile(p.value.data);
      if (o.status === "fulfilled" && Array.isArray(o.value.data)) setOrders(o.value.data);
      if (l.status === "fulfilled" && Array.isArray(l.value.data)) setLikes(l.value.data.length);
      if (c.status === "fulfilled" && Array.isArray(c.value.data)) setCartCount(c.value.data.length);
    });
    return () => { alive = false; };
  }, []);

  if (error) {
    return (
      <div className="sh-page sh-narrow">
        <div className="sh-empty">
          <div className="sh-empty-art" aria-hidden="true">😕</div>
          <h2>We could not load your profile</h2>
          <button className="sh-btn sh-btn-primary" onClick={() => window.location.reload()}>Try again</button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="sh-page sh-narrow">
        <div className="sh-skel-list"><span className="tall" /><span /><span /></div>
      </div>
    );
  }

  const isAdmin = profile.role === "admin";
  const spent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const links = [
    { to: "/cart", label: "My cart", note: "Review and pay", icon: "🛒" },
    { to: "/liked", label: "Wishlist", note: "Saved dishes", icon: "❤️" },
    { to: "/orders", label: "Orders", note: "Track and invoices", icon: "📦" },
    { to: "/profilechange", label: "Edit profile", note: "Photo, email, phone", icon: "✏️" },
    ...(isAdmin ? [{ to: "/upload", label: "Admin dashboard", note: "Manage the store", icon: "🛠️" }] : []),
    { to: "/about", label: "About Legend", note: "Who we are", icon: "ℹ️" },
  ];

  return (
    <div className="sh-page sh-narrow ac">
      <motion.section className="ac-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="ac-cover" aria-hidden="true" />
        <div className="ac-head">
          {profile.image ? (
            <img className="ac-avatar" src={profile.image} alt={`${profile.username}'s photo`} />
          ) : (
            <span className="ac-avatar ac-avatar-fallback" aria-hidden="true">{profile.username.charAt(0).toUpperCase()}</span>
          )}
          <div className="ac-who">
            <h1>{profile.username} {isAdmin && <span className="sh-pill sh-pill-hot">Admin</span>}</h1>
            <p>{profile.email}</p>
            <p>{profile.phone || "No phone number added"}</p>
          </div>
          <Link className="sh-btn sh-btn-ghost" to="/profilechange">Edit profile</Link>
        </div>

        <div className="ac-stats">
          <Stat label="Orders" value={orders.length} to="/orders" />
          <Stat label="Wishlist" value={likes} to="/liked" />
          <Stat label="In cart" value={cartCount} to="/cart" />
          <div className="ac-stat"><b>{money(spent)}</b><span>Total spent</span></div>
        </div>
      </motion.section>

      <section className="ac-links" aria-label="Shortcuts">
        {links.map((l, i) => (
          <motion.div key={l.to} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.05 } }}>
            <Link className="ac-link" to={l.to}>
              <span aria-hidden="true">{l.icon}</span>
              <div><b>{l.label}</b><small>{l.note}</small></div>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="ac-recent">
        <div className="hm-head"><div><p className="hm-eyebrow">Latest</p><h2>Recent orders</h2></div>{orders.length > 0 && <Link className="sh-link" to="/orders">View all</Link>}</div>
        {orders.length === 0 ? (
          <p className="ac-empty">No orders yet. <Link to="/menu">Order your first dish</Link></p>
        ) : (
          <ul>
            {orders.slice(0, 3).map((o, i) => (
              <motion.li key={o.id} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.07 } }}>
                <div><b>Order #{o.id}</b><small>{when(o.created_at)}</small></div>
                <span className={`sh-status st-${o.status.toLowerCase().replace(/\s+/g, "-")}`}>{o.status}</span>
                <strong>{money(o.total, 2)}</strong>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <button className="sh-btn sh-btn-ghost ac-logout" onClick={() => navigate("/logout")}>Log out</button>
    </div>
  );
}

export default Profile;
