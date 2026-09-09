import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "75vh",
          color: "#94a3b8",
          gap: "18px",
          background: "radial-gradient(circle at 50% 30%, rgba(32, 70, 128, 0.15), transparent 70%), #05070f",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid rgba(34, 211, 255, 0.15)",
            borderTopColor: "#00d2ff",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: "0.95rem", letterSpacing: "0.05em", color: "#6fe7ff", fontWeight: 500 }}>
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
