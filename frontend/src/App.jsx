import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
// import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Resources from "./pages/Resources";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
import AdminPortal from "./pages/AdminPortal";
import Dashboard from "./components/dashboard/Dashboard";
import Analysis from "./pages/Analysis";
import OAuthCallback from "./pages/OAuthCallback";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const hideFooter = ["/login", "/signup", "/oauth/callback", "/profile", "/admin", "/dashboard"].includes(path);

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Explicitly Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Global Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
