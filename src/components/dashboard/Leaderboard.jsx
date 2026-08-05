import "./Dashboard.css";
import {
  FaMedal,
  FaArrowUp
} from "react-icons/fa";

const users = [
  {
    rank: 1,
    name: "Rahul Sharma",
    score: "96%",
    badge: "🥇"
  },
  {
    rank: 2,
    name: "Zaid Khan",
    score: "92%",
    badge: "🥈"
  },
  {
    rank: 3,
    name: "Priya Singh",
    score: "90%",
    badge: "🥉"
  },
  {
    rank: 4,
    name: "Aman Gupta",
    score: "88%",
    badge: "🏅"
  },
  {
    rank: 5,
    name: "Neha Verma",
    score: "84%",
    badge: "🏅"
  }
];

function Leaderboard() {

  return (

    <div className="leaderboard">

      <div className="leaderboard-header">

        <h2>🏆 Weekly Leaderboard</h2>

        <button className="view-btn">
          View All
        </button>

      </div>

      {users.map((user) => (

        <div
          className="leader-item"
          key={user.rank}
        >

          <div className="leader-left">

            <div className="leader-rank">
              {user.badge}
            </div>

            <div>

              <h3>{user.name}</h3>

              <small>Interview Performance</small>

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