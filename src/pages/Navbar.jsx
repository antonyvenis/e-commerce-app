import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const updateCartCount = () => {
    const count = Number(localStorage.getItem("cartCount")) || 0;
    setCartCount(count);
  };

  const logout = () => {
    // localStorage.removeItem("user");
    navigate("/logout");
    // alert("Logged out");
  };

  /* =========================
     🔥 DARK MODE
  ========================= */
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  /* =========================
     🔥 CART COUNT (FAST FIX)
  ========================= */
  useEffect(() => {
    updateCartCount(); // initial load

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);


  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="nav">

        <h2><Link to="/profile" id="Link-text">⚡<span className="App-Name">𝓛𝓮𝓰𝓮𝓷𝓭</span><sup>💫</sup>⚡</Link></h2>

        {/* 🍔 Menu */}
        <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* 📱 Menu */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <button onClick={() => setDark(!dark)}>
                     {dark ? "☀️" : "🌙"}
        </button>

          <Link to="/" onClick={() => setMenuOpen(false)}>🏠Home</Link>

          <Link to="/menu" onClick={() => setMenuOpen(false)}>🍛Foods</Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            🛒Cart({cartCount})
          </Link>

          <Link to="/liked" onClick={() => setMenuOpen(false)}>
            ❤️Wishlist
          </Link>

          <Link to="/orders" onClick={() => setMenuOpen(false)}>
            📦Orders
          </Link>

          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            👤 {user?.name || "Profile"}
          </Link>

          {!user && (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              🔐Login
            </Link>
          )}

          {user && (
            <span className="logout-btn">
             <Link to="/logout" onClick={() => setMenuOpen(false)}>🚪Logout </Link>
            </span>
          )}
        </div>
      </nav>

      {/* 🔥 OVERLAY ADD HERE */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;
