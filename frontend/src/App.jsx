import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Resources from "./pages/Resources";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
import AdminPortal from "./pages/AdminPortal";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import { fetchCurrentUser, getToken, clearToken } from "./api";

function App() {

  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // On first load, if a token is saved, ask the backend who it belongs to.
  // This keeps the user logged in across page refreshes without trusting
  // whatever a client might have stashed in localStorage.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCheckingSession(false);
      return;
    }

    fetchCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => clearToken())
      .finally(() => setCheckingSession(false));
  }, []);

  const goToPage = (targetPage) => {
    setPage(targetPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navigation = {
    onOpenHome: () => goToPage("home"),

    onOpenResources: () => goToPage("resources"),

    onOpenDashboard: () => goToPage("dashboard"),

    onOpenCompanies: () => goToPage("companies"),

    onOpenPricing: () => goToPage("pricing"),

    onOpenFaq: () => goToPage("faq"),

    onOpenLogin: () => goToPage("login"),

    onOpenSignup: () => goToPage("signup"),

    onOpenProfile: () => setPage("profile"),

    onOpenAdmin: () => setPage("admin"),

    onAuth: (authenticatedUser) => {
      setUser(authenticatedUser);
      goToPage("home");
    },

    onLogout: () => {
      clearToken();
      setUser(null);
      goToPage("home");
    },

    user,
  };

  if (checkingSession) {
    return null;
  }

  return (
    <>
      {/* Navbar */}
      {page !== "login" && page !== "signup" && (
        <Navbar
          {...navigation}
          currentPage={page}
        />
      )}

      {/* Home */}
      {page === "home" && (
        <Home {...navigation} />
      )}

      {/* Resources */}
      {page === "resources" && (
        <Resources {...navigation} />
      )}

      {/* Companies */}
      {page === "companies" && (
        <Companies {...navigation} />
      )}

      {/* Pricing */}
      {page === "pricing" && (
        <Pricing {...navigation} />
      )}

      {/* FAQ */}
      {page === "faq" && (
        <FAQ {...navigation} />
      )}

      {/* Dashboard */}
      {page === "dashboard" && (
        <Dashboard {...navigation} />
      )}

      {/* {Profile Page} */}
      {page === "profile" && (
        <Profile user={user} onUserUpdate={setUser} />
      )}

      {/* Admin Portal */}
      {page === "admin" && (
        <AdminPortal user={user} {...navigation} />
      )}

      {/* Login */}
      {page === "login" && (
        <AuthPage
          mode="login"
          {...navigation}
        />
      )}

      {/* Signup */}
      {page === "signup" && (
        <AuthPage
          mode="signup"
          {...navigation}
        />
      )}

      {/* Footer */}
      {page !== "login" &&
        page !== "signup" && page !== "profile" && page !== "admin" && (
          <Footer />
        )}
    </>
  );
}

export default App;