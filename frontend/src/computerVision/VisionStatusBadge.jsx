import React from "react";
import { FaEye, FaRegSmile, FaInfoCircle } from "react-icons/fa";

export function VisionStatusBadge({
  isModelReady,
  isModelLoading,
  faceDetected,
  direction,
  expression,
  activeTip,
}) {
  const getDirectionLabel = (dir) => {
    switch (dir) {
      case "camera_facing":
        return "Centered";
      case "looking_left":
        return "Looking Left";
      case "looking_right":
        return "Looking Right";
      case "looking_up":
        return "Looking Up";
      case "looking_down":
        return "Looking Down";
      default:
        return "Active";
    }
  };

  const getExpressionLabel = (expr) => {
    switch (expr) {
      case "positive":
        return "Positive";
      case "surprised":
        return "Expressive";
      case "tense":
        return "Focused";
      default:
        return "Composed";
    }
  };

  return (
    <div className="vision-status-container">
      {/* 1. Main Status Pill */}
      <div className="vision-status-pill">
        <span
          className={`vision-status-dot ${
            faceDetected ? "dot-active" : isModelReady ? "dot-searching" : "dot-loading"
          }`}
        />
        <span className="vision-status-text">
          {isModelLoading
            ? "Vision Init..."
            : faceDetected
            ? `Vision: ${getDirectionLabel(direction)}`
            : "Vision: Searching"}
        </span>
        {faceDetected && (
          <span className="vision-expression-tag" title="Facial expressiveness indicator">
            <FaRegSmile style={{ fontSize: "10px", marginRight: "3px" }} />
            {getExpressionLabel(expression)}
          </span>
        )}
      </div>

      {/* 2. Non-intrusive Informational Tip (strictly informational, auto-clearing) */}
      {activeTip && (
        <div className="vision-info-tip" role="status" aria-live="polite">
          <FaInfoCircle className="tip-icon" />
          <span>{activeTip}</span>
        </div>
      )}
    </div>
  );
}
