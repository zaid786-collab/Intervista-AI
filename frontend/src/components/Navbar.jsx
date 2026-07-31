import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logoBox">✦</div>
        <h2>Intervista AI</h2>
      </div>

      <div className="navMenu">
        <ul className="navLinks">
          <li>Product</li>
          <li>Dashboard</li>
          <li>Stories</li>
          <li>Pricing</li>
          <li>FAQ</li>
        </ul>

        <div className="navRight">
          <a href="/" className="loginBtn">
            Log in
          </a>

          <button className="startBtn">
            Start free interview
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;