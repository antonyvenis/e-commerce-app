import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const API = "https://e-commerce-app-8jg4.onrender.com";

function Liked() {

  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user")),
    []
  );

  /* ================================
     ❤️ FETCH LIKES
  ================================ */
  const fetchLikes = useCallback(async () => {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const res = await axios.get(
        `${API}/api/likes/`,
        {
          params: {
            username: user.username
          }
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setLikedProducts(data);

    } catch (err) {

      console.log(
        "LIKE FETCH ERROR 👉",
        err.response?.data
      );

      toast.error(
        "Failed to load wishlist ❌"
      );

      setLikedProducts([]);

    } finally {

      setLoading(false);
    }

  }, [user]);

  /* ================================
     🔥 FIRST LOAD
  ================================ */
  useEffect(() => {

    fetchLikes();

  }, [fetchLikes]);

  /* ================================
     🔥 REAL-TIME UPDATE
  ================================ */
  useEffect(() => {

    const handleUpdate = () => {
      fetchLikes();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleUpdate
    );

    return () => {

      window.removeEventListener(
        "wishlistUpdated",
        handleUpdate
      );
    };

  }, [fetchLikes]);

  /* ================================
     ❌ REMOVE
  ================================ */
  const removeItem = async (item) => {

    const oldData = [...likedProducts];

    /* ⚡ INSTANT UI UPDATE */
    setLikedProducts(prev =>
      prev.filter(p => p.id !== item.id)
    );

    try {

      await axios.post(
        `${API}/api/remove-like/`,
        {
          username: user.username,
          id: item.id
        }
      );

      toast.success(
        `${item.item_name} removed ❌`
      );

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

    } catch (err) {

      console.log(err);

      /* 🔥 RESTORE IF ERROR */
      setLikedProducts(oldData);

      toast.error("Remove failed ❌");
    }
  };

  /* ================================
     🛒 ADD TO CART
  ================================ */
  const handleAdd = async (item) => {

    if (!user) {
      return toast.error("Login first ❌");
    }

    /* ⚡ FAST TOAST */
    toast.success(
      `${item.item_name} added to cart 🛒`
    );

    /* ⚡ REALTIME CART UPDATE */
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    try {

      await axios.post(
        `${API}/api/add-cart/`,
        {
          username: user.username,
          product_id: item.id
        }
      );

    } catch (err) {

      console.log(
        "CART ERROR 👉",
        err.response?.data
      );

      toast.error("Cart error ❌");
    }
  };

  /* ================================
     LOADING
  ================================ */
  if (loading) {

    return (
      <div className="liked-container">
        <h2>Loading wishlist... ❤️</h2>
      </div>
    );
  }

  return (

    <div className="liked-container">

      <h2 className="liked-title">
        ❤️ Wishlist ({likedProducts.length})
      </h2>

      {likedProducts.length === 0 ? (

        <div className="empty-state">

          <h3>No liked items 😢</h3>

          <Link to="/menu">
            <button>
              Go Shopping ➡️
            </button>
          </Link>

        </div>

      ) : (

        <div className="liked-grid">

          <AnimatePresence>

            {likedProducts.map((item, index) => {

              /* ================================
                 🔥 OFFER
              ================================ */
              const offerPercent = Number(
                item.offer ?? item.discount ?? 0
              );

              const isOffer = offerPercent > 0;

              const offerPrice = isOffer
                ? (
                    Number(item.price) -
                    (
                      Number(item.price) *
                      offerPercent
                    ) / 100
                  ).toFixed(2)
                : Number(item.price).toFixed(2);

              return (

                <motion.div
                  key={item.id}
                  className="liked-card"
                  layout
                  initial={{
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    x: 100
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  style={{
                    position: "relative"
                  }}
                >

                  {/* 🔥 OFFER BADGE */}
                  {isOffer && (

                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "red",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        zIndex: 10,
                        boxShadow:
                          "0 2px 8px rgba(0,0,0,0.2)"
                      }}
                    >
                      🔥 {offerPercent}% OFF
                    </div>
                  )}

                  {/* 🖼 IMAGE */}
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image.includes("/upload/")
                            ? item.image.replace(
                                "/upload/",
                                "/upload/w_300,q_auto,f_auto/"
                              )
                            : item.image
                          : `${API}${item.image}`
                        : "https://dummyimage.com/300"
                    }
                    alt={item.item_name}
                    loading="lazy"
                  />

                  {/* 📦 NAME */}
                  <h4>
                    {index + 1}. {item.item_name}
                  </h4>

                  {/* 💰 PRICE */}
                  <div className="price-section">

                    {isOffer ? (

                      <>

                        <p
                          style={{
                            textDecoration:
                              "line-through",
                            color: "gray",
                            marginBottom: "5px"
                          }}
                        >
                          ₹{item.price}
                        </p>

                        <p
                          style={{
                            color: "green",
                            fontWeight: "bold",
                            fontSize: "22px"
                          }}
                        >
                          ₹{offerPrice}
                        </p>

                      </>

                    ) : (

                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "22px"
                        }}
                      >
                        ₹{item.price || 100}
                      </p>

                    )}

                  </div>

                  {/* 🔘 BUTTONS */}
                  <div className="btn-group">

                    <button
                      onClick={() => handleAdd(item)}
                    >
                      Add to Cart 🛒
                    </button>

                    <button
                      onClick={() => removeItem(item)}
                    >
                      Remove ❌
                    </button>

                  </div>

                </motion.div>
              );
            })}

          </AnimatePresence>

        </div>
      )}

    </div>
  );
}

export default Liked;