import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import "./shop.css";
import "./extra.css";

const STEP = 12;
const KEY = "exploreSaved"; // its own key, so it can never clash with the server wishlist cache ("likes")

// "Chicken Handi" -> "Chicken", used to jump into our own menu search
const keyword = (name = "") => name.split(/\s+/).find((w) => w.length > 3) || name;

const readSaved = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

function ExploreGrid({ eyebrow, title, accent, subtitle, items, loading, failed }) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(readSaved);
  const [shown, setShown] = useState(STEP);

  const tags = useMemo(() => {
    const counts = {};
    items.forEach((i) => { counts[i.tag] = (counts[i.tag] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) =>
      (tag === "All" || i.tag === tag) &&
      (!savedOnly || saved.includes(i.id)) &&
      (!q || i.name.toLowerCase().includes(q))
    );
  }, [items, search, tag, savedOnly, saved]);

  const visible = filtered.slice(0, shown);

  const toggleSave = (item) => {
    const next = saved.includes(item.id) ? saved.filter((id) => id !== item.id) : [...saved, item.id];
    setSaved(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    toast.success(next.includes(item.id) ? `${item.name} saved` : `${item.name} removed`);
  };

  return (
    <div className="hm ex">
      <header className="ex-hero">
        <p className="hm-eyebrow">{eyebrow}</p>
        <h1>{title} <span>{accent}</span></h1>
        <p className="ex-sub">{subtitle}</p>
        <p className="ex-demo">Inspiration from a public sample menu. To order, search the dish on <Link to="/menu">our menu</Link>.</p>
      </header>

      <div className="ex-wrap">
        <div className="mn-toolbar ex-toolbar">
          <label className="mn-search">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setShown(STEP); }} placeholder="Search dishes…" aria-label="Search dishes" />
          </label>
          <button className={`mn-toggle ${savedOnly ? "is-on" : ""}`} onClick={() => { setSavedOnly((s) => !s); setShown(STEP); }} aria-pressed={savedOnly}>
            <span /> Saved ({saved.filter((id) => items.some((i) => i.id === id)).length})
          </button>
        </div>

        {tags.length > 0 && (
          <div className="mn-chips" role="tablist" aria-label="Cuisine">
            {[{ name: "All", count: items.length }, ...tags].map((t) => (
              <button key={t.name} className={`mn-chip ${tag === t.name ? "is-on" : ""}`} onClick={() => { setTag(t.name); setShown(STEP); }}>{t.name} <b>{t.count}</b></button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="ex-grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="sh-skel-card" style={{ "--d": `${i * 70}ms` }} />)}</div>
        ) : failed ? (
          <div className="sh-empty">
            <div className="sh-empty-art" aria-hidden="true">📡</div>
            <h2>Could not load the dishes</h2>
            <p>The sample menu service did not answer. Check your connection and try again.</p>
            <button className="sh-btn sh-btn-primary" onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : visible.length === 0 ? (
          <div className="sh-empty">
            <div className="sh-empty-art" aria-hidden="true">🔍</div>
            <h2>No dishes found</h2>
            <p>Try another word or clear the filters.</p>
            <button className="sh-btn sh-btn-primary" onClick={() => { setSearch(""); setTag("All"); setSavedOnly(false); }}>Clear filters</button>
          </div>
        ) : (
          <>
            <p className="mn-count" aria-live="polite">Showing {visible.length} of {filtered.length} dishes</p>
            <motion.div className="ex-grid" layout>
              <AnimatePresence mode="popLayout">
                {visible.map((item, i) => {
                  const isSaved = saved.includes(item.id);
                  return (
                    <motion.article key={item.id} layout className="ex-card"
                      initial={{ opacity: 0, y: 28, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i % STEP, 8) * 0.04 } }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}>
                      <div className="ex-media">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <span className="ex-tag">{item.tag}</span>
                        <button className={`sh-heart ${isSaved ? "is-on" : ""}`} onClick={() => toggleSave(item)} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${item.name}` : `Save ${item.name}`}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2 0 3.6 1 4.7 2.7h1.4c1.1-1.7 2.7-2.7 4.7-2.7 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z" /></svg>
                        </button>
                      </div>
                      <div className="ex-body">
                        <h3>{item.name}</h3>
                        <p className="ex-meta">
                          <span className="sh-rating">★ {Number(item.rating).toFixed(1)}</span>
                          <span>{item.time} min</span>
                          {item.sub && <span>{item.sub}</span>}
                        </p>
                        <Link className="sh-btn sh-btn-ghost sh-block" to={`/menu?q=${encodeURIComponent(keyword(item.name))}`}>Find on our menu</Link>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {shown < filtered.length && (
              <div className="ex-more"><button className="sh-btn sh-btn-primary" onClick={() => setShown((s) => s + STEP)}>Show more dishes</button></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ExploreGrid;
