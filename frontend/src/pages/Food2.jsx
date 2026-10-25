import { useEffect, useState } from "react";
import axios from "axios";
import ExploreGrid from "./ExploreGrid";

function Food2() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    axios.get("https://dummyjson.com/recipes")
      .then(({ data }) => {
        if (!alive) return;
        setItems((data.recipes || []).map((r) => ({
          id: `recipe-${r.id}`,
          name: r.name,
          image: r.image,
          tag: r.cuisine || "International",
          sub: r.mealType?.[0] || r.difficulty,
          rating: Number(r.rating) || 4.5,
          time: (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0) || 30,
        })));
      })
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <ExploreGrid
      eyebrow="Recipes"
      title="Recipe ideas for"
      accent="every mood"
      subtitle="Pick a cuisine, see how long a dish takes and save your favourites. Hungry already? Jump straight to our menu."
      items={items}
      loading={loading}
      failed={failed}
    />
  );
}

export default Food2;
