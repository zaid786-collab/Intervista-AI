import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const authenticatedLinks = [
    { label: "Resources", to: "/resources" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Companies", to: "/companies" },
    { label: "FAQ", to: "/faq" },
    { label: "Analysis", to: "/analysis" },
  ];

  const publicLinks = [
    { label: "FAQ", to: "/faq" },
  ];

  const activeNavLinks = user ? authenticatedLinks : publicLinks;

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <div className="logoBox">✦</div>
        <h2>Intervista AI</h2>
      </Link>

      <button
        type="button"
        className={`navToggle ${isMenuOpen ? "open" : ""}`}
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navMenu ${isMenuOpen ? "open" : ""}`}>
        <ul className="navLinks">
          {activeNavLinks.map(({ label, to }) => (
            <li key={to} className={path === to ? "active-page" : ""}>
              <Link to={to} className="navLinkButton" onClick={closeMenu}>
                {label}
              </Link>
            </li>
          ))}

          {user?.is_admin && (
            <li className={path === "/admin" ? "active-page" : ""}>
              <Link to="/admin" className="navLinkButton" onClick={closeMenu}>
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="navRight">
          {user ? (
            <>
              <Link
                to="/profile"
                className={path === "/profile" ? "profileBtn active-page" : "profileBtn"}
                onClick={closeMenu}
              >
                Profile
              </Link>
              <button type="button" className="loginBtn" onClick={handleLogout}>
                Log out
              </button>
              <Link
                to="/dashboard"
                className="startBtn"
                onClick={closeMenu}
              >
                Start Interview
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={path === "/login" ? "loginBtn active-page" : "loginBtn"}
                onClick={closeMenu}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className={path === "/signup" ? "startBtn active-page" : "startBtn"}
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;