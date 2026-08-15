import { useState } from "react";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Resources from "./pages/Resources";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
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

    onAuth: (authenticatedUser) => {
      localStorage.setItem(
        "intervista-current-user",
        JSON.stringify(authenticatedUser)
      );

      setUser(authenticatedUser);
      goToPage("home");
    },

    onLogout: () => {
      localStorage.removeItem("intervista-current-user");

      setUser(null);
      goToPage("home");
    },

    user,
  };

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
        <Profile user={user}/>
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
        page !== "signup" &&  page !== "profile" && (
          <Footer />
        )}
    </>
  );
}

export default App;