import { useState } from "react";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Resources from "./pages/Resources";

import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import Companies from "./pages/Companies";

function App() {
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("intervista-current-user")
        ) || null
      );
    } catch {
      return null;
    }
  }); 

  const navigation = {
    // Intervista AI logo → Home
    onOpenHome: () => setPage("home"),

    // Navbar navigation
    onOpenResources: () => setPage("resources"),

    onOpenDashboard: () => setPage("dashboard"),

    onOpenCompanies: () => setPage("companies"),

    onOpenPricing: () => setPage("pricing"),

    onOpenFaq: () => setPage("faq"),

    onOpenLogin: () => setPage("login"),

    onOpenSignup: () => setPage("signup"),

    // Authentication
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
      {/* Common Home Navbar - visible on every main page */}
      {page !== "login" && page !== "signup" && (
        <Navbar {...navigation} />
      )}

      {/* Pages */}
      {page === "home" && (
        <Home {...navigation} />
      )}

      {page === "resources" && (
        <Resources {...navigation} />
      )}

       {page === "companies" && (
        <Companies {...navigation} />
      )}

      {page === "pricing" && (
        <Pricing {...navigation} />
      )}

      {page === "faq" && (
        <FAQ {...navigation} />
      )}

      {page === "dashboard" && (
        <Dashboard {...navigation} />
      )}

      {page === "login" && (
        <AuthPage
          mode="login"
          {...navigation}
        />
      )}

      {page === "signup" && (
        <AuthPage
          mode="signup"
          {...navigation}
        />
      )}

      {/* Footer */}
      {page !== "login" &&
        page !== "signup" &&
        page !== "dashboard" && <Footer />}
    </>
  );
}

export default App;