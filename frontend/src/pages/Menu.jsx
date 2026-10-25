import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api, { getUser } from "../api";
import ProductCard, { finalPrice } from "./ProductCart";
import { labelOf } from "./shopUtils";
import "./shop.css";
import "./store.css";

const PAGE_SIZE = 12;

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "offer", label: "Biggest offers" },
];

const sorters = {
  featured: null,
  "price-asc": (a, b) => finalPrice(a) - finalPrice(b),
  "price-desc": (a, b) => finalPrice(b) - finalPrice(a),
  rating: (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
  offer: (a, b) => Number(b.offer || 0) - Number(a.offer || 0),
};

// 1, 2, 3 … 8, 9 style page list
const pageWindow = (current, total) => {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? ["…", p] : [p]));
};

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [offersOnly, setOffersOnly] = useState(false);
  const [page, setPage] = useState(1);

  // all pages of the (cached) product list, at most 10 requests
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = [];
        let next = 1;
        let total = 1;
        do {
          const { data } = await api.get("/products/", { params: { page: next } });
          if (Array.isArray(data)) { all.push(...data); break; }
          all.push(...(data.products || []));
          total = data.total_pages || 1;
          next += 1;
        } while (next <= total && next <= 10);
        if (alive) setProducts(all);
      } catch {
        if (alive) setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // one request for all the hearts on the page
  useEffect(() => {
    if (!getUser()) return;
    api.get("/likes/")
      .then(({ data }) => setLikedIds(Array.isArray(data) ? data.map((i) => i.id) : []))
      .catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [search, category, sort, offersOnly]);

  const categories = useMemo(() => {
    const counts = {};
    products.forEach((p) => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([key, count]) => ({ key, count }));
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) =>
      (category === "all" || p.category === category) &&
      (!offersOnly || Number(p.offer) > 0) &&
      (!q || p.name?.toLowerCase().includes(q))
    );
    if (sorters[sort]) list = [...list].sort(sorters[sort]);
    return list;
  }, [products, search, category, sort, offersOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const favourites = useMemo(
    () => [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 4),
    [products]
  );

  const goPage = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reset = () => { setSearch(""); setCategory("all"); setSort("featured"); setOffersOnly(false); };
  const filtering = search || category !== "all" || offersOnly || sort !== "featured";

  return (
    <div className="sh-page mn">
      <header className="mn-hero">
        <div>
          <p className="hm-eyebrow">Our menu</p>
          <h1>Tasty food, <span>made fresh</span></h1>
          <p className="mn-sub">{loading ? "Loading dishes…" : `${products.length} dishes from your favourite kitchens. Free delivery above ₹199.`}</p>
        </div>
      </header>

      <div className="mn-toolbar">
        <label className="mn-search">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes…" aria-label="Search dishes" />
          {search && <button onClick={() => setSearch("")} aria-label="Clear search">×</button>}
        </label>

        <select className="mn-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort dishes">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <button className={`mn-toggle ${offersOnly ? "is-on" : ""}`} onClick={() => setOffersOnly((o) => !o)} aria-pressed={offersOnly}>
          <span /> Offers only
        </button>
      </div>

      <div className="mn-chips" role="tablist" aria-label="Categories">
        <button className={`mn-chip ${category === "all" ? "is-on" : ""}`} onClick={() => setCategory("all")}>All <b>{products.length}</b></button>
        {categories.map(({ key, count }) => (
          <button key={key} className={`mn-chip ${category === key ? "is-on" : ""}`} onClick={() => setCategory(key)}>{labelOf(key)} <b>{count}</b></button>
        ))}
        <Link className="mn-chip mn-chip-link" to="/food">Cakes →</Link>
        <Link className="mn-chip mn-chip-link" to="/food2">Chinese →</Link>
      </div>

      {loading ? (
        <div className="mn-grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="sh-skel-card" style={{ "--d": `${i * 70}ms` }} />)}</div>
      ) : visible.length === 0 ? (
        <motion.div className="sh-empty" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sh-empty-art" aria-hidden="true">🔍</div>
          <h2>No dishes found</h2>
          <p>Try another word or clear the filters.</p>
          <button className="sh-btn sh-btn-primary" onClick={reset}>Clear filters</button>
        </motion.div>
      ) : (
        <>
          <p className="mn-count" aria-live="polite">
            Showing {(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + visible.length} of {filtered.length} dishes
            {filtering && <button onClick={reset}>Clear filters</button>}
          </p>

          <motion.div className="mn-grid" layout>
            <AnimatePresence mode="popLayout">
              {visible.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 26, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 8) * 0.04 } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                >
                  <ProductCard product={item} likedIds={likedIds} setLikedIds={setLikedIds} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <nav className="mn-pager" aria-label="Pages">
              <button onClick={() => goPage(page - 1)} disabled={page === 1}>Previous</button>
              {pageWindow(page, totalPages).map((p, i) =>
                p === "…" ? <span key={`gap-${i}`}>…</span> : (
                  <button key={p} className={p === page ? "is-on" : ""} onClick={() => goPage(p)} aria-current={p === page ? "page" : undefined}>{p}</button>
                )
              )}
              <button onClick={() => goPage(page + 1)} disabled={page === totalPages}>Next</button>
            </nav>
          )}
        </>
      )}

      {!loading && favourites.length > 0 && !filtering && (
        <section className="mn-fav">
          <div className="hm-head"><div><p className="hm-eyebrow">Customer favourites</p><h2>Top rated right now</h2></div></div>
          <div className="mn-grid mn-grid-4">
            {favourites.map((item) => <ProductCard key={item.id} product={item} likedIds={likedIds} setLikedIds={setLikedIds} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default Menu;
