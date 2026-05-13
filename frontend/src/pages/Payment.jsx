// import { useCart } from "./CartContext";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// function Payment() {
//   const { clearCart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔥 IMPORTANT: get cart from Cart.jsx
//   const cart = location.state?.cart || [];

//   const user = JSON.parse(localStorage.getItem("user"));

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     method: "COD"
//   });

//   /* ================================
//      🔐 LOGIN CHECK
//   ================================ */
//   useEffect(() => {
//     if (!user) {
//       alert("Please login first ❌");
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ================================
//      💰 TOTAL (🔥 FIXED)
//   ================================ */
//   const total = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   /* ================================
//      💳 PAYMENT
//   ================================ */
//   const handlePayment = async () => {

//     if (!user) {
//       alert("Login please ⚠️ ");
//       navigate("/login");
//       return;
//     }

//     if (!form.name || !form.phone || !form.address) {
//       alert("Fill all details First ⚠️");
//       return;
//     }

//     if (cart.length === 0) {
//       alert("Cart empty ❌");
//       return;
//     }

//     try {
//       await axios.post("https://e-commerce-app-8jg4.onrender.com/api/order/", {
//         username: user.username,
//         name: form.name,
//         phone: form.phone,
//         address: form.address,
//         payment_method: form.method,

//         // 🔥 DB FORMAT MATCH
//         items: cart.map(item => ({
//           item_name: item.item_name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image
//         }))
//       });

//       // 🧹 CLEAR EVERYTHING
//       clearCart();
//       localStorage.removeItem("cartCount");

//       alert("Order placed successfully ✅🔥");

//       navigate("/success");

//     } catch (err) {
//       console.log("ORDER ERROR 👉", err.response?.data);
//       alert("Order failed ❌");
//     }
//   };

//   return (
//     <div className="payment">
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, x: 100 }}
//         >

//           <h2>💳 Checkout</h2>

//           {/* 🧾 FORM */}
//           <input name="name" placeholder="Name" onChange={handleChange} />
//           <input name="phone" placeholder="Phone" onChange={handleChange} />
//           <textarea name="address" placeholder="Address" onChange={handleChange} />

//           {/* 💳 METHOD */}
//           <select name="method" onChange={handleChange}>
//             <option value="COD">Cash On Delivery</option>
//             <option value="UPI">UPI</option>
//             <option value="Card">Card</option>
//           </select>

//           {/* 🛒 ITEMS */}
//           {cart.map(item => (
//             <div key={item.id} className="payment-item">
//               <img src={item.image} width="70" alt={item.item_name} />
//               <div>
//                 <p>{item.item_name}</p>
//                 <p>Qty: {item.quantity}</p>
//               </div>
//             </div>
//           ))}
//           <div className="payment-section">
//           <h3>Total: ₹{total}</h3>

//           {cart.length > 0 && (
//             <button onClick={handlePayment}  className="pay-btn">
//               Pay Now 💳
//             </button>
//           )}</div>

//         </motion.div>
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

  const [loading, setLoading] = useState(false);

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

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* ================================
     💰 TOTAL
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
      alert("Login please ⚠️");
      navigate("/login");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      alert("Fill all details first ⚠️");
      return;
    }

    if (cart.length === 0) {
      alert("Cart empty ❌");
      return;
    }

    try {

      setLoading(true);

      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/order/",
        {
          username: user.username,

          // 🔥 EMAIL FOR INVOICE
          email: user.email,

          name: form.name,
          phone: form.phone,
          address: form.address,

          payment_method: form.method,

          // 🔥 TOTAL PRICE
          total_price: total,

          // 🔥 CART ITEMS
          items: cart.map((item) => ({
            item_name: item.item_name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        }
      );

      // 🧹 CLEAR CART
      clearCart();

      localStorage.removeItem("cartCount");

      alert("Order placed successfully ✅🔥");

      navigate("/success");

    } catch (err) {

      console.log("ORDER ERROR 👉", err.response?.data);

      alert("Order failed ❌");

    } finally {

      setLoading(false);

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
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />

          {/* 💳 METHOD */}
          <select
            name="method"
            onChange={handleChange}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          {/* 🛒 ITEMS */}
          {cart.map((item) => (

            <div
              key={item.id}
              className="payment-item"
            >

              <img
                src={item.image}
                width="70"
                alt={item.item_name}
              />

              <div>
                <p>{item.item_name}</p>
                <p>Qty: {item.quantity}</p>
              </div>

            </div>

          ))}

          <div className="payment-section">

            <h3>Total: ₹{total}</h3>

            {cart.length > 0 && (

              <button
                onClick={handlePayment}
                className="pay-btn"
                disabled={loading}
              >

                {
                  loading
                    ? "Processing..."
                    : "Pay Now 💳"
                }

              </button>

            )}

          </div>

        </motion.div>

      </AnimatePresence>

    </div>
  );
}

export default Payment;