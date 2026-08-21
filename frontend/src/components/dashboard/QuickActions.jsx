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
    id: "interview",
    title: "Start Interview",
    icon: <FaPlay />,
    color: "#2563eb",
    section: "interviews",
    scrollTo: "mock-interview",
    event: "intervista_start_interview"
  },
  {
    id: "resume",
    title: "Upload Resume",
    icon: <FaUpload />,
    color: "#22c55e",
    section: "career",
    scrollTo: "career-prep-section"
  },
  {
    id: "voice",
    title: "Voice Practice",
    icon: <FaMicrophone />,
    color: "#f59e0b",
    section: "interviews",
    scrollTo: "mock-interview",
    event: "intervista_voice_practice"
  },
  {
    id: "reports",
    title: "View Reports",
    icon: <FaChartBar />,
    color: "#8b5cf6",
    section: "analytics",
    scrollTo: "analytics-section"
  },
  {
    id: "chat",
    title: "AI Chat",
    icon: <FaComments />,
    color: "#ec4899",
    action: "chat"
  },
  {
    id: "settings",
    title: "Settings",
    icon: <FaCog />,
    color: "#64748b",
    section: "settings",
    scrollTo: "settings-section"
  }
];

function QuickActions({ onAction }) {
  const handleActionClick = (action) => {
    if (action.action === "chat") {
      window.dispatchEvent(new CustomEvent("intervista_open_chat"));
      const chatBtn = document.querySelector(".chat-float-btn");
      if (chatBtn) chatBtn.click();
      return;
    }

    if (action.section) {
      if (onAction) {
        onAction(action.section);
      }

      if (action.event) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent(action.event));
        }, 150);
      }

      setTimeout(() => {
        if (action.scrollTo) {
          const el = document.getElementById(action.scrollTo);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="quick-actions">
      <h2>⚡ Quick Actions</h2>

      <div className="action-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-btn"
            type="button"
            onClick={() => handleActionClick(action)}
            title={action.title}
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