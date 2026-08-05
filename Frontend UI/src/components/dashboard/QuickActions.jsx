import "./Dashboard.css";
import {
  FaPlay,
  FaUpload,
  FaMicrophone,
  FaChartBar,
  FaComments,
  FaCog
} from "react-icons/fa";

const actions = [
  {
    title: "Start Interview",
    icon: <FaPlay />,
    color: "#2563eb"
  },
  {
    title: "Upload Resume",
    icon: <FaUpload />,
    color: "#22c55e"
  },
  {
    title: "Voice Practice",
    icon: <FaMicrophone />,
    color: "#f59e0b"
  },
  {
    title: "View Reports",
    icon: <FaChartBar />,
    color: "#8b5cf6"
  },
  {
    title: "AI Chat",
    icon: <FaComments />,
    color: "#ec4899"
  },
  {
    title: "Settings",
    icon: <FaCog />,
    color: "#64748b"
  }
];

function QuickActions() {
  return (
    <div className="quick-actions">

      <h2>⚡ Quick Actions</h2>

      <div className="action-grid">

        {actions.map((action, index) => (

          <button
            key={index}
            className="action-btn"
          >

            <div
              className="action-icon"
              style={{ background: action.color }}
            >
              {action.icon}
            </div>

            <span>{action.title}</span>

          </button>

        ))}

      </div>

    </div>
  );
}

export default QuickActions;