import { useCart } from "./CartContext";

function Quantity({ item }) {
  const { updateQty } = useCart();

  return (
    <div className="qty">
      <button onClick={() => updateQty(item.id, "dec")}>-</button>
      <span>{item.qty}</span>
      <button onClick={() => updateQty(item.id, "inc")}>+</button>
    </div>
  );
}
export default Quantity;