import "./Dashboard.css";
import {
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaUserCircle
} from "react-icons/fa";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className="navbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search interviews..."
        />
      </div>

      <div className="nav-right">

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="notification">

          <FaBell />

          <span className="badge">3</span>

        </div>

        <div className="profile">

          <FaUserCircle />

          <div>

            <h4>Zaid Khan</h4>

            <p>AI Interview Coach</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Navbar;