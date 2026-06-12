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
import HeroBanner from "./HeroBanner";

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
  { image: "https://img.magnific.com/premium-photo/flying-chicken-biryani-spicy-indian-hyderabadi-biryani-generative-ai_21085-36430.jpg?w=2000", title: "🔥 Biryani Special", sub: "Hot & spicy", loading:"lazy"},
  { image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65", title: "🍕 Pizza Blast", sub: "Cheesy love",loading:"lazy" },
  { image: "https://images.unsplash.com/photo-1550547660-d9450f859349", title: "🍔 Burger King", sub: "Juicy bites",loading:"lazy" },
  { image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87", title: "🥤 Cool Drinks", sub: "Chill refresh",loading:"lazy" },
  { image: "https://img.magnific.com/free-photo/boneless-chicken-with-fries-top-view_23-2149972943.jpg?semt=ais_hybrid", title: "🍗 Chicken Fry", sub: "Crispy & tasty" ,loading:"lazy"},
  { image: "https://static.vecteezy.com/system/resources/previews/027/679/809/large_2x/side-anglegraphy-of-delicious-noodles-in-white-background-photo.jpg", title: "🍜 Noodles", sub: "Street style" ,loading:"lazy"},
  { image: "https://st2.depositphotos.com/1354142/7950/i/950/depositphotos_79501054-stock-photo-south-indian-meals-served-on.jpg", title: "🍛 Meals", sub: "Full meals",loading:"lazy" },
  { image: "https://i.pinimg.com/originals/0f/13/7d/0f137d2a243f7b63e5716ab4c10c3ee3.jpg", title: "🥗 Veg Special", sub: "Healthy",loading:"lazy" },
  { image: "https://images.unsplash.com/photo-1551024601-bec78aea704b", title: "🍰 Desserts", sub: "Sweet treat",loading:"lazy" },
  { image: "https://wallpaperaccess.com/full/1401021.jpg", title: "🥘 Chinese", sub: "Rich taste",loading:"lazy" },
  { image: "https://wallpapercave.com/wp/wp6818614.jpg", title: "🍖 BBQ", sub: "Smoky flavor",loading:"lazy" },
  { image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0", title: "🍞 Breakfast", sub: "Start fresh",loading:"lazy" },
  { image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054", title: "🍹 Juice", sub: "Natural energy",loading:"lazy" },
  { image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092", title: "🔥 Combo Offers", sub: "Save big",loading:"lazy" }
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

          {/* <div className="search-box">
            <input
              type="text"
              placeholder="Search for food...🔍"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Link to="/menu">
              <button>Search</button>
            </Link>
          </div> */}

          {/* 🔍 SEARCH BOX */}
  <div className="search-box">

  <input
    type="text"
    placeholder="Search for food... 🔍"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        navigate("/menu");
      }
    }}
  />

  <button
    className="search-btn"
    onClick={() => navigate("/menu")}
  >
    Search
  </button>

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
      {/* <div style={{ textAlign: "center", margin: "15px" }}>
        <button onClick={() => setSpeed(speed === "slow" ? "fast" : "slow")}>
          {speed === "slow" ? "✨ Slow" : "⚡ Fast"}
        </button>
      </div> */}

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
              {/* <img
                src={
                  item.image
                    ? `https://e-commerce-app-8jg4.onrender.com+${item.image}`
                    : "https://dummyimage.com/150"
                }
                alt={item.name}
                loading="lazy"
              /> */}
              <img
             src={
              item.image
              ? item.image.startsWith("http")
              ? item.image.replace('/upload/', '/upload/w_300,q_auto,f_auto/')
              : `https://e-commerce-app-8jg4.onrender.com${item.image}`
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
      <HeroBanner />
      <About />
      <Footer />

    </motion.div>
  );
}

export default Home;