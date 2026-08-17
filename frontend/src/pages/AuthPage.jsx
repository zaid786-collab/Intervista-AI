import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./AuthPage.css";

export default function AuthPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        await signup({
          name: formData.name.trim() || email.split("@")[0],
          email,
          password,
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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

        <p className="authSwitch">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="textButton"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </main>
    </div>
  );
}