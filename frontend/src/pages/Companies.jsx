import { useState, useEffect } from "react";
import "./Companies.css";
import companyData from "./companyData";
import { fetchCompanySolved, toggleCompanySolved } from "../api";

const defaultCompany = {
  stats: ["50+", "30+", "10+"],
  questions: [],
  mostAsked: [],
  preparation: {
    overview: "Focus on strong DSA fundamentals, system design, and behavioral preparation.",
    topics: "DSA, System Design, Problem Solving",
    strategy: "Practice problems consistently and explain your approach clearly.",
    tips: "Clarify requirements, test edge cases, and communicate effectively."
  },
  rounds: []
};

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

  const [selectedCompany, setSelectedCompany] =
    useState("Google");

  const [solvedQuestions, setSolvedQuestions] =
    useState({});

  const [activeSection, setActiveSection] =
    useState("dsa");

  useEffect(() => {
    let isMounted = true;
    fetchCompanySolved(selectedCompany)
      .then((solvedList) => {
        if (isMounted && Array.isArray(solvedList)) {
          const map = {};
          solvedList.forEach((title) => {
            map[`${selectedCompany}-${title}`] = true;
          });
          setSolvedQuestions((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [selectedCompany]);

  const data =
    companyData[selectedCompany] || defaultCompany;

  const toggleSolved = (questionTitle) => {
    const key = `${selectedCompany}-${questionTitle}`;
    const newState = !solvedQuestions[key];

    setSolvedQuestions((prev) => ({
      ...prev,
      [key]: newState,
    }));

    // Sync with backend
    toggleCompanySolved(selectedCompany, questionTitle).catch(() => {});
  };

  const isSolved = (questionTitle) => {
    return solvedQuestions[
      `${selectedCompany}-${questionTitle}`
    ];
  };

  const solvedCount = data.questions.filter((question) =>
    isSolved(question.title)
  ).length;

  const changeCompany = (company) => {
    setSelectedCompany(company);

    // Always start from DSA when changing company
    setActiveSection("dsa");
  };

  return (
    <div className="companies-page">

      {/* ================= SIDEBAR ================= */}

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
                selectedCompany === company
                  ? "active"
                  : ""
              }`}
              onClick={() => changeCompany(company)}
            >

              <span className="company-icon">
                {company.charAt(0)}
              </span>

              <span>{company}</span>

            </button>

          ))}

        </div>

      </aside>

      {/* ================= MAIN ================= */}

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
            Practice company-specific DSA questions,
            prepare technical concepts and understand
            the interview process.
          </p>

        </div>

        <div className="company-content">

          {/* ================= HERO ================= */}

          <div className="company-hero-card">

            <div className="company-large-icon">
              {selectedCompany.charAt(0)}
            </div>

            <div>
              <h2>{selectedCompany}</h2>

              <p>
                Complete interview preparation for{" "}
                {selectedCompany}.
              </p>
            </div>

          </div>

          {/* ================= STATS ================= */}

          <div className="company-stats">

            <div className="company-stat-card">
              <strong>{data.stats[0]}</strong>
              <span>DSA Problems</span>
            </div>

            <div className="company-stat-card">
              <strong>{data.stats[1]}</strong>
              <span>Interview Questions</span>
            </div>

            <div className="company-stat-card">
              <strong>{data.stats[2]}</strong>
              <span>Core Topics</span>
            </div>

          </div>

          {/* ================= THREE CARDS ================= */}

          <div className="company-sections">

            {/* DSA */}

            <div
              className={`company-section-card ${
                activeSection === "dsa"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveSection("dsa")}
            >

              <span>⌘</span>

              <h3>DSA Questions</h3>

              <p>
                Practice frequently asked DSA
                questions associated with{" "}
                {selectedCompany}.
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("dsa");
                }}
              >
                Practice DSA →
              </button>

            </div>

            {/* MOST ASKED */}

            <div
              className={`company-section-card ${
                activeSection === "questions"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveSection("questions")
              }
            >

              <span>◈</span>

              <h3>Most Asked Questions</h3>

              <p>
                Prepare technical and conceptual
                questions commonly discussed in
                interviews.
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("questions");
                }}
              >
                View Questions →
              </button>

            </div>

            {/* PREPARATION */}

            <div
              className={`company-section-card ${
                activeSection === "preparation"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveSection("preparation")
              }
            >

              <span>✦</span>

              <h3>Preparation Guide</h3>

              <p>
                Understand preparation strategy
                and interview rounds for{" "}
                {selectedCompany}.
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("preparation");
                }}
              >
                Explore Guide →
              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* DSA SECTION */}
          {/* ================================================= */}

          {activeSection === "dsa" && (

            <section className="company-details">

              <div className="details-header">

                <span>LEETCODE PRACTICE</span>

                <h2>
                  {selectedCompany} DSA Questions
                </h2>

                <p>
                  Solve these problems and track
                  your preparation.
                </p>

                <div className="progress-info">
                  {solvedCount} /{" "}
                  {data.questions.length} solved
                </div>

              </div>

              <div className="question-list">

                {data.questions.map(
                  (question, index) => (

                    <div
                      className={`question-item ${
                        isSolved(question.title)
                          ? "solved"
                          : ""
                      }`}
                      key={question.title}
                    >

                      <div className="question-number">
                        {index + 1}
                      </div>

                      <div className="question-content">

                        <h3>
                          {question.title}
                        </h3>

                        <span>
                          {question.topic} •{" "}
                          {question.difficulty}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleSolved(
                            question.title
                          )
                        }
                      >
                        {isSolved(question.title)
                          ? "✓ Solved"
                          : "Mark Solved"}
                      </button>

                      <a
                        href={question.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leetcode-btn"
                      >
                        Solve →
                      </a>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

          {/* ================================================= */}
          {/* MOST ASKED QUESTIONS */}
          {/* ================================================= */}

          {activeSection === "questions" && (

            <section className="company-details">

              <div className="details-header">

                <span>MOST ASKED</span>

                <h2>
                  {selectedCompany} Interview Questions
                </h2>

                <p>
                  Questions you should be comfortable
                  answering before your interview.
                </p>

              </div>

              <div className="question-list">

                {data.mostAsked.map(
                  (question, index) => (

                    <div
                      className="question-item"
                      key={question}
                    >

                      <div className="question-number">
                        {index + 1}
                      </div>

                      <div className="question-content">

                        <h3>{question}</h3>

                        <span>
                          Technical / Interview
                          Preparation
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard?.writeText(
                            question
                          )
                        }
                      >
                        Copy
                      </button>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

          {/* ================================================= */}
          {/* PREPARATION GUIDE */}
          {/* ================================================= */}

          {activeSection === "preparation" && (

            <section className="company-details">

              <div className="details-header">

                <span>
                  PREPARATION MATERIAL
                </span>

                <h2>
                  {selectedCompany} Preparation Guide
                </h2>

                <p>
                  A structured preparation document
                  for your {selectedCompany} interview.
                </p>

              </div>

              <div className="preparation-document">

                <div>
                  <h3>Company Focus</h3>
                  <p>
                    {data.preparation.overview}
                  </p>
                </div>

                <div>
                  <h3>Important Topics</h3>
                  <p>
                    {data.preparation.topics}
                  </p>
                </div>

                <div>
                  <h3>Preparation Strategy</h3>
                  <p>
                    {data.preparation.strategy}
                  </p>
                </div>

                <div>
                  <h3>Interview Tips</h3>
                  <p>
                    {data.preparation.tips}
                  </p>
                </div>

              </div>

              {/* INTERVIEW FORMAT */}

              <div className="details-header interview-format-heading">

                <span>
                  INTERVIEW FORMAT
                </span>

                <h2>
                  Typical Interview Process
                </h2>

              </div>

              <div className="experience-list">

                {data.rounds.map(
                  (round, index) => (

                    <div
                      className="experience-item"
                      key={round.title}
                    >

                      <div className="experience-number">
                        {index + 1}
                      </div>

                      <div>
                        <h3>
                          {round.title}
                        </h3>

                        <p>
                          {round.description}
                        </p>
                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

        </div>

      </main>

    </div>
  );
}

export default Companies;