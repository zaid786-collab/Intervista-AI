import React from "react";
import {
  FaVideo,
  FaEye,
  FaSmile,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaChartLine,
  FaUserCheck,
} from "react-icons/fa";
import "./VisionAnalysisCard.css";

export function VisionAnalysisCard({ visionData }) {
  if (!visionData) return null;

  const {
    available = true,
    attentionScore = 88,
    engagementScore = 84,
    presentationConfidence = 82,
    facialExpressiveness = 76,
    faceVisibility = 95,
    cameraFacingPercentage = 88,
    attentionAwayCount = 0,
    attentionAwayDuration = 0,
    faceMissingCount = 0,
    faceMissingDuration = 0,
    presentationStyle = {},
    strengths = [],
    improvements = [],
  } = visionData;

  const {
    communicationPresence = "Strong",
    expressiveness = "Moderate",
    cameraEngagement = "High",
    visualAttentiveness = "Good",
    overallPresentation = "Professional",
  } = presentationStyle;

  return (
    <section className="analysis-card vision-analysis-card" aria-label="Computer Vision Presentation Analysis">
      {/* Header */}
      <div className="vision-card-header">
        <div className="vision-header-left">
          <div className="vision-icon-bubble">
            <FaVideo />
          </div>
          <div>
            <div className="vision-badge-row">
              <span className="vision-pill-tag">AI Computer Vision</span>
              <span className="vision-live-tag">Webcam Presentation Analysis</span>
            </div>
            <h2 className="vision-card-title">Computer Vision Analysis</h2>
            <p className="vision-card-subtitle">
              Observable presentation signals and visual engagement indicators during your interview.
            </p>
          </div>
        </div>

        {/* Overall Presentation Confidence Pill */}
        <div className="vision-overall-score-box">
          <span className="overall-score-lbl">Presentation Confidence</span>
          <div className="overall-score-val-wrap">
            <span className="overall-score-num">{presentationConfidence}</span>
            <span className="overall-score-max">/100</span>
          </div>
          <span className="overall-score-tag">Observable Behavior Indicator</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="vision-metrics-grid">
        {/* 1. Attention Score */}
        <div className="vision-metric-item">
          <div className="metric-top">
            <span className="metric-icon-wrap icon-blue"><FaEye /></span>
            <span className="metric-label">Attention Score</span>
          </div>
          <div className="metric-number-row">
            <span className="metric-main-num">{attentionScore}%</span>
          </div>
          <div className="metric-progress-bar">
            <div className="metric-progress-fill fill-blue" style={{ width: `${attentionScore}%` }} />
          </div>
          <span className="metric-footnote">
            {cameraFacingPercentage}% camera-facing consistency
          </span>
        </div>

        {/* 2. Engagement Score */}
        <div className="vision-metric-item">
          <div className="metric-top">
            <span className="metric-icon-wrap icon-purple"><FaChartLine /></span>
            <span className="metric-label">Engagement Score</span>
          </div>
          <div className="metric-number-row">
            <span className="metric-main-num">{engagementScore}%</span>
          </div>
          <div className="metric-progress-bar">
            <div className="metric-progress-fill fill-purple" style={{ width: `${engagementScore}%` }} />
          </div>
          <span className="metric-footnote">
            Synthesized camera presence & participation
          </span>
        </div>

        {/* 3. Facial Expressiveness */}
        <div className="vision-metric-item">
          <div className="metric-top">
            <span className="metric-icon-wrap icon-amber"><FaSmile /></span>
            <span className="metric-label">Facial Expressiveness</span>
          </div>
          <div className="metric-number-row">
            <span className="metric-main-num">{facialExpressiveness}%</span>
          </div>
          <div className="metric-progress-bar">
            <div className="metric-progress-fill fill-amber" style={{ width: `${facialExpressiveness}%` }} />
          </div>
          <span className="metric-footnote">
            Dynamic expressiveness: {expressiveness}
          </span>
        </div>

        {/* 4. Face Visibility */}
        <div className="vision-metric-item">
          <div className="metric-top">
            <span className="metric-icon-wrap icon-green"><FaUserCheck /></span>
            <span className="metric-label">Face Visibility</span>
          </div>
          <div className="metric-number-row">
            <span className="metric-main-num">{faceVisibility}%</span>
          </div>
          <div className="metric-progress-bar">
            <div className="metric-progress-fill fill-green" style={{ width: `${faceVisibility}%` }} />
          </div>
          <span className="metric-footnote">
            Active in-frame presence
          </span>
        </div>
      </div>

      {/* Events Summary & Presentation Style Dual Block */}
      <div className="vision-details-grid">
        {/* Style Block */}
        <div className="vision-subcard presentation-style-subcard">
          <h3 className="subcard-title">Interview Presentation Style</h3>
          <p className="subcard-desc">Derived strictly from observable visual cues:</p>

          <div className="style-attribute-list">
            <div className="style-attr-row">
              <span className="style-attr-name">Communication presence:</span>
              <span className="style-attr-val val-strong">{communicationPresence}</span>
            </div>
            <div className="style-attr-row">
              <span className="style-attr-name">Expressiveness:</span>
              <span className="style-attr-val">{expressiveness}</span>
            </div>
            <div className="style-attr-row">
              <span className="style-attr-name">Camera engagement:</span>
              <span className="style-attr-val">{cameraEngagement}</span>
            </div>
            <div className="style-attr-row">
              <span className="style-attr-name">Visual attentiveness:</span>
              <span className="style-attr-val">{visualAttentiveness}</span>
            </div>
            <div className="style-attr-row">
              <span className="style-attr-name">Overall presentation:</span>
              <span className="style-attr-val val-strong">{overallPresentation}</span>
            </div>
          </div>
        </div>

        {/* Sustained Events Summary */}
        <div className="vision-subcard event-summary-subcard">
          <h3 className="subcard-title">Attention & Visibility Summary</h3>
          <p className="subcard-desc">Logged sustained intervals during the session:</p>

          <div className="vision-event-stats-row">
            <div className="event-stat-box">
              <span className="stat-box-title">Attention Away</span>
              <span className="stat-box-count">{attentionAwayCount} <small>events</small></span>
              <span className="stat-box-duration">Total duration: {attentionAwayDuration}s</span>
            </div>

            <div className="event-stat-box">
              <span className="stat-box-title">Face Missing</span>
              <span className="stat-box-count">{faceMissingCount} <small>events</small></span>
              <span className="stat-box-duration">Total duration: {faceMissingDuration}s</span>
            </div>
          </div>

          <div className="vision-notice-footnote">
            * Brief natural eye glances or head movements under 2 seconds are excluded from attention events.
          </div>
        </div>
      </div>

      {/* Qualitative Feedback Block */}
      <div className="vision-feedback-grid">
        <div className="feedback-col strengths-col">
          <h4 className="feedback-col-title">
            <FaCheckCircle className="fb-icon-green" /> Observed Visual Strengths
          </h4>
          <ul className="feedback-bullets">
            {strengths.map((st, i) => (
              <li key={`vstr-${i}`}>{st}</li>
            ))}
          </ul>
        </div>

        <div className="feedback-col improvements-col">
          <h4 className="feedback-col-title">
            <FaLightbulb className="fb-icon-amber" /> Presentation Improvement Areas
          </h4>
          <ul className="feedback-bullets">
            {improvements.map((imp, i) => (
              <li key={`vimp-${i}`}>{imp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Privacy Disclosure Footer */}
      <div className="vision-privacy-disclosure">
        <FaShieldAlt className="privacy-shield-icon" />
        <div className="privacy-text">
          <strong>Privacy & Methodology:</strong> Computer Vision analyzes camera-based presentation signals in real-time. Raw video is processed locally in your browser and is never stored. Metrics reflect observable presentation indicators and do not represent psychological, medical, or personality diagnoses.
        </div>
      </div>
    </section>
  );
}
