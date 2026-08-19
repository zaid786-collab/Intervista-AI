import "./Dashboard.css";
import {
  FaFire,
  FaMedal,
  FaStar,
  FaTrophy,
  FaBolt,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth";

const achievements = [
  {
    icon: <FaFire />,
    title: "7 Day Streak",
    desc: "Practiced every day this week",
    color: "#f97316",
  },
  {
    icon: <FaMedal />,
    title: "Top Performer",
    desc: "Scored above 90%",
    color: "#22c55e",
  },
  {
    icon: <FaStar />,
    title: "Challenge Solver",
    desc: "Solved daily algorithmic question",
    color: "#2563eb",
  },
  {
    icon: <FaTrophy />,
    title: "Interview Master",
    desc: "Completed mock interviews",
    color: "#eab308",
  },
];

function Achievements() {
  const { user } = useAuth();
  const xp = user?.xp || 1480;

  return (
    <div className="achievements">
      <div className="achievement-header">
        <h2>🏅 Achievements</h2>

        <div className="xp-card">
          <FaBolt />
          <span>{xp.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="achievement-grid">
        {achievements.map((item, index) => (
          <div className="achievement-card" key={index}>
            <div
              className="achievement-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;