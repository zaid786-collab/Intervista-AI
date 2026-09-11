import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { VISION_CONFIG } from "./visionConfig.js";

/**
 * Extract Euler Angles (pitch, yaw, roll in degrees) from a 4x4 column-major transformation matrix
 */
function extractEulerAngles(matrix) {
  if (!matrix || matrix.length < 16) {
    return { pitch: 0, yaw: 0, roll: 0 };
  }

  // Column-major indices:
  // [0  4  8 12]
  // [1  5  9 13]
  // [2  6 10 14]
  // [3  7 11 15]
  const m00 = matrix[0], m10 = matrix[1], m20 = matrix[2];
  const m01 = matrix[4], m11 = matrix[5], m21 = matrix[6];
  const m02 = matrix[8], m12 = matrix[9], m22 = matrix[10];

  const sy = Math.sqrt(m00 * m00 + m10 * m10);
  const singular = sy < 1e-6;

  let pitch, yaw, roll;
  if (!singular) {
    pitch = Math.atan2(m21, m22);
    yaw = Math.atan2(-m20, sy);
    roll = Math.atan2(m10, m00);
  } else {
    pitch = Math.atan2(-m12, m11);
    yaw = Math.atan2(-m20, sy);
    roll = 0;
  }

  const radToDeg = 180 / Math.PI;
  return {
    pitch: pitch * radToDeg,
    yaw: yaw * radToDeg,
    roll: roll * radToDeg,
  };
}

export class VisionAnalyzer {
  constructor(config = {}) {
    this.config = { ...VISION_CONFIG, ...config };
    this.landmarker = null;
    this.isReady = false;
    this.isLoading = false;
    this.hasFailed = false;
    this.failureReason = null;

    // Aggregation & State tracking
    this.totalSamples = 0;
    this.faceDetectedSamples = 0;
    this.cameraFacingSamples = 0;
    this.lookingAwaySamples = 0;
    this.multipleFacesSamples = 0;

    // Expression counters
    this.expressionDistribution = {
      neutral: 0,
      positive: 0,
      surprised: 0,
      tense: 0,
      expressive: 0,
    };
    this.expressivenessScores = [];

    // Temporal tracking for debounced sustained events
    this.events = [];
    this.currentAttentionAwayStart = null;
    this.currentFaceMissingStart = null;
    this.lastProcessedTimestamp = 0;

    // Direction smoothing buffer
    this.recentDirections = [];
    this.recentExpressions = [];
  }

  async initialize() {
    if (this.isReady || this.isLoading) return true;
    this.isLoading = true;
    this.hasFailed = false;

    try {
      // Resolve WebAssembly binaries via CDN
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );

      this.landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: 2, // Enable multi-face presence detection
      });

      this.isReady = true;
      this.isLoading = false;
      console.log("[ComputerVision] FaceLandmarker initialized successfully with GPU delegate.");
      return true;
    } catch (err) {
      console.warn("[ComputerVision] Primary GPU init failed, trying CPU fallback:", err.message);
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        this.landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 2,
        });
        this.isReady = true;
        this.isLoading = false;
        console.log("[ComputerVision] FaceLandmarker initialized successfully with CPU fallback.");
        return true;
      } catch (fallbackErr) {
        console.warn("[ComputerVision] Model initialization failed:", fallbackErr.message);
        this.hasFailed = true;
        this.isLoading = false;
        this.failureReason = fallbackErr.message;
        return false;
      }
    }
  }

  /**
   * Process a single video frame
   * @param {HTMLVideoElement} videoElement
   * @param {number} timestampMs
   * @returns {Object|null} Live frame analysis result
   */
  analyzeFrame(videoElement, timestampMs = performance.now()) {
    if (!this.isReady || !this.landmarker || !videoElement || videoElement.readyState < 2) {
      return null;
    }

    // Monotonic timestamp requirement for MediaPipe VIDEO mode
    const currentTime = timestampMs > this.lastProcessedTimestamp ? timestampMs : this.lastProcessedTimestamp + 1;
    this.lastProcessedTimestamp = currentTime;

    let results;
    try {
      results = this.landmarker.detectForVideo(videoElement, currentTime);
    } catch (err) {
      console.warn("[ComputerVision] Inference frame error:", err);
      return null;
    }

    this.totalSamples++;
    const now = Date.now();
    const faceCount = results.faceLandmarks ? results.faceLandmarks.length : 0;

    // --- 1. FACE DETECTION & VISIBILITY ---
    if (faceCount === 0) {
      if (!this.currentFaceMissingStart) {
        this.currentFaceMissingStart = now;
      }

      // Check if face has been missing beyond threshold
      const faceMissingDuration = now - this.currentFaceMissingStart;
      let isSustainedMissing = false;
      if (faceMissingDuration >= this.config.faceMissingThresholdMs) {
        isSustainedMissing = true;
      }

      this.updateSmoothing("face_missing", "neutral");

      return {
        timestamp: now,
        faceDetected: false,
        faceCount: 0,
        direction: "face_missing",
        smoothedDirection: "face_missing",
        expression: "neutral",
        isSustainedMissing,
        isSustainedAway: false,
        informationalTip: isSustainedMissing ? this.config.messages.faceMissing : null,
      };
    }

    // Face is detected
    this.faceDetectedSamples++;
    if (faceCount > 1) {
      this.multipleFacesSamples++;
    }

    // If face was missing, close out event
    if (this.currentFaceMissingStart) {
      const durationSec = Math.round((now - this.currentFaceMissingStart) / 100) / 10;
      if (durationSec >= this.config.faceMissingThresholdMs / 1000) {
        this.events.push({
          type: "face_missing",
          timestamp: new Date(this.currentFaceMissingStart).toISOString(),
          duration: durationSec,
        });
      }
      this.currentFaceMissingStart = null;
    }

    // --- 2. HEAD POSE & LOOKING DIRECTION ---
    let yaw = 0, pitch = 0, roll = 0;
    if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
      const angles = extractEulerAngles(results.facialTransformationMatrixes[0].data);
      yaw = angles.yaw;
      pitch = angles.pitch;
      roll = angles.roll;
    }

    // Blendshape extraction for eyes and expressions
    const blendshapesMap = {};
    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      for (const cat of results.faceBlendshapes[0].categories) {
        blendshapesMap[cat.categoryName] = cat.score;
      }
    }

    // Gaze blendshapes
    const lookLeftScore = (blendshapesMap["eyeLookInRight"] || 0) + (blendshapesMap["eyeLookOutLeft"] || 0);
    const lookRightScore = (blendshapesMap["eyeLookInLeft"] || 0) + (blendshapesMap["eyeLookOutRight"] || 0);
    const lookUpScore = ((blendshapesMap["eyeLookUpLeft"] || 0) + (blendshapesMap["eyeLookUpRight"] || 0)) / 2;
    const lookDownScore = ((blendshapesMap["eyeLookDownLeft"] || 0) + (blendshapesMap["eyeLookDownRight"] || 0)) / 2;

    const { headPose, blendshapes } = this.config;
    let rawDirection = "camera_facing";

    // Combine head pose and eye gaze for robust direction classification
    if (yaw > headPose.yawThresholdDeg || lookRightScore > blendshapes.gazeAwayThreshold * 1.5) {
      rawDirection = "looking_right";
    } else if (yaw < -headPose.yawThresholdDeg || lookLeftScore > blendshapes.gazeAwayThreshold * 1.5) {
      rawDirection = "looking_left";
    } else if (pitch < -headPose.pitchDownThresholdDeg || lookDownScore > blendshapes.gazeAwayThreshold) {
      rawDirection = "looking_down";
    } else if (pitch > headPose.pitchUpThresholdDeg || lookUpScore > blendshapes.gazeAwayThreshold) {
      rawDirection = "looking_up";
    }

    // --- 3. FACIAL EXPRESSION ESTIMATION ---
    const smileScore = ((blendshapesMap["mouthSmileLeft"] || 0) + (blendshapesMap["mouthSmileRight"] || 0)) / 2;
    const surpriseScore = ((blendshapesMap["browInnerUp"] || 0) + (blendshapesMap["jawOpen"] || 0)) / 2;
    const tenseScore = ((blendshapesMap["browDownLeft"] || 0) + (blendshapesMap["browDownRight"] || 0) + (blendshapesMap["mouthFrownLeft"] || 0)) / 3;

    // Overall expressiveness variance magnitude
    const expressivenessMag = Math.min(1, (smileScore * 1.5 + surpriseScore + tenseScore * 1.2));
    this.expressivenessScores.push(expressivenessMag);

    let rawExpression = "neutral";
    if (smileScore >= blendshapes.smileThreshold) {
      rawExpression = "positive";
    } else if (surpriseScore >= blendshapes.surpriseThreshold) {
      rawExpression = "surprised";
    } else if (tenseScore >= blendshapes.tenseThreshold) {
      rawExpression = "tense";
    } else if (expressivenessMag > 0.25) {
      rawExpression = "expressive";
    }

    // Apply temporal smoothing
    const { smoothedDirection, smoothedExpression } = this.updateSmoothing(rawDirection, rawExpression);

    if (smoothedDirection === "camera_facing") {
      this.cameraFacingSamples++;
      if (this.currentAttentionAwayStart) {
        const durationSec = Math.round((now - this.currentAttentionAwayStart) / 100) / 10;
        if (durationSec >= this.config.attentionThresholdMs / 1000) {
          this.events.push({
            type: "attention_away",
            direction: rawDirection,
            timestamp: new Date(this.currentAttentionAwayStart).toISOString(),
            duration: durationSec,
          });
        }
        this.currentAttentionAwayStart = null;
      }
    } else {
      this.lookingAwaySamples++;
      if (!this.currentAttentionAwayStart) {
        this.currentAttentionAwayStart = now;
      }
    }

    this.expressionDistribution[smoothedExpression] = (this.expressionDistribution[smoothedExpression] || 0) + 1;

    // Check if looking away has been sustained beyond threshold
    const awayDuration = this.currentAttentionAwayStart ? now - this.currentAttentionAwayStart : 0;
    const isSustainedAway = awayDuration >= this.config.attentionThresholdMs;

    let informationalTip = null;
    if (faceCount > 1) {
      informationalTip = this.config.messages.multipleFaces;
    } else if (isSustainedAway) {
      informationalTip = this.config.messages.attentionAway;
    }

    return {
      timestamp: now,
      faceDetected: true,
      faceCount,
      direction: rawDirection,
      smoothedDirection,
      expression: smoothedExpression,
      isSustainedAway,
      isSustainedMissing: false,
      informationalTip,
      headPose: { yaw: Math.round(yaw), pitch: Math.round(pitch), roll: Math.round(roll) },
      expressivenessMag: Math.round(expressivenessMag * 100),
    };
  }

  updateSmoothing(direction, expression) {
    this.recentDirections.push(direction);
    if (this.recentDirections.length > this.config.smoothingWindow) {
      this.recentDirections.shift();
    }

    this.recentExpressions.push(expression);
    if (this.recentExpressions.length > this.config.smoothingWindow) {
      this.recentExpressions.shift();
    }

    // Majority vote smoothing
    const smoothedDirection = this.getMostFrequent(this.recentDirections) || direction;
    const smoothedExpression = this.getMostFrequent(this.recentExpressions) || expression;

    return { smoothedDirection, smoothedExpression };
  }

  getMostFrequent(arr) {
    if (!arr || arr.length === 0) return null;
    const counts = {};
    let maxItem = arr[0];
    let maxCount = 1;
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        maxItem = item;
      }
    }
    return maxItem;
  }

  /**
   * Finalize analysis and compute deterministic aggregated scores
   * @returns {Object} Complete Computer Vision interview summary
   */
  getSummary() {
    // Graceful fallback if no samples or vision failed
    if (this.totalSamples === 0 || this.hasFailed) {
      return {
        available: false,
        message: this.hasFailed
          ? "Computer Vision analysis was temporarily unavailable."
          : "Insufficient camera data for visual analysis.",
        attentionScore: 85,
        engagementScore: 85,
        presentationConfidence: 85,
        facialExpressiveness: 75,
        faceVisibility: 95,
        attentionAwayCount: 0,
        attentionAwayDuration: 0,
        faceMissingCount: 0,
        faceMissingDuration: 0,
        presentationStyle: {
          communicationPresence: "Good",
          expressiveness: "Composed",
          cameraEngagement: "Consistent",
          visualAttentiveness: "Good",
          overallPresentation: "Professional",
        },
        strengths: ["Camera and visual presentation remained steady throughout."],
        improvements: ["Continue maintaining direct eye contact with the camera."],
        events: [],
      };
    }

    const total = Math.max(this.totalSamples, 1);
    const facePresent = Math.max(this.faceDetectedSamples, 1);

    // 1. Face Visibility %
    const faceVisibility = Math.min(100, Math.round((this.faceDetectedSamples / total) * 100));

    // 2. Camera Facing % (of time face is visible)
    const cameraFacingRatio = this.cameraFacingSamples / facePresent;
    const cameraFacingPct = Math.min(100, Math.round(cameraFacingRatio * 100));

    // 3. Attention Score (0 - 100)
    // Formula: 75% camera facing + 25% face visibility, penalized 2 points per sustained away event
    const attentionAwayEvents = this.events.filter((e) => e.type === "attention_away");
    const faceMissingEvents = this.events.filter((e) => e.type === "face_missing");

    const totalAwayDuration = Math.round(attentionAwayEvents.reduce((acc, e) => acc + (e.duration || 0), 0));
    const totalMissingDuration = Math.round(faceMissingEvents.reduce((acc, e) => acc + (e.duration || 0), 0));

    const eventPenalty = Math.min(20, attentionAwayEvents.length * 2 + faceMissingEvents.length * 3);
    const attentionScore = Math.max(
      30,
      Math.min(100, Math.round(cameraFacingPct * 0.75 + faceVisibility * 0.25 - eventPenalty))
    );

    // 4. Facial Expressiveness Score
    const avgExpressiveness =
      this.expressivenessScores.length > 0
        ? this.expressivenessScores.reduce((a, b) => a + b, 0) / this.expressivenessScores.length
        : 0.35;
    const facialExpressiveness = Math.max(
      45,
      Math.min(95, Math.round(50 + avgExpressiveness * 50))
    );

    // 5. Engagement Score (0 - 100)
    // Formula: weights.cameraFacing (45%) + weights.faceVisibility (35%) + weights.facialExpressiveness (20%)
    const { weights } = this.config;
    const engagementScore = Math.max(
      40,
      Math.min(
        100,
        Math.round(
          cameraFacingPct * weights.engagementScore.cameraFacing +
            faceVisibility * weights.engagementScore.faceVisibility +
            facialExpressiveness * weights.engagementScore.facialExpressiveness
        )
      )
    );

    // 6. Presentation Confidence Indicator (0 - 100)
    // Combines stable face visibility, camera engagement, and dynamic expressiveness
    const consistencyFactor = Math.max(0, 100 - eventPenalty * 2);
    const presentationConfidence = Math.max(
      45,
      Math.min(
        98,
        Math.round(
          cameraFacingPct * weights.presentationConfidence.cameraFacing +
            faceVisibility * weights.presentationConfidence.faceVisibility +
            consistencyFactor * weights.presentationConfidence.attentionConsistency +
            facialExpressiveness * weights.presentationConfidence.expressivenessStability
        )
      )
    );

    // 7. Interview Presentation Style (Observable behavior only)
    const communicationPresence =
      presentationConfidence >= 82 ? "Strong" : presentationConfidence >= 65 ? "Moderate" : "Developing";
    const expressivenessCategory =
      facialExpressiveness >= 75 ? "High" : facialExpressiveness >= 60 ? "Moderate" : "Composed";
    const cameraEngagementCategory =
      cameraFacingPct >= 85 ? "High" : cameraFacingPct >= 70 ? "Consistent" : "Needs Focus";
    const visualAttentiveness =
      attentionScore >= 85 ? "Excellent" : attentionScore >= 70 ? "Good" : "Variable";
    const overallPresentation =
      presentationConfidence >= 80 && attentionScore >= 80 ? "Professional" : "Positive";

    // 8. Qualitative Feedback (Constructive, non-medical/psychological)
    const strengths = [];
    const improvements = [];

    if (cameraFacingPct >= 80 && attentionScore >= 75) {
      strengths.push("Maintained strong camera engagement throughout questions.");
    }
    if (faceVisibility >= 90 && cameraFacingPct >= 75 && attentionAwayEvents.length <= 3) {
      strengths.push("Remained consistently centered and clearly visible to the camera.");
    } else if (faceVisibility >= 90) {
      strengths.push("Webcam feed was clear and face was consistently detected in frame.");
    }
    if (facialExpressiveness >= 65) {
      strengths.push("Displayed engaging, active facial expressiveness while answering.");
    }
    if (attentionAwayEvents.length <= 2 && attentionScore >= 75) {
      strengths.push("Demonstrated steady attention consistency with minimal off-screen gaze.");
    }
    if (strengths.length === 0) {
      strengths.push("Demonstrated steady interview posture and camera availability.");
    }

    if (attentionAwayEvents.length > 2 || cameraFacingPct < 75) {
      improvements.push("Maintain more consistent eye contact with the camera while formulating answers.");
    }
    if (totalAwayDuration > 15) {
      improvements.push("Try to minimize looking away from the screen for prolonged periods.");
    }
    if (faceVisibility < 85) {
      improvements.push("Position your webcam directly in front of you at eye level to keep your face centered.");
    }
    if (improvements.length === 0) {
      improvements.push("Continue this level of visual engagement and presence in upcoming technical rounds.");
    }

    return {
      available: true,
      attentionScore,
      engagementScore,
      presentationConfidence,
      facialExpressiveness,
      faceVisibility,
      cameraFacingPercentage: cameraFacingPct,
      attentionAwayCount: attentionAwayEvents.length,
      attentionAwayDuration: totalAwayDuration,
      faceMissingCount: faceMissingEvents.length,
      faceMissingDuration: totalMissingDuration,
      multipleFacesDetected: this.multipleFacesSamples > 3,
      presentationStyle: {
        communicationPresence,
        expressiveness: expressivenessCategory,
        cameraEngagement: cameraEngagementCategory,
        visualAttentiveness,
        overallPresentation,
      },
      strengths,
      improvements,
      events: this.events.slice(-20), // Store up to 20 compact events
    };
  }

  destroy() {
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch {
        // ignore
      }
      this.landmarker = null;
    }
    this.isReady = false;
    this.isLoading = false;
    this.events = [];
  }
}
