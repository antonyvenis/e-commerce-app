// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ProductCard from "./ProductCart";
// import { useCart } from "./CartContext";
// import Products from "./products";
// import { Link } from "react-router-dom";

// function Menu() {
//   const { cart } = useCart();
//   const products = Products();

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   // 🔥 Search + Filter COMBINED
//   const filtered = products
//     .filter(p => filter === "all" || p.category === filter)
//     .filter(p =>
//       p.name.toLowerCase().includes(search.toLowerCase())
//     );

//   // 🧠 Smart Suggestions
//   const getSuggestions = (products, cart) => {
//     if (cart.length === 0) return products.slice(0, 3);

//     const categories = cart.map(item => item.category);
//     return products.filter(p => categories.includes(p.category));
//   };

//   const suggestions = getSuggestions(products, cart);

//   return (
//     <div>

//       {/* 🔍 Search Bar */}
//       <motion.input
//         type="text"
//         placeholder="Search food...🔍"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="search"

//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//       />

//       {/* 🎯 Category Filter */}
//       <div className="filters">
//         <button onClick={() => setFilter("all")}>All</button>
//         <button onClick={() => setFilter("veg")}>Veg</button>
//         <button onClick={() => setFilter("non-veg")}>Non-Veg</button>
//         <button onClick={() => setFilter("drinks")}>Cool Drinks</button>
//         <button onClick={() => setFilter("side-dish")}>Side Dish</button>

//         <button>
//           <Link to="/food" id="Link-text">Cake</Link>
//         </button>

//         <button>
//           <Link to="/food2" id="Link-text">Chinese</Link>
//         </button>

//         <button onClick={() => setFilter("comming-soon")}>Comming soon....</button>

        
//       </div>

//       <h2 className="title">Tasty & Sweety Foods 🔥</h2>

//       {/* 🍔 PRODUCTS GRID */}
//       <div className="grid">
//         <AnimatePresence>
//           {filtered.length > 0 ? (
//             filtered.map(item => (
//               <motion.div
//                 key={item.id}

//                 layout
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.5 }}

//                 transition={{ duration: 0.3 }}
//               >
//                 <ProductCard product={item} />
//               </motion.div>
//             ))
//           ) : (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               No items found 😢
//             </motion.p>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* 🧠 Smart Suggestions */}
//       <h2 className="title">🧠 Recommended for You</h2>

//       <div className="grid">
//         {suggestions.map(item => (
//           <motion.div
//             key={item.id}
//             whileHover={{ scale: 1.05 }}
//           >
//             <ProductCard product={item} />
//           </motion.div>
//         ))}
//       </div>

//     </div>
//   );
// }

// export default Menu;

// import { useState, useEffect } from "react";   // 🔥 useEffect add
// import { motion, AnimatePresence } from "framer-motion";
// import ProductCard from "./ProductCart";
// import { useCart } from "./CartContext";
// import axios from "axios";                    // 🔥 axios add
// import { Link } from "react-router-dom";

// function Menu() {
//   const { cart } = useCart();

//   const [products, setProducts] = useState([]);  // 🔥 change
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   // 🔥 FETCH PRODUCTS FROM DJANGO
//   const fetchProducts = () => {
//     axios.get("http://127.0.0.1:8000/api/products/")
//       .then(res => setProducts(res.data))
//       .catch(err => console.log(err));
//   };

//   // 🔥 AUTO LOAD + LIVE UPDATE
//   useEffect(() => {
//     fetchProducts();

//     const interval = setInterval(fetchProducts, 5000); // 🔥 live update

//     return () => clearInterval(interval);
//   }, []);

//   // 🔥 Search + Filter
//   const filtered = products
//     .filter(p => filter === "all" || p.category === filter)
//     .filter(p =>
//       p.name?.toLowerCase().includes(search.toLowerCase())
//     );

//   // 🧠 Smart Suggestions
//   const getSuggestions = (products, cart) => {
//     if (cart.length === 0) return products.slice(0, 3);

//     const categories = cart.map(item => item.category);
//     return products.filter(p => categories.includes(p.category));
//   };

//   const suggestions = getSuggestions(products, cart);

//   return (
//     <div>

//       {/* 🔍 Search */}
//       <motion.input
//         type="text"
//         placeholder="Search food...🔍"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="search"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//       />

//       {/* 🎯 Filters */}
//       <div className="filters">
//         <button onClick={() => setFilter("all")}>All</button>
//         <button onClick={() => setFilter("veg")}>Veg</button>
//         <button onClick={() => setFilter("non-veg")}>Non-Veg</button>
//         <button onClick={() => setFilter("drinks")}>Cool Drinks</button>
//         <button onClick={() => setFilter("side-dish")}>Side Dish</button>

//         <button>
//           <Link to="/food" id="Link-text">Cake</Link>
//         </button>

//         <button>
//           <Link to="/food2" id="Link-text">Chinese</Link>
//         </button>

//         <button onClick={() => setFilter("comming-soon")}>
//           Coming soon....
//         </button>
//       </div>

//       <h2 className="title">Tasty & Sweety Foods 🔥</h2>

//       {/* 🍔 PRODUCTS */}
//       <div className="grid">
//         <AnimatePresence>
//           {filtered.length > 0 ? (
//             filtered.map(item => (
//               <motion.div
//                 key={item.id}
//                 layout
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.5 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <ProductCard product={item} />
//               </motion.div>
//             ))
//           ) : (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               No items found 😢
//             </motion.p>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* 🧠 Suggestions */}
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

function Menu() {
  const { cart } = useCart();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true); // 🔥 loader

  // 🔥 FETCH PRODUCTS (ONLY ONCE)
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

  // 🔥 OPTIMIZED FILTER (useMemo → fast)
  const filtered = useMemo(() => {
    return products
      .filter(p => filter === "all" || p.category === filter)
      .filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
  }, [products, search, filter]);

  // 🧠 SMART SUGGESTIONS (optimized)
  const suggestions = useMemo(() => {
    if (cart.length === 0) return products.slice(0, 3);

    const categories = cart.map(item => item.category);
    return products.filter(p => categories.includes(p.category));
  }, [products, cart]);

  return (
    <div>

      {/* 🔍 Search */}
      <motion.input
        type="text"
        placeholder="Search food...🔍"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      />

      {/* 🎯 Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("veg")}>Veg</button>
        <button onClick={() => setFilter("non-veg")}>Non-Veg</button>
        <button onClick={() => setFilter("drinks")}>Cool Drinks</button>
        <button onClick={() => setFilter("side-dish")}>Side Dish</button>

        <button>
          <Link to="/food" id="Link-text">Cake</Link>
        </button>

        <button>
          <Link to="/food2" id="Link-text">Chinese</Link>
        </button>

        <button onClick={() => setFilter("comming-soon")}>
          Coming soon....
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
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