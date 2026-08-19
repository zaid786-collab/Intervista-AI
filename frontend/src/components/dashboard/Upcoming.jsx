import "./Dashboard.css";

const defaultInterviews = [
  {
    name: "Alex Ferguson",
    company: "Google",
    role: "Frontend Developer",
    date: "04 Aug 2026",
    time: "10:00 AM",
  },
  {
    name: "James Chadwick",
    company: "Microsoft",
    role: "Data Analyst",
    date: "05 Aug 2026",
    time: "02:00 PM",
  },
  {
    name: "Sam Altman",
    company: "OpenAI",
    role: "Backend Developer",
    date: "07 Aug 2026",
    time: "11:30 AM",
  },
];

function Upcoming({ interviews: propInterviews }) {
  const list = propInterviews && propInterviews.length > 0 ? propInterviews : defaultInterviews;

  const handleJoin = () => {
    const el = document.getElementById("mock-interview");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="upcoming">
      <h2>Upcoming Interviews</h2>

      {list.map((item, index) => (
        <div className="interview-card" key={index}>
          <div>
            <h3>{item.company || item.name}</h3>
            <p>{item.role}</p>
            <small>
              {item.date} • {item.time}
            </small>
          </div>

          <button className="join-btn" onClick={handleJoin} type="button">
            Join
          </button>
        </div>
      ))}
    </div>
  );
}

export default Upcoming;