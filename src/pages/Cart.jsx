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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API = "https://e-commerce-app-8jg4.onrender.com";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================================
     🟢 FETCH CART (FAST)
  ================================ */
  const fetchCart = async () => {
    if (!user) return;

    try {
      const res = await axios.get(`${API}/api/cart/`, {
        params: { username: user.username }
      });

      setCart(res.data);

      localStorage.setItem("cartCount", res.data.length);

      // 🔥 MUST ADD THIS
     window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.log("FETCH CART ERROR 👉", err.response?.data);
      toast.error("Cart load error ❌");
    } finally {
      setLoading(false); // 🔥 stop loading
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================================
     ➕ INCREASE (INSTANT UI 🔥)
  ================================ */
  const increaseQty = async (item) => {

    // 🔥 instant UI update
    setCart(prev =>
      prev.map(p =>
        p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );

    try {
      await axios.post(`${API}/api/update-quantity/`, {
        username: user.username,
        id: item.id,
        quantity: item.quantity + 1
      });

    } catch (err) {
      console.log("INCREASE ERROR 👉", err.response?.data);
    }
  };

  /* ================================
     ➖ DECREASE (INSTANT UI 🔥)
  ================================ */
  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    setCart(prev =>
      prev.map(p =>
        p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p
      )
    );

    try {
      await axios.post(`${API}/api/update-quantity/`, {
        username: user.username,
        id: item.id,
        quantity: item.quantity - 1
      });

    } catch (err) {
      console.log("DECREASE ERROR 👉", err.response?.data);
    }
  };

  /* ================================
     ❌ REMOVE
  ================================ */
  const removeItem = async (item) => {
    try {
      await axios.post(`${API}/api/remove-cart/`, {
        username: user.username,
        id: item.id
      });

      setCart(prev => prev.filter(p => p.id !== item.id));

      const newCount = cart.length - 1;
      localStorage.setItem("cartCount", newCount);

      toast.success(`${item.item_name} removed from cart ❌`);

    } catch (err) {
      console.log("REMOVE ERROR 👉", err.response?.data);
    }
  };

  /* ================================
     💰 TOTAL
  ================================ */
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /* ================================
     💳 CHECKOUT
  ================================ */
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart empty ❌");
      return;
    }

    navigate("/payment", { state: { cart } });
  };

  /* ================================
     🖼 IMAGE FIX
  ================================ */
  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/80";

    return img.startsWith("http")
      ? img
      : `${API}${img}`;
  };

  /* ================================
     🎨 UI
  ================================ */
  return (
    <div className="cart-container">

      {/* 🔥 LOADING */}
      {loading ? (
        <h2 style={{ textAlign: "center" }}>Loading Cart... ⏳</h2>
      ) : (

        <AnimatePresence mode="wait">

          {cart.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <h2>🛒 Your Cart is Empty 😢</h2>

              <button onClick={() => navigate("/menu")}>
                Go Shopping 🛍️
              </button>
            </motion.div>

          ) : (

            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              <h2 className="cart-title">
                🛒 Cart ({cart.length})
              </h2>

              {cart.map(item => (
                <div key={item.id} className="cart-item">

                  {/* 🖼 SAME SIZE IMAGE */}
                  <img
                    src={getImage(item.image)}
                    alt={item.item_name}
                    className="cart-img"
                  />

                  <div className="cart-info">
                    <h3>{item.item_name}</h3>
                    <p>₹{item.price}</p>
                  </div>

                  {/* 🔢 QTY */}
                  <div className="qty">
                    <button onClick={() => decreaseQty(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item)}>+</button>
                  </div>

                  {/* ❌ REMOVE */}
                  <button onClick={() => removeItem(item)}>
                    Remove ❌
                  </button>

                </div>
              ))}

              {/* 💰 TOTAL */}
              <div className="total-box">
                <h3>Total: ₹{total}</h3>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Pay 💳
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      )}

    </div>
  );
}

export default Cart;