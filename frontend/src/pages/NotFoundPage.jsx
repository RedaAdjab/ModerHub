import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="shell page-stack">
      <section className="panel not-found">
        <p className="eyebrow">404</p>
        <h1>That page does not exist.</h1>
        <p>The link might be outdated, or the page may have been removed.</p>
        <Link to="/" className="cta-button">
          Back to Homepage
        </Link>
      </section>
    </div>
  );
}
