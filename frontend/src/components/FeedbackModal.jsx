import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { submitFeedback } from "../api";
import "./FeedbackModal.css";

const FEEDBACK_TYPES = [
  { id: "General Feedback", label: "🌟 General Feedback", icon: "✦" },
  { id: "Feature Request", label: "💡 Feature Request", icon: "✨" },
  { id: "Bug Report", label: "🐛 Bug Report", icon: "⚠️" },
  { id: "Interview Experience", label: "🎯 Interview Experience", icon: "🎙️" },
  { id: "Appreciations & Praise", label: "🚀 Praise & Love", icon: "❤️" },
];

const RATING_LABELS = {
  1: "Needs Improvement 😕",
  2: "Fair 🙂",
  3: "Good 👍",
  4: "Very Good! 🌟",
  5: "Exceptional! 🚀",
};

export default function FeedbackModal({ isOpen, onClose, pageContext = "Home Page - Instant Feedback" }) {
  const { user } = useAuth();

  const [feedbackType, setFeedbackType] = useState("General Feedback");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    // Reset state after transition
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMessage("");
      setMessage("");
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await submitFeedback({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        feedback_type: feedbackType,
        rating: rating || undefined,
        message: message.trim(),
        page_context: pageContext,
      });

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.message || "Failed to deliver feedback. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fb-modal-overlay" onClick={handleClose}>
      <div
        className="fb-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        {/* Glow accent */}
        <div className="fb-modal-glow" />

        {/* Close Button */}
        <button
          type="button"
          className="fb-modal-close"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close feedback dialog"
        >
          ✕
        </button>

        {isSuccess ? (
          /* ================= SUCCESS STATE ================= */
          <div className="fb-success-view">
            <div className="fb-success-icon-wrap">
              <div className="fb-success-icon">✓</div>
            </div>

            <h3 className="fb-success-title">Feedback Sent Directly!</h3>
            <p className="fb-success-desc">
              Thank you for sharing your thoughts with us. Your instant feedback has been delivered directly to the Intervista AI product and engineering team.
            </p>

            <div className="fb-success-summary">
              <div className="fb-summary-item">
                <span>Category:</span>
                <strong>{feedbackType}</strong>
              </div>
              <div className="fb-summary-item">
                <span>Rating:</span>
                <strong>{rating} / 5 Stars ⭐</strong>
              </div>
              {email && (
                <div className="fb-summary-item">
                  <span>Follow-up:</span>
                  <strong>{email}</strong>
                </div>
              )}
            </div>

            <button
              type="button"
              className="fb-btn-primary"
              onClick={handleClose}
              style={{ marginTop: "24px", width: "100%" }}
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* ================= FORM STATE ================= */
          <form className="fb-form" onSubmit={handleSubmit}>
            <div className="fb-modal-header">
              <div className="fb-header-badge">
                <span className="fb-pulse-dot" /> Instant Feedback
              </div>
              <h2 id="feedback-title" className="fb-modal-title">
                Help Us Build the Future of Interviews
              </h2>
              <p className="fb-modal-subtitle">
                Your direct critique, feature requests, or suggestions go straight to our core team's inbox.
              </p>
            </div>

            {errorMessage && (
              <div className="fb-error-banner" role="alert">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Rating Selector */}
            <div className="fb-section">
              <label className="fb-label">
                Overall Experience Rating
                <span className="fb-rating-caption">
                  {RATING_LABELS[hoverRating || rating] || "Select a rating"}
                </span>
              </label>

              <div className="fb-stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`fb-star-btn ${star <= (hoverRating || rating) ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${star} star rating`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Category */}
            <div className="fb-section">
              <label className="fb-label">What is this regarding?</label>
              <div className="fb-chips-grid">
                {FEEDBACK_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`fb-chip ${feedbackType === type.id ? "selected" : ""}`}
                    onClick={() => setFeedbackType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email inputs */}
            <div className="fb-input-grid">
              <div className="fb-input-group">
                <label htmlFor="fb-name" className="fb-label">
                  Your Name <span className="fb-opt">(Optional)</span>
                </label>
                <input
                  id="fb-name"
                  type="text"
                  placeholder="e.g. Alex Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="fb-input"
                  maxLength={60}
                />
              </div>

              <div className="fb-input-group">
                <label htmlFor="fb-email" className="fb-label">
                  Email Address <span className="fb-opt">(For replies)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  placeholder="e.g. alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="fb-input"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Feedback Message */}
            <div className="fb-section">
              <div className="fb-label-row">
                <label htmlFor="fb-message" className="fb-label">
                  Your Feedback / Suggestions <span className="fb-req">*</span>
                </label>
                <span className="fb-char-count">{message.length} / 1500</span>
              </div>
              <textarea
                id="fb-message"
                rows={4}
                required
                maxLength={1500}
                placeholder="What did you love? What was confusing or broken? What features should we add next? Tell us anything!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="fb-textarea"
              />
            </div>

            {/* Destination Disclaimer */}
            <div className="fb-disclaimer">
              ✉️ Delivers directly to the <strong>Intervista AI Team</strong>
            </div>

            {/* Action Buttons */}
            <div className="fb-actions">
              <button
                type="button"
                className="fb-btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="fb-btn-primary"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="fb-spinner" />
                    Sending to Intervista...
                  </>
                ) : (
                  <>Send Instant Feedback 🚀</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
