import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCart";
import { useCart } from "./CartContext";
import axios from "axios";
import { Link } from "react-router-dom";
// import { FaBars } from "react-icons/fa";

const API = "https://e-commerce-app-8jg4.onrender.com";

function Menu() {
  const { cart } = useCart();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products/`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter(p => filter === "all" || p.category === filter)
      .filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
  }, [products, search, filter]);

  const suggestions = useMemo(() => {
    if (cart.length === 0) return products.slice(0, 3);
    const categories = cart.map(item => item.category);
    return products.filter(p => categories.includes(p.category));
  }, [products, cart]);

  return (
    <div>

      {/* 🔥 TOP BAR (Search + Hamburger same line) */}
      <div className="top-bar">
        <motion.input
          type="text"
          placeholder="Search food...🔍"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        />

        {/* <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}> ☰ </button> */}

        <button 
  className="hamburger" 
  onClick={() => setMenuOpen(!menuOpen)}
  style={{ display: window.innerWidth >= 768 ? 'none' : 'flex' }}
  > ☰ </button>

      </div>

      {/* 🎯 FILTERS */}
      <div className={`filters ${menuOpen ? "open" : ""}`}>

        <button onClick={() => { setFilter("all"); setMenuOpen(false); }}>
         All 🍽️
        </button>

        <button onClick={() => { setFilter("veg"); setMenuOpen(false); }}>
          Veg 🍛
        </button>

        <button onClick={() => { setFilter("non-veg"); setMenuOpen(false); }}>
          Non-Veg 🍗
        </button>

        <button onClick={() => { setFilter("drinks"); setMenuOpen(false); }}>
          Cool Drinks 🥤
        </button>

        <button onClick={() => { setFilter("side-dish"); setMenuOpen(false); }}>
          Side Dish 🍔
        </button>

        <button onClick={() => setMenuOpen(false)}>
          <Link to="/food" id="Link-text">Cake 🍰 </Link>
        </button>

        <button onClick={() => setMenuOpen(false)}>
          <Link to="/food2" id="Link-text">Chinese 🥢</Link>
        </button>

        <button onClick={() => { setFilter("comming-soon"); setMenuOpen(false); }}>
          Coming 🔜.... 🕒
        </button>

      </div>

      <h2 className="title">Tasty & Sweety Foods 🔥</h2>

      {/* ⏳ LOADING */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading... ⏳</p>
      ) : (
        <div className="grid">
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                No items found 😢
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 🧠 Suggestions */}
      <h2 className="title">🧠 Recommended for You</h2>

      <div className="grid">
        {suggestions.map(item => (
          <motion.div key={item.id} whileHover={{ scale: 1.05 }}>
            <ProductCard product={item} />
          </motion.div>
        ))}
      </div>

    </div>
  );
}

export default Menu;