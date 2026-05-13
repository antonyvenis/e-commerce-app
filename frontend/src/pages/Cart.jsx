import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API = "https://e-commerce-app-8jg4.onrender.com";

function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================================
     🟢 FETCH CART
  ================================ */
  const fetchCart = async () => {

    if (!user) return;

    try {

      const res = await axios.get(
        `${API}/api/cart/`,
        {
          params: {
            username: user.username
          }
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setCart(data);

      // ✅ ONLY PRODUCT COUNT
      localStorage.setItem(
        "cartCount",
        data.length
      );

      // ✅ LIVE NAVBAR UPDATE
      window.dispatchEvent(
        new Event("cartUpdated")
      );

    } catch (err) {

      console.log(
        "FETCH CART ERROR 👉",
        err.response?.data
      );

      toast.error("Cart load error ❌");

      setCart([]);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchCart();

    // ✅ REALTIME UPDATE FIX
    window.addEventListener(
      "cartUpdated",
      fetchCart
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        fetchCart
      );

    };

  }, []);

  /* ================================
     ➕ INCREASE
  ================================ */
  const increaseQty = async (item) => {

    // ✅ INSTANT UI UPDATE
    const updatedCart = cart.map(p =>
      p.id === item.id
        ? {
            ...p,
            quantity: p.quantity + 1
          }
        : p
    );

    setCart(updatedCart);

    // ✅ PRODUCT COUNT ONLY
    localStorage.setItem(
      "cartCount",
      updatedCart.length
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    try {

      await axios.post(
        `${API}/api/update-quantity/`,
        {
          username: user.username,
          id: item.id,
          quantity: item.quantity + 1
        }
      );

    } catch (err) {

      console.log(
        "INCREASE ERROR 👉",
        err.response?.data
      );

    }
  };

  /* ================================
     ➖ DECREASE
  ================================ */
  const decreaseQty = async (item) => {

    if (item.quantity <= 1) return;

    // ✅ INSTANT UI UPDATE
    const updatedCart = cart.map(p =>
      p.id === item.id
        ? {
            ...p,
            quantity: p.quantity - 1
          }
        : p
    );

    setCart(updatedCart);

    // ✅ PRODUCT COUNT ONLY
    localStorage.setItem(
      "cartCount",
      updatedCart.length
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    try {

      await axios.post(
        `${API}/api/update-quantity/`,
        {
          username: user.username,
          id: item.id,
          quantity: item.quantity - 1
        }
      );

    } catch (err) {

      console.log(
        "DECREASE ERROR 👉",
        err.response?.data
      );

    }
  };

  /* ================================
     ❌ REMOVE
  ================================ */
  const removeItem = async (item) => {

    // ✅ INSTANT REMOVE
    const updatedCart =
      cart.filter(p => p.id !== item.id);

    setCart(updatedCart);

    // ✅ PRODUCT COUNT ONLY
    localStorage.setItem(
      "cartCount",
      updatedCart.length
    );

    // ✅ LIVE NAVBAR UPDATE
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    // ✅ FAST TOAST
    toast.success(
      `${item.item_name} removed ❌`
    );

    try {

      await axios.post(
        `${API}/api/remove-cart/`,
        {
          username: user.username,
          id: item.id
        }
      );

    } catch (err) {

      console.log(
        "REMOVE ERROR 👉",
        err.response?.data
      );

      toast.error("Remove failed ❌");

      fetchCart();
    }
  };

  /* ================================
     💰 TOTAL
  ================================ */
  const total = Array.isArray(cart)
    ? cart.reduce((acc, item) => {

        const price =
          Number(item.price) || 0;

        const qty =
          Number(item.quantity) || 1;

        return acc + price * qty;

      }, 0)
    : 0;

  /* ================================
     💳 CHECKOUT
  ================================ */
  const handleCheckout = () => {

    if (!cart.length) {

      toast.error("Cart empty ❌");

      return;
    }

    navigate("/payment", {
      state: { cart }
    });
  };

  /* ================================
     🎨 UI
  ================================ */
  return (

    <div className="cart-container">

      {loading ? (

        <h2 style={{ textAlign: "center" }}>
          Loading Cart... 🛒
        </h2>

      ) : (

        <AnimatePresence mode="wait">

          {cart.length === 0 ? (

            <motion.div
              key="empty"
              initial={{
                opacity: 0,
                y: 50
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -50
              }}
            >

              <h2>
                🛒 Your Cart is Empty 😢
              </h2>

              <button
                onClick={() =>
                  navigate("/menu")
                }
              >
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

              {cart.map(item => {

                const isOffer =
                  Number(item.offer) > 0;

                return (

                  <div
                    key={item.id}
                    className="cart-item"
                  >

                    <img
                      src={
                        item.image
                          ? item.image.startsWith("http")
                            ? item.image.replace(
                                "/upload/",
                                "/upload/w_300,q_auto,f_auto/"
                              )
                            : `${API}${item.image}`
                          : "https://dummyimage.com/150"
                      }
                      alt={item.item_name}
                      className="cart-img"
                    />

                    <div className="cart-info">

                      <h3>
                        {item.item_name}
                      </h3>

                      {isOffer ? (
                        <>
                          <p
                            style={{
                              color: "green",
                              fontWeight: "bold",
                              fontSize: "20px"
                            }}
                          >
                            ₹{item.price}
                          </p>

                          <p
                            style={{
                              color: "red",
                              fontSize: "13px",
                              fontWeight: "bold"
                            }}
                          >
                            🔥 {item.offer}% OFF
                          </p>
                        </>
                      ) : (
                        <p>₹{item.price}</p>
                      )}

                    </div>

                    <div className="qty">

                      <button
                        onClick={() =>
                          decreaseQty(item)
                        }
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item)
                        }
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() =>
                        removeItem(item)
                      }
                    >
                      Remove ❌
                    </button>

                  </div>
                );
              })}

              <div className="total-box">

                <h3>
                  Total: ₹
                  {total.toFixed(2)}
                </h3>

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