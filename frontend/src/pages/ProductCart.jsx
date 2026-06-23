import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function ProductCard({ product, likedIds = [], setLikedIds }) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= IMAGE ================= */
  const imageUrl = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://e-commerce-app-8jg4.onrender.com${product.image}`
    : "https://via.placeholder.com/200";

  /* ================= OFFER ================= */
  const offerPercent = Number(product.offer ?? product.discount ?? 0);
  const isOffer = offerPercent > 0;
  const offerPrice = isOffer
    ? (Number(product.price) - (Number(product.price) * offerPercent) / 100).toFixed(2)
    : Number(product.price || 0).toFixed(2);

  /* ================= LOAD ================= */
  // ✅ likedIds prop வந்தா அதுவே use பண்ணு
  // ❌ Per-card API call இல்ல — egress fix!
  useEffect(() => {
    setLiked(likedIds.includes(product.id));
  }, [likedIds, product.id]);

  // ⭐ Rating localStorage
  useEffect(() => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    setRating(savedRatings[product.id] || 0);
  }, [product.id]);

  /* ================= LIKE ================= */
  const toggleLike = async () => {
    if (!user) {
      return toast.error("Login first ❌");
    }

    const newLiked = !liked;
    setLiked(newLiked);

    // ✅ likedIds update — Menu la sync ஆகும்
    if (setLikedIds) {
      setLikedIds(prev =>
        newLiked
          ? [...prev, product.id]
          : prev.filter(id => id !== product.id)
      );
    }

    toast.success(
      newLiked
        ? `${product.name} Added to Wishlist ❤️`
        : `${product.name} Removed from Wishlist ❌`
    );

    try {
      await axios.post(
        `https://e-commerce-app-8jg4.onrender.com/api/${newLiked ? "add-like" : "remove-like"}/`,
        {
          username: user.username,
          item_name: product.name,
          image: imageUrl,
          price: product.price,
          id: product.id,
        }
      );
    } catch (err) {
      console.log(err);

      // ❌ Rollback
      setLiked(!newLiked);

      if (setLikedIds) {
        setLikedIds(prev =>
          newLiked
            ? prev.filter(id => id !== product.id)
            : [...prev, product.id]
        );
      }

      toast.error("Something went wrong ❌");
    }
  };

  /* ================= ADD CART ================= */
  const handleAdd = async () => {
    if (product.is_active === false) {
      return toast.error("This product is disabled ❌");
    }

    if (!user) {
      return toast.error("Login first ❌");
    }

    try {
      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/add-cart/",
        {
          username: user.username,
          product_id: product.id,
        }
      );

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingIndex = cart.findIndex(item => item.id === product.id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({ ...product, image: imageUrl, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      localStorage.setItem("cartCount", totalItems);

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success(`${product.name} Added to Cart 🛒`);

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to add ❌");
    }
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = () => {
    if (product.is_active === false) {
      return toast.error("This product is disabled ❌");
    }

    if (!user) {
      return toast.error("Login first ❌");
    }

    const buyNowProduct = [
      {
        id: product.id,
        item_name: product.name,
        name: product.name,
        image: imageUrl,
        price: parseFloat(isOffer ? offerPrice : product.price),
        offer: offerPercent,
        quantity: 1,
        category: product.category || "Food",
      },
    ];

    navigate("/payment", { state: { cart: buyNowProduct } });
  };

  /* ================= RATING ================= */
  const handleRating = (value) => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    savedRatings[product.id] = value;
    localStorage.setItem("ratings", JSON.stringify(savedRatings));
    setRating(value);
    toast.success(`${product.name} Rated ${value} ⭐`);
  };

  /* ================= UI ================= */
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.03 }}
    >
      {/* OFFER */}
      {isOffer && (
        <div className="offer-badge">
          🔥 {offerPercent}% OFF
        </div>
      )}

      {/* DISABLED */}
      {product.is_active === false && (
        <div className="disabled-overlay">
          NOT AVAILABLE
        </div>
      )}

      {/* LIKE */}
      <div className="like-btn" onClick={toggleLike}>
        <span style={{ color: liked ? "red" : "#999", fontSize: "22px" }}>
          {liked ? "❤️" : "🤍"}
        </span>
      </div>

      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={product.name}
        className="product-img"
      />

      {/* NAME */}
      <h3>{product.name}</h3>

      {/* CATEGORY */}
      <p>🍽️ {product.category || "Food"}</p>

      {/* PRODUCT RATING */}
      <p>⭐ {Number(product.rating || 4.5).toFixed(1)}</p>

      {/* PRICE */}
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

      {/* STAR RATING */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            style={{
              color: rating >= star ? "gold" : "gray",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          className="cart-btn"
          disabled={product.is_active === false}
          onClick={handleAdd}
          style={{ flex: 1 }}
        >
          Add to Cart 🛒
        </button>

        <button
          disabled={product.is_active === false}
          onClick={handleBuyNow}
          style={{
            flex: 1,
            background: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Buy Now ⚡
        </button>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);