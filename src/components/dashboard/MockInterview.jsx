import "./Dashboard.css";
import {
    FaVideo,
    FaMicrophone,
    FaLaptopCode,
    FaPlayCircle,
    FaCircle
} from "react-icons/fa";

function MockInterview(){

    return(

        <div className="mock-interview">

            <div className="mock-header">

                <h2>🎤 AI Mock Interview Room</h2>

                <span className="live-status">
                    <FaCircle/>
                    AI Online
                </span>

            </div>

            <div className="mock-grid">

                <div className="mock-card">

                    <h3>Company</h3>

                    <p>Google</p>

                </div>

                <div className="mock-card">

                    <h3>Role</h3>

                    <p>Software Engineer</p>

                </div>

                <div className="mock-card">

                    <h3>Difficulty</h3>

                    <p>Medium</p>

                </div>

                <div className="mock-card">

                    <h3>Duration</h3>

                    <p>45 Minutes</p>

                </div>

            </div>

            <div className="device-status">

                <div>

                    <FaVideo/>

                    Camera Ready

                </div>

                <div>

                    <FaMicrophone/>

                    Microphone Connected

                </div>

                <div>

                    <FaLaptopCode/>

                    Screen Sharing Available

                </div>

            </div>

            <div className="interview-actions">

                <button className="start-interview">

                    <FaPlayCircle/>

                    Start Interview

                </button>

                <button className="schedule-btn">

                    Schedule Later

                </button>

            </div>

        </div>

    );

}

export default MockInterview;