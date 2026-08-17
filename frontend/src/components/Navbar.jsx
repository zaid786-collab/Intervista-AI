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
  onOpenProfile,
  onOpenAdmin,
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

        {/* Navigation Links */}
        <ul className="navLinks">

          <li className={currentPage === "resources" ? "active-page" : ""}>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenResources}
            >
              Resources
            </button>
          </li>

          <li className={currentPage === "dashboard" ? "active-page" : ""}>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenDashboard}
            >
              Dashboard
            </button>
          </li>

          <li className={currentPage === "companies" ? "active-page" : ""}>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenCompanies}
            >
              Companies
            </button>
          </li>

          <li className={currentPage === "pricing" ? "active-page" : ""}>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenPricing}
            >
              Pricing
            </button>
          </li>

          <li className={currentPage === "faq" ? "active-page" : ""}>
            <button
              type="button"
              className="navLinkButton"
              onClick={onOpenFaq}
            >
              FAQ
            </button>
          </li>

          {user?.is_admin && (
            <li className={currentPage === "admin" ? "active-page" : ""}>
              <button
                type="button"
                className="navLinkButton"
                onClick={onOpenAdmin}
              >
                Admin
              </button>
            </li>
          )}

        </ul>


<div className="navRight">

 <button
type="button"
  className="startBtn"
  onClick={onOpenProfile}
>
  Profile
</button>

  {user ? (
    <button
      type="button"
      className="loginBtn"
      onClick={onLogout}
    >
      Log out
    </button>
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