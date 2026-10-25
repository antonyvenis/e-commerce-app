// Small helpers + icons shared by Home, Cart, Wishlist and Orders.
import { API_BASE } from "../api";

export const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);

export const money2 = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffe3d1'/><stop offset='1' stop-color='#ffc9a3'/></linearGradient></defs><rect width='400' height='300' fill='url(#g)'/><text x='200' y='170' font-size='84' text-anchor='middle'>🍽️</text></svg>"
  );

// Cloudinary urls get a small, optimised version; relative paths get the API host.
export const imgUrl = (image, width = 480) => {
  if (!image) return PLACEHOLDER;
  if (image.startsWith("http")) return image.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
  return `${API_BASE}${image}`;
};

export const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER;
};

export const Stars = ({ value = 0 }) => {
  const full = Math.round(Number(value) || 0);
  return (
    <span className="sx-stars" aria-label={`${Number(value).toFixed(1)} out of 5`}>
      {"★★★★★".split("").map((s, i) => (
        <i key={i} className={i < full ? "on" : ""}>★</i>
      ))}
      <b>{Number(value) ? Number(value).toFixed(1) : "New"}</b>
    </span>
  );
};

const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const Icon = {
  heart: (p) => <svg {...base} {...p}><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.6 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.3 0 5.3 3.1 4.1 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" /></svg>,
  heartFill: (p) => <svg {...base} fill="currentColor" {...p}><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.6 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.3 0 5.3 3.1 4.1 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" /></svg>,
  trash: (p) => <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>,
  cart: (p) => <svg {...base} {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.1L21 8H6" /></svg>,
  plus: (p) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>,
  minus: (p) => <svg {...base} {...p}><path d="M5 12h14" /></svg>,
  search: (p) => <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>,
  pin: (p) => <svg {...base} {...p}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.4" /></svg>,
  bolt: (p) => <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>,
  check: (p) => <svg {...base} strokeWidth={2.6} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>,
  file: (p) => <svg {...base} {...p}><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6" /></svg>,
  chevron: (p) => <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>,
  shield: (p) => <svg {...base} {...p}><path d="M12 3 4.5 6v5.5c0 4.5 3.1 8 7.5 9.5 4.4-1.5 7.5-5 7.5-9.5V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>,
  truck: (p) => <svg {...base} {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>,
  bag: (p) => <svg {...base} {...p}><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" /></svg>,
};
