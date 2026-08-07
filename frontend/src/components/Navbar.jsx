import "./Navbar.css";

function Navbar({
  onOpenHome,
  onOpenResources,
  onOpenDashboard,
  onOpenCompanies,
  onOpenPricing,
  onOpenFaq,
  onOpenLogin,
  onOpenSignup,
  user,
  onLogout,
  currentPage,
}) {
  return (
    <nav className="navbar">

      {/* Logo */}
      <button
        type="button"
        className="logo"
        onClick={onOpenHome}
      >
        <div className="logoBox">✦</div>
        <h2>Intervista AI</h2>
      </button>

      <div className="navMenu">

        <ul className="navLinks">

          {/* Resources */}
          <li
            className={
              currentPage === "resources"
                ? "active-page"
                : ""
            }
          >
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenResources}
            >
              Resources
            </button>
          </li>

          {/* Dashboard */}
          <li
            className={
              currentPage === "dashboard"
                ? "active-page"
                : ""
            }
          >
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenDashboard}
            >
              Dashboard
            </button>
          </li>

          {/* Companies */}
          <li
  className={
    currentPage === "companies"
      ? "active-page"
      : ""
  }
>
  <button
    type="button"
    className="navLinkButton"
    onClick={onOpenCompanies}
  >
    Companies
  </button>
</li>

          {/* Pricing */}
          <li
            className={
              currentPage === "pricing"
                ? "active-page"
                : ""
            }
          >
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenPricing}
            >
              Pricing
            </button>
          </li>

          {/* FAQ */}
          <li
            className={
              currentPage === "faq"
                ? "active-page"
                : ""
            }
          >
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
              <span className="navUser">
                Hi, {user.name}
              </span>

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