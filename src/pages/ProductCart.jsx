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

import { useCart } from "./CartContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { memo } from "react";   // 🔥 ADD

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================================================
     🔥 IMAGE FIX
  ========================================================= */
  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://e-commerce-app-8jg4.onrender.com${product.image}`
    : "https://via.placeholder.com/200";

  /* =========================================================
     🔥 LOAD LIKES (FAST)
  ========================================================= */
  useEffect(() => {
    if (!user) return;

    axios.get("https://e-commerce-app-8jg4.onrender.com/api/likes/", {
      params: { username: user.username }
    })
    .then(res => {
      const likedIds = res.data.map(item => item.id);
      setLiked(likedIds.includes(product.id));
    })
    .catch(err => console.log(err));

    // ⭐ rating load
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    setRating(savedRatings[product.id] || 0);

  }, [product.id]);

  /* =========================================================
     ❤️ LIKE (⚡ INSTANT UI)
  ========================================================= */
  const toggleLike = () => {
    if (!user) {
      toast.error("Login first ❌");
      return;
    }

    const newLiked = !liked;

    // 🔥 instant UI
    setLiked(newLiked);

    // 🔥 instant toast
    toast.dismiss();
    newLiked ? toast.success(`${product.name} added to wishlist ❤️`) : toast.error(`${product.name} removed from wishlist❌`);

    // 🔥 backend (no wait)
    axios.post(
      `https://e-commerce-app-8jg4.onrender.com/api/${newLiked ? "add-like" : "remove-like"}/`,
      {
        username: user.username,
        item_name: product.name,
        image: imageUrl,
        price: product.price,
        id: product.id
      }
    )
    .then(() => {
      window.dispatchEvent(new Event("wishlistUpdated"));
    })
    .catch(() => {
      setLiked(!newLiked); // rollback
      toast.error("Server error ❌");
    });
  };

  /* =========================================================
     🛒 ADD TO CART (⚡ FAST)
  ========================================================= */
  const handleAdd = () => {
    if (!user) {
      toast.error("Login first ❌");
      return;
    }

    // 🔥 instant UI
    addToCart(product);

    // 🔥 instant toast
    toast.dismiss();
    toast.success(`${product.name} added to cart 🛒`);

    // 🔥 backend (no wait)
    axios.post("https://e-commerce-app-8jg4.onrender.com/api/add-cart/", {
      username: user.username,
      item_name: product.name,
      price: product.price,
      quantity: 1,
      image: imageUrl,
      id: product.id
    })
    .catch(() => {
      toast.error("Cart sync failed ❌");
    });
  };

  /* =========================================================
     ⭐ RATING
  ========================================================= */
  const handleRating = (value) => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    savedRatings[product.id] = value;

    localStorage.setItem("ratings", JSON.stringify(savedRatings));
    setRating(value);

    toast.success(`${product.name} rated ${value} ⭐`);
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >

      {/* ❤️ LIKE */}
      <div className="like-btn" onClick={toggleLike}>
        <span
          style={{
            color: liked ? "red" : "#999",
            fontSize: "22px",
            transition: "0.15s"
          }}
        >
          {liked ? "❤️" : "🤍"}
        </span>
      </div>

      {/* 🖼 IMAGE */}
      <img
        src={imageUrl}
        alt={product.name}
        className="product-img"
        loading="lazy"   // 🔥 PERFORMANCE BOOST
      />

      {/* DETAILS */}
      <h3>{product.name}</h3>
      <p>🍽️ {product.category || "Food"}</p><br></br>
      <p>⭐ {product.rating || "4.5"}</p><br></br>
      <p>₹{product.price}</p>

      {/* ⭐ RATING */}
      <div>
        {[1,2,3,4,5].map(star => (
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

      {/* 🛒 CART */}
      <button onClick={handleAdd}>
        Add to Cart 🛒
      </button>

    </motion.div>
  );
}

export default memo(ProductCard);  // 🔥 IMPORTANT