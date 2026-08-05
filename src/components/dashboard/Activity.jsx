import "./Dashboard.css";
import {
  FaCheckCircle,
  FaRobot,
  FaCalendarAlt,
  FaCode
} from "react-icons/fa";

const activities = [
  {
    icon: <FaCheckCircle />,
    title: "Interview Completed",
    company: "Google",
    time: "2 hours ago",
    color: "#22c55e"
  },
  {
    icon: <FaRobot />,
    title: "AI Feedback Generated",
    company: "Score: 92%",
    time: "Yesterday",
    color: "#2563eb"
  },
  {
    icon: <FaCalendarAlt />,
    title: "Interview Scheduled",
    company: "Microsoft",
    time: "Tomorrow 11:00 AM",
    color: "#f59e0b"
  },
  {
    icon: <FaCode />,
    title: "Coding Challenge Completed",
    company: "LeetCode",
    time: "Today",
    color: "#a855f7"
  }
];

function Activity() {
  return (
    <div className="activity">

      <h2>Recent Activity</h2>

      {activities.map((item, index) => (
        <div className="activity-item" key={index}>

          <div
            className="activity-icon"
            style={{ background: item.color }}
          >
            {item.icon}
          </div>

          <div className="activity-info">
            <h4>{item.title}</h4>
            <p>{item.company}</p>
          </div>

          <span>{item.time}</span>

        </div>
      ))}

    </div>
  );
}

export default Activity;