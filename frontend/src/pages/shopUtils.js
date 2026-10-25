import { API_BASE } from "../api";

export const GST_RATE = 0.05;
export const FREE_DELIVERY_ABOVE = 199;
export const DELIVERY_FEE = 40;

export const money = (n, decimals = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(n) || 0);

// Same maths the server uses in place_order() and the invoice
export const breakdown = (subtotal) => {
  const tax = subtotal * GST_RATE;
  const delivery = subtotal > FREE_DELIVERY_ABOVE || subtotal === 0 ? 0 : DELIVERY_FEE;
  return { subtotal, tax, delivery, total: subtotal + tax + delivery };
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%' height='100%' fill='#eef0f7'/><text x='50%' y='58%' font-size='96' text-anchor='middle'>🍽️</text></svg>"
  );

export const imgUrl = (src, width = 400) => {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("http")) return src.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
  return `${API_BASE}${src}`;
};

export const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER;
};

export const STATUSES = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

export const setCartCount = (n) => {
  localStorage.setItem("cartCount", String(n));
  window.dispatchEvent(new Event("cartUpdated"));
};

const CATEGORY_LABELS = {
  veg: "Veg",
  "non-veg": "Non-veg",
  drinks: "Cool drinks",
  "side-dish": "Side dish",
  "comming-soon": "Coming soon",
};
export const labelOf = (key = "Food") => CATEGORY_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
