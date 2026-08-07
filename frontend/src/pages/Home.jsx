import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home({
  onOpenDashboard,
  onOpenPricing,
  onOpenFaq,
  onOpenLogin,
  onOpenSignup,
  user,
  onLogout,
}) {
  return (
    <div className="home-page">

      {/* Fixed Home Navbar */}
      <Navbar
        onOpenDashboard={onOpenDashboard}
        onOpenPricing={onOpenPricing}
        onOpenFaq={onOpenFaq}
        onOpenLogin={onOpenLogin}
        onOpenSignup={onOpenSignup}
        user={user}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <Hero />

    </div>
  );
}

export default Home;