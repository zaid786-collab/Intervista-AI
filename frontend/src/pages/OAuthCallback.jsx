import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { callbackOAuth } from "../api";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [statusMessage, setStatusMessage] = useState("Connecting with identity provider...");
  const [errorNotice, setErrorNotice] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function handleOAuthExchange() {
      const code = searchParams.get("code");
      const provider = searchParams.get("provider") || (code?.startsWith("mock_github") ? "github" : "google");
      const oauthError = searchParams.get("error");
      const errorDesc = searchParams.get("error_description");

      if (oauthError) {
        const errorMsg = errorDesc || "Authentication was cancelled by the user.";
        if (isMounted) {
          setErrorNotice(errorMsg);
          setTimeout(() => navigate(`/login?error=${encodeURIComponent(errorMsg)}`), 1200);
        }
        return;
      }

      if (!code) {
        if (isMounted) {
          setErrorNotice("No authorization code received.");
          setTimeout(() => navigate("/login?error=Authorization+code+missing"), 1200);
        }
        return;
      }

      try {
        if (isMounted) setStatusMessage(`Verifying ${provider.toUpperCase()} credentials...`);

        const redirectUri = `${window.location.origin}/oauth/callback`;
        const data = await callbackOAuth(provider, {
          code,
          redirect_uri: redirectUri,
        });

        if (isMounted) {
          setStatusMessage("Account verified! Launching your workspace...");
          loginWithOAuth(data.access_token, data.user);

          // Check if there was an intended redirect URL
          const destination = searchParams.get("redirect") || "/dashboard";
          setTimeout(() => {
            navigate(destination, { replace: true });
          }, 400);
        }
      } catch (err) {
        if (isMounted) {
          const message = err.message || "Failed to complete OAuth authentication.";
          setErrorNotice(message);
          setTimeout(() => {
            navigate(`/login?error=${encodeURIComponent(message)}`, { replace: true });
          }, 1500);
        }
      }
    }

    handleOAuthExchange();

    return () => {
      isMounted = false;
    };
  }, [searchParams, navigate, loginWithOAuth]);

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
