import "./Dashboard.css";
import { useAuth } from "../../context/useAuth";

function Welcome() {
  const { user } = useAuth();
  const displayName = user?.name ? `, ${user.name}` : "";

  const handleStart = () => {
    const el = document.getElementById("mock-interview");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="welcome">
      <h1>
        <span>Welcome Back{displayName}</span>
      </h1>
      <p style={{ marginTop: "6px", color: "#94a3b8" }}>
        <span>Ready to practice with AI and crush your next technical interview?</span>
      </p>

      <button className="start-btn" onClick={handleStart} type="button">
        + Start New Interview
      </button>
    </div>
  );
}

export default Welcome;