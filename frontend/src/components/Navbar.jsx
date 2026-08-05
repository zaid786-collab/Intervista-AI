import "./Navbar.css";

function Navbar({
  onGoHome,
  onOpenDashboard,
  onOpenCompanies,
  onOpenPricing,
  onOpenFaq,
  onOpenLogin,
  onOpenSignup,
  onLogout,
  user,
}) {
  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={() => {
          console.log("Home Click");
          onGoHome();
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="logoBox">✦</div>
        <h2>Intervista AI</h2>
      </div>

      <div className="navMenu">
        <ul className="navLinks">
          <li>
            <button type="button" className="navLinkButton">
              Resources
            </button>
          </li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={() => {
                console.log("Dashboard Click");
                onOpenDashboard();
              }}
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={() => {
                console.log("Companies Click");
                onOpenCompanies();
              }}
            >
              Companies
            </button>
          </li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={() => {
                console.log("Pricing Click");
                onOpenPricing();
              }}
            >
              Pricing
            </button>
          </li>

          <li>
            <button
              type="button"
              className="navLinkButton"
              onClick={() => {
                console.log("FAQ Click");
                onOpenFaq();
              }}
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