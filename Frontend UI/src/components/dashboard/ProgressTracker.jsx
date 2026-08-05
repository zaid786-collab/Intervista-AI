import "./Dashboard.css";

const skills = [
  { name: "Data Structures & Algorithms", progress: 90, color: "#2563eb" },
  { name: "Communication Skills", progress: 82, color: "#22c55e" },
  { name: "Problem Solving", progress: 95, color: "#f59e0b" },
  { name: "System Design", progress: 68, color: "#8b5cf6" },
  { name: "Core CS Subjects", progress: 84, color: "#ec4899" },
  { name: "Behavioral Interview", progress: 76, color: "#06b6d4" }
];

function ProgressTracker() {
  return (
    <div className="progress-tracker">

      <h2>📈 Candidate Progress</h2>

      {skills.map((skill, index) => (

        <div className="skill" key={index}>

          <div className="skill-top">

            <span>{skill.name}</span>

            <span>{skill.progress}%</span>

          </div>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${skill.progress}%`,
                background: skill.color
              }}
            ></div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default ProgressTracker;