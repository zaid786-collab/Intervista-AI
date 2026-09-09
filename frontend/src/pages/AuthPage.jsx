import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { resendOtp, getOAuthUrl } from "../api";
import "./AuthPage.css";

export default function AuthPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const { login, signup, verifyEmail, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectDest = searchParams.get("redirect") || "/dashboard";
  const redirectQuery = searchParams.get("redirect")
    ? `?redirect=${encodeURIComponent(searchParams.get("redirect"))}`
    : "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectDest, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectDest]);

  // Read any error notice passed via URL
  useEffect(() => {
    const urlError = searchParams.get("error");
    const urlNotice = searchParams.get("notice");
    if (urlError) setError(urlError);
    if (urlNotice) setNotice(urlNotice);
  }, [searchParams]);

  const updateField = (event) =>
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    if (!email || !password) {
      return setError("Please fill in your email and password.");
    }

    if (!isLogin) {
      if (password.length < 6) {
        return setError("Password must be at least 6 characters long.");
      }
      if (formData.confirmPassword !== password) {
        return setError("Passwords do not match.");
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login({ email, password });
        navigate(redirectDest, { replace: true });
      } else {
        const res = await signup({
          name: formData.name.trim() || email.split("@")[0],
          email,
          password,
        });
        setVerificationEmail(email);
        setAwaitingVerification(true);
        setNotice(res?.message || `We sent a 6-digit verification code to ${email}.`);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code sent to your email.");
    setLoading(true);
    try {
      await verifyEmail({ email: verificationEmail, code });
      navigate(redirectDest, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await resendOtp(verificationEmail);
      setNotice(res?.message || "A new code has been sent to your email.");
    } catch (err) {
      setError(err.message || "Could not resend the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");
    setOauthLoading(provider);
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const res = await getOAuthUrl(provider, redirectUri);
      if (res?.url) {
        // If there's an intended destination, append to OAuth redirect
        let targetUrl = res.url;
        if (redirectDest && redirectDest !== "/dashboard") {
          const separator = targetUrl.includes("?") ? "&" : "?";
          targetUrl = `${targetUrl}${separator}redirect=${encodeURIComponent(redirectDest)}`;
        }
        window.location.href = targetUrl;
      } else {
        throw new Error(`Unable to obtain ${provider} authorization link.`);
      }
    } catch (err) {
      setError(err.message || `Failed to connect with ${provider}. Please try again.`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="authPage">
      <main className="authCard">
        <header className="authIntro">
          <p className="eyebrow">Intervista AI</p>
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p>
            {isLogin
              ? "Sign in to access your interview workspace, analysis, and preparation tools."
              : "Join Intervista AI and start realistic AI-powered mock interviews."}
          </p>
        </header>

        {/* Forgot password helper modal / banner */}
        {showForgotModal && (
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(31, 219, 252, 0.08)",
              border: "1px solid rgba(31, 219, 252, 0.25)",
              marginBottom: "18px",
              fontSize: "0.88rem",
              lineHeight: "1.5",
              color: "#c2e7ff",
            }}
          >
            <strong>Password Recovery Assistance:</strong>
            <p style={{ margin: "6px 0 10px", color: "#98a3b7" }}>
              To reset your credentials, please enter your registered email in the form below or contact support at{" "}
              <span style={{ color: "#1fdbfc" }}>support@intervista.ai</span>. You can also re-authenticate via Google or GitHub if previously linked.
            </p>
            <button
              type="button"
              className="textButton"
              style={{ fontSize: "0.85rem" }}
              onClick={() => setShowForgotModal(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {awaitingVerification ? (
          <form className="authForm" onSubmit={handleVerification}>
            <label>
              Email verification code
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength="6"
                autoFocus
              />
            </label>
            {notice && <p className="authNotice">{notice}</p>}
            {error && <p className="authError">{error}</p>}
            <button type="submit" className="authSubmitBtn" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
              <button type="button" className="textButton authResend" disabled={loading} onClick={handleResend}>
                Resend code
              </button>
              <button
                type="button"
                className="textButton"
                onClick={() => {
                  setAwaitingVerification(false);
                  setError("");
                  setNotice("");
                }}
              >
                ← Back to edit
              </button>
            </div>
          </form>
        ) : (
          <>
            <form className="authForm" onSubmit={handleSubmit}>
              {!isLogin && (
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={updateField}
                    placeholder="Ava Taylor"
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                <div className="authLabelRow">
                  <span>Password</span>
                  {isLogin && (
                    <button
                      type="button"
                      className="authForgotLink"
                      onClick={() => setShowForgotModal((prev) => !prev)}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={updateField}
                  placeholder="Enter your password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </label>

              {!isLogin && (
                <label>
                  Confirm password
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={updateField}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                </label>
              )}

              {notice && <p className="authNotice">{notice}</p>}
              {error && <p className="authError">{error}</p>}

              <button type="submit" className="authSubmitBtn" disabled={loading || Boolean(oauthLoading)}>
                {loading ? "Please wait..." : isLogin ? "Log in" : "Create account"}
              </button>
            </form>

            <div className="authDivider">
              <span>OR</span>
            </div>

            <div className="authSocialContainer">
              <button
                type="button"
                className="authSocialBtn"
                disabled={loading || Boolean(oauthLoading)}
                onClick={() => handleOAuthLogin("google")}
              >
                <svg className="authSocialIcon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{oauthLoading === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
              </button>

              <button
                type="button"
                className="authSocialBtn"
                disabled={loading || Boolean(oauthLoading)}
                onClick={() => handleOAuthLogin("github")}
              >
                <svg className="authSocialIcon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>{oauthLoading === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
              </button>
            </div>
          </>
        )}

        {!awaitingVerification && (
          <p className="authSwitch">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <Link to={isLogin ? `/signup${redirectQuery}` : `/login${redirectQuery}`}>
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
