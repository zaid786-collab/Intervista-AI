import { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaArrowUp, FaTrophy } from "react-icons/fa";
import { getToken } from "../../api";

const DEFAULT_BOARD = [
  { rank: 1, name: "Sarah Chen", score: "96%", badge: "🥇" },
  { rank: 2, name: "Alex Rivera", score: "94%", badge: "🥈" },
  { rank: 3, name: "Priya Sharma", score: "92%", badge: "🥉" },
  { rank: 4, name: "Michael Zhang", score: "89%", badge: "🏅" },
  { rank: 5, name: "David Kim", score: "88%", badge: "🏅" },
];

function Leaderboard() {
  const [board, setBoard] = useState(DEFAULT_BOARD);

  useEffect(() => {
    const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
    const token = getToken();

    for (const base of candidateBases) {
      fetch(`${base}/api/leaderboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setBoard(
              data.slice(0, 5).map((u, i) => ({
                rank: i + 1,
                name: u.name,
                score: `${u.avg_score || 90}%`,
                badge: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏅",
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Top Candidates</h2>
        <span style={{ fontSize: "12px", color: "var(--text-muted, #94a3b8)" }}>
          Global Ranking
        </span>
      </div>

      {board.map((user) => (
        <div className="leader-item" key={user.rank}>
          <div className="leader-left">
            <div className="leader-rank">{user.badge}</div>
            <div>
              <h3>{user.name}</h3>
              <small>Interview Rating</small>
            </div>
          </div>

          <div className="leader-score">
            <FaArrowUp />
            <span>{user.score}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;