import { useState } from "react";
import "./singleBlog.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("❌ Please enter your email.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("❌ Please enter a valid email address.");
      return;
    }

    setError(""); // Clear errors before sending

    try {
      const response = await fetch("https://formsubmit.co/ajax/reachus@astrafin.org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("✅ Subscription successful! You will receive our updates.");
        setEmail("");
      } else {
        setError("❌ Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("❌ Failed to send email.");
    }
  };

  return (
    <div className="newsletter-section">
      <div className="newpadding-newsletter">
        <h2 className="newsletter-heading">Subscribe to Our Newsletter</h2>
        <p className="newsletter-text">
          Get the latest updates, insights, and tips on asset financing and business growth.
        </p>
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="subscribe-form-button-container">
            <button type="submit" id="waitlist" disabled={!email.trim()}>
              Subscribe
            </button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default Newsletter;
