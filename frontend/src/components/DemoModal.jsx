import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./DemoModal.css";

const chapters = [
  {
    id: "voice-ai",
    title: "1. Voice AI Mock Interview",
    badge: "Real-Time Speech & Vision",
    icon: "🎙️",
    duration: 35,
    tagline: "Realistic AI interviewer with audio waveform & proctor telemetry",
    highlights: [
      "Dynamic question generation based on your target role and resume",
      "Real-time voice activity detection (VAD) with natural speech pauses",
      "Webcam proctoring telemetry & eye-contact feedback",
      "Adaptive follow-up questions tailored to your spoken answers",
    ],
  },
  {
    id: "live-code",
    title: "2. Live Coding & Whiteboard",
    badge: "Compiler & Test Cases",
    icon: "💻",
    duration: 35,
    tagline: "Integrated code editor with automated test suite & complexity analysis",
    highlights: [
      "Multi-language support: Python, JavaScript, Java, C++, Go",
      "Instant execution against edge cases and hidden test suites",
      "Algorithmic time and space complexity evaluation",
      "Interactive drawing whiteboard for system design diagrams",
    ],
  },
  {
    id: "resume-ats",
    title: "3. Resume ATS Analyzer",
    badge: "AI Skill Matcher",
    icon: "📄",
    duration: 30,
    tagline: "Instant ATS score, keyword matching, and skill gap identification",
    highlights: [
      "Deep PDF/Word parsing with recruiter ATS compatibility scoring",
      "Target Job Description comparison with missing keywords highlight",
      "Quantifiable impact recommendations and bullet point improvements",
      "Automatic custom mock interview questions mapped to your resume",
    ],
  },
  {
    id: "company-hub",
    title: "4. Company & Aptitude Hub",
    badge: "15+ Top Companies",
    icon: "🏢",
    duration: 30,
    tagline: "Company-specific DSA roadmaps, most asked questions & aptitude tests",
    highlights: [
      "Verified questions for Google, Microsoft, Amazon, Meta, Apple, TCS, etc.",
      "Comprehensive Quantitative Aptitude, Logical Reasoning & Classic Puzzles",
      "Step-by-step mathematical derivations and formula shortcut cards",
      "Direct one-click LeetCode problem solving connections",
    ],
  },
  {
    id: "analytics",
    title: "5. Analytics & Scorecard",
    badge: "AI Performance Report",
    icon: "📊",
    duration: 30,
    tagline: "Comprehensive telemetry report, confidence metrics & growth tracking",
    highlights: [
      "Granular scoring on Technical Accuracy, Communication & Problem Solving",
      "Pace of speech, filler word counters, and pause duration breakdown",
      "Actionable recommendations with model answer comparisons",
      "Downloadable PDF report for interview review and progress tracking",
    ],
  },
];

export default function DemoModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeViewMode, setActiveViewMode] = useState("interactive"); // "interactive" | "custom_video"
  const [customVideoUrl, setCustomVideoUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  const currentChapter = chapters[activeChapterIndex];

  // Auto-play timer for interactive tour
  useEffect(() => {
    if (!isOpen || !isPlaying || activeViewMode !== "interactive") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next chapter or loop
          setActiveChapterIndex((c) => (c + 1) % chapters.length);
          return 0;
        }
        return prev + (100 / (currentChapter.duration * 10)) * playbackSpeed;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeChapterIndex, playbackSpeed, activeViewMode, currentChapter]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartNow = () => {
    onClose();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const handleChapterSelect = (index) => {
    setActiveChapterIndex(index);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.5, 2];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
  };

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <div
        className={`demo-modal-window ${isFullscreen ? "fullscreen" : ""}`}
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="demo-modal-header">
          <div className="demo-header-info">
            <div className="demo-header-badge">
              <span className="live-dot"></span>
              ✦ INTERVISTA AI PRODUCT DEMO
            </div>
            <h2>Walkthrough & Interactive Showcase</h2>
          </div>

          <div className="demo-header-actions">
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${activeViewMode === "interactive" ? "active" : ""}`}
                onClick={() => setActiveViewMode("interactive")}
              >
                🎮 Interactive Tour
              </button>
              <button
                type="button"
                className={`mode-btn ${activeViewMode === "custom_video" ? "active" : ""}`}
                onClick={() => setActiveViewMode("custom_video")}
              >
                📹 Video Stream
              </button>
            </div>

            <button
              type="button"
              className="demo-close-btn"
              onClick={onClose}
              aria-label="Close demo"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chapter Tabs */}
        <div className="demo-chapters-bar">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              className={`chapter-tab ${activeChapterIndex === idx ? "active" : ""}`}
              onClick={() => handleChapterSelect(idx)}
            >
              <span className="chapter-icon">{ch.icon}</span>
              <div className="chapter-meta">
                <strong>{ch.title}</strong>
                <small>{ch.badge}</small>
              </div>
              {activeChapterIndex === idx && (
                <div
                  className="chapter-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Showcase Stage */}
        <div className="demo-stage-area">
          {activeViewMode === "interactive" ? (
            <div className="interactive-stage">
              {/* Simulated Screen */}
              <div className="simulated-device-frame">
                <div className="device-top-bar">
                  <div className="window-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="device-url-bar">
                    🔒 https://intervista-ai.com/session/{currentChapter.id}
                  </div>
                  <span className="device-status-badge">● LIVE INTERACTIVE</span>
                </div>

                <div className="device-screen-content">
                  {/* Dynamic Simulation based on chapter */}
                  {activeChapterIndex === 0 && (
                    <div className="sim-voice-screen">
                      <div className="sim-interviewer-card">
                        <div className="ai-avatar-glow">
                          <span className="ai-avatar-emoji">🤖</span>
                          <div className="ai-pulse-ring"></div>
                        </div>
                        <div className="ai-speech-bubble">
                          <span className="bubble-speaker">AI Senior Interviewer (Google SDE II)</span>
                          <p>
                            "Welcome Alex! Let's start with system scalability. How would you design a distributed caching layer that prevents thundering herds during peak load?"
                          </p>
                        </div>
                      </div>

                      <div className="sim-waveform-wrap">
                        <div className="sim-waveform">
                          <span className="w-bar b1"></span>
                          <span className="w-bar b2"></span>
                          <span className="w-bar b3"></span>
                          <span className="w-bar b4"></span>
                          <span className="w-bar b5"></span>
                          <span className="w-bar b6"></span>
                          <span className="w-bar b7"></span>
                          <span className="w-bar b8"></span>
                          <span className="w-bar b9"></span>
                        </div>
                        <span className="waveform-label">🎙️ Live Candidate Audio Stream • 48 kHz Natural VAD</span>
                      </div>

                      <div className="sim-telemetry-pill-row">
                        <div className="telemetry-pill">
                          <span>👁️ Eye Contact</span>
                          <strong>94% Stable</strong>
                        </div>
                        <div className="telemetry-pill">
                          <span>🗣️ Speech Clarity</span>
                          <strong>138 WPM (Optimal)</strong>
                        </div>
                        <div className="telemetry-pill">
                          <span>🎯 Confidence</span>
                          <strong>High</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeChapterIndex === 1 && (
                    <div className="sim-code-screen">
                      <div className="code-editor-header">
                        <div className="file-tab active">solution.py</div>
                        <div className="file-tab">test_cases.py</div>
                        <span className="lang-tag">Python 3.11</span>
                      </div>
                      <div className="code-editor-body">
                        <pre>
                          <code>
{`def findKthLargest(nums: List[int], k: int) -> int:
    # Min-Heap optimization for O(N log K) time
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

# Automated Test Suite: 18/18 Passed ✓
# Time Complexity: O(N log K) | Space: O(K)`}
                          </code>
                        </pre>
                      </div>
                      <div className="code-run-console">
                        <span className="console-status">✓ All 18 Test Cases Passed in 42ms</span>
                        <span className="console-perf">Memory: 14.8 MB (Top 92%)</span>
                      </div>
                    </div>
                  )}

                  {activeChapterIndex === 2 && (
                    <div className="sim-resume-screen">
                      <div className="resume-score-header">
                        <div className="score-circle-wrap">
                          <div className="score-circle">92%</div>
                          <span>ATS Match Score</span>
                        </div>
                        <div className="resume-stats-right">
                          <h4>Senior Full-Stack Engineer Profile</h4>
                          <p>Matched against target role: Lead Frontend Architect</p>
                          <div className="ats-badges-row">
                            <span className="ats-badge ok">✓ 14 Keywords Matched</span>
                            <span className="ats-badge ok">✓ Strong Action Verbs</span>
                            <span className="ats-badge warn">! Add Kubernetes Metric</span>
                          </div>
                        </div>
                      </div>

                      <div className="resume-skills-bars">
                        <div className="skill-line">
                          <span>System Architecture & React</span>
                          <div className="line-bar"><div style={{ width: "95%" }}></div></div>
                          <strong>95%</strong>
                        </div>
                        <div className="skill-line">
                          <span>Distributed APIs & SQL</span>
                          <div className="line-bar"><div style={{ width: "88%" }}></div></div>
                          <strong>88%</strong>
                        </div>
                        <div className="skill-line">
                          <span>Cloud Deployments (AWS/GCP)</span>
                          <div className="line-bar"><div style={{ width: "82%" }}></div></div>
                          <strong>82%</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeChapterIndex === 3 && (
                    <div className="sim-company-screen">
                      <div className="company-grid-header">
                        <div className="comp-badge active">Google</div>
                        <div className="comp-badge">Microsoft</div>
                        <div className="comp-badge">Amazon</div>
                        <div className="comp-badge">Meta</div>
                        <div className="comp-badge">TCS</div>
                      </div>

                      <div className="company-feature-card">
                        <div className="feat-top">
                          <span className="feat-icon">🧮</span>
                          <div>
                            <h4>25 Horses Classic Puzzle & DP Graphs</h4>
                            <small>Frequently asked in Google Stage 2 Assessments</small>
                          </div>
                          <span className="feat-tag">Verified Solution</span>
                        </div>

                        <p className="feat-desc">
                          "Find the top 3 fastest horses among 25 with a 5-lane track without a stopwatch."
                        </p>

                        <div className="feat-solution-preview">
                          <strong>⚡ Step-by-Step Derivation:</strong>
                          <span>Race all 5 groups (5 races) → Race the 5 winners (Race 6) → Race top contenders (Race 7) = Minimum 7 Races.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeChapterIndex === 4 && (
                    <div className="sim-analytics-screen">
                      <div className="analytics-top-grid">
                        <div className="ana-card">
                          <span>OVERALL SCORE</span>
                          <strong>89 / 100</strong>
                          <small>↑ Top 5% Candidates</small>
                        </div>
                        <div className="ana-card">
                          <span>TECHNICAL DEPTH</span>
                          <strong>94%</strong>
                          <small>Exceeded expectations</small>
                        </div>
                        <div className="ana-card">
                          <span>COMMUNICATION</span>
                          <strong>86%</strong>
                          <small>Concise & structured</small>
                        </div>
                      </div>

                      <div className="ana-feedback-box">
                        <h4>AI Interviewer Feedback & Action Items</h4>
                        <ul>
                          <li>✓ Outstanding structured approach using STAR method for behavioral answers.</li>
                          <li>✓ Clear explanation of cache invalidation tradeoffs and latency bottlenecks.</li>
                          <li>💡 <em>Suggestion:</em> Mention database sharding replicas earlier when describing peak load.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Feature Breakdown */}
              <div className="stage-sidebar">
                <div className="sidebar-chapter-header">
                  <span className="sidebar-icon">{currentChapter.icon}</span>
                  <div>
                    <h3>{currentChapter.title}</h3>
                    <p>{currentChapter.tagline}</p>
                  </div>
                </div>

                <div className="sidebar-highlights">
                  <h4>Key Capabilities</h4>
                  <ul>
                    {currentChapter.highlights.map((h, i) => (
                      <li key={i}>
                        <span className="check-bullet">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-cta-wrap">
                  <button
                    type="button"
                    className="sidebar-start-btn"
                    onClick={handleStartNow}
                  >
                    🎤 Try Live Interview Now →
                  </button>
                  <small>No credit card required • Instant AI feedback</small>
                </div>
              </div>
            </div>
          ) : (
            <div className="custom-video-stage">
              <div className="video-player-container">
                {customVideoUrl ? (
                  <div className="video-iframe-wrap">
                    {customVideoUrl.includes("youtube.com") || customVideoUrl.includes("youtu.be") ? (
                      <iframe
                        src={
                          customVideoUrl.includes("embed")
                            ? customVideoUrl
                            : customVideoUrl.replace("watch?v=", "embed/")
                        }
                        title="Intervista AI Demo Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={customVideoUrl}
                        controls
                        autoPlay
                        className="custom-video-element"
                      ></video>
                    )}
                  </div>
                ) : (
                  <div className="no-video-placeholder">
                    <div className="placeholder-icon">📹</div>
                    <h3>Interactive Demo Player is Active</h3>
                    <p>
                      You can watch our interactive simulated live walkthrough above, or paste an external video link (MP4, YouTube) below to stream directly.
                    </p>

                    <div className="video-url-input-row">
                      <input
                        type="url"
                        placeholder="Paste YouTube or MP4 video URL..."
                        value={customVideoUrl}
                        onChange={(e) => setCustomVideoUrl(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!customVideoUrl) {
                            setCustomVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
                          }
                        }}
                      >
                        Load Video
                      </button>
                    </div>

                    <button
                      type="button"
                      className="switch-back-btn"
                      onClick={() => setActiveViewMode("interactive")}
                    >
                      ← Back to Interactive Live Tour
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Player Controls Bar */}
        <div className="demo-player-controls">
          <div className="control-buttons-left">
            <button
              type="button"
              className="control-play-btn"
              onClick={togglePlay}
              title={isPlaying ? "Pause Demo" : "Play Demo"}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            <button
              type="button"
              className="control-skip-btn"
              onClick={() => {
                const prev = (activeChapterIndex - 1 + chapters.length) % chapters.length;
                handleChapterSelect(prev);
              }}
              title="Previous Chapter"
            >
              ⏮ Prev
            </button>

            <button
              type="button"
              className="control-skip-btn"
              onClick={() => {
                const next = (activeChapterIndex + 1) % chapters.length;
                handleChapterSelect(next);
              }}
              title="Next Chapter"
            >
              Next ⏭
            </button>

            <button
              type="button"
              className="control-speed-btn"
              onClick={cycleSpeed}
              title="Change Speed"
            >
              {playbackSpeed}x Speed
            </button>
          </div>

          <div className="control-progress-text">
            <span>Chapter {activeChapterIndex + 1} of {chapters.length}:</span>
            <strong>{currentChapter.badge}</strong>
          </div>

          <div className="control-buttons-right">
            <button
              type="button"
              className="control-fullscreen-btn"
              onClick={() => setIsFullscreen((prev) => !prev)}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? "⤓ Exit Fullscreen" : "⛶ Fullscreen"}
            </button>

            <button
              type="button"
              className="control-cta-btn"
              onClick={handleStartNow}
            >
              Start Free Mock Interview ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
