import "./Companies.css";

function Companies() {
  return (
    <div className="companies-page">
      <div className="companies-container">

        <h1 className="title">Interview Hub</h1>

        <p className="subtitle">
          Explore company-wise interview process, OA pattern, interview rounds,
          salary, eligibility, preparation roadmap, and previous interview experiences.
        </p>

        <div className="company-grid">

          <div className="company-card">
            <h2>Amazon</h2>
            <p>Interview Rounds • OA • Salary • Experience</p>
            <button>View Details</button>
          </div>

          <div className="company-card">
            <h2>Google</h2>
            <p>Interview Rounds • OA • Salary • Experience</p>
            <button>View Details</button>
          </div>

          <div className="company-card">
            <h2>Microsoft</h2>
            <p>Interview Rounds • OA • Salary • Experience</p>
            <button>View Details</button>
          </div>

          <div className="company-card">
            <h2>Adobe</h2>
            <p>Interview Rounds • OA • Salary • Experience</p>
            <button>View Details</button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Companies;