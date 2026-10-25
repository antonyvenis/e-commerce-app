import { useEffect, useState } from "react";
import axios from "axios";
import ExploreGrid from "./ExploreGrid";

// Prices and ratings used to be random on every render. Derive them from the id so they stay put.
const seeded = (id, min, max) => {
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return min + (h % (max - min + 1));
};

function Food() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then(({ data }) => {
        if (!alive) return;
        setItems((data.meals || []).map((m) => ({
          id: `meal-${m.idMeal}`,
          name: m.strMeal,
          image: m.strMealThumb,
          tag: m.strArea || "International",
          sub: m.strCategory,
          rating: seeded(m.idMeal, 38, 49) / 10,
          time: seeded(`t${m.idMeal}`, 12, 45),
        })));
      })
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <ExploreGrid
      eyebrow="Explore"
      title="Dishes from around"
      accent="the world"
      subtitle="Browse ideas from kitchens across the globe, save the ones you love, then find the closest dish on our menu."
      items={items}
      loading={loading}
      failed={failed}
    />
  );
}

export default Food;
