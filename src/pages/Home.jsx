// import { useEffect, useState, useMemo, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import About from "./About";
// import { motion } from "framer-motion";
// // import Products from "./Products";

// function Home() {
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [location, setLocation] = useState("Detecting...");
//   const [offerIndex, setOfferIndex] = useState(0);

//   // 🔥 NEW STATES
//   const [speed, setSpeed] = useState("slow");
//   const trackRef = useRef();

//   // 🔥 PRODUCTS
//   const products = useMemo(() => Products(), []);

//   const offers = [
//     "🔥 50% OFF on all orders",
//     "🚚 Free Delivery above ₹199",
//     "🍔 Buy 1 Get 1 Free",
//     "💳 20% Cashback with UPI"
//   ];

//   const user = JSON.parse(localStorage.getItem("user"));

//   // 📍 Location detect
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       () => setLocation("Chennai 📍"),
//       () => setLocation("Location blocked ❌")
//     );
//   }, []);

//   // 🔁 Offer rotation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setOfferIndex((prev) => (prev + 1) % offers.length);
//     }, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   // 🔍 Search Filter
//   const filtered = data.filter((product) =>
//     product.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <motion.div
//       className="home-container"
//       initial={{ opacity: 0, x: 50 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//     >

//       {/* 👋 Welcome */}
//       {user && (
//         <h3 className="welcome">
//           Welcome, {user?.username} 👋
//         </h3>
//       )}

//       {/* 🔥 HERO */}
//       <div className="hero">
//         <div className="hero-content">

//           <p className="location">📍 {location}</p>

//           <h2 key={offerIndex} className="offer-text">
//             {offers[offerIndex]}
//           </h2>

//           <h1 className="hero-title">
//             Delicious Food Delivered 😋
//           </h1>

//           <p>Order your favorite meals anytime</p>

//           {/* 🔍 Search */}
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search for food...🔍"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="search"
//             />

//             <Link to="/menu">
//               <button>Search</button>
//             </Link>
//           </div>

//           <button
//             className="order-btn"
//             onClick={() => navigate("/menu")}
//           >
//             Order Now 🍔
//           </button>

//         </div>
//       </div>

//       {/* ⚡ SPEED CONTROL */}
//       <div style={{ textAlign: "center", margin: "15px" }}>
//         <button onClick={() => setSpeed(speed === "slow" ? "fast" : "slow")}>
//           {speed === "slow" ? "✨ Slow" : "⚡ Fast"}
//         </button>
//       </div>

//       {/* 🍔 AUTO SCROLL PRODUCTS */}
//       <div className="scroll-container">

//         <div
//           className={`scroll-track ${speed}`}
//           ref={trackRef}
//           onTouchStart={() =>
//             (trackRef.current.style.animationPlayState = "paused")
//           }
//           onTouchEnd={() =>
//             (trackRef.current.style.animationPlayState = "running")
//           }
//         >

//           {[...products, ...products].map((item, index) => (
//             <div
//               className="food-card"
//               key={index}
//               onClick={() =>
//                 navigate(`/product/${item.id}`, { state: item })
//               }
//             >
//               <img
//                 src={item.image || "https://dummyimage.com/150"}
//                 alt={item.name}
//               />
//               <p>{item.name}</p>
//             </div>
//           ))}

//         </div>
//       </div> 

//       {/* 🍽️ Categories */}
//       <div className="categories">
//         <div className="cat-card">🍔 Food</div>
//         <div className="cat-card">🥤 Drinks</div>
//         <div className="cat-card">🥬🍗 Veg & NonVeg</div>
//         <div className="cat-card">🍛 Biryani</div>
//       </div>

//       <div><small>Visit again:</small></div>

//       <div>
//         <About />
//       </div>

//     </motion.div>
//   );
// }

// export default Home;

import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import About from "./About";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Detecting...");
  const [offerIndex, setOfferIndex] = useState(0);

  const [speed, setSpeed] = useState("slow");
  const trackRef = useRef();

  /* =========================
     🔥 HERO SLIDER (15)
  ========================= */
  const heroSlides = [
  { image: "/src/assets/images/briyani_hero.png", title: "🔥 Biryani Special", sub: "Hot & spicy" },
  { image: "/src/assets/images/pizza_hero.png", title: "🍕 Pizza Blast", sub: "Cheesy love" },
  { image: "/src/assets/images/burger_hero.png", title: "🍔 Burger King", sub: "Juicy bites" },
  { image: "/src/assets/images/cool_drinks_hero.png", title: "🥤 Cool Drinks", sub: "Chill refresh" },
  { image: "/src/assets/images/chicken_fry_hero.png", title: "🍗 Chicken Fry", sub: "Crispy & tasty" },
  { image: "/src/assets/images/noodles_hero.png", title: "🍜 Noodles", sub: "Street style" },
  { image: "/src/assets/images/meals_hero.png", title: "🍛 Meals", sub: "Full meals" },
  { image: "/src/assets/images/veg_special_hero.png", title: "🥗 Veg Special", sub: "Healthy" },
  { image: "/src/assets/images/cake_hero.png", title: "🍰 Desserts", sub: "Sweet treat" },
  { image: "/src/assets/images/chinese_hero.png", title: "🥘 Chinese", sub: "Rich taste" },
  { image: "/src/assets/images/bbq_hero.png", title: "🍖 BBQ", sub: "Smoky flavor" },
  { image: "/src/assets/images/breakfast_hero.png", title: "🍞 Breakfast", sub: "Start fresh" },
  { image: "/src/assets/images/Juice_hero.png", title: "🍹 Juice", sub: "Natural energy" },
  { image: "/src/assets/images/combo_offers_hero.png", title: "🔥 Combo Offers", sub: "Save big" }
];

  const [heroIndex, setHeroIndex] = useState(0);

  /* 📱 SWIPE */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }

    if (distance < -50) {
      setHeroIndex((prev) =>
        prev === 0 ? heroSlides.length - 1 : prev - 1
      );
    }
  };

  /* 🔁 AUTO SLIDE */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  /* =========================
     🔥 OFFERS
  ========================= */
  const offers = [
    "🔥 50% OFF on all orders",
    "🚚 Free Delivery above ₹199",
    "🍔 Buy 1 Get 1 Free",
    "💳 20% Cashback with UPI"
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  /* 📍 LOCATION */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => setLocation("Chennai 📍"),
      () => setLocation("Location blocked ❌")
    );
  }, []);

  /* 🔁 OFFERS ROTATE */
  useEffect(() => {
    const interval = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % offers.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  /* 🔥 FETCH PRODUCTS */
  const fetchProducts = () => {
    axios.get("https://e-commerce-app-8jg4.onrender.com/api/products/")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const products = useMemo(() => data, [data]);

  const filtered = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* 👋 Welcome */}
      {user && (
        <h3 className="welcome">
          Welcome, {user?.username} 👋
        </h3>
      )}

      {/* 🔥 EXISTING HERO */}
      <div className="hero">
        <div className="hero-content">

          <p className="location">📍 {location}</p>

          <h2 key={offerIndex} className="offer-text">
            {offers[offerIndex]}
          </h2>

          <h1 className="hero-title">
            Delicious Food Delivered 😋
          </h1>

          <p>Order your favorite meals anytime</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search for food...🔍"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search"
            />

            <Link to="/menu">
              <button>Search</button>
            </Link>
          </div>

          <button
            className="order-btn"
            onClick={() => navigate("/menu")}
          >
            Order Now 🍔
          </button>

        </div>
      </div>

      {/* ⚡ SPEED */}
      <div style={{ textAlign: "center", margin: "15px" }}>
        <button onClick={() => setSpeed(speed === "slow" ? "fast" : "slow")}>
          {speed === "slow" ? "✨ Slow" : "⚡ Fast"}
        </button>
      </div>

      {/* 🍔 AUTO SCROLL */}
      <div className="scroll-container">
        <div
          className={`scroll-track ${speed}`}
          ref={trackRef}
          onTouchStart={() =>
            (trackRef.current.style.animationPlayState = "paused")
          }
          onTouchEnd={() =>
            (trackRef.current.style.animationPlayState = "running")
          }
        >

          {[...filtered, ...filtered].map((item, index) => (
            <div
              className="food-card"
              key={index}
              onClick={() =>
                navigate(`/product/${item.id}`, { state: item })
              }
            >
              <img
                src={
                  item.image
                    ? `https://e-commerce-app-8jg4.onrender.com${item.image}`
                    : "https://dummyimage.com/150"
                }
                alt={item.name}
                loading="lazy"
              />
              <p>{item.name}</p>
            </div>
          ))}

        </div>
      </div>

      {/* 🍽️ Categories */}
      <div className="categories">
        <div className="cat-card" onClick={() => navigate("/menu")}>🍔 Food</div>
        <div className="cat-card" onClick={() => navigate("/menu")}>🥤 Drinks</div>
        <div className="cat-card" onClick={() => navigate("/menu")}>🥬🍗 Veg & NonVeg</div>
        <div className="cat-card" onClick={() => navigate("/menu")}>🍛 Biryani</div>
      </div>

      <div><p>Order Now 👇🏻✔️</p></div>
          
          {/* 🔥 HERO SLIDER */}
       <div
        className="hero-slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`slide ${i === heroIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <h1>{slide.title}</h1>
              <p>{slide.sub}</p>
              <button onClick={() => navigate("/menu")}>
                Order Now 🍔
              </button>
            </div>
          </div>
        ))}
      </div> 

      <div><p>Visit Again ❤️👇🏻</p></div>

      <About />
      <Footer />

    </motion.div>
  );
}

export default Home;