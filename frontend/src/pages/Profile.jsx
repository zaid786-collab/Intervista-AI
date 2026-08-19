import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { updateUserProfile, deleteMyAccount, fetchDashboardData } from "../api";
import { FaTimes, FaCheck, FaTrash, FaUserEdit, FaSpinner } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    total_interviews: 24,
    avg_score: "78%",
    best_score: "92%",
    practice_time: "18 hrs",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "Interview Candidate",
    bio: user?.bio || "Aspiring Software Engineer preparing for top tech interviews.",
    target_role: user?.target_role || "Full Stack Developer",
    skills: user?.skills || "DSA, JavaScript, React.js, Node.js, Python, System Design",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        bio: user.bio || "Aspiring Software Engineer preparing for top tech interviews.",
        target_role: user.target_role || "Full Stack Developer",
        skills: user.skills || "DSA, JavaScript, React.js, Node.js, Python, System Design",
      });
    }

    let isMounted = true;
    fetchDashboardData()
      .then((data) => {
        if (isMounted && data?.metrics) {
          setMetrics(data.metrics);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [user]);

  const name = user?.name || "Interview Candidate";
  const email = user?.email || "candidate@example.com";
  const accountType = user?.is_admin ? "Admin" : "Free Member";
  const memberSince = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : "2026";
  const progress = user?.progress ?? 75;
  const skillsArray = (user?.skills || editForm.skills)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateUserProfile(editForm);
      if (updateUser) updateUser(updated);
      setShowEditModal(false);
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your Intervista AI account permanently? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteMyAccount();
      logout();
      navigate("/");
    } catch (err) {
      alert(err.message || "Failed to delete account.");
    }
  };

  return (
    <main className="profile-page">
      <div className="profile-container">
        {/* ================= PROFILE HEADER ================= */}
        <section className="profile-hero">
          <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>

          <div className="profile-heading">
            <span className="profile-badge">✦ MY PROFILE</span>

            <h1>
              Welcome, <span>{name}</span>
            </h1>

            <p>{user?.bio || "Manage your account, track your interview journey and build your career profile."}</p>
          </div>

          <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}>
            <FaUserEdit style={{ marginRight: "6px" }} /> Edit Profile
          </button>
        </section>

        {/* ================= PERSONAL INFORMATION ================= */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <span className="section-label">ACCOUNT</span>
              <h2>Personal Information</h2>
              <p>Your basic account and role details.</p>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-field">
              <span>FULL NAME</span>
              <strong>{name}</strong>
            </div>

            <div className="profile-field">
              <span>EMAIL ADDRESS</span>
              <strong>{email}</strong>
            </div>

            <div className="profile-field">
              <span>TARGET ROLE</span>
              <strong>{user?.target_role || "Full Stack Developer"}</strong>
            </div>

            <div className="profile-field">
              <span>ACCOUNT TYPE</span>
              <strong>{accountType}</strong>
            </div>

            <div className="profile-field">
              <span>MEMBER SINCE</span>
              <strong>{memberSince}</strong>
            </div>

            <div className="profile-field">
              <span>ACCUMULATED XP</span>
              <strong style={{ color: "#f59e0b" }}>{user?.xp || 250} XP</strong>
            </div>
          </div>
        </section>

        {/* ================= OVERALL PROGRESS ================= */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <span className="section-label">PROGRESS</span>
              <h2>Overall Progress</h2>
              <p>Your interview-readiness progress across Intervista AI.</p>
            </div>
          </div>

          <div className="progress-overview">
            <span>Completion</span>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        {/* ================= INTERVIEW STATISTICS ================= */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <span className="section-label">PERFORMANCE</span>
              <h2>Interview Statistics</h2>
              <p>Your overall progress on Intervista AI.</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="stat-icon">🎤</div>
              <strong>{metrics.total_interviews}</strong>
              <span>Interviews Completed</span>
            </div>

            <div className="profile-stat">
              <div className="stat-icon">◈</div>
              <strong>{metrics.avg_score}</strong>
              <span>Average Score</span>
            </div>

            <div className="profile-stat">
              <div className="stat-icon">🏆</div>
              <strong>{metrics.best_score}</strong>
              <span>Best Score</span>
            </div>

            <div className="profile-stat">
              <div className="stat-icon">◷</div>
              <strong>{metrics.practice_time}</strong>
              <span>Practice Time</span>
            </div>
          </div>
        </section>

        {/* ================= SKILLS ================= */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <span className="section-label">CAREER PROFILE</span>
              <h2>Skills & Interests</h2>
              <p>Areas you are currently preparing for.</p>
            </div>
          </div>

          <div className="skills-container">
            {skillsArray.map((skill, idx) => (
              <span className="skill-tag" key={idx}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* ================= ACCOUNT ACTIONS ================= */}
        <section className="profile-card account-actions">
          <div>
            <span className="section-label">ACCOUNT</span>
            <h2>Account Settings</h2>
            <p>Manage your account preferences and security.</p>
          </div>

          <div className="account-buttons">
            <button className="profile-action-btn" onClick={() => setShowEditModal(true)}>
              ⚙ Edit Profile Details
            </button>

            <button className="profile-action-btn danger" onClick={handleDeleteAccount}>
              <FaTrash style={{ marginRight: "6px" }} /> Delete Account
            </button>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="profile-cta">
          <div>
            <span>READY FOR YOUR NEXT INTERVIEW?</span>
            <h2>
              Keep improving.
              <br />
              <span>Your next opportunity is closer.</span>
            </h2>
            <p>Practice with AI, analyze your performance and become interview-ready.</p>
          </div>

          <button
            type="button"
            className="profile-cta-btn"
            onClick={() => navigate("/dashboard")}
          >
            Start New Interview →
          </button>
        </section>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEditModal && (
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
              maxWidth: "520px",
              padding: "28px",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>✎ Edit Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Target Role</label>
                <input
                  type="text"
                  value={editForm.target_role}
                  onChange={(e) => setEditForm({ ...editForm, target_role: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Bio / Headline</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", resize: "vertical" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: "10px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: "10px 22px", borderRadius: "8px", background: "#2563eb", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {loading ? <FaSpinner className="fa-spin" /> : <FaCheck />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile;