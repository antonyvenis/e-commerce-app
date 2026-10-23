import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getUser } from "../api";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/liked", label: "Wishlist" },
  { to: "/orders", label: "Orders" },
];

const HIDDEN_ON = ["/login", "/register", "/otp", "/forgot-password"];

const Bolt = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.1L21 8H6" />
  </svg>
);

const ThemeIcon = ({ dark }) =>
  dark ? (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  );

function Navbar() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(Number(localStorage.getItem("cartCount")) || 0);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  // re-render when someone logs in / out (api.js fires "auth:changed")
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("auth:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const update = () => setCartCount(Number(localStorage.getItem("cartCount")) || 0);
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile drawer after every navigation
  useEffect(() => setMenuOpen(false), [location.pathname]);

  if (HIDDEN_ON.includes(location.pathname)) return null;

  const links = user?.role === "admin" ? [...LINKS, { to: "/upload", label: "Admin" }] : LINKS;
  const initial = (user?.username || "?").charAt(0).toUpperCase();

  return (
    <header className={`lg-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="lg-nav-inner">
        <Link to="/" className="lg-logo" aria-label="Legend home">
          <span className="lg-logo-mark"><Bolt /></span>
          Legend
        </Link>

        <nav className="lg-links" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `lg-link ${isActive ? "is-active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="lg-actions">
          <button className="lg-icon-btn" onClick={() => setDark((d) => !d)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            <ThemeIcon dark={dark} />
          </button>

          <Link to="/cart" className={`lg-cart ${location.pathname === "/cart" ? "active" : ""}`} aria-label={`Cart, ${cartCount} items`}>
            <CartIcon />
            <span>Cart</span>
            {cartCount > 0 && <span className="lg-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="lg-user" aria-label="Your profile">
                <span className="lg-avatar">{initial}</span>
                <span className="lg-username">{user.username}</span>
              </Link>
              <Link to="/logout" className="lg-btn lg-btn-ghost">Log out</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="lg-btn lg-btn-ghost">Log in</Link>
              <Link to="/register" className="lg-btn lg-btn-solid">Sign up</Link>
            </>
          )}

          <button className="lg-icon-btn lg-burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg-drawer">
          <nav aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `lg-link ${isActive ? "is-active" : ""}`}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/profile" className="lg-link">Profile</NavLink>
                <NavLink to="/logout" className="lg-link">Log out</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="lg-link">Log in</NavLink>
                <NavLink to="/register" className="lg-link">Sign up</NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
