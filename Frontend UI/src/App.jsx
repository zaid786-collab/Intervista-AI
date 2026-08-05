import { useState } from "react";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer/Footer";

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
    return <Dashboard />;
  }

  const navigation = {
    onOpenDashboard: () => setPage("dashboard"),
    onOpenPricing: () => setPage("pricing"),
    onOpenFaq: () => setPage("faq"),
    onOpenLogin: () => setPage("login"),
    onOpenSignup: () => setPage("signup"),
    onAuth: (authenticatedUser) => {
      localStorage.setItem("intervista-current-user", JSON.stringify(authenticatedUser));
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
      {page === "home" && <Home {...navigation} />}
      {page === "pricing" && <Pricing {...navigation} />}
      {page === "faq" && <FAQ {...navigation} />}
      {page === "login" && <AuthPage mode="login" {...navigation} />}
      {page === "signup" && <AuthPage mode="signup" {...navigation} />}
      {page !== "login" && page !== "signup" && <Footer />}
    </>
  );
}

export default App;
