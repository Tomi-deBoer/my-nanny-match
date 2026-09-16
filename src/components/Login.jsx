import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("LOGIN FORM SUBMITTED");
    console.log("Email:", email);
    console.log("Password:", password);

    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      console.log("Login successful:", response.data);

      localStorage.setItem("token", response.data.token);

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="brand-content">
          <div className="brand-logo">
            <span className="brand-logo-icon">♥</span>
            <span>NannyMatch</span>
          </div>

          <div className="brand-message">
            <p className="eyebrow">NANNY MANAGEMENT PLATFORM</p>

            <h1>
              Quality care,
              <br />
              <span>made simple.</span>
            </h1>

            <p className="brand-description">
              Connect families with trusted childcare professionals
              and manage everything in one friendly, secure place.
            </p>
          </div>

          <div className="brand-features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Trusted nanny profiles</span>
            </div>

            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Simple family management</span>
            </div>

            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Safe and secure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-section">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to your NannyMatch account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={error ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <a href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={error ? "input-error" : ""}
              />
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span className="error-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="signup-text">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create one
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;