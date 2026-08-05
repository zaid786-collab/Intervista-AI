import "./Dashboard.css";

const data = [
  2,1,0,3,4,1,0,
  2,4,3,1,2,0,1,
  4,4,3,2,1,0,2,
  1,2,3,4,4,3,2,
  1,0,1,2,3
];

function getColor(value){

    if(value===0) return "#1e293b";

    if(value===1) return "#0ea5e9";

    if(value===2) return "#22c55e";

    if(value===3) return "#84cc16";

    return "#16a34a";

}

function InterviewHeatmap(){

    return(

        <div className="heatmap">

            <div className="heatmap-header">

                <h2>🔥 Interview Heatmap</h2>

                <p>Last 35 Days</p>

            </div>

            <div className="heatmap-grid">

                {

                    data.map((value,index)=>(

                        <div

                            key={index}

                            className="heat-cell"

                            style={{
                                background:getColor(value)
                            }}

                            title={`${value} practice sessions`}

                        />

                    ))

                }

            </div>

            <div className="heatmap-legend">

                <span>Less</span>

                <div className="legend-color" style={{background:"#1e293b"}}></div>

                <div className="legend-color" style={{background:"#0ea5e9"}}></div>

                <div className="legend-color" style={{background:"#22c55e"}}></div>

                <div className="legend-color" style={{background:"#84cc16"}}></div>

                <div className="legend-color" style={{background:"#16a34a"}}></div>

                <span>More</span>

            </div>

        </div>

    );

}

export default InterviewHeatmap;