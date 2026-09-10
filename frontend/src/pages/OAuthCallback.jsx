import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { callbackOAuth } from "../api";

export default function OAuthCallback({ providerOverride }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [statusMessage, setStatusMessage] = useState("Connecting with identity provider...");
  const [errorNotice, setErrorNotice] = useState(null);
  const exchangeStarted = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const stateParam = searchParams.get("state") || "";
    const oauthError = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    // Resolve provider from override, URL path, URL param, state prefix, or sessionStorage
    let provider = providerOverride || searchParams.get("provider");
    if (!provider && window.location.pathname.includes("github")) {
      provider = "github";
    }
    if (!provider && stateParam) {
      if (stateParam.startsWith("google")) provider = "google";
      else if (stateParam.startsWith("github")) provider = "github";
    }
    if (!provider) {
      provider = sessionStorage.getItem("oauth_provider");
    }
    if (!provider) {
      provider = "google";
    }

    console.log("[OAUTH] CALLBACK_MOUNTED", {
      provider,
      hasCode: Boolean(code),
      hasState: Boolean(stateParam),
      hasError: Boolean(oauthError),
      pathname: window.location.pathname,
    });

    if (oauthError) {
      const errorMsg = errorDesc || "Authentication was cancelled by the user.";
      console.warn("[OAUTH] Provider returned error:", errorMsg);
      sessionStorage.removeItem("oauth_provider");
      sessionStorage.removeItem("oauth_redirect");
      setErrorNotice(errorMsg);
      setTimeout(() => navigate(`/login?error=${encodeURIComponent(errorMsg)}`, { replace: true }), 2000);
      return;
    }

    if (!code) {
      console.warn("[OAUTH] Authorization code missing from callback URL parameters");
      sessionStorage.removeItem("oauth_provider");
      sessionStorage.removeItem("oauth_redirect");
      setErrorNotice("No authorization code received from authentication provider.");
      setTimeout(() => navigate("/login?error=Authorization+code+missing", { replace: true }), 2000);
      return;
    }

    // Ensure single execution of the one-time authorization code exchange
    if (exchangeStarted.current) {
      console.log("[OAUTH] Duplicate exchange execution ignored");
      return;
    }
    exchangeStarted.current = true;

    async function handleOAuthExchange() {
      console.log("[OAUTH] EXCHANGE_STARTED", {
        provider,
        hasCode: Boolean(code),
        hasState: Boolean(stateParam),
      });
      setStatusMessage(`Verifying your ${provider === "github" ? "GitHub" : "Google"} credentials...`);

      const baseOrigin = window.location.origin.includes("127.0.0.1")
        ? window.location.origin.replace("127.0.0.1", "localhost")
        : window.location.origin;

      const redirectUri = provider === "github"
        ? `${baseOrigin}/oauth/github/callback`
        : `${baseOrigin}/oauth/callback`;

      // Safety timeout guard (15s) so loading is never permanent
      const timeoutTimer = setTimeout(() => {
        console.error("[OAUTH] EXCHANGE_FAILED - Request timed out after 15 seconds");
        setErrorNotice("Authentication timed out. Please try logging in again.");
        setTimeout(() => navigate("/login?error=Authentication+timed+out", { replace: true }), 2000);
      }, 15000);

      try {
        const data = await callbackOAuth(provider, {
          code,
          redirect_uri: redirectUri,
          state: stateParam || undefined,
        });

        clearTimeout(timeoutTimer);

        console.log("[OAUTH] EXCHANGE_RESPONSE_RECEIVED", {
          hasAccessToken: Boolean(data?.access_token),
          hasUser: Boolean(data?.user),
          status: "OK",
        });

        if (!data?.access_token || !data?.user) {
          throw new Error("Invalid session data returned by authentication server.");
        }

        console.log("[OAUTH] EXCHANGE_SUCCESS");
        setStatusMessage("Account verified! Launching your workspace...");

        // Store user session in auth context and localStorage
        loginWithOAuth(data.access_token, data.user);

        const savedRedirect = sessionStorage.getItem("oauth_redirect");
        const destination = searchParams.get("redirect") || savedRedirect || "/dashboard";

        sessionStorage.removeItem("oauth_provider");
        sessionStorage.removeItem("oauth_redirect");

        // Navigate immediately to the destination
        navigate(destination, { replace: true });
      } catch (err) {
        clearTimeout(timeoutTimer);
        console.error("[OAUTH] EXCHANGE_FAILED", {
          message: err?.message || "Failed to complete OAuth authentication.",
        });
        sessionStorage.removeItem("oauth_provider");
        sessionStorage.removeItem("oauth_redirect");
        const message = err?.message || "Failed to complete OAuth authentication.";
        setErrorNotice(message);
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(message)}`, { replace: true });
        }, 2000);
      }
    }

    handleOAuthExchange();
  }, [searchParams, navigate, loginWithOAuth, providerOverride]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at 50% 30%, rgba(32, 70, 128, 0.2), transparent 70%), #05070f",
        color: "#f8fbff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "40px 30px",
          borderRadius: "24px",
          background: "rgba(19, 28, 49, 0.9)",
          border: "1px solid rgba(58, 151, 255, 0.25)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "3px solid rgba(34, 211, 255, 0.15)",
            borderTopColor: errorNotice ? "#f43f5e" : "#00d2ff",
            animation: errorNotice ? "none" : "spin 0.9s linear infinite",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

        <h2 style={{ fontSize: "1.35rem", margin: 0, color: errorNotice ? "#ff8e8e" : "#f8fbff" }}>
          {errorNotice ? "Authentication Notice" : "Securing Intervista AI Session"}
        </h2>

        <p style={{ color: "#98a3b7", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
          {errorNotice || statusMessage}
        </p>
      </div>
    </div>
  );
}
