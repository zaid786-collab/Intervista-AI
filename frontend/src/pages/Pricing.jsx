import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import CheckoutModal from "../components/CheckoutModal";
import "./Pricing.css";

const COMPARISON_FEATURES = [
  { feature: "AI Mock Interviews", starter: "5 / month", pro: "Unlimited", team: "Unlimited" },
  { feature: "Real-time Voice & Video AI", starter: "✕", pro: "✓ Included", team: "✓ Included" },
  { feature: "ATS Resume Review & Scoring", starter: "Basic", pro: "Advanced + Keyword Match", team: "Advanced + Bulk ATS" },
  { feature: "Live Coding Sandbox & Hints", starter: "Limited", pro: "✓ Full Access", team: "✓ Full Access" },
  { feature: "Company Specific Interview Packs", starter: "Top 3", pro: "All 50+ Top Tech Companies", team: "All 50+ & Custom Packs" },
  { feature: "Performance Analytics & Heatmaps", starter: "Basic", pro: "✓ Deep AI Diagnostics", team: "✓ Team & Recruiter Analytics" },
  { feature: "Official Certificate of Readiness", starter: "✕", pro: "✓ Shareable Certificate", team: "✓ Shareable Certificate" },
  { feature: "Support SLA", starter: "Community", pro: "24/7 Priority Support", team: "Dedicated Account Manager" },
];

const FAQS = [
  {
    q: "Can I cancel or switch my plan at any time?",
    a: "Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time with one click from your account settings. No questions asked.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support all major Credit and Debit cards (Visa, Mastercard, American Express), UPI / QR Code instant payments, Net Banking from 50+ banks, and digital wallets like Apple Pay, Google Pay, and PayPal.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes! We offer a full 14-day 100% money-back guarantee. If you're not completely satisfied with your interview preparation results, simply contact us for an instant refund.",
  },
  {
    q: "How does the annual discount work?",
    a: "When you choose Annual billing, you receive an automatic 20% discount on the total yearly price, which equals 2 months of free access compared to monthly billing.",
  },
  {
    q: "Can I use promo codes on checkout?",
    a: "Yes! Use coupon code INTERVISTA20 at checkout for an extra 20% off, or AIREADY for an instant ₹15 savings on all plans.",
  },
];

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState("pro");
  const [openFaq, setOpenFaq] = useState(null);

  const currentPlan = (user?.subscription_plan || "free").toLowerCase();

  const handlePlanAction = (planKey) => {
    if (planKey === "starter") {
      if (!isAuthenticated) {
        navigate("/signup");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    if (!isAuthenticated) {
      // Store intent and send to login/signup or allow direct modal checkout
      setSelectedPlanForModal(planKey);
      setModalOpen(true);
      return;
    }

    setSelectedPlanForModal(planKey);
    setModalOpen(true);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="pricing-section">
      {/* ================= HERO HEADER ================= */}
      <header className="pricing-header">
        <div className="pricing-tag">✦ INVEST IN YOUR CAREER</div>

        <h1>
          Simple, Transparent <span>Pricing</span>
        </h1>

        <p className="pricing-subtitle">
          Ace your technical interviews at Google, Meta, Amazon, and top tech companies with AI-powered mock interviews and real-time coaching.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="billing-toggle-container">
          <div className="billing-toggle-pill">
            <button
              type="button"
              className={`cycle-btn ${billingCycle === "monthly" ? "active" : ""}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              className={`cycle-btn ${billingCycle === "yearly" ? "active" : ""}`}
              onClick={() => setBillingCycle("yearly")}
            >
              Annual Billing
              <span className="save-badge">SAVE 20%</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRICING CARDS ================= */}
      <section className="pricing-container" aria-label="Pricing plans">
        {/* PLAN 1: STARTER */}
        <article className={`price-card ${currentPlan === "free" || currentPlan === "starter" ? "current-tier" : ""}`}>
          <div className="card-header-area">
            <h3>Starter</h3>
            <p className="plan-description">Essential AI practice for students and job seekers.</p>
          </div>

          <p className="price">
            ₹0
            <span>/month</span>
          </p>

          <ul className="plan-perks-list">
            <li>✓ <strong>5 AI Mock Interviews</strong> per month</li>
            <li>✓ Basic Technical & Communication Score</li>
            <li>✓ ATS Resume Upload & Format Check</li>
            <li>✓ Access to 50+ DSA Practice Problems</li>
            <li>✓ Community Discord & Forum Access</li>
          </ul>

          <button
            type="button"
            className="plan-cta-btn starter"
            onClick={() => handlePlanAction("starter")}
          >
            {isAuthenticated ? (currentPlan === "free" ? "Current Plan" : "Downgrade to Free") : "Get Started Free"}
          </button>
        </article>

        {/* PLAN 2: PRO (FEATURED) */}
        <article className={`price-card featured ${currentPlan === "pro" ? "current-tier" : ""}`}>
          <span className="pricing-badge">★ MOST POPULAR</span>

          <div className="card-header-area">
            <h3>Pro</h3>
            <p className="plan-description">Complete mastery system for serious software engineers.</p>
          </div>

          <p className="price">
            {billingCycle === "yearly" ? "₹79" : "₹99"}
            <span>/month {billingCycle === "yearly" ? "(billed ₹950/yr)" : ""}</span>
          </p>

          <ul className="plan-perks-list">
            <li>✓ <strong>Unlimited AI Mock Interviews</strong></li>
            <li>✓ <strong>Real-time Voice & Video</strong> speech diagnostics</li>
            <li>✓ <strong>Deep ATS Resume Scoring</strong> & keyword optimizer</li>
            <li>✓ <strong>50+ Company-Specific</strong> interview rubrics (FAANG)</li>
            <li>✓ Live Coding Sandbox with AI hint generation</li>
            <li>✓ Official Shareable Interview Readiness Certificate</li>
            <li>✓ Priority 24/7 Support with AI Mentor</li>
          </ul>

          <button
            type="button"
            className="plan-cta-btn pro"
            onClick={() => handlePlanAction("pro")}
          >
            {currentPlan === "pro" ? "✓ Active Pro Plan" : "Upgrade to Pro →"}
          </button>
        </article>

        {/* PLAN 3: TEAM */}
        <article className={`price-card team-card ${currentPlan === "team" ? "current-tier" : ""}`}>
          <div className="card-header-area">
            <h3>Team & Enterprise</h3>
            <p className="plan-description">For universities, bootcamps, and hiring teams.</p>
          </div>

          <p className="price">
            {billingCycle === "yearly" ? "₹159" : "₹199"}
            <span>/month {billingCycle === "yearly" ? "(billed ₹1,910/yr)" : ""}</span>
          </p>

          <ul className="plan-perks-list">
            <li>✓ <strong>Everything in Pro</strong> for up to 10 team seats</li>
            <li>✓ Recruiter Dashboard & Candidate Analytics</li>
            <li>✓ Custom Rubrics tailored to your hiring bar</li>
            <li>✓ Bulk CSV / PDF Candidate Evaluation Export</li>
            <li>✓ Single Sign-On (SSO) & LMS Integration</li>
            <li>✓ Dedicated Technical Account Manager</li>
          </ul>

          <button
            type="button"
            className="plan-cta-btn team"
            onClick={() => handlePlanAction("team")}
          >
            {currentPlan === "team" ? "✓ Active Team Plan" : "Get Team Plan →"}
          </button>
        </article>
      </section>

      {/* ================= MONEY BACK & SECURITY PROMISE ================= */}
      <section className="pricing-trust-bar">
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <div>
            <strong>Bank-Grade 256-Bit SSL</strong>
            <p>Your payment data is fully tokenized & encrypted.</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">💳</span>
          <div>
            <strong>Multiple Payment Methods</strong>
            <p>Cards, UPI / QR, Net Banking, Apple Pay, PayPal.</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">↩️</span>
          <div>
            <strong>14-Day Money-Back Guarantee</strong>
            <p>Risk-free 100% refund if not satisfied.</p>
          </div>
        </div>
      </section>

      {/* ================= DETAILED COMPARISON TABLE ================= */}
      <section className="feature-comparison-section">
        <div className="comparison-header">
          <h2>Compare <span>Plan Features</span></h2>
          <p>Everything you need to know about our subscription tiers</p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Features</th>
                <th>Starter</th>
                <th className="highlight-col">Pro (Recommended)</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row, idx) => (
                <tr key={idx}>
                  <td className="feat-title">{row.feature}</td>
                  <td>{row.starter}</td>
                  <td className="highlight-col font-bold">{row.pro}</td>
                  <td>{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="pricing-faq-section">
        <div className="faq-header">
          <h2>Frequently Asked <span>Questions</span></h2>
          <p>Have questions about payments, billing, or plans? We have answers.</p>
        </div>

        <div className="faq-accordion">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFaq === index ? "open" : ""}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <span className="faq-toggle-icon">{openFaq === index ? "−" : "+"}</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="pricing-bottom-cta">
        <div className="cta-inner-card">
          <h2>Ready to Land Your Dream Tech Job?</h2>
          <p>Join thousands of engineers practicing with Intervista AI today.</p>
          <button
            type="button"
            className="cta-sparkle-btn"
            onClick={() => handlePlanAction("pro")}
          >
            Start Your Pro Journey Today →
          </button>
        </div>
      </section>

      {/* ================= CHECKOUT MODAL ================= */}
      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlan={selectedPlanForModal}
        initialCycle={billingCycle}
        onSuccess={(receipt) => {
          // Success callback
        }}
      />
    </main>
  );
}