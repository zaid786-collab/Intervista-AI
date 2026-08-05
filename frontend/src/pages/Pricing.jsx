import Navbar from "../components/Navbar";
import "./Pricing.css";

const plans = [
  { name: "Starter", price: "₹99", features: ["5 AI Interviews", "Basic Feedback", "Resume Upload", "Community Access"], action: "Get Started" },
  { name: "Pro", price: "₹499", features: ["Unlimited Interviews", "AI Performance Analysis", "ATS Resume Review", "Voice + Video Interview", "Coding Challenges"], action: "Start Pro", featured: true },
  { name: "Team", price: "₹999", features: ["Team Dashboard", "Recruiter Analytics", "Custom AI Models", "Priority Support"], action: "Contact Us" },
];

export default function Pricing(navigation) {
  return (
    <>
      <Navbar {...navigation} />
      <main className="pricing-section">
        <header className="pricing-header">
          <p className="pricing-tag">Pricing</p>
          <h1>Simple, Transparent <span>Pricing</span></h1>
          <p className="pricing-subtitle">Choose the perfect plan to level up your interview preparation.</p>
        </header>
        <section className="pricing-container" aria-label="Pricing plans">
          {plans.map((plan) => (
            <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <span className="pricing-badge">Most Popular</span>}
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}<span>/month</span></p>
              <ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>
              <button type="button">{plan.action}</button>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
