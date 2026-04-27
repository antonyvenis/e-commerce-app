// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// function Orders() {
//   const orders = JSON.parse(localStorage.getItem("orders")) || [];
//   const user = JSON.parse(localStorage.getItem("user"));

//   const myOrders = orders.filter(order => order.user?.id === user?.id);

//   return (
//     <div className="orders-container">
//     <AnimatePresence>
//   <motion.div
//   initial={{ opacity: 0, scale: 0.8 }}
//   animate={{ opacity: 1, scale: 1 }}
//   exit={{ opacity: 0, x: 100 }}
//   transition={{ duration: 0.4 }}
              
// >
//       <h2 className="orders-title">📦 My Orders</h2>

//       {myOrders.length === 0 && <p>No orders yet 😢</p> }
//       {myOrders.length === 0 && <button onClick={() => navigate("/")}>
//               Go Shopping 🛍️
//         </button> }

//       {myOrders.map(order => (
//         <div key={order.id} className="order-card">

//           <div className="order-top">
//             <p>🗓 {order.date}</p>
//             <p>{order.time}</p>
//             <p>🚚 {order.status}</p>
//           </div>

//           <div className="order-location">
//             <p>📍 {order.address}</p>
//           </div>

//           <div className="order-meta">
//             <span>💳 {order.method}</span>
//             <span className="status">✔ {order.status}</span>
//           </div>

//           {/* ✅ FIXED PART */}
//           <div className="order-item">
//             {order.items.map(item => (
//               <div key={item.id}>
//                 <img src={item.image} width="60" alt={item.name} />
//                 <div>
//                   <div className="item-name">{item.name}</div>
//                   <div className="item-qty">Qty: {item.qty}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button className="reorder-btn">
//           <Link to="/menu" id="Link-text">Reorder 🔁</Link>
//           </button>

//         </div>
//       ))}
//       </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Orders;

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// function Orders() {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   /* =========================================
//      📦 FETCH ORDERS FROM DB
//   ========================================= */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user) return;

//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/orders/", {
//           params: { username: user.username }
//         });

//         console.log("ORDERS 👉", res.data);
//         setOrders(res.data);

//       } catch (err) {
//         console.log("ORDER ERROR 👉", err);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   return (
//     <div className="orders-container">
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, x: 100 }}
//           transition={{ duration: 0.4 }}
//         >

//           <h2 className="orders-title">📦 My Orders ({orders.length})</h2>

//           {/* ❌ NO USER */}
//           {!user && (
//             <>
//               <p>Please login 😢</p>
//               <button onClick={() => navigate("/login")}>
//                 Login ➡️
//               </button>
//             </>
//           )}

//           {/* 😢 EMPTY */}
//           {user && orders.length === 0 && (
//             <>
//               <p>No orders yet 😢</p>
//               <button onClick={() => navigate("/menu")}>
//                 Go Shopping 🛍️
//               </button>
//             </>
//           )}

//           {/* ✅ ORDERS LIST */}
//           {orders.map(order => (
//             <div key={order.id} className="order-card">

//               <div className="order-top">
//                 <p>🆔 Order ID: {order.id}</p>
//                 <p>🗓️ {new Date(order.created_at).toLocaleString()}</p>
//                 <p className="status">🚚  ✔{order.status}</p>
//               </div>
//               <div className="order-location">
//                 <p>📍 {order.address}</p>
//                 <span>📞 {order.phone}</span>
//               </div>
//               <div className="order-meta">
//                 <span>💳 {order.payment_method}</span>
//                 {/* <span className="status">✔ {order.status}</span> */}
//               </div>

//               {/* 📦 ITEMS (🔥 FIX HERE) */}
//               <div className="order-items">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="order-item">

//                     <img src={item.image} width="60" alt={item.item_name} />

//                     <div>
//                       <div className="item-name">{index+1}.{item.item_name}</div><br></br>
//                       <div className="item-qty">Qty: {item.quantity}</div><br></br>
//                       <div className="item-price">₹ {item.price}</div><br></br>
//                     </div>

//                   </div>
//                 ))}
//               </div>

//               {/* 💰 TOTAL */}
//               <h4>Total: ₹{order.total}</h4>

//               {/* 📅 DATE */}
//               {/* <div className="order-date">
//                 <p>🗓 {new Date(order.created_at).toLocaleString()}</p>
//               </div> */}

//               <button className="reorder-btn">
//                 <Link to="/menu" id="Link-text">
//                   Reorder 🔁
//                 </Link>
//               </button>

//             </div>
//           ))}

//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Orders;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://127.0.0.1:8000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 NEW
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================================
     📦 FETCH ORDERS FROM DB (FAST)
  ========================================= */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/api/orders/`, {
          params: { username: user.username }
        });

        console.log("ORDERS 👉", res.data);
        setOrders(res.data);

      } catch (err) {
        console.log("ORDER ERROR 👉", err);
      } finally {
        setLoading(false); // 🔥 STOP LOADING
      }
    };

    fetchOrders();
  }, [user]);

  /* =========================================
     🖼 IMAGE FIX
  ========================================= */
  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/60";

    return img.startsWith("http")
      ? img
      : `${API}${img}`;
  };

  return (
    <div className="orders-container">

      {/* 🔥 LOADING */}
      {loading ? (
        <h2 style={{ textAlign: "center" }}>
          Loading Orders... ⏳
        </h2>
      ) : (

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
          >

            <h2 className="orders-title">
              📦 My Orders ({orders.length})
            </h2>

            {/* ❌ NO USER */}
            {!user && (
              <>
                <p>Please login 😢</p>
                <button onClick={() => navigate("/login")}>
                  Login ➡️
                </button>
              </>
            )}

            {/* 😢 EMPTY */}
            {user && orders.length === 0 && (
              <>
                <p>No orders yet 😢</p>
                <button onClick={() => navigate("/menu")}>
                  Go Shopping 🛍️
                </button>
              </>
            )}

            {/* ✅ ORDERS LIST */}
            {orders.map(order => (
              <div key={order.id} className="order-card">

                <div className="order-top">
                  <p>🆔 Order ID: {order.id}</p>
                  <p>🗓️ {new Date(order.created_at).toLocaleString()}</p>
                  <p className="status">🚚 ✔ {order.status}</p>
                </div>

                <div className="order-location">
                  <p>📍 {order.address}</p>
                  <span>📞 {order.phone}</span>
                </div>

                <div className="order-meta">
                  <span>💳 {order.payment_method}</span>
                </div>

                {/* 📦 ITEMS */}
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">

                      {/* 🔥 IMAGE FIX */}
                      <img
                        src={getImage(item.image)}
                        alt={item.item_name}
                        className="order-img"
                      />

                      <div>
                        <div className="item-name">
                          {index + 1}. {item.item_name}
                        </div><br />

                        <div className="item-qty">
                          Qty: {item.quantity}
                        </div><br />

                        <div className="item-price">
                          ₹ {item.price}
                        </div><br />
                      </div>

                    </div>
                  ))}
                </div>

                {/* 💰 TOTAL */}
                <h4>Total: ₹{order.total}</h4>

                <button className="reorder-btn">
                  <Link to="/menu" id="Link-text">
                    Reorder 🔁
                  </Link>
                </button>

              </div>
            ))}

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}

export default Orders;