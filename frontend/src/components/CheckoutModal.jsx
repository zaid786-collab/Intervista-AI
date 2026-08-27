import { useState, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  createPaymentOrder,
  confirmPayment,
  validateCoupon,
} from "../api";
import "./CheckoutModal.css";

const POPULAR_BANKS = [
  { id: "hdfc", name: "HDFC Bank", code: "HDFC", icon: "🏛️" },
  { id: "icici", name: "ICICI Bank", code: "ICICI", icon: "🏢" },
  { id: "sbi", name: "State Bank of India", code: "SBIN", icon: "🏦" },
  { id: "axis", name: "Axis Bank", code: "UTIB", icon: "💳" },
  { id: "kotak", name: "Kotak Mahindra", code: "KKBK", icon: "🪙" },
  { id: "chase", name: "JPMorgan Chase", code: "CHAS", icon: "🌐" },
];

export default function CheckoutModal({
  isOpen,
  onClose,
  initialPlan = "pro",
  initialCycle = "monthly",
  onSuccess,
}) {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Pricing & Selection State
  const [selectedPlan, setSelectedPlan] = useState(initialPlan.toLowerCase());
  const [billingCycle, setBillingCycle] = useState(initialCycle);
  const [activeTab, setActiveTab] = useState("card"); // 'card' | 'upi' | 'netbanking' | 'wallet'

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardBrand, setCardBrand] = useState("visa");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState("");
  const [upiTimer, setUpiTimer] = useState(300); // 5 min countdown

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("hdfc");

  // Wallet State
  const [walletType, setWalletType] = useState("gpay");

  // Processing & Success State
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const modalHeadingId = useId();

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(initialPlan.toLowerCase());
      setBillingCycle(initialCycle);
      setPaymentSuccess(false);
      setPaymentReceipt(null);
      setErrorMessage("");
      setPromoError("");
    }
  }, [isOpen, initialPlan, initialCycle]);

  // UPI countdown timer
  useEffect(() => {
    let interval = null;
    if (isOpen && activeTab === "upi" && !paymentSuccess) {
      interval = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeTab, paymentSuccess]);

  if (!isOpen) return null;

  // Price calculations
  const baseMonthly = selectedPlan === "team" ? 99 : 49;
  const baseYearly = selectedPlan === "team" ? 950 : 470;
  const basePrice = billingCycle === "yearly" ? baseYearly : baseMonthly;

  let discountVal = 0;
  if (promoApplied) {
    discountVal = promoApplied.discount_amount;
  }
  const finalPrice = Math.max(0, basePrice - discountVal);

  // Card Number Formatter and Brand Detector
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);

    // Detect card brand
    if (val.startsWith("4")) setCardBrand("visa");
    else if (val.startsWith("5") || val.startsWith("2")) setCardBrand("mastercard");
    else if (val.startsWith("34") || val.startsWith("37")) setCardBrand("amex");
    else if (val.startsWith("6")) setCardBrand("discover");
    else setCardBrand("generic");

    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    setCardCvv(val);
  };

  // Test card autofill for easy evaluation
  const autofillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardName(user?.name || "Alex Morgan");
    setCardExpiry("12/28");
    setCardCvv("888");
    setCardBrand("visa");
  };

  // Apply Coupon
  const handleApplyPromo = async (e) => {
    e?.preventDefault();
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");

    try {
      const res = await validateCoupon({
        code: promoCode,
        plan_name: selectedPlan,
        billing_cycle: billingCycle,
      });
      setPromoApplied(res);
    } catch (err) {
      setPromoError(err.message || "Invalid promo code");
      setPromoApplied(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
  };

  // Process Checkout
  const handleProceedPayment = async (e) => {
    e?.preventDefault();
    setErrorMessage("");

    // Validate inputs per active tab
    if (activeTab === "card") {
      const rawCard = cardNumber.replace(/\s/g, "");
      if (rawCard.length < 15) {
        setErrorMessage("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardName.trim()) {
        setErrorMessage("Please enter the name on the card.");
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage("Please enter a valid expiration date (MM/YY).");
        return;
      }
      if (cardCvv.length < 3) {
        setErrorMessage("Please enter a valid CVV/CVC code.");
        return;
      }
    } else if (activeTab === "upi") {
      if (!upiId.trim() && !upiId.includes("@")) {
        setErrorMessage("Please enter a valid UPI ID (e.g. user@okhdfcbank).");
        return;
      }
    }

    setProcessing(true);
    setProcessingStep(1);

    try {
      // Step 1: Create Order
      const order = await createPaymentOrder({
        plan_name: selectedPlan,
        billing_cycle: billingCycle,
        promo_code: promoApplied?.code || null,
        currency: "USD",
      });

      // Animate progress
      setTimeout(() => setProcessingStep(2), 600);
      setTimeout(() => setProcessingStep(3), 1200);

      // Step 2: Confirm Payment
      const paymentPayload = {
        order_id: order.order_id,
        plan_name: selectedPlan,
        billing_cycle: billingCycle,
        amount: finalPrice,
        currency: "USD",
        payment_method: activeTab,
        promo_code: promoApplied?.code || null,
        discount_amount: discountVal,
        card_last4: cardNumber.replace(/\s/g, "").slice(-4) || "4242",
        card_brand: cardBrand || "Visa",
        upi_id: upiId || undefined,
        bank_name: selectedBank || undefined,
      };

      const result = await confirmPayment(paymentPayload);

      setTimeout(() => {
        setProcessing(false);
        setPaymentSuccess(true);
        setPaymentReceipt(result.receipt || result);

        // Update auth user object with active subscription
        if (user) {
          updateUser({
            ...user,
            subscription_plan: selectedPlan,
            subscription_cycle: billingCycle,
            subscription_expires_at: result.subscription_expires_at,
          });
        }

        if (onSuccess) {
          onSuccess(result);
        }
      }, 1600);
    } catch (err) {
      setProcessing(false);
      setErrorMessage(err.message || "Payment authorization failed. Please try again.");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="checkout-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={modalHeadingId}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* ================= SUCCESS CELEBRATION VIEW ================= */}
        {paymentSuccess && paymentReceipt ? (
          <div className="checkout-success-view">
            <div className="success-icon-badge">
              <span className="sparkle">✦</span>
              <div className="checkmark-circle">✓</div>
            </div>

            <h2 id={modalHeadingId} className="success-title">Payment Successful!</h2>
            <p className="success-subtitle">
              Welcome to <strong>Intervista AI {selectedPlan.toUpperCase()}</strong>! Your account has been upgraded with unlimited access.
            </p>

            <div className="receipt-card" id="printable-receipt">
              <div className="receipt-header">
                <div>
                  <span className="receipt-logo">⚡ Intervista AI</span>
                  <p className="receipt-invoice-id">Invoice: {paymentReceipt.invoice_id}</p>
                </div>
                <div className="receipt-status-pill">PAID & VERIFIED</div>
              </div>

              <div className="receipt-grid">
                <div>
                  <span>Date & Time</span>
                  <strong>{paymentReceipt.date || "Today"}</strong>
                </div>
                <div>
                  <span>Payment Method</span>
                  <strong>
                    {paymentReceipt.payment_method || activeTab.toUpperCase()} {paymentReceipt.card_last4 ? `(••• ${paymentReceipt.card_last4})` : ""}
                  </strong>
                </div>
                <div>
                  <span>Plan Subscribed</span>
                  <strong className="receipt-highlight">
                    {selectedPlan.toUpperCase()} ({billingCycle.toUpperCase()})
                  </strong>
                </div>
                <div>
                  <span>Valid Until</span>
                  <strong>{paymentReceipt.expires_at || "30 Days from now"}</strong>
                </div>
              </div>

              <div className="receipt-line-items">
                <div className="receipt-item-row">
                  <span>Intervista AI {selectedPlan.toUpperCase()} Plan</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {discountVal > 0 && (
                  <div className="receipt-item-row discount">
                    <span>Discount ({promoApplied?.code})</span>
                    <span>-${discountVal.toFixed(2)}</span>
                  </div>
                )}
                <div className="receipt-item-row total">
                  <span>Total Paid</span>
                  <span>${finalPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            <div className="success-action-row">
              <button type="button" className="receipt-btn secondary" onClick={handlePrintReceipt}>
                🖨 Print / Save Receipt
              </button>
              <button
                type="button"
                className="receipt-btn primary"
                onClick={() => {
                  onClose();
                  navigate("/dashboard");
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN CHECKOUT INTERFACE ================= */
          <div className="checkout-content-grid">
            {/* LEFT COLUMN: Payment Methods & Details */}
            <div className="checkout-left-pane">
              <div className="checkout-header">
                <span className="checkout-badge">⚡ SECURE 256-BIT CHECKOUT</span>
                <h2 id={modalHeadingId}>Complete Your Subscription</h2>
                <p>Select your preferred payment method to activate your plan instantly.</p>
              </div>

              {/* Plan Switcher Pills inside checkout */}
              <div className="checkout-plan-selector">
                <button
                  type="button"
                  className={`plan-pill ${selectedPlan === "pro" ? "active" : ""}`}
                  onClick={() => setSelectedPlan("pro")}
                >
                  <span className="pill-name">PRO PLAN</span>
                  <span className="pill-price">{billingCycle === "yearly" ? "$470/yr" : "$49/mo"}</span>
                </button>
                <button
                  type="button"
                  className={`plan-pill ${selectedPlan === "team" ? "active" : ""}`}
                  onClick={() => setSelectedPlan("team")}
                >
                  <span className="pill-name">TEAM PLAN</span>
                  <span className="pill-price">{billingCycle === "yearly" ? "$950/yr" : "$99/mo"}</span>
                </button>
              </div>

              {/* Payment Method Tabs */}
              <div className="payment-method-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "card"}
                  className={`method-tab ${activeTab === "card" ? "active" : ""}`}
                  onClick={() => setActiveTab("card")}
                >
                  <span className="tab-icon">💳</span>
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "upi"}
                  className={`method-tab ${activeTab === "upi" ? "active" : ""}`}
                  onClick={() => setActiveTab("upi")}
                >
                  <span className="tab-icon">📱</span>
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "netbanking"}
                  className={`method-tab ${activeTab === "netbanking" ? "active" : ""}`}
                  onClick={() => setActiveTab("netbanking")}
                >
                  <span className="tab-icon">🏦</span>
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "wallet"}
                  className={`method-tab ${activeTab === "wallet" ? "active" : ""}`}
                  onClick={() => setActiveTab("wallet")}
                >
                  <span className="tab-icon">🌐</span>
                  <span>Wallets / PayPal</span>
                </button>
              </div>

              {/* ERROR ALERT */}
              {errorMessage && (
                <div className="checkout-error-alert" role="alert">
                  <span>⚠️</span> {errorMessage}
                </div>
              )}

              {/* TAB 1: CARD PAYMENT */}
              {activeTab === "card" && (
                <div className="tab-content card-tab-content">
                  {/* Interactive Virtual Card Preview */}
                  <div className={`virtual-card ${cardBrand} ${isCardFlipped ? "flipped" : ""}`}>
                    <div className="card-front">
                      <div className="card-top">
                        <div className="card-chip"></div>
                        <div className="contactless-wave">📶</div>
                        <span className="card-brand-logo">{cardBrand.toUpperCase()}</span>
                      </div>
                      <div className="card-number-display">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="card-bottom">
                        <div className="card-holder">
                          <span>CARD HOLDER</span>
                          <strong>{cardName.toUpperCase() || "YOUR NAME"}</strong>
                        </div>
                        <div className="card-exp">
                          <span>EXPIRES</span>
                          <strong>{cardExpiry || "MM/YY"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="test-card-helper">
                    <span>💡 Testing environment:</span>
                    <button type="button" onClick={autofillTestCard} className="quick-autofill-btn">
                      Auto-fill Test Card (4242)
                    </button>
                  </div>

                  {/* Accessible Card Form */}
                  <form onSubmit={handleProceedPayment} className="checkout-form">
                    <div className="form-group">
                      <label htmlFor="cc-number">Card Number</label>
                      <div className="input-with-icon">
                        <input
                          id="cc-number"
                          name="cc-number"
                          type="text"
                          autoComplete="cc-number"
                          inputMode="numeric"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          required
                        />
                        <span className="field-icon">💳</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cc-name">Cardholder Name</label>
                      <input
                        id="cc-name"
                        name="cc-name"
                        type="text"
                        autoComplete="cc-name"
                        placeholder="e.g. Alex Morgan"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cc-exp">Expiry (MM/YY)</label>
                        <input
                          id="cc-exp"
                          name="cc-exp"
                          type="text"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="cc-csc">CVV / CVC</label>
                        <input
                          id="cc-csc"
                          name="cc-csc"
                          type="password"
                          autoComplete="cc-csc"
                          inputMode="numeric"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={handleCvvChange}
                          maxLength={4}
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="checkout-pay-btn"
                      disabled={processing}
                    >
                      {processing ? (
                        <span className="btn-loader-text">
                          <span className="spinner"></span> Processing ${finalPrice.toFixed(2)}...
                        </span>
                      ) : (
                        `Pay $${finalPrice.toFixed(2)} & Upgrade to ${selectedPlan.toUpperCase()}`
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: UPI / QR CODE */}
              {activeTab === "upi" && (
                <div className="tab-content upi-tab-content">
                  <div className="upi-qr-card">
                    <div className="qr-visual">
                      <div className="qr-matrix">
                        {/* Interactive SVG QR Code Mockup */}
                        <svg viewBox="0 0 100 100" width="140" height="140" className="qr-svg">
                          <rect width="100" height="100" fill="#ffffff" rx="8" />
                          <rect x="10" y="10" width="25" height="25" fill="#070b18" rx="3" />
                          <rect x="15" y="15" width="15" height="15" fill="#ffffff" rx="2" />
                          <rect x="18" y="18" width="9" height="9" fill="#8b5cf6" />

                          <rect x="65" y="10" width="25" height="25" fill="#070b18" rx="3" />
                          <rect x="70" y="15" width="15" height="15" fill="#ffffff" rx="2" />
                          <rect x="73" y="18" width="9" height="9" fill="#8b5cf6" />

                          <rect x="10" y="65" width="25" height="25" fill="#070b18" rx="3" />
                          <rect x="15" y="70" width="15" height="15" fill="#ffffff" rx="2" />
                          <rect x="18" y="73" width="9" height="9" fill="#8b5cf6" />

                          <rect x="42" y="15" width="6" height="6" fill="#070b18" />
                          <rect x="52" y="22" width="6" height="6" fill="#070b18" />
                          <rect x="42" y="42" width="16" height="16" fill="#8b5cf6" rx="2" />
                          <rect x="68" y="50" width="8" height="8" fill="#070b18" />
                          <rect x="50" y="72" width="8" height="8" fill="#070b18" />
                          <rect x="75" y="75" width="10" height="10" fill="#070b18" />
                        </svg>
                      </div>
                      <div className="qr-info">
                        <span className="qr-scan-badge">⚡ Instant Scan & Pay</span>
                        <strong>Scan with any UPI App</strong>
                        <p>Google Pay, PhonePe, Paytm, BHIM, Cred</p>
                        <div className="qr-timer">
                          ⏳ Expires in: <strong>{Math.floor(upiTimer / 60)}:{(upiTimer % 60).toString().padStart(2, "0")}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="upi-divider">
                    <span>OR ENTER UPI ID</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="upi-id">Virtual Payment Address (VPA)</label>
                    <div className="upi-input-wrapper">
                      <input
                        id="upi-id"
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <button
                        type="button"
                        className="upi-quick-pill"
                        onClick={() => setUpiId("intervista.candidate@okhdfcbank")}
                      >
                        Autofill Demo VPA
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="checkout-pay-btn upi"
                    onClick={handleProceedPayment}
                    disabled={processing}
                  >
                    {processing ? "Verifying UPI Payment..." : `Verify & Pay $${finalPrice.toFixed(2)}`}
                  </button>
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {activeTab === "netbanking" && (
                <div className="tab-content netbanking-tab-content">
                  <p className="bank-selection-hint">Choose your bank to proceed with direct Net Banking portal:</p>
                  <div className="bank-grid">
                    {POPULAR_BANKS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={`bank-tile ${selectedBank === b.id ? "selected" : ""}`}
                        onClick={() => setSelectedBank(b.id)}
                      >
                        <span className="bank-icon">{b.icon}</span>
                        <span className="bank-name">{b.name}</span>
                        {selectedBank === b.id && <span className="bank-check">✓</span>}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="checkout-pay-btn"
                    onClick={handleProceedPayment}
                    disabled={processing}
                  >
                    {processing ? "Connecting to Bank Gateway..." : `Proceed with ${POPULAR_BANKS.find(b => b.id === selectedBank)?.name} ($${finalPrice.toFixed(2)})`}
                  </button>
                </div>
              )}

              {/* TAB 4: WALLETS / PAYPAL */}
              {activeTab === "wallet" && (
                <div className="tab-content wallet-tab-content">
                  <div className="wallet-options">
                    <button
                      type="button"
                      className={`wallet-btn paypal ${walletType === "paypal" ? "active" : ""}`}
                      onClick={() => setWalletType("paypal")}
                    >
                      <span className="wallet-icon">🅿️</span>
                      <strong>PayPal Express</strong>
                      <span>Fast & Secure</span>
                    </button>

                    <button
                      type="button"
                      className={`wallet-btn gpay ${walletType === "gpay" ? "active" : ""}`}
                      onClick={() => setWalletType("gpay")}
                    >
                      <span className="wallet-icon">🌐</span>
                      <strong>Google Pay</strong>
                      <span>One-click checkout</span>
                    </button>

                    <button
                      type="button"
                      className={`wallet-btn applepay ${walletType === "applepay" ? "active" : ""}`}
                      onClick={() => setWalletType("applepay")}
                    >
                      <span className="wallet-icon"></span>
                      <strong>Apple Pay</strong>
                      <span>Touch / Face ID</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="checkout-pay-btn wallet"
                    onClick={handleProceedPayment}
                    disabled={processing}
                  >
                    {processing ? "Authorizing Wallet..." : `Pay with ${walletType.toUpperCase()} ($${finalPrice.toFixed(2)})`}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Order Summary & Coupon */}
            <div className="checkout-right-pane">
              <div className="order-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                {/* Selected Plan Details */}
                <div className="summary-plan-banner">
                  <div className="plan-tag">Intervista AI</div>
                  <h4>{selectedPlan.toUpperCase()} MEMBERSHIP</h4>
                  <p className="plan-cycle-text">
                    Billed {billingCycle} {billingCycle === "yearly" ? "(20% Annual Savings Included)" : ""}
                  </p>
                </div>

                {/* Plan Highlights */}
                <ul className="summary-features-list">
                  <li>✓ Unlimited AI Mock Interviews</li>
                  <li>✓ Real-Time Voice & Video Feedback</li>
                  <li>✓ ATS Resume Review & Scoring</li>
                  <li>✓ Full DSA Coding Challenge Suite</li>
                  <li>✓ Official Verified Certificate of Readiness</li>
                </ul>

                {/* Coupon Code Section */}
                <div className="coupon-box">
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. INTERVISTA20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={Boolean(promoApplied)}
                    />
                    {promoApplied ? (
                      <button type="button" className="remove-promo-btn" onClick={handleRemovePromo}>
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="apply-promo-btn"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoCode.trim()}
                      >
                        {promoLoading ? "..." : "Apply"}
                      </button>
                    )}
                  </div>

                  {promoApplied && (
                    <div className="promo-success-badge">
                      ✓ {promoApplied.message}
                    </div>
                  )}
                  {promoError && (
                    <div className="promo-error-badge">
                      ✕ {promoError}
                    </div>
                  )}

                  <div className="coupon-suggestions">
                    <span>Try:</span>
                    <button type="button" onClick={() => { setPromoCode("INTERVISTA20"); }}>
                      INTERVISTA20 (20% OFF)
                    </button>
                    <button type="button" onClick={() => { setPromoCode("AIREADY"); }}>
                      AIREADY ($15 OFF)
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pricing-breakdown">
                  <div className="breakdown-row">
                    <span>Base Subscription</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>

                  {discountVal > 0 && (
                    <div className="breakdown-row discount">
                      <span>Promo Discount ({promoApplied?.code})</span>
                      <span>-${discountVal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="breakdown-row">
                    <span>Estimated Tax</span>
                    <span className="tax-free">$0.00</span>
                  </div>

                  <div className="breakdown-divider"></div>

                  <div className="breakdown-row total">
                    <span>Total Due Today</span>
                    <span className="total-amount">${finalPrice.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Trust & Guarantee Badges */}
                <div className="security-badges">
                  <div className="badge-item">
                    <span>🔒</span>
                    <div>
                      <strong>256-Bit SSL</strong>
                      <p>Bank-grade encryption</p>
                    </div>
                  </div>
                  <div className="badge-item">
                    <span>🛡️</span>
                    <div>
                      <strong>PCI-DSS Certified</strong>
                      <p>Tokenized payments</p>
                    </div>
                  </div>
                  <div className="badge-item">
                    <span>↩️</span>
                    <div>
                      <strong>14-Day Guarantee</strong>
                      <p>100% money back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING OVERLAY */}
        {processing && (
          <div className="checkout-processing-overlay">
            <div className="processing-spinner-box">
              <div className="ring-pulse"></div>
              <div className="spinner-center">⚡</div>
            </div>
            <h3>Authorizing Secure Payment</h3>
            <p className="step-text">
              {processingStep === 1 && "Verifying payment credentials with gateway..."}
              {processingStep === 2 && "Securing cryptographic subscription token..."}
              {processingStep === 3 && "Generating invoice & unlocking Pro benefits..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
