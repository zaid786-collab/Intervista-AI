import "./Dashboard.css";
import {
  FaFileUpload,
  FaCheckCircle,
  FaFilePdf,
  FaStar
} from "react-icons/fa";

function ResumeAnalyzer() {

    return (

        <div className="resume">

            <div className="resume-header">

                <h2>📄 AI Resume Analyzer</h2>

                <button className="upload-btn">
                    <FaFileUpload />
                    Upload Resume
                </button>

            </div>

            <div className="resume-box">

                <FaFilePdf className="pdf-icon"/>

                <h3>Resume.pdf</h3>

                <p>Uploaded Successfully</p>

            </div>

            <div className="resume-score">

                <div>

                    <FaStar />

                    <h3>ATS Score</h3>

                </div>

                <span>91%</span>

            </div>

            <div className="resume-feedback">

                <h3>
                    <FaCheckCircle />
                    AI Suggestions
                </h3>

                <ul>

                    <li>Add more React projects.</li>

                    <li>Include System Design skills.</li>

                    <li>Quantify achievements using numbers.</li>

                    <li>Improve technical summary.</li>

                    <li>Add GitHub & LinkedIn links.</li>

                </ul>

            </div>

        </div>

    );

}

export default ResumeAnalyzer;