// Central place for all calls to the Intervista AI backend.
// Set VITE_API_URL in a .env file if the backend isn't on localhost:8000.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

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

// ---------- User Profile & Actions ----------

export function updateUserProfile(updates) {
  return request("/api/users/me", { method: "PATCH", auth: true, body: updates });
}

export function updateMyProgress(progress) {
  return request("/api/users/me/progress", { method: "PATCH", auth: true, body: { progress } });
}

export function deleteMyAccount() {
  return request("/api/users/me", { method: "DELETE", auth: true });
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

// ---------- Dashboard ----------

export function fetchDashboardData() {
  return request("/api/dashboard", { auth: true });
}

// ---------- AI Chat Assistant ----------

export function sendAIChatMessage({ message, history = [], category = "general" }) {
  return request("/api/ai/chat", {
    method: "POST",
    auth: true,
    body: { message, history, category },
  });
}

// ---------- AI Resume Analyzer ----------

export function analyzeResume({ resume_text, target_role = "Full Stack Developer", target_company = "Google" }) {
  return request("/api/resume/analyze", {
    method: "POST",
    auth: true,
    body: { resume_text, target_role, target_company },
  });
}

// ---------- AI Mock Interview Engine ----------

export function startMockInterview({ company = "Google", role = "Frontend Developer", difficulty = "Medium", duration_minutes = 45 }) {
  return request("/api/interviews/start", {
    method: "POST",
    auth: true,
    body: { company, role, difficulty, duration_minutes },
  });
}

export function submitMockInterview({ company, role, difficulty, duration_minutes, answers }) {
  return request("/api/interviews/submit", {
    method: "POST",
    auth: true,
    body: { company, role, difficulty, duration_minutes, answers },
  });
}

export function scheduleInterview({ company, role, date, time, mode = "Virtual" }) {
  return request("/api/interviews/schedule", {
    method: "POST",
    auth: true,
    body: { company, role, date, time, mode },
  });
}

export function fetchInterviews(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/api/interviews${query}`, { auth: true });
}

// ---------- Daily Coding Challenges ----------

export function fetchDailyChallenge() {
  return request("/api/challenges/daily", { auth: true });
}

export function solveDailyChallenge({ challenge_id, code = "", approach_explanation = "" }) {
  return request("/api/challenges/solve", {
    method: "POST",
    auth: true,
    body: { challenge_id, code, approach_explanation },
  });
}

// ---------- Companies ----------

export function fetchCompaniesList() {
  return request("/api/companies");
}

export function fetchCompanyDetails(companyName) {
  return request(`/api/companies/${encodeURIComponent(companyName)}`, { auth: true });
}

export function fetchCompanySolved(companyName) {
  return request(`/api/companies/${encodeURIComponent(companyName)}/solved`, { auth: true });
}

export function toggleCompanySolved(companyName, title) {
  return request(`/api/companies/${encodeURIComponent(companyName)}/toggle-solved`, {
    method: "POST",
    auth: true,
    body: { title },
  });
}

// ---------- Leaderboard & Jobs ----------

export function fetchLeaderboard() {
  return request("/api/leaderboard", { auth: true });
}

export function fetchJobRecommendations() {
  return request("/api/jobs");
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