import { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaCheck,
} from "react-icons/fa";
import { SiNetflix } from "react-icons/si";
import { fetchJobRecommendations } from "../../api";

const defaultJobs = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer Intern",
    location: "Bangalore",
    salary: "₹18 LPA",
    icon: <FaGoogle />,
    color: "#4285F4",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Frontend Developer",
    location: "Hyderabad",
    salary: "₹22 LPA",
    icon: <FaMicrosoft />,
    color: "#7FBA00",
  },
  {
    id: 3,
    company: "Amazon",
    role: "Backend Engineer",
    location: "Delhi",
    salary: "₹20 LPA",
    icon: <FaAmazon />,
    color: "#FF9900",
  },
  {
    id: 4,
    company: "Netflix",
    role: "Full Stack Engineer",
    location: "Remote",
    salary: "₹35 LPA",
    icon: <SiNetflix />,
    color: "#E50914",
  },
];

function JobRecommendations() {
  const [jobs, setJobs] = useState(defaultJobs);
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    let isMounted = true;
    fetchJobRecommendations()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Add logo icons
          const mapped = data.map((j) => {
            let icon = <FaGoogle />;
            if (j.company === "Microsoft") icon = <FaMicrosoft />;
            else if (j.company === "Amazon") icon = <FaAmazon />;
            else if (j.company === "Netflix") icon = <SiNetflix />;
            return { ...j, icon };
          });
          setJobs(mapped);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({
      ...prev,
      [jobId]: true,
    }));
  };

  return (
    <div className="jobs">
      <div className="jobs-header">
        <h2>💼 Recommended Jobs</h2>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Matched to your skills</span>
      </div>

      {jobs.map((job) => (
        <div className="job-card" key={job.id}>
          <div className="job-logo" style={{ background: job.color || "#2563eb" }}>
            {job.icon || job.company.charAt(0)}
          </div>

          <div className="job-info">
            <h3>{job.company}</h3>
            <p>{job.role}</p>
            <small>
              {job.location} • {job.salary}
            </small>
          </div>

          <button
            className="apply-btn"
            onClick={() => handleApply(job.id)}
            style={{
              background: appliedJobs[job.id] ? "rgba(34,197,94,0.2)" : undefined,
              color: appliedJobs[job.id] ? "#4ade80" : undefined,
              borderColor: appliedJobs[job.id] ? "#22c55e" : undefined,
            }}
          >
            {appliedJobs[job.id] ? (
              <>
                <FaCheck style={{ marginRight: "4px" }} /> Applied
              </>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export default JobRecommendations;