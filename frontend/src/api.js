// Central place for all calls to the Intervista AI backend.
// Supports automatic fallback across 127.0.0.1, localhost, and Vite proxy.

let activeBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "intervista-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const payload = body ? JSON.stringify(body) : undefined;
  let response;

  const candidateBases = [
    activeBaseUrl,
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "",
  ];

  let lastError = null;

  for (const base of candidateBases) {
    try {
      const url = base ? `${base}${path}` : path;
      response = await fetch(url, {
        method,
        headers,
        body: payload,
      });

      if (response) {
        activeBaseUrl = base; // memorize working base URL
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!response) {
    throw new Error(lastError?.message || "Failed to fetch: Cannot connect to Intervista AI backend.");
  }

  // 204 No Content has no body to parse
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || "Something went wrong. Please try again.";
    throw new Error(typeof message === "string" ? message : "Request failed.");
  }

  return data;
}

// ---------- Auth ----------

export function signup({ name, email, password }) {
  return request("/api/auth/signup", { method: "POST", body: { name, email, password } });
}

export function login({ email, password }) {
  return request("/api/auth/login", { method: "POST", body: { email, password } });
}

export function fetchCurrentUser() {
  return request("/api/auth/me", { auth: true });
}

// ---------- Self-service user actions ----------

export function updateMyProgress(progress) {
  return request("/api/users/me/progress", { method: "PATCH", auth: true, body: { progress } });
}

// ---------- Admin portal ----------

export function adminListUsers() {
  return request("/api/admin/users", { auth: true });
}

export function adminUpdateUser(userId, updates) {
  return request(`/api/admin/users/${userId}`, { method: "PATCH", auth: true, body: updates });
}

export function adminDeleteUser(userId) {
  return request(`/api/admin/users/${userId}`, { method: "DELETE", auth: true });
}

// ---------- Dashboard & Offline Sync ----------

const DASHBOARD_STORAGE_KEY = "intervista_local_dashboard_v2";

export function getInitialDashboardState() {
  return {
    metrics: {
      total_interviews: 0,
      avg_score: "0%",
      best_score: "0%",
      practice_time: "0 mins",
    },
    weekly_performance: [
      { name: "Mon", score: 0 },
      { name: "Tue", score: 0 },
      { name: "Wed", score: 0 },
      { name: "Thu", score: 0 },
      { name: "Fri", score: 0 },
      { name: "Sat", score: 0 },
      { name: "Sun", score: 0 },
    ],
    recent_interviews: [],
    upcoming_interviews: [],
    activities: [],
    notifications: [],
  };
}

export function getLocalDashboardData() {
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.metrics) return parsed;
    }
  } catch {
    // ignore parse error
  }
  return getInitialDashboardState();
}

export function saveLocalDashboardData(data) {
  try {
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage error
  }
}

export function recordLocalInterviewSession(session) {
  const current = getLocalDashboardData();
  const scoreNum = typeof session.score === "number" ? session.score : parseInt(session.score, 10) || 0;
  const duration = typeof session.duration_minutes === "number" && session.duration_minutes > 0 ? session.duration_minutes : 1;

  const newInterview = {
    id: session.id || Date.now(),
    role: session.role || "Software Engineer",
    company: session.company || "Mock Interview",
    score: `${scoreNum}%`,
    score_num: scoreNum,
    duration_minutes: duration,
    status: session.status || "Completed",
    date: session.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    time: session.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    mode: session.mode || "Virtual",
    technical_score: session.technical_score,
    communication_score: session.communication_score,
    problem_solving_score: session.problem_solving_score,
    grade: session.grade,
    feedback: session.feedback,
    strengths: session.strengths,
    improvements: session.improvements,
    detailed_feedback: session.detailed_feedback,
    identified_keywords: session.identified_keywords,
  };

  const updatedRecent = [newInterview, ...(current.recent_interviews || [])];
  const completedList = updatedRecent.filter((i) => i.status === "Completed");
  const totalCount = completedList.length;

  const totalScores = completedList.reduce((acc, curr) => acc + (curr.score_num || parseInt(curr.score, 10) || 0), 0);
  const avgScore = totalCount > 0 ? Math.round(totalScores / totalCount) : 0;
  const bestScore = completedList.reduce((max, curr) => Math.max(max, curr.score_num || parseInt(curr.score, 10) || 0), 0);

  const totalMinutes = completedList.reduce((acc, curr) => acc + (curr.duration_minutes || 1), 0);
  let practiceTimeStr = "0 mins";
  if (totalMinutes === 0) {
    practiceTimeStr = "0 mins";
  } else if (totalMinutes === 1) {
    practiceTimeStr = "1 min";
  } else if (totalMinutes < 60) {
    practiceTimeStr = `${totalMinutes} mins`;
  } else {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    practiceTimeStr = m > 0 ? `${h}h ${m}m` : `${h} hrs`;
  }

  // Update weekly performance
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayName = days[new Date().getDay()];
  const updatedPerf = (current.weekly_performance || getInitialDashboardState().weekly_performance).map((p) => {
    if (p.name === todayName) {
      return { ...p, score: p.score > 0 ? Math.round((p.score + scoreNum) / 2) : scoreNum };
    }
    return p;
  });

  const updatedActivities = [
    {
      id: Date.now(),
      title: `Interview Completed: ${newInterview.company}`,
      company: `Score: ${scoreNum}% • ${newInterview.role} (${duration}m)`,
      time: "Just now",
      color: "#22c55e",
    },
    ...(current.activities || []),
  ];

  const updatedNotifications = [
    {
      id: Date.now(),
      title: `${newInterview.company} Evaluation Report Ready`,
      desc: `Scored ${scoreNum}% on ${newInterview.role}`,
      color: "#22c55e",
      time: "Just now",
      is_read: false,
    },
    ...(current.notifications || []),
  ];

  const updatedState = {
    metrics: {
      total_interviews: totalCount,
      avg_score: `${avgScore}%`,
      best_score: `${bestScore}%`,
      practice_time: practiceTimeStr,
    },
    weekly_performance: updatedPerf,
    recent_interviews: updatedRecent,
    upcoming_interviews: current.upcoming_interviews || [],
    activities: updatedActivities,
    notifications: updatedNotifications,
  };

  saveLocalDashboardData(updatedState);
  return updatedState;
}

export function recordLocalScheduledInterview(session) {
  const current = getLocalDashboardData();
  const newInterview = {
    id: session.id || Date.now(),
    role: session.role || "Software Engineer",
    company: session.company || "Mock Interview",
    score: "Upcoming",
    status: "Scheduled",
    date: session.date,
    time: session.time || "10:00 AM",
    mode: session.mode || "Virtual",
  };

  const updatedUpcoming = [newInterview, ...(current.upcoming_interviews || [])];
  const updatedState = {
    ...current,
    upcoming_interviews: updatedUpcoming,
  };

  saveLocalDashboardData(updatedState);
  return updatedState;
}

export async function fetchDashboardData() {
  try {
    const data = await request("/api/dashboard", { auth: true });
    if (data && data.metrics) {
      saveLocalDashboardData(data);
      return data;
    }
  } catch (err) {
    console.warn("Backend /api/dashboard unavailable, using local session data:", err.message);
  }
  return getLocalDashboardData();
}

// ---------- Resources ----------

export function fetchResources(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.difficulty && params.difficulty !== "All") query.set("difficulty", params.difficulty);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return request(`/api/resources${queryString}`);
}

export function fetchSolvedResources() {
  return request("/api/resources/solved", { auth: true });
}

export function toggleSolvedResource(title) {
  return request("/api/resources/toggle-solved", { method: "POST", auth: true, body: { title } });
}