// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductDetails from "./ProductDetails";


// function Food() {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true); // ✅ ADD

//   // 🍔 Fetch Food Data
//   useEffect(() => {
//     axios
//       .get("https://www.themealdb.com/api/json/v1/1/search.php?s=")
//       .then((res) => {
//         const meals = res.data.meals.map((item) => ({
//           id: item.idMeal,
//           title: item.strMeal,
//           name: item.strMeal,
//           image: item.strMealThumb,
//           price: Math.floor(Math.random() * 200) + 100,
//         }));

//         setData(meals);
//         setLoading(false); // ✅ STOP LOADING
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, []);

//   // 🔍 Search Filter
//   const filtered = data.filter((product) =>
//     product.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="food-page">

//       {/* 🔍 Search */}
//       <input
//         type="text"
//         placeholder="Search food...🔍"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="search"
//       />

//       {/* 🍽️ GRID */}
//       <div className="grid">

//         {/* 💀 LOADING SKELETON */}
//         {loading ? (
//           [...Array(6)].map((_, i) => (
//             <div className="skeleton" key={i}></div>
//           ))
//         ) : filtered.length > 0 ? (

//           /* 🍔 REAL DATA */
//           filtered.map((product) => (
//             <ProductDetails key={product.id} product={product} />
//           ))

//         ) : (

//           /* ❌ NO RESULT */
//           <p>No food found 😢</p>

//         )}

//       </div>

//     </div>
//   );
// }

// export default Food;

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

            id: item.idMeal,

            title: item.strMeal,

            name: item.strMeal,

            image: item.strMealThumb,

            price:
              Math.floor(Math.random() * 200) +
              100,
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
        maxWidth: "1500px",
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

          padding: "14px",

          borderRadius: "12px",

          border: "1px solid #ccc",

          marginBottom: "30px",

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

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 320px))",

          justifyContent: "center",

          gap: "28px",

          alignItems: "stretch"
        }}
      >

        {/* 💀 LOADING */}
        {loading ? (

          [...Array(6)].map((_, i) => (

            <div
              className="skeleton"
              key={i}
              style={{

                width: "320px",

                height: "480px",

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
                width: "100%",
                maxWidth: "320px",
                margin: "0 auto"
              }}
            >

              <ProductDetails
                product={product}
              />

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