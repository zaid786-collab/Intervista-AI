import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer/Footer";
import Companies from "./pages/Companies";

function App() {
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("intervista-current-user")) || null;
    } catch {
      return null;
    }
  });

 
  if (page === "dashboard") {
  return (
    <Dashboard
      onGoHome={() => setPage("home")}
      onOpenDashboard={() => setPage("dashboard")}
      onOpenCompanies={() => setPage("companies")}
      onOpenPricing={() => setPage("pricing")}
      onOpenFaq={() => setPage("faq")}
      onOpenLogin={() => setPage("login")}
      onOpenSignup={() => setPage("signup")}
      user={user}
      onLogout={() => {
        localStorage.removeItem("intervista-current-user");
        setUser(null);
        setPage("home");
      }}
    />
  );
}

  const navigation = {
    onGoHome: () => setPage("home"),
    onOpenDashboard: () => setPage("dashboard"),
    onOpenCompanies: () => setPage("companies"),
    onOpenPricing: () => setPage("pricing"),
    onOpenFaq: () => setPage("faq"),
    onOpenLogin: () => setPage("login"),
    onOpenSignup: () => setPage("signup"),

    onAuth: (authenticatedUser) => {
      localStorage.setItem(
        "intervista-current-user",
        JSON.stringify(authenticatedUser)
      );
      setUser(authenticatedUser);
      setPage("home");
    },

    onLogout: () => {
      localStorage.removeItem("intervista-current-user");
      setUser(null);
      setPage("home");
    },

    user,
  };

  return (
    <>
      {/* Navbar */}
      {page !== "login" &&
        page !== "signup" &&
        page !== "dashboard" && (
          <Navbar {...navigation} />
        )}

      {/* Pages */}
      {page === "home" && <Home />}
      {page === "pricing" && <Pricing />}
      {page === "faq" && <FAQ />}
      {page === "companies" && <Companies />}

      {page === "login" && (
        <AuthPage mode="login" {...navigation} />
      )}

      {page === "signup" && (
        <AuthPage mode="signup" {...navigation} />
      )}

      {/* Footer */}
      {page !== "login" &&
        page !== "signup" &&
        page !== "dashboard" && (
          <Footer />
        )}
    </>
  );
}

export default App;