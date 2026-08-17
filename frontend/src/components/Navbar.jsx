import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <div className="logoBox">✦</div>
        <h2>Intervista AI</h2>
      </Link>

      <div className="navMenu">
        {/* Navigation Links */}
        <ul className="navLinks">
          <li className={path === "/resources" ? "active-page" : ""}>
            <Link
              to="/resources"
              className="navLinkButton"
            >
              Resources
            </Link>
          </li>

          <li className={path === "/dashboard" ? "active-page" : ""}>
            <Link
              to="/dashboard"
              className="navLinkButton"
            >
              Dashboard
            </Link>
          </li>

          <li className={path === "/companies" ? "active-page" : ""}>
            <Link
              to="/companies"
              className="navLinkButton"
            >
              Companies
            </Link>
          </li>

          <li className={path === "/pricing" ? "active-page" : ""}>
            <Link
              to="/pricing"
              className="navLinkButton"
            >
              Pricing
            </Link>
          </li>

          <li className={path === "/faq" ? "active-page" : ""}>
            <Link
              to="/faq"
              className="navLinkButton"
            >
              FAQ
            </Link>
          </li>

          {user?.is_admin && (
            <li className={path === "/admin" ? "active-page" : ""}>
              <Link
                to="/admin"
                className="navLinkButton"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="navRight">
          {/* Profile button */}
          <Link
            to="/profile"
            className={path === "/profile" ? "profileBtn active-page" : "profileBtn"}
          >
            Profile
          </Link>

          {user ? (
            <button
              type="button"
              className="loginBtn"
              onClick={handleLogout}
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className={path === "/login" ? "loginBtn active-page" : "loginBtn"}
            >
              Log in
            </Link>
          )}

          {/* Start Interview button */}
          <Link
            to={user ? "/dashboard" : "/signup"}
            className={path === "/signup" ? "startBtn active-page" : "startBtn"}
          >
            Start Interview
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;