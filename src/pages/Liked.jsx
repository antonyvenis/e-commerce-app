// import { useState, useEffect, useMemo } from "react";
// import { useCart } from "./CartContext";
// import { motion, AnimatePresence } from "framer-motion";
// import Products from "./products";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";

// function Liked() {
//   const { addToCart } = useCart();

//   const [likedProducts, setLikedProducts] = useState([]);

//   /* =========================================================
//      📦 MEMOIZED PRODUCTS (🔥 FIX)
//   ========================================================= */
//   const products = useMemo(() => Products(), []);

//   /* =========================================================
//      📦 LOAD LIKED PRODUCTS
//   ========================================================= */
//   useEffect(() => {
//     const likes = JSON.parse(localStorage.getItem("likes")) || [];

//     const filtered = products.filter(p =>
//       likes.includes(p.id)
//     );

//     setLikedProducts(filtered);
//   }, [products]);

//   /* =========================================================
//      ❌ REMOVE ITEM
//   ========================================================= */
//   const removeItem = (id) => {
//     const updated = likedProducts.filter(item => item.id !== id);
//     setLikedProducts(updated);

//     const ids = updated.map(item => item.id);
//     localStorage.setItem("likes", JSON.stringify(ids));

//     toast("Removed from wishlist ❌", {
//       icon: "🗑️",
//     });
//   };

//   /* =========================================================
//      🛒 ADD TO CART
//   ========================================================= */
//   const handleAdd = (item) => {
//     addToCart(item);

//     toast.success(`${item.name} added to cart 🛒🔥`, {
//       duration: 1500,
//       style: {
//         background: "#222",
//         color: "#fff",
//         borderRadius: "12px",
//       },
//     });
//   };

//   return (
//     <div className="liked-container">
//       <h2 className="liked-title">❤️ Wishlist</h2>

//       {/* 😢 EMPTY STATE */}
//       {likedProducts.length === 0 ? (
//         <div className="empty-state">
//           <h3>No liked items 😢</h3>
//           <p>Add some products to wishlist!</p>

//           <Link to="/menu">
//             <button className="go-btn">Go ➡️</button>
//           </Link>
//         </div>
//       ) : (

//         <div className="liked-grid">
//           <AnimatePresence>

//             {likedProducts.map((item, index) => (
//               <motion.div
//                 key={item.id}
//                 className="liked-card"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, x: 100 }}
//                 transition={{ duration: 0.4 }}
//               >

//                 {/* 🖼️ IMAGE FIX */}
//                 <img
//                   src={item.image || "https://dummyimage.com/150"}
//                   alt={item.name}
//                 />

//                 <h4 className="liked-name">
//                   {index + 1}. {item.name}
//                 </h4>

//                 <p className="liked-price">₹{item.price}</p>

//                 <div className="btn-group">

//                   {/* 🛒 ADD */}
//                   <button
//                     className="cart-btn"
//                     onClick={() => handleAdd(item)}
//                   >
//                     Add to Cart 🛒
//                   </button>

//                   {/* ❌ REMOVE */}
//                   <button
//                     className="remove-btn"
//                     onClick={() => removeItem(item.id)}
//                   >
//                     Remove ❤️
//                   </button>

//                 </div>

//               </motion.div>
//             ))}

//           </AnimatePresence>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Liked;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Liked() {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================================
     ❤️ FETCH LIKES
  ================================ */
  const fetchLikes = async () => {
    if (!user) return;

    try {
      const res = await axios.get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
        params: { username: user.username }
      });

      setLikedProducts(res.data);

    } catch (err) {
      console.log("LIKE FETCH ERROR 👉", err.response?.data);
      toast.error("Failed to load wishlist ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     🔥 FIRST LOAD
  ================================ */
  useEffect(() => {
    fetchLikes();
  }, []);

  /* ================================
     🔥 REAL-TIME UPDATE LISTENER
  ================================ */
  useEffect(() => {
    const handleUpdate = () => {
      fetchLikes(); // 🔥 auto refresh
    };

    window.addEventListener("wishlistUpdated", handleUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleUpdate);
    };
  }, []);

  /* ================================
     ❌ REMOVE LIKE
  ================================ */
  const removeItem = async (item) => {
    // 🔥 instant UI
    setLikedProducts(prev => prev.filter(p => p.id !== item.id));

    try {
      await axios.post("https://e-commerce-app-8jg4.onrender.com/api/remove-like/", {
        username: user.username,
        id: item.id
      });

      toast.success(`${item.item_name} removed from wishlist ❌`);

      // 🔥 trigger global update
      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch (err) {
      console.log(err);
      toast.error("Remove failed ❌");
    }
  };

  /* ================================
     🛒 ADD TO CART
  ================================ */
  const handleAdd = async (item) => {
    try {
      await axios.post("https://e-commerce-app-8jg4.onrender.com/api/add-cart/", {
        username: user.username,
        item_name: item.item_name,
        price: item.price || 100,
        quantity: 1,
        image: item.image,
        id: item.id
      });

      toast.success(`${item.item_name} added to cart 🛒`);

    } catch (err) {
      console.log(err);
      toast.error("Cart error ❌");
    }
  };

  /* ================================
     LOADING
  ================================ */
  if (loading) {
    return (
      <div className="liked-container">
        <h2>Loading wishlist... ⏳</h2>
      </div>
    );
  }

  return (
    <div className="liked-container">

      <h2 className="liked-title">
        ❤️ Wishlist ({likedProducts.length})
      </h2>

      {likedProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No liked items 😢</h3>

          <Link to="/menu">
            <button>Go Shopping ➡️</button>
          </Link>
        </div>
      ) : (

        <div className="liked-grid">
          <AnimatePresence>

            {likedProducts.map((item, index) => (
              <motion.div
                key={item.id}
                className="liked-card"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >

                <img
                  src={"https://e-commerce-app-8jg4.onrender.com" + item.image}
                  alt={item.item_name}
                />

                <h4>
                  {index + 1}. {item.item_name}
                </h4>

                <p>₹ {item.price || 100}</p>

                <div className="btn-group">

                  <button onClick={() => handleAdd(item)}>
                    Add to Cart 🛒
                  </button>

                  <button onClick={() => removeItem(item)}>
                    Remove ❌
                  </button>

                </div>

              </motion.div>
            ))}

          </AnimatePresence>
        </div>
      )}

    </div>
  );
}

export default Liked;