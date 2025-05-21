import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    setError("");

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
    <div className="newsletter">
      <h3 className="font-bold text-lg mb-3 text-blue-600">Subscribe to Our Newsletter</h3>
      <p>Stay updated with the latest news and offers.</p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Newsletter;
