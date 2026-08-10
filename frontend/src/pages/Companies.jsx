import { useState } from "react";
import "./Companies.css";

const companyData = {
  Google: {
    stats: ["150+", "100+", "30+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hash Map",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Longest Substring Without Repeating Characters",
        topic: "Strings • Sliding Window",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        title: "LRU Cache",
        topic: "Design • Hash Map",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        title: "Word Ladder",
        topic: "Graphs • BFS",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/word-ladder/",
      },
    ],

    mostAsked: [
      "Explain the difference between BFS and DFS.",
      "How does a HashMap work internally?",
      "What is the time complexity of binary search?",
      "Explain process vs thread.",
      "What is normalization in databases?",
      "How would you design a URL shortener?",
    ],

    preparation: {
      overview:
        "Focus on strong DSA fundamentals, problem-solving ability, computer science fundamentals and clear communication.",
      topics:
        "Arrays, Strings, Trees, Graphs, Dynamic Programming, Hashing, Binary Search and System Design.",
      strategy:
        "Practice problems without memorizing solutions. Focus on explaining your approach, complexity and edge cases.",
      tips:
        "During interviews, clarify the problem first, discuss your approach, write clean code and test it with examples.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding problems used for initial screening.",
      },
      {
        title: "Technical Interview",
        description:
          "DSA, algorithms, problem solving and CS fundamentals.",
      },
      {
        title: "Advanced Technical",
        description:
          "More complex coding, design and problem-solving discussion.",
      },
      {
        title: "Behavioral / Googliness",
        description:
          "Communication, collaboration, leadership and behavioral discussion.",
      },
    ],
  },

  Microsoft: {
    stats: ["130+", "90+", "28+"],

    questions: [
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs • BFS/DFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        title: "Course Schedule",
        topic: "Graphs • Topological Sort",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What is the difference between process and thread?",
      "Explain virtual memory.",
      "What is a deadlock?",
      "Explain database indexing.",
      "How would you design a scalable application?",
    ],

    preparation: {
      overview:
        "Microsoft interviews emphasize problem solving, coding fundamentals, CS concepts and communication.",
      topics:
        "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, OOP, OS, DBMS and Networks.",
      strategy:
        "Practice medium-level DSA problems and make sure you can explain multiple approaches.",
      tips:
        "Think aloud during the interview and explain why your chosen approach is efficient.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding and problem-solving assessment.",
      },
      {
        title: "Technical Round 1",
        description:
          "DSA and coding fundamentals.",
      },
      {
        title: "Technical Round 2",
        description:
          "Advanced coding and computer science concepts.",
      },
      {
        title: "Behavioral Round",
        description:
          "Teamwork, leadership, communication and experience.",
      },
    ],
  },

  Amazon: {
    stats: ["180+", "120+", "32+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hash Map",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Longest Palindromic Substring",
        topic: "Strings • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
      },
      {
        title: "Binary Tree Level Order Traversal",
        topic: "Trees • BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        title: "Rotting Oranges",
        topic: "Graphs • BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/rotting-oranges/",
      },
      {
        title: "Trapping Rain Water",
        topic: "Arrays • Two Pointer",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/trapping-rain-water/",
      },
    ],

    mostAsked: [
      "Explain the difference between stack and heap.",
      "How does BFS work?",
      "Explain binary search.",
      "What is database indexing?",
      "Explain caching.",
      "Tell me about a difficult technical problem you solved.",
    ],

    preparation: {
      overview:
        "Amazon places strong emphasis on coding, problem solving and behavioral principles.",
      topics:
        "Arrays, Strings, Trees, Graphs, Dynamic Programming, Sorting, Searching and System Design.",
      strategy:
        "Practice timed coding problems and prepare structured behavioral answers.",
      tips:
        "Use structured examples for behavioral questions and always analyze time and space complexity.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding assessment with algorithmic problems.",
      },
      {
        title: "Technical Interviews",
        description:
          "DSA, coding and technical fundamentals.",
      },
      {
        title: "Bar Raiser / Advanced Round",
        description:
          "Deeper technical and behavioral evaluation.",
      },
      {
        title: "Leadership Principles",
        description:
          "Behavioral questions based on Amazon's leadership principles.",
      },
    ],
  },
};

const defaultCompanyData = {
  stats: ["100+", "70+", "25+"],

  questions: [
    {
      title: "Two Sum",
      topic: "Arrays • Hash Map",
      difficulty: "Easy",
      url: "https://leetcode.com/problems/two-sum/",
    },
    {
      title: "Valid Parentheses",
      topic: "Stack",
      difficulty: "Easy",
      url: "https://leetcode.com/problems/valid-parentheses/",
    },
    {
      title: "Binary Tree Level Order Traversal",
      topic: "Trees • BFS",
      difficulty: "Medium",
      url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
    {
      title: "Number of Islands",
      topic: "Graphs • BFS/DFS",
      difficulty: "Medium",
      url: "https://leetcode.com/problems/number-of-islands/",
    },
  ],

  mostAsked: [
    "Explain OOP principles.",
    "What is the difference between process and thread?",
    "Explain database normalization.",
    "What is a REST API?",
    "Explain time and space complexity.",
  ],

  preparation: {
    overview:
      "Build strong DSA fundamentals and prepare the core computer science subjects required for technical interviews.",
    topics:
      "Arrays, Strings, Linked Lists, Trees, Graphs, OOP, DBMS, OS and Computer Networks.",
    strategy:
      "Practice consistently and focus on understanding patterns instead of memorizing solutions.",
    tips:
      "Explain your thought process clearly and always discuss complexity.",
  },

  rounds: [
    {
      title: "Online Assessment",
      description:
        "Initial coding and aptitude screening.",
    },
    {
      title: "Technical Round",
      description:
        "DSA and computer science fundamentals.",
    },
    {
      title: "Advanced Technical Round",
      description:
        "Problem solving and role-specific technical discussion.",
    },
    {
      title: "HR / Behavioral",
      description:
        "Communication, teamwork and behavioral discussion.",
    },
  ],
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

  const data =
    companyData[selectedCompany] || defaultCompanyData;

  const toggleSolved = (questionTitle) => {
    const key = `${selectedCompany}-${questionTitle}`;

    setSolvedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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