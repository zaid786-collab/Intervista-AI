/**
 * Computer Vision Configuration for Intervista AI
 * All metrics represent observable presentation behavior only.
 * No psychological, personality, or medical diagnoses are inferred.
 */

export const VISION_CONFIG = {
  // Sampling rate and responsiveness
  analysisIntervalMs: 250, // Run inference every 250ms (~4 FPS, negligible CPU load)
  smoothingWindow: 5, // Number of samples for moving average smoothing

  // Debouncing & Temporal Thresholds
  attentionThresholdMs: 2000, // Sustained looking away (2.0s) before registering an attention event
  faceMissingThresholdMs: 2500, // Sustained face absence (2.5s) before triggering informational tip
  tipDisplayDurationMs: 4000, // Minimum duration an informational tip stays visible

  // Gaze & Head Pose Estimation Thresholds (in degrees)
  headPose: {
    yawThresholdDeg: 22, // Left / Right rotation limit
    pitchDownThresholdDeg: 20, // Downward tilt limit
    pitchUpThresholdDeg: 18, // Upward tilt limit
  },

  // MediaPipe Blendshape Thresholds (Action Units: 0.0 to 1.0)
  blendshapes: {
    gazeAwayThreshold: 0.38, // Looking away blendshape magnitude (eyeLookIn/eyeLookOut)
    smileThreshold: 0.28, // Positive / smile expression
    surpriseThreshold: 0.35, // Eyebrows raised + mouth open
    tenseThreshold: 0.30, // Brow furrowed / tense expression
    blinkThreshold: 0.55, // Eye closure
  },

  // Weights for Deterministic Scoring
  weights: {
    presentationConfidence: {
      cameraFacing: 0.40,
      faceVisibility: 0.30,
      attentionConsistency: 0.15,
      expressivenessStability: 0.15,
    },
    engagementScore: {
      cameraFacing: 0.45,
      faceVisibility: 0.35,
      facialExpressiveness: 0.20,
    },
  },

  // Informational User Messages (Strictly non-punitive, auto-clearing)
  messages: {
    faceMissing: "Please keep your face visible to the camera.",
    attentionAway: "Please try to keep your attention toward the camera.",
    multipleFaces: "Multiple faces detected. Please ensure you are alone in view.",
    visionReady: "Vision active: Face detected",
    visionLoading: "Initializing vision analysis...",
    visionUnavailable: "Computer Vision temporarily unavailable.",
  },

  // Privacy disclosure
  privacyNotice:
    "Computer Vision analyzes camera-based presentation signals during this interview. Raw video is processed locally in your browser and is never stored.",
};
