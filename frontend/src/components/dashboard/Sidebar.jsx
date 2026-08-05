function Sidebar() {
    return (
        <div className="sidebar">

            <div className="sidebar-brand" aria-label="Intervista AI">
                <span aria-hidden="true">✦</span>
                <h2>Intervista AI</h2>
            </div>

            <ul>
                <li>Dashboard</li>
                <li>Interviews</li>
                <li>Analytics</li>
                <li>Feedback</li>
                <li>Settings</li>
            </ul>

        </div>
    );
}

export default Sidebar;