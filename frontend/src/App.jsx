import { useState } from "react";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Resources from "./pages/Resources";
import Companies from "./pages/Companies";

import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";

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
    onOpenHome: () => setPage("home"),

    onOpenResources: () => setPage("resources"),

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
      {/* Common Navbar */}
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
        page !== "signup" && (
          <Footer />
        )}
    </>
  );
}

export default App;