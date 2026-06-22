// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ProductCard from "./ProductCart";
// import { useCart } from "./CartContext";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const API = "https://e-commerce-app-8jg4.onrender.com";

// function Menu() {
//   const { cart } = useCart();

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${API}/api/products/`);

//       // ✅ SAFE FIX: always ensure array
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.products || [];

//       setProducts(data);
//     } catch (err) {
//       console.log(err);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // 🔥 FILTERED PRODUCTS (SAFE)
//   const filtered = useMemo(() => {
//     const safeProducts = Array.isArray(products) ? products : [];

//     return safeProducts
//       .filter(p => filter === "all" || p.category === filter)
//       .filter(p =>
//         p.name?.toLowerCase().includes(search.toLowerCase())
//       );
//   }, [products, search, filter]);

//   // 🧠 SUGGESTIONS (SAFE)
//   const suggestions = useMemo(() => {
//     const safeProducts = Array.isArray(products) ? products : [];

//     if (!cart || cart.length === 0) {
//       return safeProducts.slice(0, 3);
//     }

//     const categories = cart.map(item => item.category);

//     return safeProducts.filter(p =>
//       categories.includes(p.category)
//     );
//   }, [products, cart]);

//   return (
//     <div>

//       {/* 🔥 TOP BAR */}
//       <div className="top-bar">

//         <motion.input
//           type="text"
//           placeholder="Search food...🔍"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="search"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         />

//         {/* ✅ FIX: remove window.innerWidth usage */}
//         <button
//           className="hamburger"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </button>

//       </div>

//       {/* 🎯 FILTERS */}
//       <div className={`filters ${menuOpen ? "open" : ""}`}>

//         <button onClick={() => { setFilter("all"); setMenuOpen(false); }}>
//           All 🍽️
//         </button>

//         <button onClick={() => { setFilter("veg"); setMenuOpen(false); }}>
//           Veg 🍛
//         </button>

//         <button onClick={() => { setFilter("non-veg"); setMenuOpen(false); }}>
//           Non-Veg 🍗
//         </button>

//         <button onClick={() => { setFilter("drinks"); setMenuOpen(false); }}>
//           Cool Drinks 🥤
//         </button>

//         <button onClick={() => { setFilter("side-dish"); setMenuOpen(false); }}>
//           Side Dish 🍔
//         </button>

//         <button onClick={() => setMenuOpen(false)}>
//           <Link to="/food" id="Link-text">Cake 🍰</Link>
//         </button>

//         <button onClick={() => setMenuOpen(false)}>
//           <Link to="/food2" id="Link-text">Chinese 🥢</Link>
//         </button>

//         <button onClick={() => { setFilter("comming-soon"); setMenuOpen(false); }}>
//           Coming 🔜 🕒
//         </button>

//       </div>

//       <h2 className="title">Tasty & Sweety Foods 🔥</h2>

//       {/* ⏳ LOADING */}
//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading... ⏳</p>
//       ) : (
//         <div className="grid">

//           <AnimatePresence>
//             {filtered.length > 0 ? (
//               filtered.map(item => (
//                 <motion.div
//                   key={item.id}
//                   layout
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.5 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <ProductCard product={item} />
//                 </motion.div>
//               ))
//             ) : (
//               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                 No items found 😢
//               </motion.p>
//             )}
//           </AnimatePresence>

//         </div>
//       )}

//       {/* 🧠 SUGGESTIONS */}
//       <h2 className="title">🧠 Recommended for You</h2>

//       <div className="grid">
//         {suggestions.map(item => (
//           <motion.div key={item.id} whileHover={{ scale: 1.05 }}>
//             <ProductCard product={item} />
//           </motion.div>
//         ))}
//       </div>

//     </div>
//   );
// }

// export default Menu;

// import { useState, useEffect, useMemo, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ProductCard from "./ProductCart";
// import { useCart } from "./CartContext";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const API = "https://e-commerce-app-8jg4.onrender.com";

// function Menu() {
//   const { cart } = useCart();

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // 🔥 INFINITE SCROLL STATE
//   const [visibleCount, setVisibleCount] = useState(10);
//   const loaderRef = useRef(null);

//   /* ================================
//      🟢 FETCH PRODUCTS
//   ================================ */
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${API}/api/products/`);

//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.products || [];

//       setProducts(data);
//     } catch (err) {
//       console.log(err);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* ================================
//      🔄 RESET visible count on filter/search change
//   ================================ */
//   useEffect(() => {
//     setVisibleCount(10);
//   }, [search, filter]);

//   /* ================================
//      🔥 FILTERED PRODUCTS (SAFE)
//   ================================ */
//   const filtered = useMemo(() => {
//     const safeProducts = Array.isArray(products) ? products : [];

//     return safeProducts
//       .filter(p => filter === "all" || p.category === filter)
//       .filter(p =>
//         p.name?.toLowerCase().includes(search.toLowerCase())
//       );
//   }, [products, search, filter]);

//   /* ================================
//      👁️ VISIBLE PRODUCTS (for infinite scroll)
//   ================================ */
//   const visibleProducts = useMemo(() => {
//     return filtered.slice(0, visibleCount);
//   }, [filtered, visibleCount]);

//   /* ================================
//      ♾️ INFINITE SCROLL - load more
//   ================================ */
//   const loadMore = useCallback(() => {
//     setVisibleCount(prev => prev + 10);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           loadMore();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => observer.disconnect();
//   }, [loadMore, visibleProducts]);

//   /* ================================
//      🧠 SUGGESTIONS (SAFE)
//   ================================ */
//   const suggestions = useMemo(() => {
//     const safeProducts = Array.isArray(products) ? products : [];

//     if (!cart || cart.length === 0) {
//       return safeProducts.slice(0, 3);
//     }

//     const categories = cart.map(item => item.category);

//     return safeProducts.filter(p =>
//       categories.includes(p.category)
//     );
//   }, [products, cart]);

//   /* ================================
//      🎨 UI
//   ================================ */
//   return (
//     <div>

//       {/* 🔥 TOP BAR */}
//       <div className="top-bar">

//         <motion.input
//           type="text"
//           placeholder="Search food...🔍"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="search"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         />

//         <button
//           className="hamburger"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </button>

//       </div>

//       {/* 🎯 FILTERS */}
//       <div className={`filters ${menuOpen ? "open" : ""}`}>

//         <button onClick={() => { setFilter("all"); setMenuOpen(false); }}>
//           All 🍽️
//         </button>

//         <button onClick={() => { setFilter("veg"); setMenuOpen(false); }}>
//           Veg 🍛
//         </button>

//         <button onClick={() => { setFilter("non-veg"); setMenuOpen(false); }}>
//           Non-Veg 🍗
//         </button>

//         <button onClick={() => { setFilter("drinks"); setMenuOpen(false); }}>
//           Cool Drinks 🥤
//         </button>

//         <button onClick={() => { setFilter("side-dish"); setMenuOpen(false); }}>
//           Side Dish 🍔
//         </button>

//         <button onClick={() => setMenuOpen(false)}>
//           <Link to="/food" id="Link-text">Cake 🍰</Link>
//         </button>

//         <button onClick={() => setMenuOpen(false)}>
//           <Link to="/food2" id="Link-text">Chinese 🥢</Link>
//         </button>

//         <button onClick={() => { setFilter("comming-soon"); setMenuOpen(false); }}>
//           Coming 🔜 🕒
//         </button>

//       </div>

//       <h2 className="title">Tasty & Sweety Foods 🔥</h2>

//       {/* ⏳ LOADING */}
//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading... ⏳</p>
//       ) : (
//         <>
//           <div className="grid">
//             <AnimatePresence>
//               {visibleProducts.length > 0 ? (
//                 visibleProducts.map(item => (
//                   <motion.div
//                     key={item.id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.5 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ProductCard product={item} />
//                   </motion.div>
//                 ))
//               ) : (
//                 <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   No items found 😢
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* ♾️ INFINITE SCROLL LOADER */}
//           {visibleCount < filtered.length && (
//             <div
//               ref={loaderRef}
//               style={{
//                 textAlign: "center",
//                 padding: "30px",
//                 fontSize: "20px"
//               }}
//             >
//               Loading more... ⏳
//             </div>
//           )}

//           {/* ✅ ALL LOADED MESSAGE */}
//           {visibleCount >= filtered.length && filtered.length > 0 && (
//             <p style={{
//               textAlign: "center",
//               padding: "20px",
//               color: "gray",
//               fontSize: "14px"
//             }}>
//               ✅ All {filtered.length} items loaded!
//             </p>
//           )}
//         </>
//       )}

//       {/* 🧠 SUGGESTIONS */}
//       <h2 className="title">🧠 Recommended for You</h2>

//       <div className="grid">
//         {suggestions.map(item => (
//           <motion.div key={item.id} whileHover={{ scale: 1.05 }}>
//             <ProductCard product={item} />
//           </motion.div>
//         ))}
//       </div>

//     </div>
//   );
// }

// export default Menu;

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCart";
import { useCart } from "./CartContext";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "https://e-commerce-app-8jg4.onrender.com";
const ITEMS_PER_PAGE = 20; // 🔥 20 products per page

function Menu() {
  const { cart } = useCart();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔥 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);

  /* ================================
     🟢 FETCH PRODUCTS
  ================================ */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products/`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.products || [];

      setProducts(data);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔄 filter/search change ஆனா page 1-க்கு reset
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  /* ================================
     🔥 FILTERED PRODUCTS
  ================================ */
  const filtered = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    return safeProducts
      .filter(p => filter === "all" || p.category === filter)
      .filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
  }, [products, search, filter]);

  /* ================================
     📄 PAGINATION LOGIC
  ================================ */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 🔝 top-க்கு scroll
  };

  /* ================================
     🧠 SUGGESTIONS
  ================================ */
  const suggestions = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    if (!cart || cart.length === 0) {
      return safeProducts.slice(0, 3);
    }

    const categories = cart.map(item => item.category);
    return safeProducts.filter(p => categories.includes(p.category));
  }, [products, cart]);

  /* ================================
     🎨 UI
  ================================ */
  return (
    <div>

      {/* 🔥 TOP BAR */}
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

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 🎯 FILTERS */}
      <div className={`filters ${menuOpen ? "open" : ""}`}>
        <button onClick={() => { setFilter("all"); setMenuOpen(false); }}>All 🍽️</button>
        <button onClick={() => { setFilter("veg"); setMenuOpen(false); }}>Veg 🍛</button>
        <button onClick={() => { setFilter("non-veg"); setMenuOpen(false); }}>Non-Veg 🍗</button>
        <button onClick={() => { setFilter("drinks"); setMenuOpen(false); }}>Cool Drinks 🥤</button>
        <button onClick={() => { setFilter("side-dish"); setMenuOpen(false); }}>Side Dish 🍔</button>
        <button onClick={() => setMenuOpen(false)}>
          <Link to="/food" id="Link-text">Cake 🍰</Link>
        </button>
        <button onClick={() => setMenuOpen(false)}>
          <Link to="/food2" id="Link-text">Chinese 🥢</Link>
        </button>
        <button onClick={() => { setFilter("comming-soon"); setMenuOpen(false); }}>Coming 🔜 🕒</button>
      </div>

      <h2 className="title">Tasty & Sweety Foods 🔥</h2>

      {/* ⏳ LOADING */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading... ⏳</p>
      ) : (
        <>
          {/* 📊 RESULT COUNT */}
          <p style={{ textAlign: "center", color: "gray", marginBottom: "10px" }}>
            Showing {currentProducts.length} of {filtered.length} items
            &nbsp;|&nbsp; Page {currentPage} of {totalPages}
          </p>

          {/* 🛒 PRODUCT GRID */}
          <div className="grid">
            <AnimatePresence mode="wait">
              {currentProducts.length > 0 ? (
                currentProducts.map(item => (
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

          {/* 📄 PAGINATION BUTTONS */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              margin: "30px 0",
              flexWrap: "wrap"
            }}>

              {/* ◀ PREV */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: currentPage === 1 ? "#ccc" : "#ff5722",
                  color: "#fff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "bold"
                }}
              >
                ◀ Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: currentPage === page ? "#ff5722" : "#f0f0f0",
                    color: currentPage === page ? "#fff" : "#333",
                    fontWeight: currentPage === page ? "bold" : "normal",
                    cursor: "pointer",
                    minWidth: "40px"
                  }}
                >
                  {page}
                </button>
              ))}

              {/* ▶ NEXT */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: currentPage === totalPages ? "#ccc" : "#ff5722",
                  color: "#fff",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "bold"
                }}
              >
                Next ▶
              </button>

            </div>
          )}
        </>
      )}

      {/* 🧠 SUGGESTIONS */}
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