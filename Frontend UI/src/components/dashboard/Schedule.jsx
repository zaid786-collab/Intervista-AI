import "./Dashboard.css";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaLaptopCode
} from "react-icons/fa";

const interviews = [
  {
    company: "Google",
    role: "SDE Intern",
    date: "04 Aug 2026",
    time: "10:00 AM",
    mode: "Virtual",
    icon: <FaVideo />,
    color: "#2563eb"
  },
  {
    company: "Microsoft",
    role: "Frontend Developer",
    date: "05 Aug 2026",
    time: "02:00 PM",
    mode: "Online Coding",
    icon: <FaLaptopCode />,
    color: "#22c55e"
  },
  {
    company: "Amazon",
    role: "Backend Engineer",
    date: "07 Aug 2026",
    time: "11:30 AM",
    mode: "Virtual",
    icon: <FaVideo />,
    color: "#f59e0b"
  }
];

function Schedule() {
  return (
    <div className="schedule">

      <div className="schedule-header">

        <h2>
          <FaCalendarAlt />
          Interview Schedule
        </h2>

        <button className="view-btn">
          View Calendar
        </button>

      </div>

      {interviews.map((item, index) => (

        <div
          className="schedule-card"
          key={index}
        >

          <div
            className="schedule-icon"
            style={{ background: item.color }}
          >
            {item.icon}
          </div>

          <div className="schedule-info">

            <h3>{item.company}</h3>

            <p>{item.role}</p>

          </div>

          <div className="schedule-time">

            <FaClock />

            <span>{item.date}</span>

            <small>{item.time}</small>

          </div>

        </div>

      ))}

    </div>
  );
}

export default Schedule;