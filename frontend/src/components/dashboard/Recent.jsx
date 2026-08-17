import "./Dashboard.css";

const defaultInterviews = [
    {
        role: "Frontend Developer",
        score: "92%",
        status: "Completed",
    },
    {
        role: "Backend Developer",
        score: "85%",
        status: "Completed",
    },
    {
        role: "React Developer",
        score: "78%",
        status: "Pending",
    },
    {
        role: "AI Engineer",
        score: "95%",
        status: "Completed",
    }
];

function Recent({ interviews = defaultInterviews }) {
    const list = interviews && interviews.length > 0 ? interviews : defaultInterviews;


    return (
        <div className="recent">
            <h2>Recent Interviews</h2>

            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>View Detail</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map((item, index) => (
                        <tr key={index}>
                            <td>{item.role}</td>

                            <td>{item.score || "-"}</td>

                            <td>
                                <span
                                    className={
                                        item.status === "Completed"
                                            ? "completed"
                                            : "pending"
                                    }
                                >
                                    {item.status}
                                </span>
                            </td>

                            <td>
                                <button className="detail-btn">View Summary</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Recent;