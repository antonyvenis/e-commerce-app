import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUser, logout as endSession } from "../api";

function Logout() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  // read the user BEFORE the session is cleared
  const user = getUser();

  const logout = async () => {
    setBusy(true);
    await endSession(); // blacklists the refresh token on the server, then clears local data
    toast.success("Logged out. See you soon!");
    navigate("/login");
  };

  return (
    <section className="logout-card">
      <h1>Log out{user ? `, ${user.username}` : ""}?</h1>
      <p>You will need to log in again to see your cart, wishlist and orders.</p>

      <div className="logout-actions">
        <button onClick={logout} disabled={busy}>{busy ? "Logging out…" : "Log out"}</button>
        <button className="logout-cancel" onClick={() => navigate(-1)} disabled={busy}>Stay logged in</button>
      </div>
    </section>
  );
}

export default Logout;
