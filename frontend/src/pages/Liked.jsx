import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api";
import { imgUrl, money, onImgError } from "./shopUtils";
import "./shop.css";

const Heart = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2 0 3.6 1 4.7 2.7h1.4c1.1-1.7 2.7-2.7 4.7-2.7 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z" />
  </svg>
);

function Liked() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/likes/");
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load your wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (item) => {
    const before = items;
    setItems((list) => list.filter((p) => p.id !== item.id));
    try {
      await api.post("/remove-like/", { id: item.id });
      toast.success(`${item.item_name} removed from wishlist`);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      setItems(before);
      toast.error("Could not remove it");
    }
  };

  const addToCart = async (item) => {
    setAdding(item.id);
    try {
      await api.post("/add-cart/", { product_id: item.id });
      toast.success(`${item.item_name} added to cart`);
      const { data } = await api.get("/cart/");
      localStorage.setItem("cartCount", String(Array.isArray(data) ? data.length : 0));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      toast.error("Could not add it to the cart");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="sh-page">
      <header className="sh-pagehead">
        <h1>Your wishlist</h1>
        {!loading && items.length > 0 && <p>{items.length} saved {items.length === 1 ? "dish" : "dishes"}</p>}
      </header>

      {loading ? (
        <div className="sh-grid">{[0, 1, 2, 3].map((i) => <div key={i} className="sh-skel-card" style={{ "--d": `${i * 90}ms` }} />)}</div>
      ) : items.length === 0 ? (
        <motion.div className="sh-empty" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sh-empty-art sh-pulse" aria-hidden="true">♥</div>
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any dish and it will wait for you here.</p>
          <Link className="sh-btn sh-btn-primary" to="/menu">Find something tasty</Link>
        </motion.div>
      ) : (
        <motion.div className="sh-grid" layout>
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const offer = Number(item.offer ?? item.discount ?? 0);
              const base = Number(item.price) || 0;
              const final = offer > 0 ? base - (base * offer) / 100 : base;
              return (
                <motion.article
                  key={item.id}
                  layout
                  className="sh-card"
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 8) * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                >
                  <div className="sh-card-media">
                    <img src={imgUrl(item.image)} alt={item.item_name} loading="lazy" onError={onImgError} />
                    {offer > 0 && <span className="sh-ribbon">{offer}% off</span>}
                    <button className="sh-heart is-on" onClick={() => remove(item)} aria-label={`Remove ${item.item_name} from wishlist`}>
                      <Heart />
                    </button>
                  </div>

                  <div className="sh-card-body">
                    <div className="sh-card-meta">
                      {item.category && <span className="sh-pill">{item.category}</span>}
                      {Number(item.rating) > 0 && <span className="sh-rating">★ {Number(item.rating).toFixed(1)}</span>}
                    </div>
                    <h3>{item.item_name}</h3>
                    <p className="sh-price-line">
                      <b>{money(final, 2)}</b>
                      {offer > 0 && <s>{money(base, 2)}</s>}
                    </p>
                    <button className="sh-btn sh-btn-primary sh-block" onClick={() => addToCart(item)} disabled={adding === item.id || item.is_active === false}>
                      {item.is_active === false ? "Unavailable" : adding === item.id ? "Adding…" : "Add to cart"}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default Liked;
