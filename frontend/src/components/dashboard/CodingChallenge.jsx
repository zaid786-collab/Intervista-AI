import "./Dashboard.css";
import {
    FaCode,
    FaClock,
    FaFire,
    FaArrowRight
} from "react-icons/fa";

function CodingChallenge() {

    return (

        <div className="challenge">

            <div className="challenge-header">

                <h2>
                    <FaCode />
                    Daily Coding Challenge
                </h2>

                <span className="difficulty hard">
                    Hard
                </span>

            </div>

            <h3>
                Longest Consecutive Sequence
            </h3>

            <p>
                Given an unsorted array of integers, return the length
                of the longest consecutive elements sequence.
            </p>

            <div className="challenge-details">

                <div>

                    <FaClock />

                    <span>45 mins</span>

                </div>

                <div>

                    <FaFire />

                    <span>150 XP</span>

                </div>

            </div>

            <button className="solve-btn">

                Solve Now

                <FaArrowRight />

            </button>

        </div>

    );

}

export default CodingChallenge;