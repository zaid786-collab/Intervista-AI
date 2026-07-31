import "./Dashboard.css";

function Card(props) {
    return (
        <div className="card">

            <div className="card-top">

                <div
                    className="card-icon"
                    style={{ backgroundColor: props.color,
                        color: props.iconColor
                     }}
                >
                    {props.icon}
                </div>

                <div>
                    <h4>{props.title}</h4>
                    <h2>{props.value}</h2>
                </div>

            </div>

            <p className="card-text">
                {props.text}
            </p>

        </div>
    );
}

export default Card;