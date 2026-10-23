import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="lg-footer">
      <div className="lg-footer-inner">
        <div className="lg-footer-brand">
          <Link to="/" className="lg-logo" aria-label="Legend home">
            <span className="lg-logo-mark">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
              </svg>
            </span>
            Legend
          </Link>
          <p>Hot food from your favourite kitchens, tracked to your door.</p>
        </div>

        <nav className="lg-footer-links" aria-label="Footer">
          <Link to="/menu">Menu</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/herobanner">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="lg-socials">
          <a href="https://github.com/antonyvenis" target="_blank" rel="noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github" />
          </a>
          <a href="https://linkedin.com/in/antony-venis-t" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in" />
          </a>
        </div>
      </div>

      <p className="lg-footer-copy">© 2026 Legend. Built with Django REST Framework and React.</p>
    </footer>
  );
}

export default Footer;
