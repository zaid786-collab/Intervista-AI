/**
 * Intervista AI - Centralized Proctoring & Anti-Cheating Manager
 * 
 * Responsibilities:
 * - Listens to browser visibility, window focus/blur, fullscreen, screen-share, and copy/paste events
 * - Deduplicates multi-event cascades (e.g. blur + visibilitychange + fullscreenexit within 2.5s) into 1 incident
 * - Manages legitimate edge cases (browser permission prompts, preflight setup, recovery grace periods)
 * - Persists session-scoped warnings and violation history in sessionStorage (immune to re-renders / refresh)
 * - Synchronizes authoritatively with backend /api/interviews/violation
 * - Automatically executes interview termination on the 5th confirmed violation
 */

import { getToken } from "../api.js";

export const PROCTORING_VIOLATION_TYPES = {
  TAB_SWITCH: "TAB_SWITCH",
  WINDOW_BLUR: "WINDOW_BLUR",
  FULLSCREEN_EXIT: "FULLSCREEN_EXIT",
  SCREEN_SHARE_STOPPED: "SCREEN_SHARE_STOPPED",
  CAMERA_DISCONNECTED: "CAMERA_DISCONNECTED",
  MIC_DISCONNECTED: "MIC_DISCONNECTED",
  PASTE_DETECTED: "PASTE_DETECTED",
};

export const DEFAULT_PROCTORING_CONFIG = {
  maxWarnings: 5,
  detectTabSwitch: true,
  detectWindowBlur: false, // Window blur is suppressed in favor of authoritative visibilitychange
  requireFullscreen: false, // Default: soft fullscreen warning if user entered fullscreen
  requireScreenShare: true,
  monitorCamera: true,
  monitorMicrophone: true,
  detectCopyPaste: true,
  incidentDebounceMs: 2500, // 2.5 seconds window for collapsing multi-event cascades
  mediaGracePeriodMs: 10000, // 10 seconds recovery window before penalizing disconnected media
};

export class ProctoringManager {
  constructor(options = {}) {
    this.sessionId = options.sessionId || `intv_sess_${Date.now()}`;
    this.company = options.company || "Company";
    this.role = options.role || "Candidate";
    this.difficulty = options.difficulty || "Medium";
    this.config = { ...DEFAULT_PROCTORING_CONFIG, ...(options.config || {}) };

    this.onWarning = options.onWarning || (() => {});
    this.onTerminate = options.onTerminate || (() => {});
    this.onGracePeriodStart = options.onGracePeriodStart || (() => {});
    this.onGracePeriodEnd = options.onGracePeriodEnd || (() => {});

    // State
    this.warningCount = 0;
    this.violations = [];
    this.isTerminated = false;
    this.isActive = false;
    this.isRequestingPermissions = false;

    // Deduplication tracking
    this.lastIncidentTime = 0;
    this.lastIncidentType = null;

    // Media grace period timers
    this.gracePeriodTimers = {
      camera: null,
      microphone: null,
    };

    // Bound event handlers
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleWindowFocus = this.handleWindowFocus.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);

    // Initialize from session storage if recovering from page refresh
    this.restoreSessionState();
  }

  // Session storage key
  get storageKey() {
    return `intervista_proctoring_${this.sessionId}`;
  }

  restoreSessionState() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.warningCount = data.warningCount || 0;
        this.violations = data.violations || [];
        this.isTerminated = data.isTerminated || false;
        console.log(`[PROCTORING] Restored existing session state: ${this.warningCount}/${this.config.maxWarnings} warnings`);
      }
    } catch (e) {
      console.warn("[PROCTORING] Error reading session storage:", e);
    }
  }

  persistSessionState() {
    try {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify({
          sessionId: this.sessionId,
          warningCount: this.warningCount,
          violations: this.violations,
          isTerminated: this.isTerminated,
          updatedAt: Date.now(),
        })
      );
    } catch (e) {
      console.warn("[PROCTORING] Error writing session storage:", e);
    }
  }

  /**
   * Activates proctoring event listeners
   */
  start() {
    if (this.isActive || this.isTerminated) return;
    this.isActive = true;

    console.log("[PROCTORING] Listener initialized");

    if (this.config.detectTabSwitch) {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
    if (this.config.detectWindowBlur) {
      window.addEventListener("blur", this.handleWindowBlur);
      window.addEventListener("focus", this.handleWindowFocus);
    }
    if (this.config.requireFullscreen) {
      document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    }

    console.log(`[PROCTORING] Proctoring active for session: ${this.sessionId}`);
  }

  /**
   * Deactivates event listeners cleanly
   */
  stop() {
    this.isActive = false;
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("blur", this.handleWindowBlur);
    window.removeEventListener("focus", this.handleWindowFocus);
    document.removeEventListener("fullscreenchange", this.handleFullscreenChange);

    // Clear any active grace period timers
    if (this.gracePeriodTimers.camera) {
      clearTimeout(this.gracePeriodTimers.camera);
      this.gracePeriodTimers.camera = null;
    }
    if (this.gracePeriodTimers.microphone) {
      clearTimeout(this.gracePeriodTimers.microphone);
      this.gracePeriodTimers.microphone = null;
    }
  }

  /**
   * Signals that the application is intentionally displaying a permission dialog.
   * Suppresses window blur and tab focus events during this window.
   */
  setPermissionRequesting(isRequesting) {
    this.isRequestingPermissions = isRequesting;
  }

  /**
   * Event deduplication check
   */
  isDebounced(type) {
    const now = Date.now();
    const timeSinceLast = now - this.lastIncidentTime;
    if (timeSinceLast < this.config.incidentDebounceMs) {
      console.log(`[PROCTORING] Deduplicated event '${type}' - within ${timeSinceLast}ms of incident '${this.lastIncidentType}'`);
      return true;
    }
    return false;
  }

  // --- BROWSER EVENT HANDLERS ---

  handleVisibilityChange() {
    if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;

    console.log(`[PROCTORING] Visibility changed: ${document.visibilityState}`);

    if (document.visibilityState === "hidden") {
      console.log("[PROCTORING] TAB_SWITCH detected");
      this.registerViolation({
        type: PROCTORING_VIOLATION_TYPES.TAB_SWITCH,
        message: "You left the interview window.",
        severity: "HIGH",
      });
    } else if (document.visibilityState === "visible") {
      console.log("[PROCTORING] User returned to interview tab (interview continues without additional warning)");
    }
  }

  handleWindowBlur() {
    if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;
    if (!this.config.detectWindowBlur) return;

    // Small delay to allow visibilitychange to fire first if it's a tab switch
    setTimeout(() => {
      if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;
      if (document.visibilityState === "hidden") {
        // Already handled by visibilitychange
        return;
      }
      this.registerViolation({
        type: PROCTORING_VIOLATION_TYPES.WINDOW_BLUR,
        message: "Interview window lost focus. Please remain focused on the interview screen.",
        severity: "MEDIUM",
      });
    }, 200);
  }

  handleWindowFocus() {
    // User returned to window; no penalty
  }

  handleFullscreenChange() {
    if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;

    if (!document.fullscreenElement && this.config.requireFullscreen) {
      this.registerViolation({
        type: PROCTORING_VIOLATION_TYPES.FULLSCREEN_EXIT,
        message: "Please remain in fullscreen mode during the interview.",
        severity: "HIGH",
      });
    }
  }

  /**
   * Screen share stop handler
   */
  handleScreenShareStopped() {
    if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;
    if (!this.config.requireScreenShare) return;

    this.registerViolation({
      type: PROCTORING_VIOLATION_TYPES.SCREEN_SHARE_STOPPED,
      message: "Screen sharing was stopped. Please keep screen sharing enabled during the interview.",
      severity: "HIGH",
    });
  }

  /**
   * Camera dropped handler with Grace Period
   */
  handleCameraDropped(reconnectCallback) {
    if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;
    if (!this.config.monitorCamera) return;

    console.log("[PROCTORING] Camera disconnected. Starting grace period recovery timer (10s)...");
    this.onGracePeriodStart("Camera", 10);

    if (this.gracePeriodTimers.camera) clearTimeout(this.gracePeriodTimers.camera);

    this.gracePeriodTimers.camera = setTimeout(() => {
      this.gracePeriodTimers.camera = null;
      this.onGracePeriodEnd("Camera");
      this.registerViolation({
        type: PROCTORING_VIOLATION_TYPES.CAMERA_DISCONNECTED,
        message: "Camera stream was disconnected and was not recovered within the grace period.",
        severity: "HIGH",
      });
    }, this.config.mediaGracePeriodMs);
  }

  /**
   * Clears camera grace period if candidate recovers camera before timeout
   */
  handleCameraRecovered() {
    if (this.gracePeriodTimers.camera) {
      console.log("[PROCTORING] Camera recovered within grace period! No violation recorded.");
      clearTimeout(this.gracePeriodTimers.camera);
      this.gracePeriodTimers.camera = null;
      this.onGracePeriodEnd("Camera");
    }
  }

  /**
   * Microphone dropped handler with Grace Period
   */
  handleMicrophoneDropped(reconnectCallback) {
    if (!this.isActive || this.isTerminated || this.isRequestingPermissions) return;
    if (!this.config.monitorMicrophone) return;

    console.log("[PROCTORING] Microphone disconnected. Starting grace period recovery timer (10s)...");
    this.onGracePeriodStart("Microphone", 10);

    if (this.gracePeriodTimers.microphone) clearTimeout(this.gracePeriodTimers.microphone);

    this.gracePeriodTimers.microphone = setTimeout(() => {
      this.gracePeriodTimers.microphone = null;
      this.onGracePeriodEnd("Microphone");
      this.registerViolation({
        type: PROCTORING_VIOLATION_TYPES.MIC_DISCONNECTED,
        message: "Microphone stream was disconnected and was not recovered within the grace period.",
        severity: "HIGH",
      });
    }, this.config.mediaGracePeriodMs);
  }

  /**
   * Clears microphone grace period if candidate recovers mic before timeout
   */
  handleMicrophoneRecovered() {
    if (this.gracePeriodTimers.microphone) {
      console.log("[PROCTORING] Microphone recovered within grace period! No violation recorded.");
      clearTimeout(this.gracePeriodTimers.microphone);
      this.gracePeriodTimers.microphone = null;
      this.onGracePeriodEnd("Microphone");
    }
  }

  /**
   * Paste event handler
   */
  handlePasteEvent(e) {
    if (!this.isActive || this.isTerminated) return;
    if (!this.config.detectCopyPaste) return;

    // Prevent default paste if strict
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    this.registerViolation({
      type: PROCTORING_VIOLATION_TYPES.PASTE_DETECTED,
      message: "Pasting externally prepared content during the interview is not allowed. Normal typing is permitted.",
      severity: "HIGH",
    });
  }

  /**
   * Central Violation Registrar
   */
  async registerViolation({ type, message, severity = "HIGH" }) {
    if (this.isTerminated || !this.isActive) return;

    // Deduplication check to prevent duplicate cascades
    if (this.isDebounced(type)) return;

    const now = Date.now();
    this.lastIncidentTime = now;
    this.lastIncidentType = type;

    console.log("[PROCTORING] Registering violation");

    // Optimistic, authoritative local increment
    this.warningCount += 1;
    const currentWarning = this.warningCount;

    const violation = {
      type,
      timestamp: new Date().toISOString(),
      warningNumber: currentWarning,
      message,
      severity,
    };
    this.violations.push(violation);
    this.persistSessionState();

    console.log(`[PROCTORING] Warning count: ${currentWarning}/${this.config.maxWarnings}`);

    // Check if 5th warning was reached -> IMMEDIATE TERMINATION
    if (currentWarning >= this.config.maxWarnings) {
      console.log("[PROCTORING] MAX WARNINGS REACHED");
      console.log("[PROCTORING] TERMINATING INTERVIEW");
      this.terminateInterview();
    } else {
      console.log("[PROCTORING] Warning UI displayed");
      this.onWarning({
        warningNumber: currentWarning,
        maxWarnings: this.config.maxWarnings,
        type,
        message,
        violations: this.violations,
      });
    }

    // Synchronize authoritatively with Backend in background without blocking UI
    this.syncViolationWithBackend(violation, currentWarning);
  }

  /**
   * Asynchronously synchronizes violation with backend
   */
  async syncViolationWithBackend(violation, currentWarning) {
    let serverData = null;
    try {
      const candidateBases = ["http://127.0.0.1:8000", "http://localhost:8000", ""];
      const token = getToken();

      for (const base of candidateBases) {
        try {
          const url = base ? `${base}/api/interviews/violation` : `/api/interviews/violation`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              session_id: this.sessionId,
              company: this.company,
              role: this.role,
              difficulty: this.difficulty,
              violation_type: violation.type,
              message: violation.message,
              severity: violation.severity,
              timestamp: violation.timestamp,
            }),
          });

          if (res.ok) {
            serverData = await res.json();
            break;
          }
        } catch {}
      }
    } catch (err) {
      console.warn("[PROCTORING] Backend violation sync error:", err);
    }

    if (serverData) {
      // Reconcile if server reports a higher count or if server terminated
      if (typeof serverData.warning_count === "number" && serverData.warning_count > this.warningCount) {
        this.warningCount = serverData.warning_count;
        this.persistSessionState();
      }

      if ((serverData.terminated || this.warningCount >= this.config.maxWarnings) && !this.isTerminated) {
        this.terminateInterview(serverData);
      }
    }
  }

  /**
   * Final Termination Action on 5th Violation
   */
  terminateInterview(serverData = null) {
    if (this.isTerminated) return;
    this.isTerminated = true;
    this.stop();
    this.persistSessionState();

    console.log("[PROCTORING] Interview termination successful");

    this.onTerminate({
      warningCount: Math.min(this.warningCount, this.config.maxWarnings),
      maxWarnings: this.config.maxWarnings,
      status: "TERMINATED_FOR_PROCTORING",
      terminationReason: serverData?.termination_reason || "Interview terminated due to repeated proctoring violations.",
      violations: this.violations,
      interviewId: serverData?.interview_id || null,
    });
  }

  getWarningCount() {
    return this.warningCount;
  }

  getViolationHistory() {
    return [...this.violations];
  }

  reset() {
    this.stop();
    this.warningCount = 0;
    this.violations = [];
    this.isTerminated = false;
    try {
      sessionStorage.removeItem(this.storageKey);
    } catch {}
  }
}
