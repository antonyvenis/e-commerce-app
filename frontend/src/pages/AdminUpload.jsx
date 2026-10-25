import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api, { downloadInvoice, getUser } from "../api";
import { Products } from "./Products";
import "./admin.css";

const STATUSES = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const when = (iso) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

/* animated number: counts up once, respects reduced-motion */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }
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
  return value;
}

function Stat({ label, value, format, tone, icon, delay }) {
  const shown = useCountUp(value);
  return (
    <div className={`adm-stat tone-${tone}`} style={{ "--d": `${delay}ms` }}>
      <span className="adm-stat-icon" aria-hidden="true">{icon}</span>
      <div>
        <p className="adm-stat-label">{label}</p>
        <p className="adm-stat-value">{format ? format(shown) : Math.round(shown).toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

const Skeleton = ({ rows = 5 }) => (
  <div className="adm-skel" aria-hidden="true">
    {Array.from({ length: rows }).map((_, i) => <span key={i} style={{ "--d": `${i * 80}ms` }} />)}
  </div>
);

const Pager = ({ page, total, onChange }) =>
  total > 1 ? (
    <div className="adm-pager">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {total}</span>
      <button disabled={page >= total} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  ) : null;

/* ---------------------------------- Orders ---------------------------------- */
function OrdersTab({ stats, onChanged }) {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/admin/orders/", { params: { status: status || undefined, page } });
      setData(res);
    } catch {
      toast.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (order, next) => {
    const previous = order.status;
    setData((d) => ({ ...d, orders: d.orders.map((o) => (o.id === order.id ? { ...o, status: next } : o)) }));
    try {
      await api.post(`/admin/orders/${order.id}/status/`, { status: next });
      toast.success(`Order #${order.id} is now ${next}`);
      onChanged();
    } catch {
      setData((d) => ({ ...d, orders: d.orders.map((o) => (o.id === order.id ? { ...o, status: previous } : o)) }));
      toast.error("Could not update the status");
    }
  };

  return (
    <section>
      <div className="adm-chips" role="tablist" aria-label="Filter orders by status">
        {["", ...STATUSES].map((s) => (
          <button key={s || "all"} className={`adm-chip ${status === s ? "is-on" : ""}`} onClick={() => { setStatus(s); setPage(1); }}>
            {s || "All"}
            <b>{s ? stats?.by_status?.[s] ?? 0 : stats?.orders ?? 0}</b>
          </button>
        ))}
      </div>

      {loading && !data ? <Skeleton /> : (
        <div className={`adm-table-wrap ${loading ? "is-loading" : ""}`}>
          <table className="adm-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Placed</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {data?.orders.map((o, i) => (
                <tr key={o.id} style={{ "--d": `${i * 35}ms` }}>
                  <td data-label="Order"><b>#{o.id}</b></td>
                  <td data-label="Customer">{o.customer}<small>{o.email}</small></td>
                  <td data-label="Items">{o.items_count}</td>
                  <td data-label="Total"><b>{money(o.total)}</b><small>{o.payment_method || "—"}</small></td>
                  <td data-label="Placed">{when(o.created_at)}</td>
                  <td data-label="Status">
                    <select className={`adm-status st-${slug(o.status)}`} value={o.status} onChange={(e) => changeStatus(o, e.target.value)} aria-label={`Status of order ${o.id}`}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td data-label="">
                    <button className="adm-ghost" onClick={() => downloadInvoice(o.id).catch(() => toast.error("Invoice failed"))}>Invoice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.orders.length === 0 && <p className="adm-empty">No orders here yet.</p>}
        </div>
      )}
      <Pager page={data?.page || 1} total={data?.total_pages || 1} onChange={setPage} />
    </section>
  );
}

/* --------------------------------- Products --------------------------------- */
function ProductsTab({ onChanged }) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setQuery(q); setPage(1); }, 300);
    return () => clearTimeout(timer.current);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/admin/products/", { params: { q: query || undefined, page } });
      setData(res);
    } catch {
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (p) => {
    setData((d) => ({ ...d, products: d.products.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)) }));
    try {
      await api.post(`/admin/products/${p.id}/toggle/`);
      toast.success(`${p.name} is now ${p.is_active ? "hidden" : "visible"}`);
      onChanged();
    } catch {
      setData((d) => ({ ...d, products: d.products.map((x) => (x.id === p.id ? { ...x, is_active: p.is_active } : x)) }));
      toast.error("Could not update the product");
    }
  };

  return (
    <section>
      <div className="adm-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes…" aria-label="Search products" />
        {data && <span>{data.total} items</span>}
      </div>

      {loading && !data ? <Skeleton /> : (
        <div className={`adm-table-wrap ${loading ? "is-loading" : ""}`}>
          <table className="adm-table">
            <thead>
              <tr><th>Dish</th><th>Category</th><th>Price</th><th>Offer</th><th>Stock</th><th>Visible</th></tr>
            </thead>
            <tbody>
              {data?.products.map((p, i) => (
                <tr key={p.id} style={{ "--d": `${i * 35}ms` }} className={p.is_active ? "" : "is-off"}>
                  <td data-label="Dish">
                    <span className="adm-dish">
                      {p.image ? <img src={p.image} alt="" loading="lazy" /> : <i />}
                      {p.name}
                    </span>
                  </td>
                  <td data-label="Category">{p.category}</td>
                  <td data-label="Price">{money(p.price)}</td>
                  <td data-label="Offer">{p.offer ? `${p.offer}%` : "—"}</td>
                  <td data-label="Stock">{p.stock}</td>
                  <td data-label="Visible">
                    <button role="switch" aria-checked={p.is_active} className={`adm-switch ${p.is_active ? "on" : ""}`} onClick={() => toggle(p)} aria-label={`Toggle ${p.name}`}>
                      <span />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.products.length === 0 && <p className="adm-empty">No dishes match "{query}".</p>}
        </div>
      )}
      <Pager page={data?.page || 1} total={data?.total_pages || 1} onChange={setPage} />
    </section>
  );
}

/* ----------------------------------- Tools ---------------------------------- */
function ToolsTab({ onChanged }) {
  const [busy, setBusy] = useState(false);

  const upload = async () => {
    if (!window.confirm("Upload the sample menu from Products.jsx? Existing dishes with the same name are updated.")) return;
    try {
      setBusy(true);
      await api.post("/add-products-bulk/", { products: Products() });
      toast.success("Sample menu uploaded");
      onChanged();
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="adm-tools">
      <article className="adm-tool">
        <h3>Upload sample menu</h3>
        <p>Adds every dish from <code>Products.jsx</code> to the database. Safe to run again, dishes with the same name are updated.</p>
        <button className="adm-primary" onClick={upload} disabled={busy}>{busy ? "Uploading…" : "Upload menu"}</button>
      </article>
      <article className="adm-tool">
        <h3>Django admin</h3>
        <p>Manage users and roles, edit dishes in full, and see raw database rows.</p>
        <a className="adm-ghost" href={`${(import.meta.env.VITE_API_URL || "https://e-commerce-app-8jg4.onrender.com").replace(/\/$/, "")}/legend-admin/`} target="_blank" rel="noreferrer">Open Django admin</a>
      </article>
    </section>
  );
}

/* ---------------------------------- Page ------------------------------------ */
const ICONS = {
  users: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M2.8 20c.6-3.4 3-5 6.2-5s5.6 1.6 6.2 5M16 5.2a3.2 3.2 0 0 1 0 6M18.5 15.2c1.7.6 2.7 2.1 3 4.3" /></svg>,
  dishes: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18a9 9 0 0 1-18 0zM8 8c0-1.5 1-2 1-3.5M12 8c0-1.5 1-2 1-3.5M16 8c0-1.5 1-2 1-3.5" /></svg>,
  orders: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" /></svg>,
  revenue: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5h10M7 9h10M7 5c4 0 6 1.5 6 4s-2 4-6 4l7 6" /></svg>,
};

function AdminUpload() {
  const user = getUser();
  const [tab, setTab] = useState("orders");
  const [stats, setStats] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/stats/");
      setStats(data);
    } catch {
      toast.error("Could not load the dashboard numbers");
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const tabs = [["orders", "Orders"], ["products", "Dishes"], ["tools", "Tools"]];

  return (
    <div className="adm">
      <header className="adm-head">
        <div>
          <p className="adm-eyebrow">Admin dashboard</p>
          <h1>Hello, {user?.username || "admin"}</h1>
        </div>
        <button className="adm-ghost" onClick={loadStats}>Refresh</button>
      </header>

      <div className="adm-stats">
        {stats ? (
          <>
            <Stat label="Customers" value={stats.users} tone="blue" icon={ICONS.users} delay={0} />
            <Stat label="Live dishes" value={stats.products} tone="orange" icon={ICONS.dishes} delay={70} />
            <Stat label="Orders" value={stats.orders} tone="violet" icon={ICONS.orders} delay={140} />
            <Stat label="Revenue" value={stats.revenue} format={money} tone="green" icon={ICONS.revenue} delay={210} />
          </>
        ) : (
          [0, 1, 2, 3].map((i) => <div key={i} className="adm-stat adm-stat-skel" style={{ "--d": `${i * 70}ms` }} />)
        )}
      </div>

      <nav className="adm-tabs" aria-label="Dashboard sections">
        {tabs.map(([key, label]) => (
          <button key={key} className={tab === key ? "is-on" : ""} onClick={() => setTab(key)} aria-current={tab === key ? "page" : undefined}>
            {label}
          </button>
        ))}
      </nav>

      <div className="adm-panel" key={tab}>
        {tab === "orders" && <OrdersTab stats={stats} onChanged={loadStats} />}
        {tab === "products" && <ProductsTab onChanged={loadStats} />}
        {tab === "tools" && <ToolsTab onChanged={loadStats} />}
      </div>
    </div>
  );
}

export default AdminUpload;
