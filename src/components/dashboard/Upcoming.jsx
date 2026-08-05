import "./Dashboard.css"

const interviews = [
    {
        name :"Alex Fergosun",
        role : "Frontend Developer",
        date : "2 Aug 2026",
        time : "10:00 AM"
    },
    {
        name : "James Chedwick",
        role : "Data Analyst",
        date : "3 Aug 2026",
        time : "10:00 AM"
    },
    {
        name : "Sam Altman",
        role : "Backend Developer",
        date : "5 Aug 2026",
        time : "12:00 AM"
    },
];

function Upcoming () {
    return (
        <div className="upcoming">

            <h2>Upcoming Interviews</h2>

            {interviews.map((item,index) => (
                <div className="interview-card" key={index}>

                    <div>
                        <h3>{item.name}</h3>
                        <p>{item.role}</p>
                        <small>
                            {item.date}  • {item.time}
                        </small>
                    </div>

                    <button className="join-btn">
                        Join
                    </button>

                </div>

            ))}
        </div>
    );
}

export default Upcoming;