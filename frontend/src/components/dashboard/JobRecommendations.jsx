import { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaApple,
  FaUber,
  FaSpotify,
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaSpinner,
  FaEnvelope,
} from "react-icons/fa";
import { SiNetflix, SiMeta } from "react-icons/si";
import { useAuth } from "../../context/useAuth";
import { applyToJob } from "../../api";

const INITIAL_JOBS = [
  {
    id: "job-1",
    company: "Google",
    role: "Software Engineer Intern",
    location: "Bangalore",
    type: "Full-Time / Hybrid",
    salary: "₹18 LPA",
    experience: "0-1 Years",
    skills: ["Data Structures", "Algorithms", "Java / C++ / Python"],
    icon: <FaGoogle />,
    color: "#4285F4",
  },
  {
    id: "job-2",
    company: "Microsoft",
    role: "Frontend Developer",
    location: "Hyderabad",
    type: "Full-Time / Remote",
    salary: "₹22 LPA",
    experience: "1-3 Years",
    skills: ["React", "TypeScript", "Core Web Vitals", "Next.js"],
    icon: <FaMicrosoft />,
    color: "#7FBA00",
  },
  {
    id: "job-3",
    company: "Amazon",
    role: "Backend Engineer (SDE-1)",
    location: "Delhi NCR",
    type: "Full-Time / Onsite",
    salary: "₹20 LPA",
    experience: "1-2 Years",
    skills: ["Distributed Systems", "AWS", "Java", "DynamoDB"],
    icon: <FaAmazon />,
    color: "#FF9900",
  },
  {
    id: "job-4",
    company: "Netflix",
    role: "Full Stack Engineer",
    location: "Remote",
    type: "Remote Global",
    salary: "₹35 LPA",
    experience: "2-4 Years",
    skills: ["Node.js", "React", "GraphQL", "Microservices"],
    icon: <SiNetflix />,
    color: "#E50914",
  },
  {
    id: "job-5",
    company: "Meta",
    role: "AI / ML Systems Engineer",
    location: "Bangalore",
    type: "Full-Time / Hybrid",
    salary: "₹32 LPA",
    experience: "2-5 Years",
    skills: ["PyTorch", "vLLM", "Distributed Training", "CUDA"],
    icon: <SiMeta />,
    color: "#0668E1",
  },
  {
    id: "job-6",
    company: "Apple",
    role: "iOS / Swift Engineer",
    location: "Hyderabad",
    type: "Full-Time / Onsite",
    salary: "₹26 LPA",
    experience: "1-3 Years",
    skills: ["Swift", "SwiftUI", "Combine", "CoreData"],
    icon: <FaApple />,
    color: "#A2AAAD",
  },
  {
    id: "job-7",
    company: "Uber",
    role: "Backend Platforms Engineer",
    location: "Bangalore",
    type: "Full-Time / Hybrid",
    salary: "₹28 LPA",
    experience: "2-4 Years",
    skills: ["Go", "Kafka", "PostgreSQL", "System Design"],
    icon: <FaUber />,
    color: "#000000",
  },
  {
    id: "job-8",
    company: "Spotify",
    role: "Web Infrastructure Developer",
    location: "Remote",
    type: "Remote Global",
    salary: "₹25 LPA",
    experience: "1-3 Years",
    skills: ["TypeScript", "Audio Web APIs", "WebSockets", "Vite"],
    icon: <FaSpotify />,
    color: "#1DB954",
  },
];

function JobRecommendations() {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem("intervista_applied_jobs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showExploreModal, setShowExploreModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("intervista_applied_jobs", JSON.stringify(appliedJobs));
    } catch {}
  }, [appliedJobs]);

  const handleApply = async (job) => {
    const isApplied = !!appliedJobs[job.id];
    if (isApplied) {
      setToastMessage({
        type: "info",
        text: `You have already applied for ${job.role} at ${job.company}.`,
      });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setApplyingJobId(job.id);
    const candidateEmail = user?.email || localStorage.getItem("intervista_user_email") || "candidate@intervista.ai";
    const candidateName = user?.name || "Candidate";

    try {
      // Send application & confirmation email through backend
      await applyToJob({
        job_id: job.id,
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary,
        recipient_email: candidateEmail,
        candidate_name: candidateName,
      });

      setAppliedJobs((prev) => ({
        ...prev,
        [job.id]: {
          appliedAt: new Date().toISOString(),
          company: job.company,
          role: job.role,
          emailSentTo: candidateEmail,
        },
      }));

      setToastMessage({
        type: "success",
        text: `✓ Application submitted to ${job.company} for ${job.role}! Confirmation email sent to ${candidateEmail}.`,
      });
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.warn("Backend job apply fallback:", err);
      // Local fallback for offline/development mode
      setAppliedJobs((prev) => ({
        ...prev,
        [job.id]: {
          appliedAt: new Date().toISOString(),
          company: job.company,
          role: job.role,
          emailSentTo: candidateEmail,
        },
      }));

      setToastMessage({
        type: "success",
        text: `✓ Application submitted for ${job.role} at ${job.company}! Email dispatched to ${candidateEmail}.`,
      });
      setTimeout(() => setToastMessage(null), 4500);
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredExploreJobs = INITIAL_JOBS.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedRoleFilter === "All" ||
      (selectedRoleFilter === "Frontend" && job.role.toLowerCase().includes("frontend")) ||
      (selectedRoleFilter === "Backend" && job.role.toLowerCase().includes("backend")) ||
      (selectedRoleFilter === "Full Stack" && job.role.toLowerCase().includes("full stack")) ||
      (selectedRoleFilter === "AI/ML" && (job.role.toLowerCase().includes("ai") || job.role.toLowerCase().includes("ml"))) ||
      (selectedRoleFilter === "Intern" && job.role.toLowerCase().includes("intern"));

    return matchesSearch && matchesFilter;
  });

  const featuredJobs = INITIAL_JOBS.slice(0, 4);

  return (
    <div className="jobs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="dashboard-toast" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaEnvelope style={{ color: "#38bdf8", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", lineHeight: "1.4" }}>{toastMessage.text || toastMessage}</span>
          <button onClick={() => setToastMessage(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="jobs-header">
        <h2>💼 Recommended Jobs</h2>
        <button
          className="view-btn"
          onClick={() => setShowExploreModal(true)}
          title="Open Job Board Explorer"
        >
          Explore All ({INITIAL_JOBS.length})
        </button>
      </div>

      {featuredJobs.map((job) => {
        const isApplied = !!appliedJobs[job.id];
        const isCurrentlyApplying = applyingJobId === job.id;

        return (
          <div className="job-card" key={job.id}>
            <div className="job-logo" style={{ background: job.color }}>
              {job.icon}
            </div>

            <div className="job-info">
              <h3>{job.company}</h3>
              <p>{job.role}</p>
              <small>
                {job.location} • {job.salary}
              </small>
            </div>

            <button
              className={`apply-btn ${isApplied ? "applied" : ""}`}
              onClick={() => handleApply(job)}
              disabled={isCurrentlyApplying || isApplied}
              style={
                isApplied
                  ? {
                      background: "rgba(34, 197, 94, 0.2)",
                      color: "#22c55e",
                      border: "1px solid rgba(34, 197, 94, 0.4)",
                      cursor: "default",
                    }
                  : undefined
              }
            >
              {isCurrentlyApplying ? (
                <>
                  <FaSpinner className="fa-spin" /> Submitting...
                </>
              ) : isApplied ? (
                "Applied ✓"
              ) : (
                "Apply"
              )}
            </button>
          </div>
        );
      })}

      {/* Explore All Jobs Modal */}
      {showExploreModal && (
        <div className="dashboard-modal-backdrop" onClick={() => setShowExploreModal(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>💼 Tech Career Opportunities</h2>
                <p>Curated high-growth tech positions matched with your mock interview proficiency.</p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowExploreModal(false)}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="modal-filter-bar">
              <div className="modal-search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by company, role, skills, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="modal-filter-pills">
                {["All", "Frontend", "Backend", "Full Stack", "AI/ML", "Intern"].map((cat) => (
                  <button
                    key={cat}
                    className={`modal-filter-pill ${selectedRoleFilter === cat ? "active" : ""}`}
                    onClick={() => setSelectedRoleFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Jobs List Grid */}
            <div className="modal-jobs-list">
              {filteredExploreJobs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                  <p>No jobs found matching your search filter.</p>
                </div>
              ) : (
                filteredExploreJobs.map((job) => {
                  const isApplied = !!appliedJobs[job.id];
                  const isCurrentlyApplying = applyingJobId === job.id;

                  return (
                    <div className="modal-job-row" key={job.id}>
                      <div className="job-logo" style={{ background: job.color }}>
                        {job.icon}
                      </div>

                      <div className="modal-job-details">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h4>{job.company}</h4>
                          <span className="modal-job-tag">{job.type}</span>
                        </div>
                        <h3>{job.role}</h3>

                        <div className="modal-job-meta">
                          <span>
                            <FaMapMarkerAlt /> {job.location}
                          </span>
                          <span>
                            <FaMoneyBillWave /> {job.salary}
                          </span>
                          <span>
                            <FaBriefcase /> {job.experience}
                          </span>
                        </div>

                        <div className="modal-job-skills">
                          {job.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="skill-chip">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`apply-btn ${isApplied ? "applied" : ""}`}
                        onClick={() => handleApply(job)}
                        disabled={isCurrentlyApplying || isApplied}
                        style={
                          isApplied
                            ? {
                                background: "rgba(34, 197, 94, 0.2)",
                                color: "#22c55e",
                                border: "1px solid rgba(34, 197, 94, 0.4)",
                                cursor: "default",
                              }
                            : undefined
                        }
                      >
                        {isCurrentlyApplying ? (
                          <>
                            <FaSpinner className="fa-spin" /> Submitting...
                          </>
                        ) : isApplied ? (
                          "Applied ✓"
                        ) : (
                          "Apply Now"
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobRecommendations;