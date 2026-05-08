// import { useCart } from "./CartContext";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   /* =========================================================
//      🛒 ADD TO CART + TOAST
//   ========================================================= */
//   const handleAdd = () => {
//     addToCart(product);

//     toast.success(`${product.name} added to cart 🛒🔥`, {
//       duration: 1500,
//       style: {
//         background: "#222",
//         color: "#fff",
//         borderRadius: "12px",
//         padding: "10px 15px",
//       },
//     });
//   };

//   /* =========================================================
//      🔥 LOAD LIKES + RATING
//   ========================================================= */
//   useEffect(() => {
//     const likes = JSON.parse(localStorage.getItem("likes")) || [];
//     setLiked(likes.includes(product.id));

//     const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
//     setRating(savedRatings[product.id] || 0);
//   }, [product.id]);

//   /* =========================================================
//      ❤️ TOGGLE LIKE + TOAST
//   ========================================================= */
//   const toggleLike = () => {
//     let likes = JSON.parse(localStorage.getItem("likes")) || [];

//     let updatedLikes;

//     if (likes.includes(product.id)) {
//       updatedLikes = likes.filter(id => id !== product.id);

//       toast("Removed from wishlist ❌", {
//         icon: "🗑️",
//       });

//     } else {
//       updatedLikes = [...likes, product.id];

//       toast.success(`${product.name} added to wishlist ❤️`, {
//         duration: 1500,
//         style: {
//           background: "#222",
//           color: "#fff",
//           borderRadius: "12px",
//         },
//       });
//     }

//     localStorage.setItem("likes", JSON.stringify(updatedLikes));
//     setLiked(updatedLikes.includes(product.id));
//   };

//   /* =========================================================
//      ⭐ RATING SYSTEM
//   ========================================================= */
//   const handleRating = (value) => {
//     const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
//     savedRatings[product.id] = value;

//     localStorage.setItem("ratings", JSON.stringify(savedRatings));
//     setRating(value);

//     toast.success(`${product.name} Rated ${value} ⭐`, {
//       duration: 1000,
//     });
//   };

//   /* =========================================================
//      🎨 UI
//   ========================================================= */
//   return (
//     <motion.div
//       className="card"
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//     >

//       {/* ❤️ LIKE BUTTON */}
//       <div className="like-btn" onClick={toggleLike}>
//         <motion.span
//           animate={{
//             scale: liked ? 1.3 : 1,
//             color: liked ? "#ff4d4d" : "#999"
//           }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           {liked ? "❤️" : "🤍"}
//         </motion.span>
//       </div>

//       {/* 🖼️ IMAGE */}
//       <img
//         src={product.image || "https://via.placeholder.com/200"}
//         alt={product.name}
//       />

//       {/* 📦 DETAILS */}
//       <h3>{product.name}</h3>
//       <p>🍽️ {product.category || product.strCategory || "Food"}</p><br></br>
//       <p>⭐ {product.rating || "4.5"}</p><br></br>
//       <p>₹{product.price}</p>

//       {/* ⭐ RATING UI */}
//       <div className="rating">
//         {[1, 2, 3, 4, 5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               cursor: "pointer",
//               color: rating >= star ? "gold" : "gray",
//               fontSize: "18px"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       {/* 🛒 ADD BUTTON */}
//       <button onClick={handleAdd}>
//         Add to Cart 🛒
//       </button>

//     </motion.div>
//   );
// }

// export default ProductCard;

// import { useCart } from "./CartContext";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { memo } from "react";   // 🔥 ADD

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* =========================================================
//      🔥 IMAGE FIX
//   ========================================================= */
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `https://e-commerce-app-8jg4.onrender.com${product.image}`
//     : "https://via.placeholder.com/200";

//   /* =========================================================
//      🔥 LOAD LIKES (FAST)
//   ========================================================= */
//   useEffect(() => {
//     if (!user) return;

//     axios.get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
//       params: { username: user.username }
//     })
//     .then(res => {
//       const likedIds = res.data.map(item => item.id);
//       setLiked(likedIds.includes(product.id));
//     })
//     .catch(err => console.log(err));

//     // ⭐ rating load
//     const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
//     setRating(savedRatings[product.id] || 0);

//   }, [product.id]);

//   /* =========================================================
//      ❤️ LIKE (⚡ INSTANT UI)
//   ========================================================= */
//   const toggleLike = () => {
//     if (!user) {
//       toast.error("Login first ❌");
//       return;
//     }

//     const newLiked = !liked;

//     // 🔥 instant UI
//     setLiked(newLiked);

//     // 🔥 instant toast
//     toast.dismiss();
//     newLiked ? toast.success(`${product.name} added to wishlist ❤️`) : toast.error(`${product.name} removed from wishlist❌`);

//     // 🔥 backend (no wait)
//     axios.post(
//       `https://e-commerce-app-8jg4.onrender.com/api/${newLiked ? "add-like" : "remove-like"}/`,
//       {
//         username: user.username,
//         item_name: product.name,
//         image: imageUrl,
//         price: product.price,
//         id: product.id
//       }
//     )
//     .then(() => {
//       window.dispatchEvent(new Event("wishlistUpdated"));
//     })
//     .catch(() => {
//       setLiked(!newLiked); // rollback
//       toast.error("Server error ❌");
//     });
//   };

//   /* =========================================================
//      🛒 ADD TO CART (⚡ FAST)
//   ========================================================= */
//   const handleAdd = () => {
//     if (!user) {
//       toast.error("Login first ❌");
//       return;
//     }

//     // 🔥 instant UI
//     addToCart(product);

//     // 🔥 instant toast
//     toast.dismiss();
//     toast.success(`${product.name} added to cart 🛒`);

//     // 🔥 backend (no wait)
//     axios.post("https://e-commerce-app-8jg4.onrender.com/api/add-cart/", {
//       username: user.username,
//       item_name: product.name,
//       price: product.price,
//       quantity: 1,
//       image: imageUrl,
//       id: product.id
//     })
//     .catch(() => {
//       toast.error("Cart sync failed ❌");
//     });
//   };

//   /* =========================================================
//      ⭐ RATING
//   ========================================================= */
//   const handleRating = (value) => {
//     const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
//     savedRatings[product.id] = value;

//     localStorage.setItem("ratings", JSON.stringify(savedRatings));
//     setRating(value);

//     toast.success(`${product.name} rated ${value} ⭐`);
//   };

//   /* =========================================================
//      UI
//   ========================================================= */
//   return (
//     <motion.div
//       className="card"
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//     >

//       {/* ❤️ LIKE */}
//       <div className="like-btn" onClick={toggleLike}>
//         <span
//           style={{
//             color: liked ? "red" : "#999",
//             fontSize: "22px",
//             transition: "0.15s"
//           }}
//         >
//           {liked ? "❤️" : "🤍"}
//         </span>
//       </div>

//       {/* 🖼 IMAGE */}
//       <img
//         src={imageUrl}
//         alt={product.name}
//         className="product-img"
//         loading="lazy"   // 🔥 PERFORMANCE BOOST
//       />

//       {/* DETAILS */}
//       <h3>{product.name}</h3>
//       <p>🍽️ {product.category || "Food"}</p><br></br>
//       <p>⭐ {product.rating || "4.5"}</p><br></br>
//       <p>₹{product.price}</p>

//       {/* ⭐ RATING */}
//       <div>
//         {[1,2,3,4,5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               color: rating >= star ? "gold" : "gray",
//               cursor: "pointer"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       {/* 🛒 CART */}
//       <button onClick={handleAdd}>
//         Add to Cart 🛒
//       </button>

//     </motion.div>
//   );
// }

// export default memo(ProductCard);  // 🔥 IMPORTANT

// import { useCart } from "./CartContext";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { memo } from "react";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================= IMAGE ================= */
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `https://e-commerce-app-8jg4.onrender.com${product.image}`
//     : "https://via.placeholder.com/200";

//   /* ================= OFFER LOGIC ================= */
//   const offerPercent = product.offer || product.discount || 0;
//   const isOffer = offerPercent > 0;

//   const offerPrice = isOffer
//     ? (product.price - (product.price * offerPercent) / 100).toFixed(2)
//     : product.price;

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     if (!user) return;

//     axios
//       .get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
//         params: { username: user.username }
//       })
//       .then(res => {
//         const likedIds = res.data.map(item => item.id);
//         setLiked(likedIds.includes(product.id));
//       });

//     const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
//     setRating(savedRatings[product.id] || 0);

//   }, [product.id]);

//   /* ================= LIKE ================= */
//   const toggleLike = () => {
//     if (!user) return toast.error("Login first ❌");

//     const newLiked = !liked;
//     setLiked(newLiked);

//     toast.success(
//       newLiked
//         ? `${product.name} Added to Wishlist ❤️`
//         : `${product.name} Removed from Wishlist ❌`
//     );

//     axios.post(
//       `https://e-commerce-app-8jg4.onrender.com/api/${newLiked ? "add-like" : "remove-like"}/`,
//       {
//         username: user.username,
//         item_name: product.name,
//         image: imageUrl,
//         price: product.price,
//         id: product.id
//       }
//     );
//   };

//   /* ================= CART ================= */
//   const handleAdd = () => {
//     if (product.is_active === false) {
//       return toast.error("This product is disabled ❌");
//     }

//     if (!user) return toast.error("Login first ❌");

//     addToCart(product);
//     toast.success(`${product.name} Added to cart 🛒`);

//     axios.post("https://e-commerce-app-8jg4.onrender.com/api/add-cart/", {
//       username: user.username,
//       item_name: product.name,
//       price: product.price,
//       quantity: 1,
//       image: imageUrl,
//       id: product.id
//     });
//   };

//   /* ================= ⭐ RATING ================= */
//   const handleRating = (value) => {
//     const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
//     savedRatings[product.id] = value;

//     localStorage.setItem("ratings", JSON.stringify(savedRatings));
//     setRating(value);

//     // 🔥 UPDATED TOAST MESSAGE
//     toast.success(`${product.name} rated ${value} ⭐`);
//   };

//   /* ================= UI ================= */
//   return (
//     <motion.div className="card" whileHover={{ scale: 1.05 }}>

//       {/* 🔥 OFFER BADGE */}
//       {isOffer && (
//         <div
//           style={{
//             position: "absolute",
//             top: "10px",
//             left: "10px",
//             background: "red",
//             color: "white",
//             padding: "5px 8px",
//             fontSize: "12px",
//             borderRadius: "5px",
//             fontWeight: "bold"
//           }}
//         >
//           {offerPercent}% OFF
//         </div>
//       )}

//       {/* 🚫 DISABLED OVERLAY */}
//       {product.is_active === false && (
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             background: "rgba(0,0,0,0.6)",
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: "bold"
//           }}
//         >
//           NOT AVAILABLE
//         </div>
//       )}

//       {/* ❤️ LIKE */}
//       <div className="like-btn" onClick={toggleLike}>
//         <span style={{ color: liked ? "red" : "#999", fontSize: "22px" }}>
//           {liked ? "❤️" : "🤍"}
//         </span>
//       </div>

//       {/* 🖼 IMAGE (optimized) */}
//       <img
//         src={imageUrl.replace('/upload/', '/upload/w_300,q_auto,f_auto/')}
//         alt={product.name}
//         className="product-img"
//         loading="lazy"
//       />

//       {/* DETAILS */}
//       <h3>{product.name}</h3>
//       <p>🍽️ {product.category}</p><br />
//       <p>⭐ {product.rating}</p><br />

//       {/* 💸 PRICE */}
//       <div>
//         {isOffer ? (
//           <>
//             <p style={{ textDecoration: "line-through", color: "gray" }}>
//               ₹{product.price}
//             </p>
//             <p style={{ color: "green", fontWeight: "bold" }}>
//               ₹{offerPrice}
//             </p>
//           </>
//         ) : (
//           <p>₹{product.price}</p>
//         )}
//       </div>

//       {/* ⭐ RATING */}
//       <div>
//         {[1, 2, 3, 4, 5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               color: rating >= star ? "gold" : "gray",
//               cursor: "pointer",
//               fontSize: "18px"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       {/* 🛒 BUTTON */}
//       <button onClick={handleAdd}>
//         Add to Cart 🛒
//       </button>
//     </motion.div>
//   );
// }

// export default memo(ProductCard);

// import { useCart } from "./CartContext";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { memo } from "react";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================= IMAGE ================= */
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `https://e-commerce-app-8jg4.onrender.com${product.image}`
//     : "https://via.placeholder.com/200";

//   /* ================= OFFER LOGIC ================= */
//   const offerPercent = Number(product.offer || product.discount || 0);

//   const isOffer = offerPercent > 0;

//   const offerPrice = isOffer
//     ? (
//         product.price -
//         (product.price * offerPercent) / 100
//       ).toFixed(2)
//     : product.price;

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     if (!user) return;

//     axios
//       .get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
//         params: { username: user.username }
//       })
//       .then(res => {
//         const likedIds = res.data.map(item => item.id);
//         setLiked(likedIds.includes(product.id));
//       });

//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     setRating(savedRatings[product.id] || 0);

//   }, [product.id]);

//   /* ================= LIKE ================= */
//   const toggleLike = () => {
//     if (!user) return toast.error("Login first ❌");

//     const newLiked = !liked;
//     setLiked(newLiked);

//     toast.success(
//       newLiked
//         ? `${product.name} Added to Wishlist ❤️`
//         : `${product.name} Removed from Wishlist ❌`
//     );

//     axios.post(
//       `https://e-commerce-app-8jg4.onrender.com/api/${
//         newLiked ? "add-like" : "remove-like"
//       }/`,
//       {
//         username: user.username,
//         item_name: product.name,
//         image: imageUrl,
//         price: product.price,
//         id: product.id
//       }
//     );
//   };

//   /* ================= CART ================= */
//   const handleAdd = () => {
//     if (product.is_active === false) {
//       return toast.error("This product is disabled ❌");
//     }

//     if (!user) return toast.error("Login first ❌");

//     addToCart(product);

//     toast.success(`${product.name} Added to cart 🛒`);

//     axios.post(
//       "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
//       {
//         username: user.username,
//         item_name: product.name,
//         price: product.price,
//         quantity: 1,
//         image: imageUrl,
//         id: product.id
//       }
//     );
//   };

//   /* ================= ⭐ RATING ================= */
//   const handleRating = (value) => {
//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     savedRatings[product.id] = value;

//     localStorage.setItem(
//       "ratings",
//       JSON.stringify(savedRatings)
//     );

//     setRating(value);

//     toast.success(`${product.name} rated ${value} ⭐`);
//   };

//   /* ================= UI ================= */
//   return (
//     <motion.div
//       className="card"
//       whileHover={{ scale: 1.03 }}
//     >

//       {/* 🔥 OFFER BADGE */}
//       {isOffer && (
//         <div className="offer-badge">
//           🔥 {offerPercent}% OFF
//         </div>
//       )}

//       {/* 🚫 DISABLED OVERLAY */}
//       {product.is_active === false && (
//         <div className="disabled-overlay">
//           NOT AVAILABLE
//         </div>
//       )}

//       {/* ❤️ LIKE */}
//       <div className="like-btn" onClick={toggleLike}>
//         <span
//           style={{
//             color: liked ? "red" : "#999",
//             fontSize: "22px"
//           }}
//         >
//           {liked ? "❤️" : "🤍"}
//         </span>
//       </div>

//       {/* 🖼 IMAGE */}
//       <img
//         src={imageUrl.replace(
//           "/upload/",
//           "/upload/w_400,q_auto,f_auto/"
//         )}
//         alt={product.name}
//         className="product-img"
//         loading="lazy"
//       />

//       {/* DETAILS */}
//       <h3>{product.name}</h3>

//       <p className="category">
//         🍽️ {product.category}
//       </p>

//       <p className="rating-text">
//         ⭐ {product.rating}
//       </p>

//       {/* 💸 PRICE */}
//       <div className="price-section">
//         {isOffer ? (
//           <>
//             <p className="old-price">
//               ₹{product.price}
//             </p>

//             <p className="offer-price">
//               ₹{offerPrice}
//             </p>
//           </>
//         ) : (
//           <p className="normal-price">
//             ₹{product.price}
//           </p>
//         )}
//       </div>

//       {/* ⭐ RATING */}
//       <div className="star-rating">
//         {[1, 2, 3, 4, 5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               color:
//                 rating >= star ? "gold" : "gray",
//               cursor: "pointer",
//               fontSize: "20px"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       {/* 🛒 BUTTON */}
//       <button
//         className="cart-btn"
//         onClick={handleAdd}
//       >
//         Add to Cart 🛒
//       </button>
//     </motion.div>
//   );
// }

// export default memo(ProductCard);

// import { useCart } from "./CartContext";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { memo } from "react";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================= IMAGE ================= */
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `https://e-commerce-app-8jg4.onrender.com${product.image}`
//     : "https://via.placeholder.com/200";

//   /* ================= OFFER LOGIC ================= */

//   // ✅ FIXED
//   const offerPercent = Number(
//     product.offer ?? product.discount ?? 0
//   );

//   // ✅ FIXED
//   const isOffer =
//     offerPercent &&
//     Number(offerPercent) > 0;

//   // ✅ FIXED
//   const offerPrice = isOffer
//     ? (
//         Number(product.price) -
//         (Number(product.price) *
//           Number(offerPercent)) /
//           100
//       ).toFixed(2)
//     : Number(product.price).toFixed(2);

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     if (!user) return;

//     axios
//       .get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
//         params: { username: user.username }
//       })
//       .then(res => {
//         const likedIds = res.data.map(item => item.id);
//         setLiked(likedIds.includes(product.id));
//       });

//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     setRating(savedRatings[product.id] || 0);

//   }, [product.id]);

//   /* ================= LIKE ================= */
//   const toggleLike = () => {
//     if (!user) return toast.error("Login first ❌");

//     const newLiked = !liked;
//     setLiked(newLiked);

//     toast.success(
//       newLiked
//         ? `${product.name} Added to Wishlist ❤️`
//         : `${product.name} Removed from Wishlist ❌`
//     );

//     axios.post(
//       `https://e-commerce-app-8jg4.onrender.com/api/${
//         newLiked ? "add-like" : "remove-like"
//       }/`,
//       {
//         username: user.username,
//         item_name: product.name,
//         image: imageUrl,
//         price: product.price,
//         id: product.id
//       }
//     );
//   };

//   /* ================= CART ================= */
//   const handleAdd = () => {
//     if (product.is_active === false) {
//       return toast.error("This product is disabled ❌");
//     }

//     if (!user) return toast.error("Login first ❌");

//     addToCart(product);

//     toast.success(`${product.name} Added to cart 🛒`);

//     // axios.post(
//     //   "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
//     //   {
//     //     username: user.username,
//     //     item_name: product.name,
//     //     price: product.price,
//     //     quantity: 1,
//     //     image: imageUrl,
//     //     id: product.id
//     //   }
//     // );
// //     axios.post(
// //   "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
// //   {
// //     username: user.username,
// //     item_name: product.name,

// //     // 🔥 OFFER PRICE
// //     price: isOffer
// //       ? Number(offerPrice)
// //       : Number(product.price),

// //     quantity: 1,
// //     image: imageUrl,
// //     id: product.id
// //   }
// // );

// axios.post(
//   "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
//   {
//     username: user.username,

//     // 🔥 IMPORTANT
//     product_id: product.id,

//     item_name: product.name,

//     quantity: 1,

//     image: imageUrl
//   }
// );
//   };

//   /* ================= ⭐ RATING ================= */
//   const handleRating = (value) => {
//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     savedRatings[product.id] = value;

//     localStorage.setItem(
//       "ratings",
//       JSON.stringify(savedRatings)
//     );

//     setRating(value);

//     toast.success(`${product.name} rated ${value} ⭐`);
//   };

//   /* ================= UI ================= */
//   return (
//     <motion.div
//       className="card"
//       whileHover={{ scale: 1.03 }}
//     >

//       {/* 🔥 OFFER BADGE */}
//       {isOffer && (
//         <div className="offer-badge">
//           🔥 {offerPercent}% OFF
//         </div>
//       )}

//       {/* 🚫 DISABLED OVERLAY */}
//       {product.is_active === false && (
//         <div className="disabled-overlay">
//           NOT AVAILABLE
//         </div>
//       )}

//       {/* ❤️ LIKE */}
//       <div className="like-btn" onClick={toggleLike}>
//         <span
//           style={{
//             color: liked ? "red" : "#999",
//             fontSize: "22px"
//           }}
//         >
//           {liked ? "❤️" : "🤍"}
//         </span>
//       </div>

//       {/* 🖼 IMAGE */}
//       <img
//         src={imageUrl.replace(
//           "/upload/",
//           "/upload/w_400,q_auto,f_auto/"
//         )}
//         alt={product.name}
//         className="product-img"
//         loading="lazy"
//       />

//       {/* DETAILS */}
//       <h3>{product.name}</h3>

//       <p className="category">
//         🍽️ {product.category || "Food"}
//       </p>

//       <p className="rating-text">
//         ⭐ {product.rating || "4.5"}
//       </p>

//       {/* 💸 PRICE */}
//       <div className="price-section">
//         {isOffer ? (
//           <>
//             <p className="old-price">
//               ₹{product.price}
//             </p>

//             <p className="offer-price">
//               ₹{offerPrice}
//             </p>
//           </>
//         ) : (
//           <p className="normal-price">
//             ₹{product.price}
//           </p>
//         )}
//       </div>

//       {/* ⭐ RATING */}
//       <div className="star-rating">
//         {[1, 2, 3, 4, 5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               color:
//                 rating >= star ? "gold" : "gray",
//               cursor: "pointer",
//               fontSize: "20px"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       {/* 🛒 BUTTON */}
//       <button
//         className="cart-btn"
//         onClick={handleAdd}
//       >
//         Add to Cart 🛒
//       </button>
//     </motion.div>
//   );
// }

// export default memo(ProductCard);

// import { useCart } from "./CartContext";
// import { useState, useEffect, memo } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import axios from "axios";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================= IMAGE ================= */
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `https://e-commerce-app-8jg4.onrender.com${product.image}`
//     : "https://via.placeholder.com/200";

//   /* ================= OFFER LOGIC ================= */
//   const offerPercent = Number(product.offer ?? product.discount ?? 0);

//   const isOffer = offerPercent && Number(offerPercent) > 0;

//   const offerPrice = isOffer
//     ? (
//         Number(product.price) -
//         (Number(product.price) * Number(offerPercent)) / 100
//       ).toFixed(2)
//     : Number(product.price).toFixed(2);

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     if (!user) return;

//     axios
//       .get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
//         params: { username: user.username }
//       })
//       .then(res => {
//         const likedIds = res.data.map(item => item.id);
//         setLiked(likedIds.includes(product.id));
//       });

//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     setRating(savedRatings[product.id] || 0);
//   }, [product.id]);

//   /* ================= LIKE ================= */
//   const toggleLike = () => {
//     if (!user) return toast.error("Login first ❌");

//     const newLiked = !liked;
//     setLiked(newLiked);

//     toast.success(
//       newLiked
//         ? `${product.name} Added to Wishlist ❤️`
//         : `${product.name} Removed from Wishlist ❌`
//     );

//     axios.post(
//       `https://e-commerce-app-8jg4.onrender.com/api/${
//         newLiked ? "add-like" : "remove-like"
//       }/`,
//       {
//         username: user.username,
//         item_name: product.name,
//         image: imageUrl,
//         price: product.price,
//         id: product.id
//       }
//     );
//   };

//   /* ================= CART (FIXED) ================= */
//   const handleAdd = async () => {
//     if (product.is_active === false) {
//       return toast.error("This product is disabled ❌");
//     }

//     if (!user) return toast.error("Login first ❌");

//     try {
//       // ❌ REMOVE LOCAL CONTEXT CART (IMPORTANT FIX)
//       // addToCart(product);

//       // ✅ BACKEND CART ONLY
//       await axios.post(
//         "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
//         {
//           username: user.username,
//           product_id: product.id
//         }
//       );

//       toast.success(`${product.name} Added to cart 🛒`);

//       // 🔥 refresh cart in Cart page
//       window.dispatchEvent(new Event("cartUpdated"));

//     } catch (err) {
//       console.log(err.response?.data);
//       toast.error("Failed to add ❌");
//     }
//   };

//   /* ================= ⭐ RATING ================= */
//   const handleRating = (value) => {
//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     savedRatings[product.id] = value;

//     localStorage.setItem("ratings", JSON.stringify(savedRatings));

//     setRating(value);

//     toast.success(`${product.name} rated ${value} ⭐`);
//   };

//   /* ================= UI ================= */
//   return (
//     <motion.div className="card" whileHover={{ scale: 1.03 }}>

//       {isOffer && (
//         <div className="offer-badge">
//           🔥 {offerPercent}% OFF
//         </div>
//       )}

//       {product.is_active === false && (
//         <div className="disabled-overlay">NOT AVAILABLE</div>
//       )}

//       <div className="like-btn" onClick={toggleLike}>
//         <span style={{ color: liked ? "red" : "#999", fontSize: "22px" }}>
//           {liked ? "❤️" : "🤍"}
//         </span>
//       </div>

//       <img src={imageUrl} alt={product.name} className="product-img" />

//       <h3>{product.name}</h3>

//       <p>🍽️ {product.category || "Food"}</p>

//       <p>⭐ {product.rating || "4.5"}</p>

//       <div className="price-section">
//         {isOffer ? (
//           <>
//             <p>₹{product.price}</p>
//             <p>₹{offerPrice}</p>
//           </>
//         ) : (
//           <p>₹{product.price}</p>
//         )}
//       </div>

//       <div className="star-rating">
//         {[1, 2, 3, 4, 5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               color: rating >= star ? "gold" : "gray",
//               cursor: "pointer"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       <button className="cart-btn" onClick={handleAdd}>
//         Add to Cart 🛒
//       </button>

//     </motion.div>
//   );
// }

// export default memo(ProductCard);

// import { useCart } from "./CartContext";
// import { useState, useEffect, memo } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import axios from "axios";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   const [liked, setLiked] = useState(false);
//   const [rating, setRating] = useState(0);

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================= IMAGE ================= */
//   const imageUrl = product.image
//     ? product.image.startsWith("http")
//       ? product.image
//       : `https://e-commerce-app-8jg4.onrender.com${product.image}`
//     : "https://via.placeholder.com/200";

//   /* ================= OFFER LOGIC ================= */
//   const offerPercent = Number(product.offer ?? product.discount ?? 0);
//   const isOffer = offerPercent > 0;

//   const offerPrice = isOffer
//     ? (
//         Number(product.price) -
//         (Number(product.price) * offerPercent) / 100
//       ).toFixed(2)
//     : Number(product.price).toFixed(2);

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     if (!user) return;

//     axios
//       .get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
//         params: { username: user.username }
//       })
//       .then(res => {
//         const likedIds = res.data.map(item => item.id);
//         setLiked(likedIds.includes(product.id));
//       });

//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     setRating(savedRatings[product.id] || 0);
//   }, [product.id]);

//   /* ================= LIKE ================= */
//   const toggleLike = () => {
//     if (!user) return toast.error("Login first ❌");

//     const newLiked = !liked;
//     setLiked(newLiked);

//     toast.success(
//       newLiked
//         ? `${product.name} Added to Wishlist ❤️`
//         : `${product.name} Removed from Wishlist ❌`
//     );

//     axios.post(
//       `https://e-commerce-app-8jg4.onrender.com/api/${
//         newLiked ? "add-like" : "remove-like"
//       }/`,
//       {
//         username: user.username,
//         item_name: product.name,
//         image: imageUrl,
//         price: product.price,
//         id: product.id
//       }
//     );
//   };

//   /* ================= CART ================= */
//   const handleAdd = async () => {
//     if (product.is_active === false) {
//       return toast.error("This product is disabled ❌");
//     }

//     if (!user) return toast.error("Login first ❌");

//     try {
//       await axios.post(
//         "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
//         {
//           username: user.username,
//           product_id: product.id
//         }
//       );

//       toast.success(`${product.name} Added to cart 🛒`);

//       window.dispatchEvent(new Event("cartUpdated"));

//     } catch (err) {
//       console.log(err.response?.data);
//       toast.error("Failed to add ❌");
//     }
//   };

//   /* ================= ⭐ RATING ================= */
//   const handleRating = (value) => {
//     const savedRatings =
//       JSON.parse(localStorage.getItem("ratings")) || {};

//     savedRatings[product.id] = value;

//     localStorage.setItem("ratings", JSON.stringify(savedRatings));

//     setRating(value);

//     toast.success(`${product.name} rated ${value} ⭐`);
//   };

//   /* ================= UI ================= */
//   return (
//     <motion.div className="card" whileHover={{ scale: 1.03 }}>

//       {isOffer && (
//         <div className="offer-badge">
//           🔥 {offerPercent}% OFF
//         </div>
//       )}

//       {product.is_active === false && (
//         <div className="disabled-overlay">NOT AVAILABLE</div>
//       )}

//       {/* ❤️ LIKE */}
//       <div className="like-btn" onClick={toggleLike}>
//         <span style={{ color: liked ? "red" : "#999", fontSize: "22px" }}>
//           {liked ? "❤️" : "🤍"}
//         </span>
//       </div>

//       {/* 🖼 IMAGE */}
//       <img src={imageUrl} alt={product.name} className="product-img" />

//       <h3>{product.name}</h3>

//       <p>🍽️ {product.category || "Food"}</p>

//       {/* ⭐ FIXED RATING DISPLAY */}
//       <p>⭐ {product.rating ?? "4.5"}</p>

//       {/* 💰 PRICE */}
//       <div className="price-section">
//         {isOffer ? (
//           <>
//             <p style={{ textDecoration: "line-through", color: "gray" }}>
//               ₹{product.price}
//             </p>

//             <p style={{ color: "green", fontWeight: "bold" }}>
//               ₹{offerPrice}
//             </p>
//           </>
//         ) : (
//           <p>₹{product.price}</p>
//         )}
//       </div>

//       {/* ⭐ RATING */}
//       <div className="star-rating">
//         {[1, 2, 3, 4, 5].map(star => (
//           <span
//             key={star}
//             onClick={() => handleRating(star)}
//             style={{
//               color: rating >= star ? "gold" : "gray",
//               cursor: "pointer"
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       <button className="cart-btn" onClick={handleAdd}>
//         Add to Cart 🛒
//       </button>

//     </motion.div>
//   );
// }

// export default memo(ProductCard);

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
  const isOffer = offerPercent > 0;

  const offerPrice = isOffer
    ? (
        Number(product.price) -
        (Number(product.price) * offerPercent) / 100
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

  /* ================= CART ================= */
  const handleAdd = async () => {

    if (product.is_active === false) {
      return toast.error("This product is disabled ❌");
    }

    if (!user) return toast.error("Login first ❌");

    // ⚡ INSTANT TOAST
    toast.success(`${product.name} Added to cart 🛒`);

    try {

      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
        {
          username: user.username,
          product_id: product.id
        }
      );

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

      {/* ❤️ LIKE */}
      <div className="like-btn" onClick={toggleLike}>
        <span style={{ color: liked ? "red" : "#999", fontSize: "22px" }}>
          {liked ? "❤️" : "🤍"}
        </span>
      </div>

      {/* 🖼 IMAGE */}
      <img src={imageUrl} alt={product.name} className="product-img" />

      <h3>{product.name}</h3>

      <p>🍽️ {product.category || "Food"}</p>

      {/* ⭐ FIXED RATING DISPLAY */}
      <p>⭐ {product.rating ?? "4.5"}</p>

      {/* 💰 PRICE */}
      <div className="price-section">
        {isOffer ? (
          <>
            <p style={{ textDecoration: "line-through", color: "gray" }}>
              ₹{product.price}
            </p>

            <p style={{ color: "green", fontWeight: "bold" }}>
              ₹{offerPrice}
            </p>
          </>
        ) : (
          <p>₹{product.price}</p>
        )}
      </div>

      {/* ⭐ RATING */}
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