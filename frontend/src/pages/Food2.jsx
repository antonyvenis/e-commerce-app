// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "./CartContext";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";

// function Food2() {
//   const [foods, setFoods] = useState([]);
//   const [search, setSearch] = useState("");

//   const { addToCart } = useCart();

//   /* =========================================================
//      💾 LOAD LIKES (COMMON KEY)
//   ========================================================= */
//   const [liked, setLiked] = useState(() => {
//     return JSON.parse(localStorage.getItem("likes")) || [];
//   });

//   /* =========================================================
//      🍔 FETCH DATA
//   ========================================================= */
//   useEffect(() => {
//     axios.get("https://dummyjson.com/recipes")
//       .then(res => setFoods(res.data.recipes))
//       .catch(err => console.log(err));
//   }, []);

//   /* =========================================================
//      💾 SAVE LIKES
//   ========================================================= */
//   useEffect(() => {
//     localStorage.setItem("likes", JSON.stringify(liked));
//   }, [liked]);

//   /* =========================================================
//      🔍 SEARCH
//   ========================================================= */
//   const filteredFoods = foods.filter(item =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /* =========================================================
//      ❤️ LIKE + TOAST
//   ========================================================= */
//   const toggleLike = (id, name) => {
//     if (liked.includes(id)) {
//       setLiked(liked.filter(item => item !== id));
//       toast("🗑️ Removed from wishlist ❌");
//     } else {
//       setLiked([...liked, id]);
//       toast.success(`${name} added to wishlist ❤️`);
//     }
//   };

//   /* =========================================================
//      🛒 ADD TO CART + TOAST
//   ========================================================= */
//   const handleAdd = (item) => {
//     const product = {
//       id: item.id,
//       name: item.name,
//       image: item.image,
//       price: Math.floor(Math.random() * 300) + 100,
//       qty: 1
//     };

//     addToCart(product);

//     toast.success(`${item.name} added to cart 🛒🔥`);
//   };

//   /* =========================================================
//      🎨 UI
//   ========================================================= */
//   return (
//     <div style={{ padding: "20px" }}>

//       {/* 🔍 SEARCH */}
//       <input
//         type="text"
//         placeholder="Search foods... 🔍"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{
//           padding: "10px",
//           width: "100%",
//           marginBottom: "20px",
//           borderRadius: "10px",
//           border: "1px solid #ccc"
//         }}
//       />

//       {/* 🍔 GRID */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//         gap: "20px"
//       }}>

//         {filteredFoods.map(item => {
//           const isLiked = liked.includes(item.id);

//           return (
//             <motion.div
//               key={item.id}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               style={{
//                 background: "#fff",
//                 borderRadius: "12px",
//                 padding: "10px",
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//                 position: "relative"
//               }}
//             >

//               {/* ❤️ LIKE */}
//               <span
//                 onClick={() => toggleLike(item.id, item.name)}
//                 style={{
//                   position: "absolute",
//                   top: "10px",
//                   right: "10px",
//                   fontSize: "22px",
//                   cursor: "pointer"
//                 }}
//               >
//                 {isLiked ? "❤️" : "🤍"}
//               </span>

//               {/* 🖼️ IMAGE */}
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 style={{
//                   width: "100%",
//                   height: "160px",
//                   objectFit: "cover",
//                   borderRadius: "10px"
//                 }}
//               />

//               {/* 📦 DETAILS */}
//               <h3>{item.name}</h3>
//               <p>🍽️ {item.cuisine}</p>
//               <p>⭐ {item.rating}</p>
//               <p>⏱️ {item.prepTimeMinutes} mins</p>

//               <p>₹{Math.floor(Math.random() * 300) + 100}</p>

//               {/* 🛒 ADD */}
//               <button
//                 onClick={() => handleAdd(item)}
//                 style={{
//                   background: "orange",
//                   color: "#fff",
//                   border: "none",
//                   padding: "8px",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   width: "100%"
//                 }}
//               >
//                 Add to Cart 🛒
//               </button>

//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Food2;

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
     💾 LOAD LIKES
  ========================================================= */
  const [liked, setLiked] = useState(() => {
    return JSON.parse(localStorage.getItem("likes")) || [];
  });

  /* =========================================================
     🍔 FETCH DATA
  ========================================================= */
  useEffect(() => {
    axios
      .get("https://dummyjson.com/recipes")
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
     ❤️ LIKE
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
     🛒 ADD TO CART
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
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}
    >

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search foods... 🔍"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "14px",
          width: "100%",
          marginBottom: "30px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box"
        }}
      />

      {/* 🍔 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          alignItems: "stretch"
        }}
      >

        {filteredFoods.map(item => {
          const isLiked = liked.includes(item.id);

          // 🔥 FIXED RANDOM PRICE
          const foodPrice =
            (item.id * 37) % 300 + 120;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.08)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: "480px"
              }}
            >

              {/* ❤️ LIKE */}
              <span
                onClick={() =>
                  toggleLike(item.id, item.name)
                }
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  fontSize: "24px",
                  cursor: "pointer",
                  zIndex: 10
                }}
              >
                {isLiked ? "❤️" : "🤍"}
              </span>

              {/* 🖼️ IMAGE */}
              <div
                style={{
                  width: "100%",
                  height: "220px",
                  overflow: "hidden"
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>

              {/* 📦 CONTENT */}
              <div
                style={{
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between"
                }}
              >

                <div>
                  <h3
                    style={{
                      marginBottom: "10px",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#222"
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      marginBottom: "8px",
                      color: "#666",
                      fontSize: "15px"
                    }}
                  >
                    🍽️ {item.cuisine}
                  </p>

                  <p
                    style={{
                      marginBottom: "8px",
                      color: "#666",
                      fontSize: "15px"
                    }}
                  >
                    ⭐ {item.rating}
                  </p>

                  <p
                    style={{
                      marginBottom: "12px",
                      color: "#666",
                      fontSize: "15px"
                    }}
                  >
                    ⏱️ {item.prepTimeMinutes} mins
                  </p>

                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#ff6600",
                      marginBottom: "18px"
                    }}
                  >
                    ₹{foodPrice}
                  </p>
                </div>

                {/* 🛒 BUTTON */}
                <button
                  onClick={() => handleAdd(item)}
                  style={{
                    background:
                      "linear-gradient(135deg,#ff8c00,#ff5e00)",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "0.3s"
                  }}
                >
                  Add to Cart 🛒
                </button>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Food2;