import { useEffect, useState } from "react";
import axios from "axios";
import ProductDetails from "./ProductDetails";


function Food() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // ✅ ADD

  // 🍔 Fetch Food Data
  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then((res) => {
        const meals = res.data.meals.map((item) => ({
          id: item.idMeal,
          title: item.strMeal,
          name: item.strMeal,
          image: item.strMealThumb,
          price: Math.floor(Math.random() * 200) + 100,
        }));

        setData(meals);
        setLoading(false); // ✅ STOP LOADING
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // 🔍 Search Filter
  const filtered = data.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="food-page">

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search food...🔍"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {/* 🍽️ GRID */}
      <div className="grid">

        {/* 💀 LOADING SKELETON */}
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div className="skeleton" key={i}></div>
          ))
        ) : filtered.length > 0 ? (

          /* 🍔 REAL DATA */
          filtered.map((product) => (
            <ProductDetails key={product.id} product={product} />
          ))

        ) : (

          /* ❌ NO RESULT */
          <p>No food found 😢</p>

        )}

      </div>

    </div>
  );
}

export default Food;