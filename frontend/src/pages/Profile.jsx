import "./Profile.css";

function Profile({ user }) {
  const name = user?.name || "Interview Candidate";
  const email = user?.email || "candidate@example.com";

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* ================= PROFILE HEADER ================= */}
        <section className="profile-hero">

          <div className="profile-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-heading">
            <span className="profile-badge">
              ✦ MY PROFILE
            </span>

            <h1>
              Welcome, <span>{name}</span>
            </h1>

            <p>
              Manage your account, track your interview journey
              and build your career profile.
            </p>
          </div>

          <button className="edit-profile-btn">
            ✎ Edit Profile
          </button>

        </section>


        {/* ================= PERSONAL INFORMATION ================= */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <span className="section-label">
                ACCOUNT
              </span>

              <h2>Personal Information</h2>

              <p>
                Your basic account information.
              </p>
            </div>
          </div>


          <div className="profile-info-grid">

            <div className="profile-field">
              <span>FULL NAME</span>
              <strong>Mohammad Zaid Khan</strong>
            </div>

            <div className="profile-field">
              <span>EMAIL ADDRESS</span>
              <strong>zaidkhan24082006@gmail.com</strong>
            </div>

            <div className="profile-field">
              <span>ACCOUNT TYPE</span>
              <strong>Premium Member</strong>
            </div>

            <div className="profile-field">
              <span>MEMBER SINCE</span>
              <strong>2025</strong>
            </div>

          </div>

        </section>


        {/* ================= INTERVIEW STATISTICS ================= */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <span className="section-label">
                PERFORMANCE
              </span>

              <h2>Interview Statistics</h2>

              <p>
                Your overall progress on Intervista AI.
              </p>
            </div>
          </div>


          <div className="profile-stats">

            <div className="profile-stat">
              <div className="stat-icon">🎤</div>
              <strong>24</strong>
              <span>Interviews Completed</span>
            </div>

            <div className="profile-stat">
              <div className="stat-icon">◈</div>
              <strong>78%</strong>
              <span>Average Score</span>
            </div>

            <div className="profile-stat">
              <div className="stat-icon">🏆</div>
              <strong>92%</strong>
              <span>Best Score</span>
            </div>

            <div className="profile-stat">
              <div className="stat-icon">◷</div>
              <strong>18h</strong>
              <span>Practice Time</span>
            </div>

          </div>

        </section>


        {/* ================= SKILLS ================= */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <span className="section-label">
                CAREER PROFILE
              </span>

              <h2>Skills & Interests</h2>

              <p>
                Areas you are currently preparing for.
              </p>
            </div>
          </div>


          <div className="skills-container">

            <span className="skill-tag">DSA</span>
            <span className="skill-tag">JavaScript</span>
            <span className="skill-tag">React.js</span>
            <span className="skill-tag">Node.js</span>
            <span className="skill-tag">Python</span>
            <span className="skill-tag">AI / ML</span>
            <span className="skill-tag">System Design</span>
            <span className="skill-tag">Problem Solving</span>

          </div>

        </section>


        {/* ================= ACCOUNT ACTIONS ================= */}
        <section className="profile-card account-actions">

          <div>
            <span className="section-label">
              ACCOUNT
            </span>

            <h2>Account Settings</h2>

            <p>
              Manage your account preferences and security.
            </p>
          </div>

          <div className="account-buttons">

            <button className="profile-action-btn">
              ⚙ Account Settings
            </button>

            <button className="profile-action-btn danger">
              🗑 Delete Account
            </button>

          </div>

        </section>


        {/* ================= CTA ================= */}
        <section className="profile-cta">

          <div>
            <span>READY FOR YOUR NEXT INTERVIEW?</span>

            <h2>
              Keep improving.
              <br />
              <span>Your next opportunity is closer.</span>
            </h2>

            <p>
              Practice with AI, analyze your performance and
              become interview-ready.
            </p>
          </div>

          <button className="profile-cta-btn">
            Start New Interview →
          </button>

        </section>

      </div>
    </main>
  );
}

export default Profile;