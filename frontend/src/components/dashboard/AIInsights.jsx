import "./Dashboard.css";
import {
  FaRobot,
  FaSmile,
  FaLightbulb,
  FaArrowUp,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";

function AIInsights({ metrics }) {
  const { user } = useAuth();
  const avgScore = parseInt(metrics?.avg_score || "78", 10) || 78;
  const bestScore = parseInt(metrics?.best_score || "92", 10) || 92;

  const confidenceScore = Math.min(avgScore + 5, 96);
  const communicationRating = avgScore >= 85 ? "Exceptional" : avgScore >= 75 ? "Very Good" : "Improving";
  const recommendation =
    user?.target_role === "Frontend Developer"
      ? "Practice React Concurrent Features & Web Performance"
      : user?.target_role === "Backend Developer"
      ? "Focus on Database Indexing & Distributed Caching"
      : "Practice DSA & High-Level System Design";

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
          <p>{confidenceScore}%</p>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-icon">
          <FaLightbulb />
        </div>

        <div>
          <h3>Communication</h3>
          <p>{communicationRating}</p>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-icon">
          <FaArrowUp />
        </div>

        <div>
          <h3>Recommendation</h3>
          <p>{recommendation}</p>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;