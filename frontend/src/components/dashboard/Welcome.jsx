import "./Dashboard.css";

function Welcome() {

    return (

        <div className="welcome">

            <h1>
                <span>Welcome Back</span>
            </h1>
        <br></br>
            <p>
                <span>
                    Ready to crush your next interview?
                </span>
            </p>

            <button className="start-btn">
                + Start New Interview
            </button>

        </div>

    );

}

export default Welcome;