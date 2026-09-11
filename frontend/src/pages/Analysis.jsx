import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAnalysisData } from "../api";
import {
  FaTrophy,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaMinusCircle,
  FaLightbulb,
  FaExternalLinkAlt,
  FaArrowRight,
  FaRedo,
  FaCompass,
  FaLayerGroup,
  FaBookOpen,
  FaStar,
  FaRocket,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import { VisionAnalysisCard } from "../computerVision/VisionAnalysisCard";
import "./Analysis.css";

export default function Analysis() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAnalysisData();
        if (isMounted) {
          setAnalysisData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load performance analysis.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, []);

  // Loading State
  if (loading) {
    return (
      <main className="analysis-page">
        <div className="container analysis-loading-container">
          <div className="analysis-loading-card">
            <FaSpinner className="analysis-spinner-icon" />
            <h2>Synthesizing Performance Analysis</h2>
            <p>Aggregating your interview results, topic scores, and learning recommendations...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error State (Network or Unhandled API Failure)
  if (error && !analysisData) {
    return (
      <main className="analysis-page">
        <div className="container analysis-empty-container">
          <div className="analysis-empty-card">
            <div className="analysis-empty-icon-wrap error-icon-wrap">
              <FaExclamationCircle className="analysis-empty-icon" />
            </div>
            <h2>Unable to Load Analysis</h2>
            <p>{error}</p>
            <button
              type="button"
              className="analysis-btn analysis-btn-primary"
              onClick={() => window.location.reload()}
            >
              <FaRedo /> Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Section 13: Empty State (No interview history yet)
  const hasInterview = Boolean(analysisData?.has_interview || analysisData?.has_data);

  if (!hasInterview || !analysisData?.performance) {
    return (
      <main className="analysis-page">
        <div className="container analysis-empty-container">
          <div className="analysis-empty-card">
            <div className="analysis-empty-icon-wrap">
              <FaCompass className="analysis-empty-icon" />
            </div>
            <h1 className="analysis-empty-title">No analysis available yet</h1>
            <p className="analysis-empty-subtitle">
              Complete your first interview to unlock personalized performance analysis and learning recommendations.
            </p>
            <div className="analysis-empty-actions">
              <Link to="/dashboard" className="analysis-btn analysis-btn-primary">
                <FaRocket /> Start Interview
              </Link>
              <Link to="/resources" className="analysis-btn analysis-btn-secondary">
                <FaBookOpen /> Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const {
    target_choices = {},
    performance = {},
    strengths = [],
    improvement_areas = [],
    recommended_topics = [],
    recommended_resources = [],
    roadmap = [],
    date,
  } = analysisData;

  const {
    role = "Software Engineer",
    domain = "General Software Engineering",
    difficulty = "Medium",
    interview_type = "Technical",
    company = "Tech Company",
    tag_string,
  } = target_choices;

  const {
    overall_score = 0,
    technical_score = overall_score,
    communication_score = overall_score,
    problem_solving_score = overall_score,
    grade = "B",
    total_questions = 10,
    answered_count = null,
    correct_count = 0,
    partial_count = 0,
    incorrect_count = 0,
    skipped_count = 0,
    completion_rate = 0,
  } = performance;

  // Compute percentage segments for the visual breakdown bar
  const totalSafe = total_questions > 0 ? total_questions : 1;
  const actualAnswered = answered_count !== null && answered_count !== undefined
    ? answered_count
    : Math.max(0, total_questions - skipped_count);
  const actualCompletionRate = Math.round((actualAnswered / totalSafe) * 100);

  const correctPct = Math.round((correct_count / totalSafe) * 100);
  const partialPct = Math.round((partial_count / totalSafe) * 100);
  const incorrectPct = Math.round((incorrect_count / totalSafe) * 100);
  const skippedPct = Math.round((skipped_count / totalSafe) * 100);

  const displayTagString = tag_string || `${role} • ${domain} • ${difficulty} • ${interview_type}`;

  return (
    <main className="analysis-page">
      <div className="container analysis-content-wrap">
        {/* Section 3: Header */}
        <header className="analysis-header">
          <div className="analysis-header-text">
            <div className="analysis-badge-row">
              <span className="analysis-target-pill">
                <FaCompass className="pill-icon" /> {displayTagString}
              </span>
              {date && <span className="analysis-date-badge">{date}</span>}
            </div>
            <h1 className="analysis-main-title">
              Performance <span>Analysis</span>
            </h1>
            <p className="analysis-main-subtitle">
              Your interview performance and personalized improvement roadmap.
            </p>
          </div>
          <div className="analysis-header-actions">
            <button
              type="button"
              className="analysis-btn-sm analysis-btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              <FaRedo /> Reattempt
            </button>
          </div>
        </header>

        {/* Section 4 & 5: Interview Performance Summary & Breakdown */}
        <section className="analysis-grid-summary" aria-label="Interview Performance">
          {/* Card A: Overall Score */}
          <div className="analysis-card analysis-score-card">
            <div className="score-header">
              <span className="card-label">Overall Score</span>
              <span className="score-grade-badge">{grade}</span>
            </div>
            <div className="score-display">
              <span className="score-number">{overall_score}</span>
              <span className="score-total">/100</span>
            </div>
            <div className="score-submetrics">
              <div className="submetric-item">
                <span className="submetric-val">{technical_score}%</span>
                <span className="submetric-lbl">Technical</span>
              </div>
              <div className="submetric-divider" />
              <div className="submetric-item">
                <span className="submetric-val">{problem_solving_score}%</span>
                <span className="submetric-lbl">Problem Solving</span>
              </div>
              <div className="submetric-divider" />
              <div className="submetric-item">
                <span className="submetric-val">{communication_score}%</span>
                <span className="submetric-lbl">Communication</span>
              </div>
            </div>
          </div>

          {/* Card B: Performance Breakdown */}
          <div className="analysis-card analysis-breakdown-card">
            <div className="score-header">
              <span className="card-label">Performance Breakdown</span>
              <span className="completion-badge">{actualAnswered} of {total_questions} Answered ({actualCompletionRate}%)</span>
            </div>

            {/* Compact Visual Segmented Bar */}
            <div className="analysis-segmented-bar" role="progressbar" aria-valuenow={overall_score} aria-valuemin="0" aria-valuemax="100">
              {correctPct > 0 && (
                <div
                  className="seg-bar-fill seg-correct"
                  style={{ width: `${correctPct}%` }}
                  title={`Correct: ${correct_count}`}
                />
              )}
              {partialPct > 0 && (
                <div
                  className="seg-bar-fill seg-partial"
                  style={{ width: `${partialPct}%` }}
                  title={`Partial: ${partial_count}`}
                />
              )}
              {incorrectPct > 0 && (
                <div
                  className="seg-bar-fill seg-incorrect"
                  style={{ width: `${incorrectPct}%` }}
                  title={`Incorrect: ${incorrect_count}`}
                />
              )}
              {skippedPct > 0 && (
                <div
                  className="seg-bar-fill seg-skipped"
                  style={{ width: `${skippedPct}%` }}
                  title={`Skipped: ${skipped_count}`}
                />
              )}
            </div>

            {/* Metric Pills Grid */}
            <div className="analysis-metrics-row">
              <div className="metric-tag tag-correct">
                <FaCheckCircle className="metric-icon" />
                <div className="metric-text">
                  <span className="metric-number">{correct_count}</span>
                  <span className="metric-title">Correct</span>
                </div>
              </div>

              <div className="metric-tag tag-partial">
                <FaExclamationCircle className="metric-icon" />
                <div className="metric-text">
                  <span className="metric-number">{partial_count}</span>
                  <span className="metric-title">Partial</span>
                </div>
              </div>

              <div className="metric-tag tag-incorrect">
                <FaTimesCircle className="metric-icon" />
                <div className="metric-text">
                  <span className="metric-number">{incorrect_count}</span>
                  <span className="metric-title">Incorrect</span>
                </div>
              </div>

              <div className="metric-tag tag-skipped">
                <FaMinusCircle className="metric-icon" />
                <div className="metric-text">
                  <span className="metric-number">{skipped_count}</span>
                  <span className="metric-title">Skipped</span>
                </div>
              </div>
            </div>

            <div className="total-questions-footnote">
              {total_questions} Questions Evaluated • <strong>{actualAnswered} Answered</strong> • <strong>{skipped_count} Skipped</strong> for {company} ({role})
            </div>
          </div>
        </section>

        {/* Section: Computer Vision Presentation Analysis */}
        {analysisData?.vision_data && (
          <VisionAnalysisCard visionData={analysisData.vision_data} />
        )}

        {/* Section 6 & 7: Strengths & Improvement Areas */}
        <section className="analysis-dual-grid" aria-label="Strengths and Improvement Areas">
          {/* Column A: Strengths */}
          <div className="analysis-card strengths-card">
            <div className="card-title-group">
              <div className="card-icon-bubble bubble-green">
                <FaTrophy />
              </div>
              <div>
                <h2 className="card-title">Your Strengths</h2>
                <p className="card-subtitle">Verified high-scoring competencies</p>
              </div>
            </div>

            <ul className="strengths-list">
              {strengths && strengths.length > 0 ? (
                strengths.map((st, idx) => (
                  <li key={`str-${idx}`} className="strength-item">
                    <span className="strength-bullet">✦</span>
                    <span className="strength-text">{st}</span>
                  </li>
                ))
              ) : (
                <li className="strength-item empty-notice">
                  <span className="strength-bullet">•</span>
                  <span className="strength-text">Not enough interview data yet.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column B: Improvement Areas */}
          <div className="analysis-card improvements-card">
            <div className="card-title-group">
              <div className="card-icon-bubble bubble-amber">
                <FaLightbulb />
              </div>
              <div>
                <h2 className="card-title">Improvement Areas</h2>
                <p className="card-subtitle">Identified gaps across evaluated questions</p>
              </div>
            </div>

            <div className="improvements-list">
              {improvement_areas && improvement_areas.length > 0 ? (
                improvement_areas.map((ia, idx) => {
                  const isHighPriority = ia.priority?.toLowerCase().includes("high");
                  const perfClass =
                    ia.current_performance?.toLowerCase().includes("weak")
                      ? "perf-weak"
                      : ia.current_performance?.toLowerCase().includes("practice")
                      ? "perf-practice"
                      : "perf-improve";

                  return (
                    <div key={`imp-${idx}`} className="improvement-item">
                      <div className="imp-top-row">
                        <div className="imp-topic-wrap">
                          <h3 className="imp-topic">{ia.topic}</h3>
                          <span className={`imp-perf-badge ${perfClass}`}>
                            {ia.current_performance}
                          </span>
                        </div>
                        <div className="imp-meta-wrap">
                          <span className="imp-score">{ia.score}%</span>
                          <span className={`imp-priority-pill ${isHighPriority ? "priority-high" : "priority-med"}`}>
                            {ia.priority}
                          </span>
                        </div>
                      </div>
                      <p className="imp-reason">{ia.reason}</p>
                    </div>
                  );
                })
              ) : (
                <div className="improvement-empty-box">
                  <FaShieldAlt className="empty-shield" />
                  <p>No critical weaknesses detected in this session. Maintain momentum with advanced topics below.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 8 & 9: Recommended Topics & Practice Resources */}
        <section className="analysis-section-wrap" aria-label="Recommended Topics and Learning Resources">
          <div className="section-head">
            <div>
              <h2 className="section-main-title">Recommended Topics & Learning Resources</h2>
              <p className="section-subtitle">
                Targeted strictly to your selected choice: <strong>{domain}</strong> ({role})
              </p>
            </div>
            <div className="target-indicator-badge">
              <span>Domain Aligned: {domain}</span>
            </div>
          </div>

          <div className="analysis-dual-grid">
            {/* Column A: Recommended Topics */}
            <div className="analysis-card topics-card">
              <div className="card-title-group">
                <div className="card-icon-bubble bubble-blue">
                  <FaLayerGroup />
                </div>
                <div>
                  <h3 className="card-title">Recommended Topics</h3>
                  <p className="card-subtitle">Prioritized based on question analysis</p>
                </div>
              </div>

              <ol className="recommended-topics-list">
                {recommended_topics && recommended_topics.length > 0 ? (
                  recommended_topics.map((top, idx) => (
                    <li key={`top-${idx}`} className="rec-topic-item">
                      <span className="topic-num">{idx + 1}</span>
                      <span className="topic-name">{top}</span>
                    </li>
                  ))
                ) : (
                  <li className="rec-topic-item">
                    <span className="topic-num">1</span>
                    <span className="topic-name">{domain} Fundamentals</span>
                  </li>
                )}
              </ol>
            </div>

            {/* Column B: Recommended Resources */}
            <div className="analysis-card resources-card">
              <div className="card-title-group">
                <div className="card-icon-bubble bubble-purple">
                  <FaBookOpen />
                </div>
                <div>
                  <h3 className="card-title">Recommended Resources</h3>
                  <p className="card-subtitle">Targeted practice matched to weak areas</p>
                </div>
              </div>

              <div className="resources-list">
                {recommended_resources && recommended_resources.length > 0 ? (
                  recommended_resources.map((res, idx) => {
                    const diffClass =
                      res.difficulty?.toLowerCase() === "easy"
                        ? "diff-easy"
                        : res.difficulty?.toLowerCase() === "hard"
                        ? "diff-hard"
                        : "diff-med";

                    return (
                      <div key={`res-${idx}`} className="analysis-resource-row">
                        <div className="res-info">
                          <div className="res-meta-line">
                            <span className="res-topic-tag">{res.topic}</span>
                            <span className={`res-diff-badge ${diffClass}`}>{res.difficulty}</span>
                          </div>
                          <h4 className="res-name">{res.name}</h4>
                        </div>
                        <div className="res-action">
                          {res.url ? (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="res-link-btn"
                              title={`Practice ${res.name}`}
                            >
                              Practice <FaExternalLinkAlt className="link-ext-icon" />
                            </a>
                          ) : (
                            <Link to="/resources" className="res-link-btn">
                              Study <FaArrowRight className="link-ext-icon" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="resource-fallback-box">
                    <p>Review comprehensive problem sets in the Resources center.</p>
                    <Link to="/resources" className="analysis-btn-sm analysis-btn-secondary">
                      Go to Resources
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Personalized Learning Roadmap ("Your Next Steps") */}
        <section className="analysis-card roadmap-card" aria-label="Personalized Learning Roadmap">
          <div className="card-title-group">
            <div className="card-icon-bubble bubble-cyan">
              <FaCompass />
            </div>
            <div>
              <h2 className="card-title">Your Next Steps</h2>
              <p className="card-subtitle">Actionable path to achieve interview readiness</p>
            </div>
          </div>

          <div className="roadmap-steps-grid">
            {roadmap && roadmap.length > 0 ? (
              roadmap.map((step) => (
                <div key={`step-${step.step_number}`} className="roadmap-step-box">
                  <div className="step-badge">Step {step.step_number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="roadmap-step-box">
                  <div className="step-badge">Step 1</div>
                  <h3 className="step-title">Fix Weak Areas</h3>
                  <p className="step-desc">Focus on the highest-priority improvement topics identified above.</p>
                </div>
                <div className="roadmap-step-box">
                  <div className="step-badge">Step 2</div>
                  <h3 className="step-title">Practice</h3>
                  <p className="step-desc">Solve targeted questions related to those specific topics.</p>
                </div>
                <div className="roadmap-step-box">
                  <div className="step-badge">Step 3</div>
                  <h3 className="step-title">Reattempt Interview</h3>
                  <p className="step-desc">Take another interview at the target difficulty to track improvement.</p>
                </div>
              </>
            )}
          </div>

          <div className="roadmap-action-bar">
            <span className="roadmap-action-prompt">Ready to level up your score?</span>
            <button
              type="button"
              className="analysis-btn analysis-btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              <FaRocket /> Start Next Interview
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
