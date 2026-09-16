import { useNavigate } from "react-router-dom";

import "./ErrorPage.css";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-decoration error-decoration-one"></div>
      <div className="error-decoration error-decoration-two"></div>

      <main className="error-card">
        <div className="error-number">404</div>

        <div className="error-icon">♡</div>

        <p className="error-eyebrow">OOPS, WE LOST OUR WAY</p>

        <h1>Page not found</h1>

        <p className="error-description">
          The page you're looking for doesn't seem to exist or may
          have moved somewhere else.
        </p>

        <div className="error-actions">
          <button
            type="button"
            className="error-primary-button"
            onClick={() => navigate("/home")}
          >
            Back to Nannies
            <span>→</span>
          </button>

          <button
            type="button"
            className="error-secondary-button"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </main>
    </div>
  );
}

export default ErrorPage;
