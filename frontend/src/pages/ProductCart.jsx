import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { getUser } from "../api";
import { imgUrl, labelOf, money, onImgError, setCartCount } from "./shopUtils";
import "./shop.css";
import "./store.css";

const Heart = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2 0 3.6 1 4.7 2.7h1.4c1.1-1.7 2.7-2.7 4.7-2.7 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z" />
  </svg>
);

export const finalPrice = (product) => {
  const base = Number(product.price) || 0;
  const offer = Number(product.offer ?? product.discount ?? 0);
  return offer > 0 ? Math.round((base - (base * offer) / 100) * 100) / 100 : base;
};

function ProductCard({ product, likedIds = [], setLikedIds }) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const user = getUser();
  const offer = Number(product.offer ?? product.discount ?? 0);
  const base = Number(product.price) || 0;
  const final = finalPrice(product);
  const liked = likedIds.includes(product.id);
  const unavailable = product.is_active === false || Number(product.stock) === 0;
  const image = imgUrl(product.image, 500);

  const toggleLike = async () => {
    if (!user) return toast.error("Log in to save dishes");

    const next = !liked;
    setLikedIds?.((ids) => (next ? [...ids, product.id] : ids.filter((id) => id !== product.id)));
    try {
      await api.post(next ? "/add-like/" : "/remove-like/", { id: product.id });
      toast.success(next ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      setLikedIds?.((ids) => (next ? ids.filter((id) => id !== product.id) : [...ids, product.id]));
      toast.error("Could not update your wishlist");
    }
  };

  const addToCart = async () => {
    if (!user) return toast.error("Log in to order");
    setAdding(true);
    try {
      await api.post("/add-cart/", { product_id: product.id });
      const { data } = await api.get("/cart/");
      setCartCount(Array.isArray(data) ? data.length : 0);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Could not add it to the cart");
    } finally {
      setAdding(false);
    }
  };

  const buyNow = () => {
    if (!user) return toast.error("Log in to order");
    navigate("/payment", {
      state: {
        cart: [{
          id: product.id,
          product_id: product.id,
          item_name: product.name,
          image,
          price: final,
          original_price: base,
          offer,
          quantity: 1,
          category: product.category || "Food",
        }],
      },
    });
  };

  return (
    <article className={`pc ${unavailable ? "is-off" : ""}`}>
      <div className="pc-media">
        <Link to={`/product/${product.id}`} state={product} aria-label={`View ${product.name}`}>
          <img src={image} alt={product.name} loading="lazy" onError={onImgError} />
        </Link>
        {offer > 0 && <span className="sh-ribbon">{offer}% off</span>}
        {unavailable && <span className="pc-soldout">Not available</span>}
        <button className={`sh-heart ${liked ? "is-on" : ""}`} onClick={toggleLike} aria-pressed={liked} aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}>
          <Heart filled={liked} />
        </button>
      </div>

      <div className="pc-body">
        <div className="sh-card-meta">
          <span className="sh-pill">{labelOf(product.category || "Food")}</span>
          <span className="sh-rating">★ {Number(product.rating || 4.5).toFixed(1)}</span>
        </div>

        <h3><Link to={`/product/${product.id}`} state={product}>{product.name}</Link></h3>

        <p className="sh-price-line">
          <b>{money(final, offer > 0 ? 2 : 0)}</b>
          {offer > 0 && <s>{money(base)}</s>}
        </p>

        <div className="pc-actions">
          <button className="sh-btn sh-btn-primary" onClick={addToCart} disabled={unavailable || adding}>{adding ? "Adding…" : "Add to cart"}</button>
          <button className="sh-btn sh-btn-ghost" onClick={buyNow} disabled={unavailable}>Buy now</button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
