import { useEffect, useState } from "react";
import axios from "axios";
import ProductDetails from "./ProductDetails";

function Food() {

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  /* =========================================================
     🍔 FETCH FOOD DATA
  ========================================================= */
  useEffect(() => {

    axios
      .get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      )

      .then((res) => {

        const meals = res.data.meals.map(
          (item) => ({

            // ✅ UNIQUE ID
            id: `meal-${item.idMeal}`,

            title: item.strMeal,

            name: item.strMeal,

            image: item.strMealThumb,

            // ✅ RANDOM PRICE
            price:
              Math.floor(Math.random() * 300) +
              120,

            // ✅ CATEGORY
            category:
              item.strCategory || "Food",

            // ✅ AREA / CUISINE
            cuisine:
              item.strArea || "International",

            // ✅ RANDOM RATING
            rating:
              (Math.random() * 2 + 3).toFixed(1),

            // ✅ RANDOM TIME
            timing:
              Math.floor(Math.random() * 40) +
              10,
          })
        );

        setData(meals);

        setLoading(false);

      })

      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);

  /* =========================================================
     🔍 SEARCH FILTER
  ========================================================= */
  const filtered = data.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* =========================================================
     🎨 UI
  ========================================================= */
  return (

    <div
      className="food-page"
      style={{
        padding: "20px",
        maxWidth: "1700px",
        margin: "0 auto"
      }}
    >

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search food... 🔍"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="search"
        style={{

          width: "100%",

          padding: "15px",

          borderRadius: "14px",

          border: "1px solid #ccc",

          marginBottom: "35px",

          fontSize: "16px",

          outline: "none",

          boxSizing: "border-box"
        }}
      />

      {/* 🍽️ GRID */}
      <div
        className="grid"
        style={{

          display: "grid",

          // ✅ 4 OR 5 CARDS DESKTOP
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",

          gap: "28px",

          alignItems: "stretch"
        }}
      >

        {/* 💀 LOADING */}
        {loading ? (

          [...Array(8)].map((_, i) => (

            <div
              className="skeleton"
              key={i}
              style={{

                width: "100%",

                height: "500px",

                borderRadius: "20px",

                background:
                  "linear-gradient(90deg,#f0f0f0,#e0e0e0,#f0f0f0)",

                backgroundSize: "200% 100%",

                animation:
                  "loading 1.5s infinite"
              }}
            ></div>

          ))

        ) : filtered.length > 0 ? (

          /* 🍔 REAL DATA */
          filtered.map((product) => (

            <div
              key={product.id}
              style={{

                background: "#fff",

                borderRadius: "20px",

                overflow: "hidden",

                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.1)",

                transition: "0.3s",

                minHeight: "520px",

                display: "flex",

                flexDirection: "column"
              }}
            >

              {/* 🖼️ IMAGE */}
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                style={{

                  width: "100%",

                  height: "230px",

                  objectFit: "cover"
                }}
              />

              {/* 📦 DETAILS */}
              <div
                style={{

                  padding: "18px",

                  display: "flex",

                  flexDirection: "column",

                  flex: 1
                }}
              >

                <h2
                  style={{

                    fontSize: "24px",

                    fontWeight: "bold",

                    marginBottom: "10px",

                    color: "#222"
                  }}
                >
                  {product.name}
                </h2>

                {/* 🍽️ CATEGORY */}
                <p
                  style={{
                    color: "#666",
                    marginBottom: "8px"
                  }}
                >
                  🍽️ {product.category}
                </p>

                {/* 🌍 CUISINE */}
                <p
                  style={{
                    color: "#666",
                    marginBottom: "8px"
                  }}
                >
                  🌍 {product.cuisine}
                </p>

                {/* ⭐ RATING */}
                <p
                  style={{
                    color: "#666",
                    marginBottom: "8px"
                  }}
                >
                  ⭐ {product.rating}
                </p>

                {/* ⏱️ TIME */}
                <p
                  style={{
                    color: "#666",
                    marginBottom: "14px"
                  }}
                >
                  ⏱️ {product.timing} mins
                </p>

                {/* 💰 PRICE */}
                <p
                  style={{

                    fontSize: "30px",

                    fontWeight: "bold",

                    color: "#ff6600",

                    marginBottom: "20px"
                  }}
                >
                  ₹{product.price}
                </p>

                {/* 🛒 PRODUCT CARD */}
                <div style={{ marginTop: "auto" }}>
                  <ProductDetails
                    product={product}
                  />
                </div>

              </div>

            </div>

          ))

        ) : (

          /* ❌ NO RESULT */
          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%"
            }}
          >
            No food found 😢
          </p>

        )}

      </div>

      {/* 🔥 LOADING ANIMATION */}
      <style>
        {`
          @keyframes loading {

            0% {
              background-position: 200% 0;
            }

            100% {
              background-position: -200% 0;
            }
          }

          /* 📱 MOBILE */
          @media (max-width: 768px) {

            .grid {
              grid-template-columns: 1fr !important;
            }

          }
        `}
      </style>

    </div>
  );
}

export default Food;