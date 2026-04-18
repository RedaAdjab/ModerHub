import { useState } from "react";

import { api } from "../api/client";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/newsletter/", { email });
      setStatusMessage(response.detail || "Thanks for subscribing.");
      setEmail("");
    } catch (error) {
      setStatusMessage(error.message || "Could not subscribe right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <h3>ModernHub</h3>
          <p>
            A full-stack starter for modern websites with publishing, user accounts,
            search, and engagement features.
          </p>
        </div>

        <div>
          <h4>Newsletter</h4>
          <form className="footer-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Subscribe"}
            </button>
          </form>
          {statusMessage && <p className="status-text">{statusMessage}</p>}
        </div>
      </div>
    </footer>
  );
}
