import "./Dashboard.css";
import {
    FaFire,
    FaMedal,
    FaStar,
    FaTrophy,
    FaBolt
} from "react-icons/fa";

const achievements = [

    {
        icon:<FaFire/>,
        title:"7 Day Streak",
        desc:"Practiced every day this week",
        color:"#f97316"
    },

    {
        icon:<FaMedal/>,
        title:"Top Performer",
        desc:"Scored above 90%",
        color:"#22c55e"
    },

    {
        icon:<FaStar/>,
        title:"100 XP Earned",
        desc:"Completed coding challenge",
        color:"#2563eb"
    },

    {
        icon:<FaTrophy/>,
        title:"Interview Master",
        desc:"Completed 50 interviews",
        color:"#eab308"
    }

];

function Achievements(){

    return(

        <div className="achievements">

            <div className="achievement-header">

                <h2>🏅 Achievements</h2>

                <div className="xp-card">

                    <FaBolt/>

                    <span>1,480 XP</span>

                </div>

            </div>

            <div className="achievement-grid">

                {

                    achievements.map((item,index)=>(

                        <div
                            className="achievement-card"
                            key={index}
                        >

                            <div
                                className="achievement-icon"
                                style={{background:item.color}}
                            >

                                {item.icon}

                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.desc}</p>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default Achievements;