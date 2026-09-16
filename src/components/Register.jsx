import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNr: "",
    password: "",
    role: "parent"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/users", formData);

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
          "We couldn't create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-icon">♡</div>

        <p className="register-eyebrow">NANNYMATCH</p>

        <h1>Create your account</h1>

        <p className="register-intro">
          Join NannyMatch and start making caring connections.
        </p>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Phone number
            <input
              type="tel"
              name="phoneNr"
              value={formData.phoneNr}
              onChange={handleChange}
              placeholder="06 12345678"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              minLength="8"
              required
            />
          </label>

          <fieldset className="register-role">
            <legend>I'm joining as</legend>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="parent"
                checked={formData.role === "parent"}
                onChange={handleChange}
              />

              <span>
                <strong>Parent</strong>
                <small>I'm looking for childcare</small>
              </span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="nanny"
                checked={formData.role === "nanny"}
                onChange={handleChange}
              />

              <span>
                <strong>Nanny</strong>
                <small>I'm offering childcare</small>
              </span>
            </label>
          </fieldset>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="register-login">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;