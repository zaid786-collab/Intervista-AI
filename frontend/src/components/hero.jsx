import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import DemoModal from "./DemoModal";
import FeedbackModal from "./FeedbackModal";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };
  return (
    <>
      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="left">

          <div className="badge">
            🟢 Live now — real-time voice interviews
          </div>

          <h1>
            Walk into your
            <br />
            <span>next interview</span>
            <br />
            <span className="span2">already having won it.</span>
          </h1>

          <p>
            Intervista AI runs realistic AI mock interviews that listen,
            challenge your answers and provide instant feedback to help you
            crack your dream job.
          </p>

          <div className="buttons">

            <button
              className="primary"
              onClick={handleStart}
            >
              🎤 Start Interview
            </button>

            <button
              className="secondary"
              onClick={() => setIsDemoModalOpen(true)}
            >
              ▶ Watch Demo
            </button>

          </div>

        </div>

        <div className="right">

          <div className="voiceCircle">

            <div className="innerCircle">

              <div className="bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= WHY INTERVISTA AI ================= */}

      <section className="home-section why-section">

        <div className="section-heading">

          <span>WHY INTERVISTA AI</span>

          <h2>
            Everything you need to
            <br />
            <span>prepare with confidence.</span>
          </h2>

          <p>
            Intervista AI combines realistic interview practice,
            intelligent feedback, and personalized preparation into
            one platform.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              ✦
            </div>

            <h3>AI-Powered Interviews</h3>

            <p>
              Practice realistic technical and behavioral interviews
              with an AI interviewer that adapts to your responses.
            </p>

          </div>


          <div
            className="feature-card feature-card-interactive"
            onClick={() => setIsFeedbackModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Open instant feedback form"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsFeedbackModalOpen(true);
              }
            }}
          >
            <div className="feature-card-header">
              <div className="feature-icon">
                ◈
              </div>
              <span className="feature-live-pill">✦ Send Feedback</span>
            </div>

            <h3>Instant Feedback</h3>

            <p>
              Understand your strengths, identify weak areas and
              receive actionable feedback after every interview.
            </p>

            <div className="feature-card-action">
              <span>Share feedback with team</span>
              <span className="feature-action-arrow">→</span>
            </div>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ↗
            </div>

            <h3>Personalized Preparation</h3>

            <p>
              Your preparation evolves with your performance,
              helping you focus on the areas that need the most work.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="home-section how-section">

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            From preparation to
            <br />
            <span>interview-ready.</span>
          </h2>

        </div>


        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <h3>
              Choose your interview
            </h3>

            <p>
              Select your role, domain and interview type
              based on the career you are targeting.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <h3>
              Practice with AI
            </h3>

            <p>
              Take a realistic interview where AI asks questions
              and responds dynamically to your answers.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <h3>
              Improve your performance
            </h3>

            <p>
              Analyze your results, review feedback and practice
              again until you become interview-ready.
            </p>

          </div>

        </div>

      </section>


      {/* ================= WHAT YOU CAN PRACTICE ================= */}

      <section className="home-section practice-section">

        <div className="section-heading">

          <span>
            INTERVIEW PREPARATION
          </span>

          <h2>
            Practice for the interviews
            <br />
            <span>that actually matter.</span>
          </h2>

          <p>
            Prepare across multiple areas of technical and
            professional interviewing.
          </p>

        </div>


        <div className="practice-grid">

          <div className="practice-card">

            <span>01</span>

            <h3>
              Technical Interviews
            </h3>

            <p>
              DSA, programming, databases, operating systems,
              computer networks and core CS concepts.
            </p>

          </div>


          <div className="practice-card">

            <span>02</span>

            <h3>
              Behavioral Interviews
            </h3>

            <p>
              Improve communication, confidence and answers
              to common behavioral interview questions.
            </p>

          </div>


          <div className="practice-card">

            <span>03</span>

            <h3>
              Company Preparation
            </h3>

            <p>
              Prepare according to the interview patterns,
              roles and expectations of different companies.
            </p>

          </div>


          <div className="practice-card">

            <span>04</span>

            <h3>
              Mock Interviews
            </h3>

            <p>
              Simulate complete interview experiences before
              appearing in the real interview.
            </p>

          </div>

        </div>

      </section>


      {/* ================= AI FEATURES ================= */}

      <section className="home-section ai-section">

        <div className="ai-content">

          <span>
            INTELLIGENT FEEDBACK
          </span>

          <h2>
            Don't just practice.
            <br />
            <span>
              Understand how you perform.
            </span>
          </h2>

          <p>
            Intervista AI analyzes your interview performance
            and turns every session into useful insights.
          </p>


          <div className="ai-points">

            <div>
              <strong>
                ✓ Communication analysis
              </strong>

              <p>
                Identify how clearly and confidently you communicate.
              </p>
            </div>


            <div>
              <strong>
                ✓ Technical performance
              </strong>

              <p>
                Understand where your technical knowledge needs improvement.
              </p>
            </div>


            <div>
              <strong>
                ✓ Performance tracking
              </strong>

              <p>
                Track your improvement across multiple interviews.
              </p>
            </div>

          </div>

        </div>


        <div className="ai-visual">

          <div className="ai-glow"></div>

          <div className="ai-score-card">

            <span>
              INTERVIEW SCORE
            </span>

            <strong>
              86%
            </strong>

            <div className="score-bar">
              <div></div>
            </div>

            <small>
              ↑ 12% improvement from your last interview
            </small>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="home-cta">

        <div>

          <span>
            READY TO START?
          </span>

          <h2>
            Your next interview
            <br />
            starts with preparation.
          </h2>

          <p>
            Practice smarter, understand your weaknesses,
            and walk into your next interview with confidence.
          </p>

          <button
            className="cta-button"
            onClick={handleStart}
          >
            Start free interview →
          </button>

        </div>

      </section>

      {/* Interactive Demo Video & Walkthrough Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Instant Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        pageContext="Home Page - Instant Feedback Feature"
      />

    </>
  );
}

export default Hero;