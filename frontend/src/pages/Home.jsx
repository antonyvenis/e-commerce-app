import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import axios from "axios";
import About from "./About";
import Footer from "./Footer";
import { API_BASE, getUser } from "../api";
import { imgUrl, money, onImgError } from "./shopUtils";
import "./shop.css";

const HERO_SLIDES = [
  { image: "https://img.magnific.com/premium-photo/flying-chicken-biryani-spicy-indian-hyderabadi-biryani-generative-ai_21085-36430.jpg?w=2000", title: "Biryani Special", sub: "Hot, spicy and slow-cooked" },
  { image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65", title: "Pizza Blast", sub: "Cheesy love in every slice" },
  { image: "https://images.unsplash.com/photo-1550547660-d9450f859349", title: "Burger King", sub: "Juicy, stacked and loaded" },
  { image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87", title: "Cool Drinks", sub: "Chill and refresh" },
  { image: "https://img.magnific.com/free-photo/boneless-chicken-with-fries-top-view_23-2149972943.jpg?semt=ais_hybrid", title: "Chicken Fry", sub: "Crispy and tasty" },
  { image: "https://st2.depositphotos.com/1354142/7950/i/950/depositphotos_79501054-stock-photo-south-indian-meals-served-on.jpg", title: "Full Meals", sub: "Home-style South Indian" },
  { image: "https://images.unsplash.com/photo-1551024601-bec78aea704b", title: "Desserts", sub: "A sweet treat to finish" },
  { image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0", title: "Breakfast", sub: "Start the day fresh" },
];

const OFFERS = [
  "50% OFF on all orders",
  "Free delivery above ₹199",
  "Buy 1 Get 1 Free",
  "20% cashback with UPI",
];

const CATEGORIES = [
  { icon: "🍔", name: "Food", note: "Burgers, pizza, rolls", tone: "orange" },
  { icon: "🍛", name: "Biryani", note: "Dum and hyderabadi", tone: "red" },
  { icon: "🥤", name: "Drinks", note: "Juices and shakes", tone: "blue" },
  { icon: "🥗", name: "Veg", note: "Fresh and healthy", tone: "green" },
  { icon: "🍗", name: "Non-veg", note: "Grilled and fried", tone: "violet" },
  { icon: "🍰", name: "Desserts", note: "Sweet endings", tone: "pink" },
];

const STEPS = [
  { n: "01", title: "Pick your dish", text: "Browse the menu, filter by category and save favourites to your wishlist." },
  { n: "02", title: "Pay securely", text: "GST and delivery are shown up front. Delivery is free above ₹199." },
  { n: "03", title: "Track it live", text: "Follow your order from kitchen to doorstep and download the invoice." },
];

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

function Home() {
  const navigate = useNavigate();
  const user = getUser();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [location, setLocation] = useState("Detecting location");
  const [offerIndex, setOfferIndex] = useState(0);
  const [slide, setSlide] = useState(0);
  const touch = useRef({ start: 0, end: 0 });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      () => setLocation("Chennai"),
      () => setLocation("Location off")
    );
  }, []);

  useEffect(() => {
    const id = setInterval(() => setOfferIndex((i) => (i + 1) % OFFERS.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSlide((i) => (i + 1) % HERO_SLIDES.length), 3500);
    return () => clearInterval(id);
  }, []);

  // one request, not a polling loop
  useEffect(() => {
    axios.get(`${API_BASE}/api/products/`)
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : res.data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? products.filter((p) => p.name?.toLowerCase().includes(q)) : products;
  }, [products, search]);

  const suggestions = search.trim() ? matches.slice(0, 5) : [];
  const popular = useMemo(() => (matches.length ? [...matches, ...matches] : []), [matches]);

  const swipe = () => {
    const d = touch.current.start - touch.current.end;
    if (Math.abs(d) < 50) return;
    setSlide((i) => (d > 0 ? (i + 1) % HERO_SLIDES.length : (i === 0 ? HERO_SLIDES.length - 1 : i - 1)));
  };

  const goProduct = (item) => navigate(`/product/${item.id}`, { state: item });
  const current = HERO_SLIDES[slide];

  return (
    <MotionConfig reducedMotion="user">
      <div className="hm">
        {/* ---------------------------------------------------- HERO */}
        <section className="hm-hero">
          <span className="hm-blob hm-blob-a" aria-hidden="true" />
          <span className="hm-blob hm-blob-b" aria-hidden="true" />

          <motion.div className="hm-hero-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {user && <p className="hm-welcome">Welcome back, {user.username}</p>}

            <div className="hm-pills">
              <span className="sh-pill hm-loc">{location}</span>
              <span key={offerIndex} className="sh-pill sh-pill-hot hm-offer">{OFFERS[offerIndex]}</span>
            </div>

            <h1>Delicious food, <span>delivered fast</span></h1>
            <p className="hm-sub">Order from your favourite kitchens anytime. Hot on arrival, tracked to your door.</p>

            <div className={`hm-search ${focused ? "is-focus" : ""}`}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={(e) => e.key === "Enter" && navigate(search.trim() ? `/menu?q=${encodeURIComponent(search.trim())}` : "/menu")}
                placeholder="Search biryani, pizza, dosa…"
                aria-label="Search dishes"
              />
              <button className="sh-btn sh-btn-primary" onClick={() => navigate(search.trim() ? `/menu?q=${encodeURIComponent(search.trim())}` : "/menu")}>Search</button>

              {focused && suggestions.length > 0 && (
                <ul className="hm-suggest">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <button onMouseDown={() => goProduct(p)}>
                        <img src={imgUrl(p.image, 120)} alt="" onError={onImgError} />
                        <span>{p.name}</span>
                        <b>{money(p.price)}</b>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="hm-cta">
              <Link className="sh-btn sh-btn-primary" to="/menu">Order now</Link>
              <Link className="sh-btn sh-btn-ghost" to="/orders">Track my order</Link>
            </div>

            <ul className="hm-stats">
              <li><b>30 min</b><span>avg delivery</span></li>
              <li><b>4.9★</b><span>happy eaters</span></li>
              <li><b>₹199+</b><span>free delivery</span></li>
            </ul>
          </motion.div>

          <motion.div
            className="hm-hero-visual"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            onTouchStart={(e) => (touch.current.start = e.touches[0].clientX)}
            onTouchMove={(e) => (touch.current.end = e.touches[0].clientX)}
            onTouchEnd={swipe}
          >
            <div className="hm-frame">
              {HERO_SLIDES.map((s, i) => (
                <div key={s.title} className={`hm-slide ${i === slide ? "is-on" : ""}`} style={{ backgroundImage: `url(${s.image})` }} role="img" aria-label={s.title} />
              ))}
              <div className="hm-caption">
                <h2 key={current.title}>{current.title}</h2>
                <p key={current.sub}>{current.sub}</p>
                <button className="sh-btn sh-btn-primary" onClick={() => navigate("/menu")}>Order now</button>
              </div>
              <div className="hm-dots" role="tablist" aria-label="Featured dishes">
                {HERO_SLIDES.map((s, i) => (
                  <button key={s.title} className={i === slide ? "is-on" : ""} onClick={() => setSlide(i)} aria-label={`Show ${s.title}`} />
                ))}
              </div>
            </div>
            <span className="hm-float hm-float-a">⭐ 4.8 rated</span>
            <span className="hm-float hm-float-b">🚚 Free above ₹199</span>
          </motion.div>
        </section>

        {/* ----------------------------------------- POPULAR MARQUEE */}
        {popular.length > 0 && (
          <motion.section className="hm-section" {...reveal}>
            <div className="hm-head">
              <div><p className="hm-eyebrow">Popular right now</p><h2>People keep ordering these</h2></div>
              <Link className="sh-link" to="/menu">See full menu</Link>
            </div>
            <div className="hm-marquee">
              <div className="hm-track">
                {popular.map((item, i) => (
                  <button key={`${item.id}-${i}`} className="hm-dish" onClick={() => goProduct(item)} aria-hidden={i >= matches.length}>
                    <img src={imgUrl(item.image, 360)} alt={i < matches.length ? item.name : ""} loading="lazy" onError={onImgError} />
                    <span className="hm-dish-name">{item.name}</span>
                    <span className="hm-dish-price">{money(item.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ------------------------------------------- CATEGORIES */}
        <motion.section className="hm-section" {...reveal}>
          <div className="hm-head"><div><p className="hm-eyebrow">Browse</p><h2>What are you craving?</h2></div></div>
          <div className="hm-cats">
            {CATEGORIES.map((c, i) => (
              <motion.button
                key={c.name}
                className={`hm-cat tone-${c.tone}`}
                onClick={() => navigate("/menu")}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="hm-cat-icon" aria-hidden="true">{c.icon}</span>
                <strong>{c.name}</strong>
                <small>{c.note}</small>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ---------------------------------------------- OFFERS */}
        <motion.section className="hm-section" {...reveal}>
          <div className="hm-offers">
            <article className="hm-offer-card hm-offer-a"><p>Today only</p><h3>50% off your first order</h3><Link to="/menu">Claim it</Link></article>
            <article className="hm-offer-card hm-offer-b"><p>Always on</p><h3>Free delivery above ₹199</h3><Link to="/menu">Start ordering</Link></article>
            <article className="hm-offer-card hm-offer-c"><p>Pay with UPI</p><h3>20% cashback on every UPI order</h3><Link to="/menu">See menu</Link></article>
          </div>
        </motion.section>

        {/* -------------------------------------------- HOW IT WORKS */}
        <motion.section className="hm-section" {...reveal}>
          <div className="hm-head"><div><p className="hm-eyebrow">How it works</p><h2>From craving to doorstep in 3 steps</h2></div></div>
          <ol className="hm-steps">
            {STEPS.map((s) => (
              <li key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </motion.section>

        {/* ------------------------------------------------ BANNER */}
        <motion.section className="hm-section" {...reveal}>
          <div className="hm-banner">
            <div>
              <h2>Hungry? Dinner is a few taps away.</h2>
              <p>Hot food, honest prices and a tracker that tells you exactly when to open the door.</p>
            </div>
            <Link className="sh-btn sh-btn-light" to="/menu">Order now</Link>
          </div>
        </motion.section>

        <About />
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default Home;
