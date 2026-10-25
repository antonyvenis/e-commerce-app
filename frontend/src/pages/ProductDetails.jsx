import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api, { getUser } from "../api";
import ProductCard, { finalPrice } from "./ProductCart";
import { imgUrl, labelOf, money, onImgError, setCartCount } from "./shopUtils";
import "./shop.css";
import "./store.css";

const PERKS = [
  { icon: "🔥", title: "Cooked fresh", text: "Made when you order, never reheated." },
  { icon: "🚚", title: "Free delivery above ₹199", text: "Otherwise a flat ₹40." },
  { icon: "⏱️", title: "About 30 minutes", text: "Track it live from the Orders page." },
];

function Stars({ value, onChange, size = 22 }) {
  return (
    <div className="pd-stars" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} role="radio" aria-checked={value === s} aria-label={`${s} star${s > 1 ? "s" : ""}`} className={value >= s ? "is-on" : ""} style={{ fontSize: size }} onClick={() => onChange(s)}>★</button>
      ))}
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const [product, setProduct] = useState(state && String(state.id) === id ? state : null);
  const [missing, setMissing] = useState(false);
  const [related, setRelated] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  useEffect(() => {
    let alive = true;
    window.scrollTo({ top: 0 });
    setQty(1);
    setMissing(false);
    api.get(`/products/${id}/`)
      .then(({ data }) => alive && setProduct(data))
      .catch((err) => { if (alive && err.response?.status === 404) setMissing(true); });
    api.get("/products/")
      .then(({ data }) => alive && setRelated(Array.isArray(data) ? data : data.products || []))
      .catch(() => {});
    try {
      setMyRating((JSON.parse(localStorage.getItem("ratings")) || {})[id] || 0);
    } catch { setMyRating(0); }
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api.get("/likes/").then(({ data }) => setLikedIds(Array.isArray(data) ? data.map((i) => i.id) : [])).catch(() => {});
  }, [user?.username]);

  const more = useMemo(
    () => related.filter((p) => String(p.id) !== id && (!product || p.category === product.category)).slice(0, 4),
    [related, id, product]
  );

  if (missing) {
    return (
      <div className="sh-page">
        <div className="sh-empty">
          <div className="sh-empty-art" aria-hidden="true">🍽️</div>
          <h2>This dish is not available</h2>
          <p>It may have been removed from the menu.</p>
          <Link className="sh-btn sh-btn-primary" to="/menu">Back to the menu</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="sh-page">
        <div className="pd-grid"><div className="sh-skel-box pd-skel" /><div className="sh-skel-list"><span /><span /><span className="tall" /></div></div>
      </div>
    );
  }

  const offer = Number(product.offer ?? 0);
  const base = Number(product.price) || 0;
  const final = finalPrice(product);
  const saving = (base - final) * qty;
  const unavailable = product.is_active === false || Number(product.stock) === 0;
  const liked = likedIds.includes(product.id);
  const image = imgUrl(product.image, 900);

  const rate = (value) => {
    setMyRating(value);
    try {
      const all = JSON.parse(localStorage.getItem("ratings")) || {};
      all[id] = value;
      localStorage.setItem("ratings", JSON.stringify(all));
    } catch { /* storage unavailable */ }
    toast.success(`You rated ${product.name} ${value} stars`);
  };

  const toggleLike = async () => {
    if (!user) return toast.error("Log in to save dishes");
    const next = !liked;
    setLikedIds((ids) => (next ? [...ids, product.id] : ids.filter((x) => x !== product.id)));
    try {
      await api.post(next ? "/add-like/" : "/remove-like/", { id: product.id });
      toast.success(next ? "Saved to wishlist" : "Removed from wishlist");
    } catch {
      setLikedIds((ids) => (next ? ids.filter((x) => x !== product.id) : [...ids, product.id]));
      toast.error("Could not update your wishlist");
    }
  };

  const addToCart = async () => {
    if (!user) return toast.error("Log in to order");
    setAdding(true);
    try {
      await api.post("/add-cart/", { product_id: product.id, quantity: qty });
      const { data } = await api.get("/cart/");
      setCartCount(Array.isArray(data) ? data.length : 0);
      toast.success(`${qty} × ${product.name} added to cart`);
    } catch {
      toast.error("Could not add it to the cart");
    } finally {
      setAdding(false);
    }
  };

  const buyNow = () => {
    if (!user) return toast.error("Log in to order");
    navigate("/payment", {
      state: { cart: [{ id: product.id, product_id: product.id, item_name: product.name, image, price: final, original_price: base, offer, quantity: qty, category: product.category }] },
    });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    } catch { /* cancelled */ }
  };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="sh-page">
      <nav className="pd-crumbs" aria-label="Breadcrumb">
        <Link to="/menu">Menu</Link><span>/</span>
        <Link to="/menu">{labelOf(product.category || "Food")}</Link><span>/</span>
        <b>{product.name}</b>
      </nav>

      <div className="pd-grid">
        <motion.div className="pd-media" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          onMouseMove={onMove} onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}>
          <img src={image} alt={product.name} onError={onImgError} style={zoom.on ? { transform: "scale(1.55)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
          {offer > 0 && <span className="sh-ribbon">{offer}% off</span>}
          {unavailable && <span className="pc-soldout">Not available</span>}
        </motion.div>

        <motion.div className="pd-info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
          <div className="pd-top">
            <span className="sh-pill">{labelOf(product.category || "Food")}</span>
            <div className="pd-actions-top">
              <button className={`sh-icon-btn ${liked ? "is-liked" : ""}`} onClick={toggleLike} aria-pressed={liked} aria-label="Save to wishlist">
                <svg viewBox="0 0 24 24" width="19" height="19" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2 0 3.6 1 4.7 2.7h1.4c1.1-1.7 2.7-2.7 4.7-2.7 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z" /></svg>
              </button>
              <button className="sh-icon-btn" onClick={share} aria-label="Share this dish">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4" /></svg>
              </button>
            </div>
          </div>

          <h1>{product.name}</h1>
          <p className="pd-rating"><span className="sh-rating">★ {Number(product.rating || 4.5).toFixed(1)}</span> <span>rated by our customers</span></p>

          <div className="pd-price">
            <b>{money(final, offer > 0 ? 2 : 0)}</b>
            {offer > 0 && <s>{money(base)}</s>}
            {offer > 0 && <span className="sh-pill sh-pill-hot">Save {money(base - final, 2)} each</span>}
          </div>

          <div className="pd-buy">
            <div className="sh-qty" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
              <motion.span key={qty} initial={{ scale: 1.35 }} animate={{ scale: 1 }}>{qty}</motion.span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10} aria-label="Increase quantity">+</button>
            </div>
            <p className="pd-total">Total <b>{money(final * qty, 2)}</b>{saving > 0 && <small>You save {money(saving, 2)}</small>}</p>
          </div>

          <div className="pd-cta">
            <button className="sh-btn sh-btn-primary" onClick={addToCart} disabled={unavailable || adding}>{adding ? "Adding…" : "Add to cart"}</button>
            <button className="sh-btn sh-btn-ghost" onClick={buyNow} disabled={unavailable}>Buy now</button>
          </div>

          <div className="pd-rate"><span>Your rating</span><Stars value={myRating} onChange={rate} /></div>

          <ul className="pd-perks">
            {PERKS.map((p) => (
              <li key={p.title}><span aria-hidden="true">{p.icon}</span><div><b>{p.title}</b><small>{p.text}</small></div></li>
            ))}
          </ul>
        </motion.div>
      </div>

      {more.length > 0 && (
        <section className="mn-fav">
          <div className="hm-head"><div><p className="hm-eyebrow">More like this</p><h2>You might also like</h2></div><Link className="sh-link" to="/menu">See full menu</Link></div>
          <div className="mn-grid mn-grid-4">
            {more.map((item) => <ProductCard key={item.id} product={item} likedIds={likedIds} setLikedIds={setLikedIds} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
