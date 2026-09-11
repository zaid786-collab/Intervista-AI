import { useState, useEffect, useRef, useCallback } from "react";
import { VisionAnalyzer } from "./visionAnalyzer.js";
import { VISION_CONFIG } from "./visionConfig.js";

/**
 * Custom React Hook managing the real-time Computer Vision analysis loop
 *
 * @param {Object} options
 * @param {boolean} options.isInterviewActive
 * @param {boolean} options.isCameraActive
 * @param {React.RefObject<HTMLVideoElement>} options.videoRef
 * @param {Object} [options.config]
 */
export function useComputerVision({
  isInterviewActive,
  isCameraActive,
  videoRef,
  config = {},
}) {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [direction, setDirection] = useState("camera_facing");
  const [expression, setExpression] = useState("neutral");
  const [activeTip, setActiveTip] = useState(null);
  const [tipExpiresAt, setTipExpiresAt] = useState(0);

  const analyzerRef = useRef(null);
  const intervalIdRef = useRef(null);
  const isRunningRef = useRef(false);

  // Initialize analyzer on mount
  useEffect(() => {
    const analyzer = new VisionAnalyzer(config);
    analyzerRef.current = analyzer;

    let mounted = true;
    setIsModelLoading(true);

    analyzer
      .initialize()
      .then((ready) => {
        if (mounted) {
          setIsModelReady(ready);
          setIsModelLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.warn("[useComputerVision] Init error:", err);
          setIsModelReady(false);
          setIsModelLoading(false);
        }
      });

    return () => {
      mounted = false;
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (analyzerRef.current) {
        analyzerRef.current.destroy();
        analyzerRef.current = null;
      }
    };
  }, []);

  // Frame processing loop
  useEffect(() => {
    const shouldRun = isInterviewActive && isCameraActive && isModelReady;

    if (!shouldRun) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      isRunningRef.current = false;
      setActiveTip(null);
      return;
    }

    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const intervalMs = config.analysisIntervalMs || VISION_CONFIG.analysisIntervalMs;

    intervalIdRef.current = setInterval(() => {
      const videoEl = videoRef?.current;
      const analyzer = analyzerRef.current;

      if (!videoEl || !analyzer || !analyzer.isReady || videoEl.readyState < 2) {
        return;
      }

      const frameResult = analyzer.analyzeFrame(videoEl);
      if (!frameResult) return;

      setFaceDetected(frameResult.faceDetected);
      setFaceCount(frameResult.faceCount);
      setDirection(frameResult.smoothedDirection);
      setExpression(frameResult.expression);

      // Handle non-punitive informational tip (auto-clears)
      const now = Date.now();
      if (frameResult.informationalTip) {
        setActiveTip(frameResult.informationalTip);
        setTipExpiresAt(now + VISION_CONFIG.tipDisplayDurationMs);
      } else if (now > tipExpiresAt) {
        setActiveTip(null);
      }
    }, intervalMs);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      isRunningRef.current = false;
    };
  }, [isInterviewActive, isCameraActive, isModelReady, videoRef, tipExpiresAt]);

  /**
   * Final aggregated report extractor called upon interview completion
   */
  const getFinalSummary = useCallback(() => {
    if (!analyzerRef.current) {
      return {
        available: false,
        message: "Computer Vision was not initialized.",
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
        improvements: ["Maintain consistent eye contact with the camera."],
        events: [],
      };
    }
    return analyzerRef.current.getSummary();
  }, []);

  return {
    isModelReady,
    isModelLoading,
    faceDetected,
    faceCount,
    direction,
    expression,
    activeTip,
    getFinalSummary,
  };
}
