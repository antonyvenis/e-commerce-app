import { useCart } from "./CartContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function ProductDetails({ product }) {
  const { addToCart } = useCart();

  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  // 🔥 Load liked + rating
  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("likes")) || [];
    setLiked(likes.includes(product.id));

    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    setRating(savedRatings[product.id] || 0);
  }, [product.id]);

  // ❤️ Toggle Like
  const toggleLike = () => {
    let likes = JSON.parse(localStorage.getItem("likes")) || [];

    let updatedLikes;

    if (likes.includes(product.id)) {
      updatedLikes = likes.filter(id => id !== product.id);
      toast("🗑️ Removed from wishlist ❌");
    } else {
      updatedLikes = [...likes, product.id];
      toast.success(`${product.name} Added to wishlist ❤️`);
    }

    localStorage.setItem("likes", JSON.stringify(updatedLikes));
    setLiked(updatedLikes.includes(product.id));
  };

  // ⭐ Rating
  const handleRating = (value) => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    savedRatings[product.id] = value;

    localStorage.setItem("ratings", JSON.stringify(savedRatings));
    setRating(value);
  };

  // 🛒 ADD TO CART (🔥 FIXED)
  const handleAdd = () => {
    addToCart(product);

    toast.success(`${product.name} added to cart 🛒🔥`, {
      duration: 1500,
      style: {
        background: "#222",
        color: "#fff",
        borderRadius: "12px",
        padding: "10px 15px",
      },
    });
  };

  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >

      {/* ❤️ Like */}
      <div className="like-btn" onClick={toggleLike}>
        <motion.span
          animate={{
            scale: liked ? 1.3 : 1,
            color: liked ? "#ff4d4d" : "#999"
          }}
        >
          {liked ? "❤️" : "🤍"}
        </motion.span>
      </div>

      {/* 🖼️ Image */}
      <img
        src={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
      />

      {/* 📦 Details */}
      <h3>{product.name}</h3><br></br>
      <p>🍽️ {product.strCategory || "Food"}</p><br></br>
      <p>⭐ {product.rating || 4.5}</p><br></br>
      <p>₹{product.price}</p>

      {/* ⭐ Rating */}
      <div className="rating">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            style={{
              cursor: "pointer",
              color: rating >= star ? "gold" : "gray",
              fontSize: "18px"
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* 🛒 Add */}
      <button onClick={handleAdd}>
        Add to Cart 🛒
      </button>

    </motion.div>
  );
}

export default ProductDetails;