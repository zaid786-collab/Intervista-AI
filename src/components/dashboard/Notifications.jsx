import "./Dashboard.css";
import {
  FaBell,
  FaRobot,
  FaCalendarAlt,
  FaCode,
  FaCheckCircle
} from "react-icons/fa";

const notifications = [
  {
    icon: <FaCalendarAlt />,
    title: "Google Interview Tomorrow",
    desc: "10:00 AM • Software Engineer",
    color: "#2563eb",
    time: "2 min ago"
  },
  {
    icon: <FaRobot />,
    title: "AI Resume Analysis Complete",
    desc: "Your ATS Score improved to 91%",
    color: "#8b5cf6",
    time: "20 min ago"
  },
  {
    icon: <FaCode />,
    title: "New Coding Challenge",
    desc: "Today's DSA question is available",
    color: "#22c55e",
    time: "1 hour ago"
  },
  {
    icon: <FaCheckCircle />,
    title: "Interview Completed",
    desc: "Feedback report is ready",
    color: "#f59e0b",
    time: "Yesterday"
  }
];

function Notifications() {

    return (

        <div className="notifications">

            <div className="notification-header">

                <h2>

                    <FaBell />

                    Notifications

                </h2>

                <span className="notification-count">

                    4 New

                </span>

            </div>

            {

                notifications.map((item,index)=>(

                    <div
                        className="notification-card"
                        key={index}
                    >

                        <div
                            className="notification-icon"
                            style={{background:item.color}}
                        >

                            {item.icon}

                        </div>

                        <div className="notification-content">

                            <h3>{item.title}</h3>

                            <p>{item.desc}</p>

                        </div>

                        <small>{item.time}</small>

                    </div>

                ))

            }

        </div>

    );

}

export default Notifications;