import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { resendOtp } from "../api";
import "./AuthPage.css";

export default function AuthPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const { login, signup, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");

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
      } else {
        const res = await signup({
          name: formData.name.trim() || email.split("@")[0],
          email,
          password,
        });
        setVerificationEmail(email);
        setAwaitingVerification(true);
        setNotice(res?.message || `We sent a 6-digit code to ${email}.`);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code from your email.");
    setLoading(true);
    try {
      await verifyEmail({ email: verificationEmail, code });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not verify this code.");
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

  return (
    <div className="authPage">
      <main className="authCard">
        <header className="authIntro">
          <p className="eyebrow">Intervista AI</p>
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p>
            {isLogin
              ? "Sign in to continue practicing with realistic interview simulations."
              : "Join Intervista AI and start your interview preparation journey."}
          </p>
        </header>

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
              {loading ? "Verifying..." : "Verify email"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
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
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={updateField}
              placeholder="Enter your password"
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
                placeholder="Confirm password"
              />
            </label>
          )}

          {error && <p className="authError">{error}</p>}

          <button type="submit" className="authSubmitBtn" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Log in" : "Create account"}
          </button>
        </form>
        )}

        {!awaitingVerification && <p className="authSwitch">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="textButton"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>}
      </main>
    </div>
  );
}
