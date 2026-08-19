import { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaArrowUp, FaTrophy } from "react-icons/fa";
import { fetchLeaderboard } from "../../api";

const defaultUsers = [
  { rank: 1, name: "Rahul Sharma", score: "96%", badge: "🥇", xp: 2450 },
  { rank: 2, name: "Zaid Khan", score: "94%", badge: "🥈", xp: 2180 },
  { rank: 3, name: "Priya Singh", score: "90%", badge: "🥉", xp: 1950 },
  { rank: 4, name: "Aman Gupta", score: "88%", badge: "🏅", xp: 1720 },
  { rank: 5, name: "Neha Verma", score: "84%", badge: "🏅", xp: 1560 },
];

function Leaderboard() {
  const [users, setUsers] = useState(defaultUsers);

  useEffect(() => {
    let isMounted = true;
    fetchLeaderboard()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setUsers(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>
          <FaTrophy style={{ color: "#eab308", marginRight: "6px" }} />
          Weekly Leaderboard
        </h2>

        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Top Candidates</span>
      </div>

      {users.map((user) => (
        <div
          className="leader-item"
          key={user.rank}
          style={{
            background: user.is_current_user ? "rgba(59,130,246,0.12)" : undefined,
            borderLeft: user.is_current_user ? "3px solid #3b82f6" : undefined,
          }}
        >
          <div className="leader-left">
            <div className="leader-rank">{user.badge}</div>

            <div>
              <h3>
                {user.name} {user.is_current_user && <span style={{ color: "#38bdf8", fontSize: "11px" }}>(You)</span>}
              </h3>
              <small>{user.xp ? `${user.xp} XP • Interview Performance` : "Interview Performance"}</small>
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