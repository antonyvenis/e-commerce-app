import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://e-commerce-app-8jg4.onrender.com";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ================================
     💰 BREAKDOWN HELPER (FIXED ✅)
     Backend saves grand total now,
     so we reverse-calc for display
  ================================ */
  const getBreakdown = (order) => {
    // Subtotal from items
    const subtotal = order.items.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * 0.05;
    const delivery = subtotal > 199 ? 0 : 40;
    const grandTotal = subtotal + tax + delivery;

    return { subtotal, tax, delivery, grandTotal };
  };

  return (
    <div className="orders-container">

      {loading ? (
        <h2 style={{ textAlign: "center" }}>
          Loading Orders... 📦
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

            {!user && (
              <>
                <p>Please login 😢</p>
                <button onClick={() => navigate("/login")}>
                  Login ➡️
                </button>
              </>
            )}

            {user && orders.length === 0 && (
              <>
                <p>No orders yet 😢</p>
                <button onClick={() => navigate("/menu")}>
                  Go Shopping 🛍️
                </button>
              </>
            )}

            {orders.map(order => {

              const { subtotal, tax, delivery, grandTotal } = getBreakdown(order);

              return (
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

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">

                        <img
                          src={
                            item.image
                              ? item.image.startsWith("http")
                                ? item.image.replace('/upload/', '/upload/w_300,q_auto,f_auto/')
                                : `${API}${item.image}`
                              : "https://dummyimage.com/150"
                          }
                          alt={item.item_name}
                          loading="lazy"
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
                            ₹ {parseFloat(item.price).toFixed(2)}
                          </div><br />
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* ✅ PRICE BREAKDOWN */}
                  <div className="order-total-breakdown">
                    <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                    <p>GST (5%): ₹{tax.toFixed(2)}</p>
                    <p>
                      Delivery:{" "}
                      {delivery === 0
                        ? <span style={{ color: "#28a745", fontWeight: "bold" }}>FREE 🎉</span>
                        : `₹${delivery}`
                      }
                    </p>
                    <h4>Total: ₹{grandTotal.toFixed(2)}</h4>
                  </div>

                  <button className="reorder-btn">
                    <Link to="/menu" id="Link-text">
                      Reorder 🔁
                    </Link>
                  </button>

                  {/* 🔥 INVOICE DOWNLOAD BUTTON */}
                  <button
                    className="reorder-btn"
                    style={{ marginTop: "10px", background: "#28a745" }}
                    onClick={() =>
                      window.open(`${API}/api/invoice/${order.id}/`, '_blank')
                    }
                  >
                    📄 Download Invoice
                  </button>

                </div>
              );
            })}

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}

export default Orders;