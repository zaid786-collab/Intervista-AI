import "./Dashboard.css";
import {
    FaGoogle,
    FaMicrosoft,
    FaAmazon
} from "react-icons/fa";
import { SiNetflix } from "react-icons/si";

const jobs = [

    {
        company: "Google",
        role: "Software Engineer Intern",
        location: "Bangalore",
        salary: "₹18 LPA",
        icon: <FaGoogle />,
        color: "#4285F4"
    },

    {
        company: "Microsoft",
        role: "Frontend Developer",
        location: "Hyderabad",
        salary: "₹22 LPA",
        icon: <FaMicrosoft />,
        color: "#7FBA00"
    },

    {
        company: "Amazon",
        role: "Backend Engineer",
        location: "Delhi",
        salary: "₹20 LPA",
        icon: <FaAmazon />,
        color: "#FF9900"
    },

    {
        company: "Netflix",
        role: "Full Stack Engineer",
        location: "Remote",
        salary: "₹35 LPA",
        icon: <SiNetflix />,
        color: "#E50914"
    }

];

function JobRecommendations(){

    return(

        <div className="jobs">

            <div className="jobs-header">

                <h2>💼 Recommended Jobs</h2>

                <button className="view-btn">

                    Explore All

                </button>

            </div>

            {

                jobs.map((job,index)=>(

                    <div
                        className="job-card"
                        key={index}
                    >

                        <div
                            className="job-logo"
                            style={{background:job.color}}
                        >

                            {job.icon}

                        </div>

                        <div className="job-info">

                            <h3>{job.company}</h3>

                            <p>{job.role}</p>

                            <small>

                                {job.location} • {job.salary}

                            </small>

                        </div>

                        <button className="apply-btn">

                            Apply

                        </button>

                    </div>

                ))

            }

        </div>

    );

}

export default JobRecommendations;