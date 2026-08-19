import "./Dashboard.css";

function Welcome({ userName, totalInterviews = 0, onStartInterview }) {
  const handleStart = () => {
    if (onStartInterview) {
      onStartInterview();
    } else {
      const el = document.getElementById("mock-interview");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="welcome">
      <h1>
        <span>Welcome Back{userName ? `, ${userName}` : ""}</span>
      </h1>
      <p>
        <span>
          {totalInterviews === 0
            ? "Ready to begin your journey? Complete your first AI mock interview below to see live stats & skill ratings!"
            : `You have completed ${totalInterviews} mock interview session${totalInterviews > 1 ? "s" : ""}. Keep pushing to improve your score!`}
        </span>
      </p>

      <button className="start-btn" onClick={handleStart}>
        + Start New Interview
      </button>
    </div>
  );
}

export default Welcome;