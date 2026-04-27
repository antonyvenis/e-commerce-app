import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Food2() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  const { addToCart } = useCart();

  /* =========================================================
     💾 LOAD LIKES (COMMON KEY)
  ========================================================= */
  const [liked, setLiked] = useState(() => {
    return JSON.parse(localStorage.getItem("likes")) || [];
  });

  /* =========================================================
     🍔 FETCH DATA
  ========================================================= */
  useEffect(() => {
    axios.get("https://dummyjson.com/recipes")
      .then(res => setFoods(res.data.recipes))
      .catch(err => console.log(err));
  }, []);

  /* =========================================================
     💾 SAVE LIKES
  ========================================================= */
  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(liked));
  }, [liked]);

  /* =========================================================
     🔍 SEARCH
  ========================================================= */
  const filteredFoods = foods.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================================================
     ❤️ LIKE + TOAST
  ========================================================= */
  const toggleLike = (id, name) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(item => item !== id));
      toast("🗑️ Removed from wishlist ❌");
    } else {
      setLiked([...liked, id]);
      toast.success(`${name} added to wishlist ❤️`);
    }
  };

  /* =========================================================
     🛒 ADD TO CART + TOAST
  ========================================================= */
  const handleAdd = (item) => {
    const product = {
      id: item.id,
      name: item.name,
      image: item.image,
      price: Math.floor(Math.random() * 300) + 100,
      qty: 1
    };

    addToCart(product);

    toast.success(`${item.name} added to cart 🛒🔥`);
  };

  /* =========================================================
     🎨 UI
  ========================================================= */
  return (
    <div style={{ padding: "20px" }}>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search foods... 🔍"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc"
        }}
      />

      {/* 🍔 GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>

        {filteredFoods.map(item => {
          const isLiked = liked.includes(item.id);

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                position: "relative"
              }}
            >

              {/* ❤️ LIKE */}
              <span
                onClick={() => toggleLike(item.id, item.name)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  fontSize: "22px",
                  cursor: "pointer"
                }}
              >
                {isLiked ? "❤️" : "🤍"}
              </span>

              {/* 🖼️ IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />

              {/* 📦 DETAILS */}
              <h3>{item.name}</h3>
              <p>🍽️ {item.cuisine}</p>
              <p>⭐ {item.rating}</p>
              <p>⏱️ {item.prepTimeMinutes} mins</p>

              <p>₹{Math.floor(Math.random() * 300) + 100}</p>

              {/* 🛒 ADD */}
              <button
                onClick={() => handleAdd(item)}
                style={{
                  background: "orange",
                  color: "#fff",
                  border: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Add to Cart 🛒
              </button>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Food2;