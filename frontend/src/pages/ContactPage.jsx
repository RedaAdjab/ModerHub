import { useState } from "react";

import { api } from "../api/client";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/contact/", formData);
      setStatusMessage("Your message has been sent. We will reply soon.");
      setFormData(initialForm);
    } catch (error) {
      setStatusMessage(error.message || "Could not send your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell page-stack">
      <section className="panel contact-layout">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Let us know what you are building.</h1>
          <p>
            Use this contact form for questions, collaboration opportunities, or
            technical support. Messages are stored directly in the Django backend.
          </p>

          <div className="contact-facts">
            <article>
              <h3>Typical response time</h3>
              <p>Within one business day</p>
            </article>
            <article>
              <h3>Topics we support</h3>
              <p>Setup, architecture, and feature customization</p>
            </article>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Subject
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          {statusMessage && <p className="status-text">{statusMessage}</p>}
        </form>
      </section>
    </div>
  );
}
