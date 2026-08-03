import "./Dashboard.css";
import {
  FaRobot,
  FaSmile,
  FaLightbulb,
  FaArrowUp
} from "react-icons/fa";

function AIInsights() {
  return (
    <div className="ai-insights">

      <h2>
        <FaRobot /> AI Insights
      </h2>

      <div className="insight-card">

        <div className="insight-icon">
          <FaSmile />
        </div>

        <div>
          <h3>Confidence Score</h3>
          <p>88%</p>
        </div>

      </div>

      <div className="insight-card">

        <div className="insight-icon">
          <FaLightbulb />
        </div>

        <div>
          <h3>Communication</h3>
          <p>Very Good</p>
        </div>

      </div>

      <div className="insight-card">

        <div className="insight-icon">
          <FaArrowUp />
        </div>

        <div>
          <h3>Recommendation</h3>
          <p>Practice DSA & System Design</p>
        </div>

      </div>

    </div>
  );
}

export default AIInsights;