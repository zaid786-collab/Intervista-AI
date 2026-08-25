import "./Dashboard.css";

function Card({ icon, title, value, text, color, iconColor, onClick }) {
  return (
    <div
      className={`card ${onClick ? "interactive-card" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      title={onClick ? `View details for ${title}` : undefined}
    >
      <div className="card-top">
        <div
          className="card-icon"
          style={{ backgroundColor: color, color: iconColor }}
        >
          {icon}
        </div>

        <div>
          <h4>{title}</h4>
          <h2>{value}</h2>
        </div>
      </div>

      <p className="card-text">{text}</p>
    </div>
  );
}

export default Card;