import "./Navbar.css";

function Navbar({
  onGoHome,
  onOpenDashboard,
  onOpenPricing,
  onOpenFaq,
  onOpenLogin,
  onOpenSignup,
  user,
  onLogout,
}) {
  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={onGoHome}
        style={{ cursor: "pointer" }}
      >
        <div className="logoBox">✦</div>
        <h2>Intervista AI</h2>
      </div>

      <div className="navMenu">
        <ul className="navLinks">
          <li>Resources</li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenDashboard}
            >
              Dashboard
            </button>
          </li>

          <li>Companies</li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenPricing}
            >
              Pricing
            </button>
          </li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenFaq}
            >
              FAQ
            </button>
          </li>
        </ul>

        <div className="navRight">
          {user ? (
            <>
              <span className="navUser">Hi, {user.name}</span>

              <button
                type="button"
                className="loginBtn"
                onClick={onLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="loginBtn"
              onClick={onOpenLogin}
            >
              Log in
            </button>
          )}

          <button
            type="button"
            className="startBtn"
            onClick={onOpenSignup}
          >
            Start free interview
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;