import { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FaCode,
  FaClock,
  FaFire,
  FaArrowRight,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { fetchDailyChallenge, solveDailyChallenge } from "../../api";

function CodingChallenge() {
  const [challenge, setChallenge] = useState({
    id: 1,
    title: "Longest Consecutive Sequence",
    difficulty: "Hard",
    description:
      "Given an unsorted array of integers, return the length of the longest consecutive elements sequence in O(n) time.",
    time_limit: "45 mins",
    xp_reward: 150,
    sample_input: "nums = [100, 4, 200, 1, 3, 2]",
    sample_output: "4",
    is_solved: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [userCode, setUserCode] = useState(
    `function longestConsecutive(nums) {\n  const numSet = new Set(nums);\n  let longest = 0;\n\n  for (const num of numSet) {\n    if (!numSet.has(num - 1)) {\n      let currentNum = num;\n      let currentStreak = 1;\n\n      while (numSet.has(currentNum + 1)) {\n        currentNum += 1;\n        currentStreak += 1;\n      }\n      longest = Math.max(longest, currentStreak);\n    }\n  }\n  return longest;\n}`
  );
  const [loading, setLoading] = useState(false);
  const [solveResult, setSolveResult] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchDailyChallenge()
      .then((data) => {
        if (isMounted && data) {
          setChallenge(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSolveSubmit = async () => {
    setLoading(true);
    try {
      const res = await solveDailyChallenge({
        challenge_id: challenge.id,
        code: userCode,
      });

      setSolveResult(res);
      setChallenge((prev) => ({ ...prev, is_solved: true }));
    } catch (err) {
      alert(err.message || "Failed to submit challenge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="challenge">
      <div className="challenge-header">
        <h2>
          <FaCode />
          Daily Coding Challenge
        </h2>

        <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
      </div>

      <h3>{challenge.title}</h3>

      <p>{challenge.description}</p>

      <div className="challenge-details">
        <div>
          <FaClock />
          <span>{challenge.time_limit}</span>
        </div>

        <div>
          <FaFire />
          <span>{challenge.xp_reward} XP</span>
        </div>
      </div>

      <button
        className="solve-btn"
        onClick={() => setShowModal(true)}
        style={{
          background: challenge.is_solved
            ? "linear-gradient(135deg, #16a34a, #22c55e)"
            : undefined,
        }}
      >
        {challenge.is_solved ? (
          <>
            <FaCheckCircle style={{ marginRight: "6px" }} />
            Solved! View Code
          </>
        ) : (
          <>
            Solve Now
            <FaArrowRight />
          </>
        )}
      </button>

      {/* ================= SOLVE MODAL ================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(10, 15, 29, 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "750px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#f59e0b",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  ✦ Daily DSA Challenge • {challenge.difficulty}
                </span>
                <h2 style={{ margin: "4px 0 0", fontSize: "20px" }}>
                  {challenge.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSolveResult(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p style={{ margin: "0 0 10px", fontSize: "14px", lineHeight: "1.5" }}>
                {challenge.description}
              </p>
              {challenge.sample_input && (
                <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
                  <strong>Example Input:</strong>{" "}
                  <code>{challenge.sample_input}</code>
                  <br />
                  <strong>Example Output:</strong>{" "}
                  <code>{challenge.sample_output}</code>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}
              >
                Code Editor (JavaScript / Python / C++)
              </label>
              <textarea
                rows={10}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#090d16",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#38bdf8",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {solveResult && (
              <div
                style={{
                  padding: "14px",
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid #22c55e",
                  borderRadius: "8px",
                  color: "#86efac",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                🎉 <strong>Accepted!</strong> +{solveResult.xp_awarded} XP has been awarded and added to your profile stats.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSolveResult(null);
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSolveSubmit}
                disabled={loading}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {loading ? <FaSpinner className="fa-spin" /> : <FaCheckCircle />}
                {loading ? "Running Test Cases..." : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodingChallenge;