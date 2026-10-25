import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api";
import { FREE_DELIVERY_ABOVE, breakdown, imgUrl, money, onImgError, setCartCount } from "./shopUtils";
import "./shop.css";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.get("/cart/");
      const items = Array.isArray(data) ? data : [];
      setCart(items);
      setCartCount(items.length);
    } catch {
      toast.error("Could not load your cart");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0),
    [cart]
  );
  const { tax, delivery, total } = breakdown(subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_ABOVE) * 100);
  const needed = Math.max(1, Math.ceil(FREE_DELIVERY_ABOVE + 0.01 - subtotal));

  const changeQty = async (item, next) => {
    if (next < 1) return;
    const before = cart;
    setCart((c) => c.map((p) => (p.id === item.id ? { ...p, quantity: next } : p)));
    try {
      await api.post("/update-quantity/", { id: item.id, quantity: next });
    } catch {
      setCart(before);
      toast.error("Could not change the quantity");
    }
  };

  const removeItem = async (item) => {
    const before = cart;
    const after = cart.filter((p) => p.id !== item.id);
    setCart(after);
    setCartCount(after.length);
    try {
      await api.post("/remove-cart/", { id: item.id });
      toast.success(`${item.item_name} removed`);
    } catch {
      setCart(before);
      setCartCount(before.length);
      toast.error("Could not remove the item");
    }
  };

  const checkout = () => {
    if (!cart.length) return toast.error("Your cart is empty");
    navigate("/payment", { state: { cart } });
  };

  return (
    <div className="sh-page">
      <header className="sh-pagehead">
        <h1>Your cart</h1>
        {!loading && cart.length > 0 && <p>{cart.length} {cart.length === 1 ? "item" : "items"} ready to order</p>}
      </header>

      {loading ? (
        <div className="sh-cart-grid">
          <div className="sh-skel-list">{[0, 1, 2].map((i) => <span key={i} style={{ "--d": `${i * 90}ms` }} />)}</div>
          <div className="sh-skel-box" />
        </div>
      ) : cart.length === 0 ? (
        <motion.div className="sh-empty" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sh-empty-art" aria-hidden="true">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Hungry? Pick something tasty from the menu.</p>
          <Link className="sh-btn sh-btn-primary" to="/menu">Browse the menu</Link>
        </motion.div>
      ) : (
        <div className="sh-cart-grid">
          <ul className="sh-cart-list">
            <AnimatePresence mode="popLayout">
              {cart.map((item, i) => {
                const offer = Number(item.offer) > 0;
                const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                return (
                  <motion.li
                    key={item.id}
                    layout
                    className="sh-cart-item"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 6) * 0.05 } }}
                    exit={{ opacity: 0, x: -60, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  >
                    <img src={imgUrl(item.image, 300)} alt={item.item_name} loading="lazy" onError={onImgError} />

                    <div className="sh-cart-info">
                      <h3>{item.item_name}</h3>
                      <p className="sh-price-line">
                        <b>{money(item.price, 2)}</b>
                        {offer && <s>{money(item.original_price, 2)}</s>}
                        {offer && <span className="sh-pill sh-pill-hot">{item.offer}% off</span>}
                      </p>

                      <div className="sh-qty" role="group" aria-label={`Quantity for ${item.item_name}`}>
                        <button onClick={() => changeQty(item, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">−</button>
                        <motion.span key={item.quantity} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>{item.quantity}</motion.span>
                        <button onClick={() => changeQty(item, item.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>

                    <div className="sh-cart-side">
                      <strong>{money(lineTotal, 2)}</strong>
                      <button className="sh-icon-btn sh-danger" onClick={() => removeItem(item)} aria-label={`Remove ${item.item_name}`}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <aside className="sh-summary">
            <h2>Order summary</h2>

            <div className="sh-free">
              <p>
                {delivery === 0
                  ? <>You unlocked <b>free delivery</b></>
                  : <>Add <b>{money(needed)}</b> more for <b>free delivery</b></>}
              </p>
              <div className="sh-bar"><motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} /></div>
            </div>

            <dl>
              <div><dt>Subtotal</dt><dd>{money(subtotal, 2)}</dd></div>
              <div><dt>GST (5%)</dt><dd>{money(tax, 2)}</dd></div>
              <div><dt>Delivery</dt><dd>{delivery === 0 ? <span className="sh-free-tag">FREE</span> : money(delivery, 2)}</dd></div>
              <div className="sh-total"><dt>Total</dt><dd>{money(total, 2)}</dd></div>
            </dl>

            <button className="sh-btn sh-btn-primary sh-block" onClick={checkout}>Proceed to pay</button>
            <Link className="sh-link-center" to="/menu">Add more items</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
