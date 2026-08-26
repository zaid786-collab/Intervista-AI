import { useState } from "react";
import "./Companies.css";
import companyData from "./companyData";

const defaultCompany = {
  stats: ["50+", "30+", "20+", "10+"],
  questions: [],
  mostAsked: [],
  aptitudeQuestions: [],
  preparation: {
    overview: "Focus on strong DSA fundamentals, quantitative aptitude, system design, and behavioral preparation.",
    topics: "DSA, Aptitude, Logical Reasoning, System Design, Problem Solving",
    strategy: "Practice problems consistently, understand standard puzzles and formulas, and explain your approach clearly.",
    tips: "Clarify requirements, test edge cases, double-check mathematical steps, and communicate effectively."
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

  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [solvedQuestions, setSolvedQuestions] = useState({});
  const [activeSection, setActiveSection] = useState("dsa");
  const [aptitudeCategory, setAptitudeCategory] = useState("All");
  const [aptitudeSearch, setAptitudeSearch] = useState("");
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const data = companyData[selectedCompany] || defaultCompany;
  const companyAptitudeQuestions = data.aptitudeQuestions || [];

  const toggleSolved = (questionTitle) => {
    const key = `${selectedCompany}-${questionTitle}`;
    setSolvedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isSolved = (questionTitle) => {
    return !!solvedQuestions[`${selectedCompany}-${questionTitle}`];
  };

  const toggleSolution = (id) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectOption = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const copyToClipboard = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const solvedDsaCount = data.questions.filter((question) =>
    isSolved(question.title)
  ).length;

  const solvedAptitudeCount = companyAptitudeQuestions.filter((q) =>
    isSolved(q.title || q.id)
  ).length;

  const changeCompany = (company) => {
    setSelectedCompany(company);
    setActiveSection("dsa");
    setAptitudeCategory("All");
    setAptitudeSearch("");
    setExpandedSolutions({});
    setSelectedOptions({});
  };

  // Filter aptitude questions
  const filteredAptitudeQuestions = companyAptitudeQuestions.filter((q) => {
    const matchesCategory =
      aptitudeCategory === "All" ||
      q.category?.toLowerCase() === aptitudeCategory.toLowerCase() ||
      (aptitudeCategory === "Puzzles" && (q.category?.includes("Puzzle") || q.category?.includes("Logic")));

    const matchesSearch =
      !aptitudeSearch ||
      q.title?.toLowerCase().includes(aptitudeSearch.toLowerCase()) ||
      q.question?.toLowerCase().includes(aptitudeSearch.toLowerCase()) ||
      q.category?.toLowerCase().includes(aptitudeSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`companies-page ${isCollapsed ? "sidebar-is-collapsed" : ""}`}>

      {/* ================= SIDEBAR ================= */}
      <aside className={`companies-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="companies-sidebar-header">
          <div className="companies-sidebar-title">
            <span>✦</span>
            {!isCollapsed && <h2>Companies</h2>}
          </div>

          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "»" : "«"}
          </button>
        </div>

        {!isCollapsed && (
          <p className="companies-sidebar-label">
            INTERVIEW PREPARATION
          </p>
        )}

        <div className="company-list">
          {companies.map((company) => (
            <button
              key={company}
              type="button"
              className={`company-sidebar-btn ${
                selectedCompany === company ? "active" : ""
              }`}
              onClick={() => changeCompany(company)}
              title={isCollapsed ? company : undefined}
            >
              <span className="company-icon">
                {company.charAt(0)}
              </span>

              {!isCollapsed && <span className="company-name">{company}</span>}
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
            Practice company-specific DSA questions, quantitative aptitude,
            logical puzzles, and understand the real interview process.
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
                Complete interview preparation, online test aptitude, and technical guides for{" "}
                {selectedCompany}.
              </p>
            </div>
          </div>

          {/* ================= STATS (4 Cards) ================= */}
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
              <strong>{data.stats[2] || `${companyAptitudeQuestions.length} Sets`}</strong>
              <span>Aptitude & Logic</span>
            </div>

            <div className="company-stat-card">
              <strong>{data.stats[3] || data.stats[2]}</strong>
              <span>Core Topics</span>
            </div>
          </div>

          {/* ================= 4 SECTION NAVIGATION CARDS ================= */}
          <div className="company-sections company-sections-four">

            {/* 1. DSA */}
            <div
              className={`company-section-card ${
                activeSection === "dsa" ? "active" : ""
              }`}
              onClick={() => setActiveSection("dsa")}
            >
              <span>⌘</span>
              <h3>DSA Questions</h3>
              <p>
                Practice frequently asked DSA questions asked in{" "}
                {selectedCompany} coding rounds.
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

            {/* 2. MOST ASKED */}
            <div
              className={`company-section-card ${
                activeSection === "questions" ? "active" : ""
              }`}
              onClick={() => setActiveSection("questions")}
            >
              <span>◈</span>
              <h3>Most Asked Questions</h3>
              <p>
                Technical and conceptual questions commonly asked in{" "}
                {selectedCompany} interviews.
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

            {/* 3. APTITUDE & LOGICAL REASONING */}
            <div
              className={`company-section-card ${
                activeSection === "aptitude" ? "active" : ""
              }`}
              onClick={() => setActiveSection("aptitude")}
            >
              <span>🧮</span>
              <h3>Aptitude & Logic</h3>
              <p>
                Quantitative aptitude, logical reasoning, and brain teaser puzzles tested by{" "}
                {selectedCompany}.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("aptitude");
                }}
              >
                Solve Aptitude →
              </button>
            </div>

            {/* 4. PREPARATION */}
            <div
              className={`company-section-card ${
                activeSection === "preparation" ? "active" : ""
              }`}
              onClick={() => setActiveSection("preparation")}
            >
              <span>✦</span>
              <h3>Preparation Guide</h3>
              <p>
                Understand preparation strategy and interview rounds for{" "}
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
                <h2>{selectedCompany} DSA Questions</h2>
                <p>Solve these problems and track your preparation.</p>
                <div className="progress-info">
                  {solvedDsaCount} / {data.questions.length} solved
                </div>
              </div>

              <div className="question-list">
                {data.questions.map((question, index) => (
                  <div
                    className={`question-item ${
                      isSolved(question.title) ? "solved" : ""
                    }`}
                    key={question.title}
                  >
                    <div className="question-number">{index + 1}</div>

                    <div className="question-content">
                      <h3>{question.title}</h3>
                      <span>
                        {question.topic} • {question.difficulty}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSolved(question.title)}
                    >
                      {isSolved(question.title) ? "✓ Solved" : "Mark Solved"}
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
                ))}
              </div>
            </section>
          )}

          {/* ================================================= */}
          {/* MOST ASKED QUESTIONS SECTION */}
          {/* ================================================= */}
          {activeSection === "questions" && (
            <section className="company-details">
              <div className="details-header">
                <span>MOST ASKED</span>
                <h2>{selectedCompany} Interview Questions</h2>
                <p>
                  Questions you should be comfortable answering before your interview.
                </p>
              </div>

              <div className="question-list">
                {data.mostAsked.map((question, index) => (
                  <div className="question-item" key={question}>
                    <div className="question-number">{index + 1}</div>

                    <div className="question-content">
                      <h3>{question}</h3>
                      <span>Technical / Interview Preparation</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(question, `ma-${index}`)}
                    >
                      {copiedId === `ma-${index}` ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================================================= */}
          {/* APTITUDE & LOGICAL REASONING SECTION */}
          {/* ================================================= */}
          {activeSection === "aptitude" && (
            <section className="company-details aptitude-company-details">
              <div className="details-header">
                <span>APTITUDE & LOGICAL ROUND</span>
                <h2>{selectedCompany} Aptitude & Logic Questions</h2>
                <p>
                  Authentic quantitative aptitude, logical reasoning, and interview puzzles
                  frequently asked in {selectedCompany} online assessments and screening rounds.
                </p>
                <div className="progress-info">
                  {solvedAptitudeCount} / {companyAptitudeQuestions.length} solved
                </div>
              </div>

              {/* Category & Search Filters */}
              <div className="aptitude-filter-bar">
                <div className="aptitude-search-wrap">
                  <input
                    type="text"
                    placeholder={`Search aptitude questions in ${selectedCompany}...`}
                    value={aptitudeSearch}
                    onChange={(e) => setAptitudeSearch(e.target.value)}
                    className="aptitude-search-input"
                  />
                  {aptitudeSearch && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setAptitudeSearch("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="aptitude-category-pills">
                  {["All", "Quantitative Aptitude", "Logical Reasoning", "Probability & Math", "Puzzles & Logic"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-pill ${aptitudeCategory === cat ? "active" : ""}`}
                      onClick={() => setAptitudeCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aptitude Question Cards */}
              <div className="aptitude-card-list">
                {filteredAptitudeQuestions.length > 0 ? (
                  filteredAptitudeQuestions.map((q, index) => {
                    const isQSolved = isSolved(q.title || q.id);
                    const isExpanded = !!expandedSolutions[q.id];
                    const selectedOpt = selectedOptions[q.id];

                    return (
                      <div
                        className={`aptitude-question-card ${isQSolved ? "solved" : ""}`}
                        key={q.id || index}
                      >
                        {/* Header */}
                        <div className="aptitude-card-header">
                          <div className="aptitude-card-meta">
                            <span className="aptitude-q-num">Q{index + 1}</span>
                            <span className="aptitude-category-tag">{q.category}</span>
                            <span className={`aptitude-difficulty-tag ${q.difficulty.toLowerCase()}`}>
                              {q.difficulty}
                            </span>
                          </div>

                          <div className="aptitude-card-actions">
                            <button
                              type="button"
                              className={`aptitude-solve-btn ${isQSolved ? "active" : ""}`}
                              onClick={() => toggleSolved(q.title || q.id)}
                            >
                              {isQSolved ? "✓ Solved" : "Mark Solved"}
                            </button>

                            <button
                              type="button"
                              className="aptitude-copy-btn"
                              onClick={() => copyToClipboard(`${q.title}\n${q.question}\n\nAnswer: ${q.correctAnswer}\n\nExplanation:\n${q.explanation}`, q.id)}
                              title="Copy question and answer"
                            >
                              {copiedId === q.id ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                        </div>

                        {/* Title & Question text */}
                        <h3 className="aptitude-title">{q.title}</h3>
                        <p className="aptitude-prompt">{q.question}</p>

                        {/* Options */}
                        {q.options && q.options.length > 0 && (
                          <div className="aptitude-options-grid">
                            {q.options.map((option, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = q.correctAnswer && option.trim().startsWith(q.correctAnswer.slice(0, 2));

                              let optionClass = "aptitude-option-btn";
                              if (isExpanded) {
                                if (isCorrect) optionClass += " option-correct";
                                else if (isSelected) optionClass += " option-wrong";
                              } else if (isSelected) {
                                optionClass += " option-selected";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  className={optionClass}
                                  onClick={() => selectOption(q.id, optIdx)}
                                >
                                  <span className="opt-indicator">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="opt-text">{option.replace(/^[A-D]\)\s*/, "")}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Toggle Solution Button */}
                        <div className="aptitude-solution-toggle-wrap">
                          <button
                            type="button"
                            className={`toggle-solution-btn ${isExpanded ? "open" : ""}`}
                            onClick={() => toggleSolution(q.id)}
                          >
                            <span>{isExpanded ? "▾ Hide Detailed Solution" : "▸ View Answer & Detailed Solution"}</span>
                          </button>
                        </div>

                        {/* Solution Section */}
                        {isExpanded && (
                          <div className="aptitude-solution-box">
                            <div className="solution-answer-badge">
                              <strong>Correct Answer:</strong> {q.correctAnswer}
                            </div>

                            <div className="solution-explanation">
                              <h4>Step-by-Step Derivation & Logic:</h4>
                              <p>{q.explanation}</p>
                            </div>

                            {q.shortcut && (
                              <div className="solution-shortcut">
                                <span>⚡ Key Shortcut & Formula:</span>
                                <p>{q.shortcut}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="no-aptitude-found">
                    <div className="no-apt-icon">🔍</div>
                    <h3>No aptitude questions found</h3>
                    <p>Try adjusting your category filter or search query.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ================================================= */}
          {/* PREPARATION GUIDE SECTION */}
          {/* ================================================= */}
          {activeSection === "preparation" && (
            <section className="company-details">
              <div className="details-header">
                <span>PREPARATION MATERIAL</span>
                <h2>{selectedCompany} Preparation Guide</h2>
                <p>
                  A structured preparation document for your {selectedCompany} interview.
                </p>
              </div>

              <div className="preparation-document">
                <div>
                  <h3>Company Focus</h3>
                  <p>{data.preparation.overview}</p>
                </div>

                <div>
                  <h3>Important Topics</h3>
                  <p>{data.preparation.topics}</p>
                </div>

                <div>
                  <h3>Preparation Strategy</h3>
                  <p>{data.preparation.strategy}</p>
                </div>

                <div>
                  <h3>Interview Tips</h3>
                  <p>{data.preparation.tips}</p>
                </div>
              </div>

              {/* INTERVIEW FORMAT */}
              <div className="details-header interview-format-heading">
                <span>INTERVIEW FORMAT</span>
                <h2>Typical Interview Process</h2>
              </div>

              <div className="experience-list">
                {data.rounds.map((round, index) => (
                  <div className="experience-item" key={round.title}>
                    <div className="experience-number">{index + 1}</div>

                    <div>
                      <h3>{round.title}</h3>
                      <p>{round.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

export default Companies;