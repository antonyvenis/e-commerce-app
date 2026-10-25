import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api, { getUser } from "../api";
import { useCart } from "./CartContext";
import { breakdown, imgUrl, money, onImgError, setCartCount } from "./shopUtils";
import "./shop.css";
import "./store.css";

const METHODS = [
  { value: "COD", title: "Cash on delivery", text: "Pay when the food arrives.", icon: "💵" },
  { value: "UPI", title: "UPI", text: "GPay, PhonePe, Paytm.", icon: "📱" },
  { value: "Card", title: "Card", text: "Debit or credit card.", icon: "💳" },
];

const validate = (f) => {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[6-9]\d{9}$/.test(f.phone.trim())) errors.phone = "Enter a 10-digit mobile number.";
  if (f.address.trim().length < 10) errors.address = "Add your full address (house, street, area).";
  return errors;
};

function Payment() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const cart = useMemo(() => location.state?.cart || [], [location.state]);

  const [form, setForm] = useState({ name: user?.username || "", phone: "", address: "", method: "COD" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // prefill the phone number from the profile
  useEffect(() => {
    api.get("/profile/")
      .then(({ data }) => setForm((f) => ({ ...f, phone: f.phone || data.phone || "" })))
      .catch(() => {});
  }, []);

  const errors = validate(form);
  const subtotal = cart.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const { tax, delivery, total } = breakdown(subtotal);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));
  const showError = (key) => touched[key] && errors[key];

  const pay = async (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, address: true });
    if (Object.keys(errors).length) return toast.error("Please fix the highlighted fields");
    if (!cart.length) return toast.error("Your cart is empty");

    try {
      setLoading(true);
      const { data } = await api.post("/order/", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        payment_method: form.method,
        // the server prices every dish from its own database, these only say WHAT was ordered
        items: cart.map((i) => ({ product_id: i.product_id ?? i.id, item_name: i.item_name || i.name, quantity: i.quantity })),
      });

      clearCart();
      try {
        const { data: left } = await api.get("/cart/");
        setCartCount(Array.isArray(left) ? left.length : 0);
      } catch { setCartCount(0); }

      navigate("/success", { replace: true, state: { orderId: data.order_id, total, method: form.method } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not place the order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="sh-page sh-narrow">
        <div className="sh-empty">
          <div className="sh-empty-art" aria-hidden="true">🧾</div>
          <h2>Nothing to pay for yet</h2>
          <p>Add a dish to your cart, then come back to checkout.</p>
          <div className="co-empty-actions">
            <Link className="sh-btn sh-btn-primary" to="/menu">Browse the menu</Link>
            <Link className="sh-btn sh-btn-ghost" to="/cart">Open my cart</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sh-page">
      <header className="sh-pagehead">
        <h1>Checkout</h1>
        <p>Almost there. Tell us where to deliver.</p>
      </header>

      <ol className="co-steps" aria-label="Checkout progress">
        <li className="is-done"><span>✓</span>Cart</li>
        <li className="is-now"><span>2</span>Details</li>
        <li><span>3</span>Done</li>
      </ol>

      <form className="co-grid" onSubmit={pay} noValidate>
        <div className="co-forms">
          <motion.section className="co-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <h2><span>1</span> Contact</h2>
            <div className="co-row">
              <div className={`co-field ${showError("name") ? "has-error" : ""}`}>
                <label htmlFor="co-name">Full name</label>
                <input id="co-name" value={form.name} onChange={set("name")} onBlur={blur("name")} autoComplete="name" placeholder="Your name" aria-invalid={Boolean(showError("name"))} />
                {showError("name") && <small role="alert">{errors.name}</small>}
              </div>
              <div className={`co-field ${showError("phone") ? "has-error" : ""}`}>
                <label htmlFor="co-phone">Mobile number</label>
                <input id="co-phone" value={form.phone} onChange={set("phone")} onBlur={blur("phone")} autoComplete="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number" aria-invalid={Boolean(showError("phone"))} />
                {showError("phone") && <small role="alert">{errors.phone}</small>}
              </div>
            </div>
          </motion.section>

          <motion.section className="co-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.07 } }}>
            <h2><span>2</span> Delivery address</h2>
            <div className={`co-field ${showError("address") ? "has-error" : ""}`}>
              <label htmlFor="co-address">Address</label>
              <textarea id="co-address" rows={3} value={form.address} onChange={set("address")} onBlur={blur("address")} autoComplete="street-address" placeholder="House no, street, area, city, pincode" aria-invalid={Boolean(showError("address"))} />
              {showError("address") && <small role="alert">{errors.address}</small>}
            </div>
          </motion.section>

          <motion.section className="co-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.14 } }}>
            <h2><span>3</span> Payment method</h2>
            <div className="co-methods" role="radiogroup" aria-label="Payment method">
              {METHODS.map((m) => (
                <label key={m.value} className={`co-method ${form.method === m.value ? "is-on" : ""}`}>
                  <input type="radio" name="method" value={m.value} checked={form.method === m.value} onChange={set("method")} />
                  <span className="co-method-icon" aria-hidden="true">{m.icon}</span>
                  <span><b>{m.title}</b><small>{m.text}</small></span>
                  <i aria-hidden="true" />
                </label>
              ))}
            </div>
            <AnimatePresence>
              {form.method !== "COD" && (
                <motion.p className="co-note" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  Demo checkout: no online payment is taken. Your order is placed as {form.method} and nothing is charged.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        <aside className="co-summary">
          <h2>Your order</h2>
          <ul className="co-items">
            {cart.map((item, i) => (
              <motion.li key={`${item.product_id ?? item.id}-${i}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.05 } }}>
                <img src={imgUrl(item.image, 120)} alt="" onError={onImgError} />
                <div><b>{item.item_name || item.name}</b><small>Qty {item.quantity}</small></div>
                <span>{money((Number(item.price) || 0) * (Number(item.quantity) || 1), 2)}</span>
              </motion.li>
            ))}
          </ul>

          <dl className="sh-order-sum">
            <div><dt>Subtotal</dt><dd>{money(subtotal, 2)}</dd></div>
            <div><dt>GST (5%)</dt><dd>{money(tax, 2)}</dd></div>
            <div><dt>Delivery</dt><dd>{delivery === 0 ? <span className="sh-free-tag">FREE</span> : money(delivery, 2)}</dd></div>
            <div className="sh-total"><dt>Total</dt><dd>{money(total, 2)}</dd></div>
          </dl>

          <button className="sh-btn sh-btn-primary sh-block" type="submit" disabled={loading}>
            {loading ? <span className="au-spin co-spin" aria-label="Placing your order" /> : `Place order · ${money(total, 2)}`}
          </button>
          <p className="co-secure">Prices are confirmed by the server when you place the order.</p>
          <Link className="sh-link-center" to="/cart">Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}

export default Payment;
