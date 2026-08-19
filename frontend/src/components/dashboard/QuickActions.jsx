import "./Dashboard.css";
import {
  FaPlay,
  FaUpload,
  FaMicrophone,
  FaChartBar,
  FaComments,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const handleAction = (type) => {
    switch (type) {
      case "interview": {
        const el = document.getElementById("mock-interview");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "resume": {
        const el = document.querySelector(".resume");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "practice": {
        navigate("/resources");
        break;
      }
      case "reports": {
        const el = document.getElementById("analytics-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "chat": {
        const chatBtn = document.querySelector(".chat-float-btn");
        if (chatBtn) chatBtn.click();
        break;
      }
      case "settings": {
        const el = document.getElementById("settings-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      default:
        break;
    }
  };

  const actions = [
    {
      title: "Start Interview",
      icon: <FaPlay />,
      color: "#2563eb",
      type: "interview",
    },
    {
      title: "Upload Resume",
      icon: <FaUpload />,
      color: "#22c55e",
      type: "resume",
    },
    {
      title: "Practice DSA",
      icon: <FaMicrophone />,
      color: "#f59e0b",
      type: "practice",
    },
    {
      title: "View Reports",
      icon: <FaChartBar />,
      color: "#8b5cf6",
      type: "reports",
    },
    {
      title: "AI Coach Chat",
      icon: <FaComments />,
      color: "#ec4899",
      type: "chat",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      color: "#64748b",
      type: "settings",
    },
  ];

  return (
    <div className="quick-actions">
      <h2>⚡ Quick Actions</h2>

      <div className="action-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-btn"
            onClick={() => handleAction(action.type)}
            type="button"
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