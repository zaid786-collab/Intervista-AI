import { useState } from "react";
import Navbar from "../components/Navbar";
import "./AuthPage.css";

export default function AuthPage({ mode = "login", onAuth, onOpenLogin, onOpenSignup, ...navigation }) {
  const isLogin = mode === "login";
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    if (!email || !password) return setError("Please fill in your email and password.");

    let storedUsers;
    try { storedUsers = JSON.parse(localStorage.getItem("intervista-users") || "[]"); } catch { storedUsers = []; }

    if (isLogin) {
      const existingUser = storedUsers.find((item) => item.email === email);
      if (!existingUser || existingUser.password !== password) return setError("Invalid email or password.");
      onAuth({ name: existingUser.name, email: existingUser.email });
      return;
    }

    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    if (formData.confirmPassword !== password) return setError("Passwords do not match.");
    if (storedUsers.some((item) => item.email === email)) return setError("An account with this email already exists.");
    const newUser = { name: formData.name.trim() || email.split("@")[0], email, password };
    localStorage.setItem("intervista-users", JSON.stringify([...storedUsers, newUser]));
    onAuth({ name: newUser.name, email: newUser.email });
  };

  return (
    <div className="authPage">
      <Navbar {...navigation} onOpenLogin={onOpenLogin} onOpenSignup={onOpenSignup} />
      <main className="authCard">
        <header className="authIntro"><p className="eyebrow">Intervista AI</p><h1>{isLogin ? "Welcome back" : "Create your account"}</h1><p>{isLogin ? "Sign in to continue practicing with realistic interview simulations." : "Join Intervista AI and start your interview preparation journey."}</p></header>
        <form className="authForm" onSubmit={handleSubmit}>
          {!isLogin && <label>Full name<input type="text" name="name" value={formData.name} onChange={updateField} placeholder="Ava Taylor" /></label>}
          <label>Email address<input type="email" name="email" value={formData.email} onChange={updateField} placeholder="you@example.com" /></label>
          <label>Password<input type="password" name="password" value={formData.password} onChange={updateField} placeholder="Enter your password" /></label>
          {!isLogin && <label>Confirm password<input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={updateField} placeholder="Confirm password" /></label>}
          {error && <p className="authError">{error}</p>}
          <button type="submit" className="authSubmitBtn">{isLogin ? "Log in" : "Create account"}</button>
        </form>
        <p className="authSwitch">{isLogin ? "New here?" : "Already have an account?"} <button type="button" className="textButton" onClick={isLogin ? onOpenSignup : onOpenLogin}>{isLogin ? "Create an account" : "Log in"}</button></p>
      </main>
    </div>
  );
}
