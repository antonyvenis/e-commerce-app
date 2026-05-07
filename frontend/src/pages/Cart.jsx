// import { useCart } from "./CartContext";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// function Cart() {
//   const { cart, addToCart, decreaseQty, removeFromCart } = useCart();
//   const navigate = useNavigate();

//   const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

//   return (
//     <div className="cart-container">

//       <AnimatePresence mode="wait">

//         {/* 🟡 EMPTY CART */}
//         {cart.length === 0 ? (

//           <motion.div
//             key="empty"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.4 }}
//             style={{ textAlign: "center", marginTop: "50px" }}
//           >
//             <h2>🛒 Your Cart is Empty 😢</h2>

//             <button onClick={() => navigate("/menu")}>
//               Go Shopping 🛍️
//             </button>
//           </motion.div>

//         ) : (

//           /* 🟢 CART ITEMS */
//           <motion.div
//             key="cart"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, x: 100 }}
//             transition={{ duration: 0.4 }}
//           >

//             <h2 className="cart-title">🛒 Cart</h2>

//             {/* 📦 ITEMS */}
//             {cart.map(item => (
//               <div key={item.id} className="cart-item">

//                 <div className="cart-info">
//                   <span className="cart-name">{item.name}</span>
//                   <span className="cart-price">₹{item.price}</span>
//                 </div>

//                 <img src={item.image} width="50" alt={item.name} />

//                 {/* ➕➖ Qty */}
//                 <div className="qty">
//                   <button onClick={() => decreaseQty(item.id)}>-</button>
//                   <span>{item.qty}</span>
//                   <button onClick={() => addToCart(item)}>+</button>
//                 </div>

//                 {/* ❌ Remove */}
//                 <button onClick={() => removeFromCart(item.id)}>
//                   Remove
//                 </button>

//               </div>
//             ))}

//             {/* 💰 TOTAL */}
//             <div className="total-box">
//               <div className="total-text">
//                 <span>Total</span>
//                 <span>₹{total}</span>
//               </div>

//               {/* 💳 CHECKOUT */}
//               <button
//                 className="checkout-btn"
//                 onClick={() => navigate("/payment")}
//               >
//                 Proceed to Pay 💳
//               </button>
//             </div>

//           </motion.div>
//         )}

//       </AnimatePresence>

//     </div>
//   );
// }

// export default Cart;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";

// const API = "https://e-commerce-app-8jg4.onrender.com";

// function Cart() {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true); // 🔥 NEW

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================================
//      🟢 FETCH CART (FAST)
//   ================================ */
//   const fetchCart = async () => {
//     if (!user) return;

//     try {
//       const res = await axios.get(`${API}/api/cart/`, {
//         params: { username: user.username }
//       });

//       setCart(res.data);

//       localStorage.setItem("cartCount", res.data.length);

//       // 🔥 MUST ADD THIS
//      window.dispatchEvent(new Event("cartUpdated"));

//     } catch (err) {
//       console.log("FETCH CART ERROR 👉", err.response?.data);
//       toast.error("Cart load error ❌");
//     } finally {
//       setLoading(false); // 🔥 stop loading
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   /* ================================
//      ➕ INCREASE (INSTANT UI 🔥)
//   ================================ */
//   const increaseQty = async (item) => {

//     // 🔥 instant UI update
//     setCart(prev =>
//       prev.map(p =>
//         p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
//       )
//     );

//     try {
//       await axios.post(`${API}/api/update-quantity/`, {
//         username: user.username,
//         id: item.id,
//         quantity: item.quantity + 1
//       });

//     } catch (err) {
//       console.log("INCREASE ERROR 👉", err.response?.data);
//     }
//   };

//   /* ================================
//      ➖ DECREASE (INSTANT UI 🔥)
//   ================================ */
//   const decreaseQty = async (item) => {
//     if (item.quantity <= 1) return;

//     setCart(prev =>
//       prev.map(p =>
//         p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p
//       )
//     );

//     try {
//       await axios.post(`${API}/api/update-quantity/`, {
//         username: user.username,
//         id: item.id,
//         quantity: item.quantity - 1
//       });

//     } catch (err) {
//       console.log("DECREASE ERROR 👉", err.response?.data);
//     }
//   };

//   /* ================================
//      ❌ REMOVE
//   ================================ */
//   const removeItem = async (item) => {
//     try {
//       await axios.post(`${API}/api/remove-cart/`, {
//         username: user.username,
//         id: item.id
//       });

//       setCart(prev => prev.filter(p => p.id !== item.id));

//       const newCount = cart.length - 1;
//       localStorage.setItem("cartCount", newCount);

//       toast.success(`${item.item_name} removed from cart ❌`);

//     } catch (err) {
//       console.log("REMOVE ERROR 👉", err.response?.data);
//     }
//   };

//   /* ================================
//      💰 TOTAL
//   ================================ */
//   const total = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   /* ================================
//      💳 CHECKOUT
//   ================================ */
//   const handleCheckout = () => {
//     if (cart.length === 0) {
//       toast.error("Cart empty ❌");
//       return;
//     }

//     navigate("/payment", { state: { cart } });
//   };

//   /* ================================
//      🖼 IMAGE FIX
//   ================================ */
//   const getImage = (img) => {
//     if (!img) return "https://via.placeholder.com/80";

//     return img.startsWith("http")
//       ? img
//       : `${API}${img}`;
//   };

//   /* ================================
//      🎨 UI
//   ================================ */
//   return (
//     <div className="cart-container">

//       {/* 🔥 LOADING */}
//       {loading ? (
//         <h2 style={{ textAlign: "center" }}>Loading Cart... 🛒</h2>
//       ) : (

//         <AnimatePresence mode="wait">

//           {cart.length === 0 ? (
//             <motion.div
//               key="empty"
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -50 }}
//             >
//               <h2>🛒 Your Cart is Empty 😢</h2>

//               <button onClick={() => navigate("/menu")}>
//                 Go Shopping 🛍️
//               </button>
//             </motion.div>

//           ) : (

//             <motion.div
//               key="cart"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >

//               <h2 className="cart-title">
//                 🛒 Cart ({cart.length})
//               </h2>

//               {cart.map(item => (
//                 <div key={item.id} className="cart-item">

//                   {/* 🖼 SAME SIZE IMAGE */}
//                   {/* <img
//                     src={
//                   item.image
//                     ? `https://e-commerce-app-8jg4.onrender.com${item.image}`
//                     : "https://dummyimage.com/150"
//                     }
//                     alt={item.item_name}
//                     className="cart-img"
//                   /> */}
//                     <img
//              src={
//               item.image
//               ? item.image.startsWith("http")
//               ? item.image.replace('/upload/', '/upload/w_300,q_auto,f_auto/')
//               : `https://e-commerce-app-8jg4.onrender.com${item.image}`
//               : "https://dummyimage.com/150"
//            }
//            alt={item.name}
//            loading="lazy"
//            className="cart-img"
//             />

//                   <div className="cart-info">
//                     <h3>{item.item_name}</h3>
//                     <p>₹{item.price}</p>
//                   </div>

//                   {/* 🔢 QTY */}
//                   <div className="qty">
//                     <button onClick={() => decreaseQty(item)}>-</button>
//                     <span>{item.quantity}</span>
//                     <button onClick={() => increaseQty(item)}>+</button>
//                   </div>

//                   {/* ❌ REMOVE */}
//                   <button onClick={() => removeItem(item)}>
//                     Remove ❌
//                   </button>

//                 </div>
//               ))}

//               {/* 💰 TOTAL */}
//               <div className="total-box">
//                 <h3>Total: ₹{total}</h3>

//                 <button
//                   className="checkout-btn"
//                   onClick={handleCheckout}
//                 >
//                   Proceed to Pay 💳
//                 </button>
//               </div>

//             </motion.div>
//           )}

//         </AnimatePresence>
//       )}

//     </div>
//   );
// }

// export default Cart;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";

// const API = "https://e-commerce-app-8jg4.onrender.com";

// function Cart() {

//   const navigate = useNavigate();

//   // ✅ FIXED
//   const [cart, setCart] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(
//     localStorage.getItem("user")
//   );

//   /* ================================
//      🟢 FETCH CART
//   ================================ */
//   const fetchCart = async () => {

//     if (!user) return;

//     try {

//       const res = await axios.get(
//         `${API}/api/cart/`,
//         {
//           params: {
//             username: user.username
//           }
//         }
//       );

//       // ✅ FIXED
//       setCart(
//         Array.isArray(res.data)
//           ? res.data
//           : []
//       );

//       localStorage.setItem(
//         "cartCount",
//         Array.isArray(res.data)
//           ? res.data.length
//           : 0
//       );

//       window.dispatchEvent(
//         new Event("cartUpdated")
//       );

//     } catch (err) {

//       console.log(
//         "FETCH CART ERROR 👉",
//         err.response?.data
//       );

//       toast.error("Cart load error ❌");

//       // ✅ FIXED
//       setCart([]);

//     } finally {

//       setLoading(false);

//     }
//   };

//   useEffect(() => {

//     fetchCart();

//   }, []);

//   /* ================================
//      ➕ INCREASE
//   ================================ */
//   const increaseQty = async (item) => {

//     setCart(prev =>
//       prev.map(p =>
//         p.id === item.id
//           ? {
//               ...p,
//               quantity: p.quantity + 1
//             }
//           : p
//       )
//     );

//     try {

//       await axios.post(
//         `${API}/api/update-quantity/`,
//         {
//           username: user.username,
//           id: item.id,
//           quantity: item.quantity + 1
//         }
//       );

//     } catch (err) {

//       console.log(
//         "INCREASE ERROR 👉",
//         err.response?.data
//       );

//     }
//   };

//   /* ================================
//      ➖ DECREASE
//   ================================ */
//   const decreaseQty = async (item) => {

//     if (item.quantity <= 1) return;

//     setCart(prev =>
//       prev.map(p =>
//         p.id === item.id
//           ? {
//               ...p,
//               quantity: p.quantity - 1
//             }
//           : p
//       )
//     );

//     try {

//       await axios.post(
//         `${API}/api/update-quantity/`,
//         {
//           username: user.username,
//           id: item.id,
//           quantity: item.quantity - 1
//         }
//       );

//     } catch (err) {

//       console.log(
//         "DECREASE ERROR 👉",
//         err.response?.data
//       );

//     }
//   };

//   /* ================================
//      ❌ REMOVE
//   ================================ */
//   const removeItem = async (item) => {

//     try {

//       await axios.post(
//         `${API}/api/remove-cart/`,
//         {
//           username: user.username,
//           id: item.id
//         }
//       );

//       setCart(prev =>
//         prev.filter(
//           p => p.id !== item.id
//         )
//       );

//       const newCount =
//         cart.length - 1;

//       localStorage.setItem(
//         "cartCount",
//         newCount
//       );

//       toast.success(
//         `${item.item_name} removed from cart ❌`
//       );

//     } catch (err) {

//       console.log(
//         "REMOVE ERROR 👉",
//         err.response?.data
//       );

//     }
//   };

//   /* ================================
//      💰 TOTAL
//   ================================ */

//   // ✅ FIXED
//   const total = Array.isArray(cart)

//     ? cart.reduce((acc, item) => {

//         const price =
//           Number(item.price) || 0;

//         const qty =
//           Number(item.quantity) || 1;

//         return acc + price * qty;

//       }, 0)

//     : 0;

//   /* ================================
//      💳 CHECKOUT
//   ================================ */
//   const handleCheckout = () => {

//     if (cart.length === 0) {

//       toast.error("Cart empty ❌");

//       return;
//     }

//     navigate("/payment", {
//       state: { cart }
//     });
//   };

//   /* ================================
//      🎨 UI
//   ================================ */
//   return (

//     <div className="cart-container">

//       {/* 🔥 LOADING */}
//       {loading ? (

//         <h2
//           style={{
//             textAlign: "center"
//           }}
//         >
//           Loading Cart... 🛒
//         </h2>

//       ) : (

//         <AnimatePresence mode="wait">

//           {cart.length === 0 ? (

//             <motion.div
//               key="empty"
//               initial={{
//                 opacity: 0,
//                 y: 50
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0
//               }}
//               exit={{
//                 opacity: 0,
//                 y: -50
//               }}
//             >

//               <h2>
//                 🛒 Your Cart is Empty 😢
//               </h2>

//               <button
//                 onClick={() =>
//                   navigate("/menu")
//                 }
//               >
//                 Go Shopping 🛍️
//               </button>

//             </motion.div>

//           ) : (

//             <motion.div
//               key="cart"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >

//               <h2 className="cart-title">
//                 🛒 Cart ({cart.length})
//               </h2>

//               {cart.map(item => {

//                 // ✅ FIXED
//                 const isOffer =
//                   Number(item.offer) > 0;

//                 return (

//                   <div
//                     key={item.id}
//                     className="cart-item"
//                   >

//                     {/* 🖼 IMAGE */}
//                     <img
//                       src={
//                         item.image
//                           ? item.image.startsWith(
//                               "http"
//                             )
//                             ? item.image.replace(
//                                 "/upload/",
//                                 "/upload/w_300,q_auto,f_auto/"
//                               )
//                             : `${API}${item.image}`
//                           : "https://dummyimage.com/150"
//                       }
//                       alt={item.item_name}
//                       loading="lazy"
//                       className="cart-img"
//                     />

//                     <div className="cart-info">

//                       <h3>
//                         {item.item_name}
//                       </h3>

//                       {/* ✅ OFFER */}
//                       {isOffer ? (

//                         <>
//                           <p
//                             style={{
//                               color: "green",
//                               fontWeight:
//                                 "bold",
//                               fontSize: "20px"
//                             }}
//                           >
//                             ₹{item.price}
//                           </p>

//                           <p
//                             style={{
//                               color: "red",
//                               fontSize: "13px",
//                               fontWeight:
//                                 "bold"
//                             }}
//                           >
//                             🔥 {item.offer}% OFF
//                           </p>
//                         </>

//                       ) : (

//                         <p>
//                           ₹{item.price}
//                         </p>

//                       )}

//                     </div>

//                     {/* 🔢 QTY */}
//                     <div className="qty">

//                       <button
//                         onClick={() =>
//                           decreaseQty(item)
//                         }
//                       >
//                         -
//                       </button>

//                       <span>
//                         {item.quantity}
//                       </span>

//                       <button
//                         onClick={() =>
//                           increaseQty(item)
//                         }
//                       >
//                         +
//                       </button>

//                     </div>

//                     {/* ❌ REMOVE */}
//                     <button
//                       onClick={() =>
//                         removeItem(item)
//                       }
//                     >
//                       Remove ❌
//                     </button>

//                   </div>
//                 );
//               })}

//               {/* 💰 TOTAL */}
//               <div className="total-box">

//                 <h3>
//                   Total: ₹
//                   {total.toFixed(2)}
//                 </h3>

//                 <button
//                   className="checkout-btn"
//                   onClick={handleCheckout}
//                 >
//                   Proceed to Pay 💳
//                 </button>

//               </div>

//             </motion.div>
//           )}

//         </AnimatePresence>
//       )}

//     </div>
//   );
// }

// export default Cart;

import { useCart } from "./CartContext";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= IMAGE ================= */
  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://e-commerce-app-8jg4.onrender.com${product.image}`
    : "https://via.placeholder.com/200";

  /* ================= OFFER LOGIC ================= */
  const offerPercent = Number(product.offer ?? product.discount ?? 0);

  const isOffer = offerPercent && Number(offerPercent) > 0;

  const offerPrice = isOffer
    ? (
        Number(product.price) -
        (Number(product.price) * Number(offerPercent)) / 100
      ).toFixed(2)
    : Number(product.price).toFixed(2);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!user) return;

    axios
      .get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
        params: { username: user.username }
      })
      .then(res => {
        const likedIds = res.data.map(item => item.id);
        setLiked(likedIds.includes(product.id));
      });

    const savedRatings =
      JSON.parse(localStorage.getItem("ratings")) || {};

    setRating(savedRatings[product.id] || 0);
  }, [product.id]);

  /* ================= LIKE ================= */
  const toggleLike = () => {
    if (!user) return toast.error("Login first ❌");

    const newLiked = !liked;
    setLiked(newLiked);

    toast.success(
      newLiked
        ? `${product.name} Added to Wishlist ❤️`
        : `${product.name} Removed from Wishlist ❌`
    );

    axios.post(
      `https://e-commerce-app-8jg4.onrender.com/api/${
        newLiked ? "add-like" : "remove-like"
      }/`,
      {
        username: user.username,
        item_name: product.name,
        image: imageUrl,
        price: product.price,
        id: product.id
      }
    );
  };

  /* ================= CART (FIXED) ================= */
  const handleAdd = async () => {
    if (product.is_active === false) {
      return toast.error("This product is disabled ❌");
    }

    if (!user) return toast.error("Login first ❌");

    try {
      // ❌ REMOVE LOCAL CONTEXT CART (IMPORTANT FIX)
      // addToCart(product);

      // ✅ BACKEND CART ONLY
      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
        {
          username: user.username,
          product_id: product.id
        }
      );

      toast.success(`${product.name} Added to cart 🛒`);

      // 🔥 refresh cart in Cart page
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to add ❌");
    }
  };

  /* ================= ⭐ RATING ================= */
  const handleRating = (value) => {
    const savedRatings =
      JSON.parse(localStorage.getItem("ratings")) || {};

    savedRatings[product.id] = value;

    localStorage.setItem("ratings", JSON.stringify(savedRatings));

    setRating(value);

    toast.success(`${product.name} rated ${value} ⭐`);
  };

  /* ================= UI ================= */
  return (
    <motion.div className="card" whileHover={{ scale: 1.03 }}>

      {isOffer && (
        <div className="offer-badge">
          🔥 {offerPercent}% OFF
        </div>
      )}

      {product.is_active === false && (
        <div className="disabled-overlay">NOT AVAILABLE</div>
      )}

      <div className="like-btn" onClick={toggleLike}>
        <span style={{ color: liked ? "red" : "#999", fontSize: "22px" }}>
          {liked ? "❤️" : "🤍"}
        </span>
      </div>

      <img src={imageUrl} alt={product.name} className="product-img" />

      <h3>{product.name}</h3>

      <p>🍽️ {product.category || "Food"}</p>

      <p>⭐ {product.rating || "4.5"}</p>

      <div className="price-section">
        {isOffer ? (
          <>
            <p>₹{product.price}</p>
            <p>₹{offerPrice}</p>
          </>
        ) : (
          <p>₹{product.price}</p>
        )}
      </div>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            style={{
              color: rating >= star ? "gold" : "gray",
              cursor: "pointer"
            }}
          >
            ★
          </span>
        ))}
      </div>

      <button className="cart-btn" onClick={handleAdd}>
        Add to Cart 🛒
      </button>

    </motion.div>
  );
}

export default memo(ProductCard);