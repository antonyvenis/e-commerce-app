// import { useCart } from "./CartContext";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { motion , AnimatePresence } from "framer-motion";

// function Payment() {
//   const { cart, clearCart } = useCart();
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     method: "COD"
//   });

//   // 🔐 LOGIN CHECK (Page open)
//   useEffect(() => {
//     if (!user) {
//       alert("Please login first ❌");
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

//   const handlePayment = () => {

//     // 🔐 LOGIN CHECK (Button click)
//     if (!user) {
//       alert("Login pannitu va da 😅");
//       navigate("/login");
//       return;
//     }

//     if (!form.name || !form.phone || !form.address) {
//       alert("Fill all details da ⚠️");
//       return;
//     }

//     // 💾 Save order
//     const orders = JSON.parse(localStorage.getItem("orders")) || [];

//     const newOrder = {
//       id: Date.now(),
//       items: cart,
//       user: user, // ✅ user info save
//       address: form.address,
//       method: form.method,
//       status: "Ordered",
//       date: new Date().toLocaleString()
//     };

//     localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));

//     clearCart();
//     navigate("/success");
//   };

//   return (
//     <div className="payment">
//       <AnimatePresence>
//        <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, x: 100 }}
//                 transition={{ duration: 0.4 }}
//        >

//       <h2>💳 Checkout</h2>

//       {/* 🧾 Address */}
//       <input name="name" placeholder="Name" onChange={handleChange} />
//       <input name="phone" placeholder="Phone" onChange={handleChange} />
//       <textarea name="address" placeholder="Address" onChange={handleChange} />

//       {/* 💳 Method */}
//       <select name="method" onChange={handleChange}>
//         <option value="COD">Cash On Delivery</option>
//         <option value="UPI">UPI</option>
//         <option value="Card">Card</option>
//       </select>

//       {/* 🛒 Items */}
//       {cart.map(item => (
//         <div key={item.id} className="payment-item">
//           <img src={item.image} width="70" alt={item.name} />
//           <div>
//             <p>{item.name}</p>
//             <p>Qty: {item.qty}</p>
//           </div>
//         </div>
//       ))}

//       <h3>Total: ₹{total}</h3>

//       {cart.length > 0 && <button onClick={handlePayment} disabled={!user} >
//         Pay Now 💳
//       </button> }

//       </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Payment;

import { useCart } from "./CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Payment() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 IMPORTANT: get cart from Cart.jsx
  const cart = location.state?.cart || [];

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    method: "COD"
  });

  /* ================================
     🔐 LOGIN CHECK
  ================================ */
  useEffect(() => {
    if (!user) {
      alert("Please login first ❌");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================================
     💰 TOTAL (🔥 FIXED)
  ================================ */
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /* ================================
     💳 PAYMENT
  ================================ */
  const handlePayment = async () => {

    if (!user) {
      alert("Login please ⚠️ ");
      navigate("/login");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      alert("Fill all details da ⚠️");
      return;
    }

    if (cart.length === 0) {
      alert("Cart empty ❌");
      return;
    }

    try {
      await axios.post("https://e-commerce-app-8jg4.onrender.com/api/order/", {
        username: user.username,
        name: form.name,
        phone: form.phone,
        address: form.address,
        payment_method: form.method,

        // 🔥 DB FORMAT MATCH
        items: cart.map(item => ({
          item_name: item.item_name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      });

      // 🧹 CLEAR EVERYTHING
      clearCart();
      localStorage.removeItem("cartCount");

      alert("Order placed successfully ✅🔥");

      navigate("/success");

    } catch (err) {
      console.log("ORDER ERROR 👉", err.response?.data);
      alert("Order failed ❌");
    }
  };

  return (
    <div className="payment">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, x: 100 }}
        >

          <h2>💳 Checkout</h2>

          {/* 🧾 FORM */}
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <textarea name="address" placeholder="Address" onChange={handleChange} />

          {/* 💳 METHOD */}
          <select name="method" onChange={handleChange}>
            <option value="COD">Cash On Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          {/* 🛒 ITEMS */}
          {cart.map(item => (
            <div key={item.id} className="payment-item">
              <img src={item.image} width="70" alt={item.item_name} />
              <div>
                <p>{item.item_name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          {cart.length > 0 && (
            <button onClick={handlePayment}>
              Pay Now 💳
            </button>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Payment;
