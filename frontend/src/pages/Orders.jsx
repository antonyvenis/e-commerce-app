import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api, { downloadInvoice } from "../api";
import { STATUSES, breakdown, imgUrl, money, onImgError } from "./shopUtils";
import "./shop.css";

const when = (iso) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function Tracker({ status }) {
  const step = Math.max(0, STATUSES.indexOf(status));
  return (
    <ol className="sh-track" aria-label={`Order status: ${status}`}>
      {STATUSES.map((s, i) => {
        const done = i < step || (status === "Delivered" && i === step);
        return (
          <li key={s} className={done ? "is-done" : i === step ? "is-now" : ""}>
            <span className="sh-dot">{done ? "✓" : i + 1}</span>
            <em>{s}</em>
          </li>
        );
      })}
      <motion.span className="sh-track-fill" initial={{ width: 0 }} animate={{ width: `${(step / (STATUSES.length - 1)) * 75}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </ol>
  );
}

function OrderCard({ order, index, startOpen }) {
  const [open, setOpen] = useState(startOpen);
  const [busy, setBusy] = useState(false);

  const subtotal = order.items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const { tax, delivery, total } = breakdown(subtotal);
  const count = order.items.reduce((n, i) => n + i.quantity, 0);

  const invoice = async () => {
    setBusy(true);
    try {
      await downloadInvoice(order.id);
    } catch {
      toast.error("Could not download the invoice");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.article
      className="sh-order"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index, 6) * 0.07 } }}
    >
      <header className="sh-order-head">
        <div>
          <h2>Order #{order.id}</h2>
          <p>{when(order.created_at)}</p>
        </div>
        <span className={`sh-status st-${order.status.toLowerCase().replace(/\s+/g, "-")}`}>{order.status}</span>
      </header>

      <Tracker status={order.status} />

      <div className="sh-order-meta">
        <span>{count} {count === 1 ? "item" : "items"}</span>
        {order.payment_method && <span>{order.payment_method}</span>}
        {order.address && <span className="sh-addr">{order.address}</span>}
        <strong>{money(total, 2)}</strong>
      </div>

      <button className="sh-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Hide items" : "Show items"}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>

      <motion.div className="sh-order-body" initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
        <ul className="sh-order-items">
          {order.items.map((item, i) => (
            <li key={i}>
              <img src={imgUrl(item.image, 200)} alt={item.item_name} loading="lazy" onError={onImgError} />
              <div><h3>{item.item_name}</h3><p>Qty {item.quantity}</p></div>
              <b>{money(parseFloat(item.price) * item.quantity, 2)}</b>
            </li>
          ))}
        </ul>

        <dl className="sh-order-sum">
          <div><dt>Subtotal</dt><dd>{money(subtotal, 2)}</dd></div>
          <div><dt>GST (5%)</dt><dd>{money(tax, 2)}</dd></div>
          <div><dt>Delivery</dt><dd>{delivery === 0 ? <span className="sh-free-tag">FREE</span> : money(delivery, 2)}</dd></div>
          <div className="sh-total"><dt>Total</dt><dd>{money(total, 2)}</dd></div>
        </dl>
      </motion.div>

      <footer className="sh-order-actions">
        <Link className="sh-btn sh-btn-ghost" to="/menu">Order again</Link>
        <button className="sh-btn sh-btn-primary" onClick={invoice} disabled={busy}>{busy ? "Preparing…" : "Download invoice"}</button>
      </footer>
    </motion.article>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.get("/orders/")
      .then(({ data }) => alive && setOrders(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Could not load your orders"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <div className="sh-page sh-narrow">
      <header className="sh-pagehead">
        <h1>Your orders</h1>
        {!loading && orders.length > 0 && <p>{orders.length} {orders.length === 1 ? "order" : "orders"} so far</p>}
      </header>

      {loading ? (
        <div className="sh-skel-list">{[0, 1].map((i) => <span key={i} className="tall" style={{ "--d": `${i * 90}ms` }} />)}</div>
      ) : orders.length === 0 ? (
        <motion.div className="sh-empty" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sh-empty-art" aria-hidden="true">📦</div>
          <h2>No orders yet</h2>
          <p>Your first order will show up here with live tracking.</p>
          <Link className="sh-btn sh-btn-primary" to="/menu">Order now</Link>
        </motion.div>
      ) : (
        <div className="sh-orders">
          {orders.map((order, i) => <OrderCard key={order.id} order={order} index={i} startOpen={i === 0} />)}
        </div>
      )}
    </div>
  );
}

export default Orders;
