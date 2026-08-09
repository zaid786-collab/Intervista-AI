import { useState } from "react";
import "./Companies.css";

function Companies() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Adobe",
    "Salesforce",
    "IBM",
    "Oracle",
    "NVIDIA",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture",
  ];

  const [selectedCompany, setSelectedCompany] = useState("Google");

  return (
    <div className="companies-page">

      {/* Companies Sidebar */}
      <aside className="companies-sidebar">

        <div className="companies-sidebar-header">
          <span>✦</span>
          <h2>Companies</h2>
        </div>

        <p className="companies-sidebar-label">
          INTERVIEW PREPARATION
        </p>

        <div className="company-list">
          {companies.map((company) => (
            <button
              key={company}
              type="button"
              className={`company-sidebar-btn ${
                selectedCompany === company ? "active" : ""
              }`}
              onClick={() => setSelectedCompany(company)}
            >
              <span className="company-icon">
                {company.charAt(0)}
              </span>

              <span>{company}</span>
            </button>
          ))}
        </div>

      </aside>

      {/* Main Content */}
      <main className="companies-main">

        <div className="companies-heading">
          <span className="companies-badge">
            ✦ COMPANY PREPARATION
          </span>

          <h1>
            Prepare for
            <br />
            <span>{selectedCompany}</span>
          </h1>

          <p>
            Practice company-specific interview questions,
            DSA problems and technical concepts.
          </p>
        </div>

        {/* Selected company content */}
        <div className="company-content">

          <div className="company-hero-card">
            <div className="company-large-icon">
              {selectedCompany.charAt(0)}
            </div>

            <div>
              <h2>{selectedCompany}</h2>
              <p>
                Interview preparation for {selectedCompany}
              </p>
            </div>
          </div>

          <div className="company-stats">

            <div className="company-stat-card">
              <strong>120+</strong>
              <span>DSA Problems</span>
            </div>

            <div className="company-stat-card">
              <strong>80+</strong>
              <span>Interview Questions</span>
            </div>

            <div className="company-stat-card">
              <strong>25+</strong>
              <span>Core Topics</span>
            </div>

          </div>

          <div className="company-sections">

            <div className="company-section-card">
              <span>⌘</span>
              <h3>DSA Questions</h3>
              <p>
                Practice frequently asked DSA questions
                from {selectedCompany} interviews.
              </p>
              <button>Practice DSA →</button>
            </div>

            <div className="company-section-card">
              <span>◈</span>
              <h3>Interview Questions</h3>
              <p>
                Prepare technical and conceptual questions
                commonly asked by {selectedCompany}.
              </p>
              <button>View Questions →</button>
            </div>

            <div className="company-section-card">
              <span>✦</span>
              <h3>Interview Experience</h3>
              <p>
                Explore interview rounds, difficulty and
                preparation strategies.
              </p>
              <button>Explore →</button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Companies;