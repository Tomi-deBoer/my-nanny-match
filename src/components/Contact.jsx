import { useNavigate } from "react-router-dom";

import "./Contact.css";

function Contact() {
  const navigate = useNavigate();

  return (
    <main className="contact-page">
      <section className="contact-content">

        <div className="contact-header">
          <p className="contact-eyebrow">
            GET IN TOUCH
          </p>

          <h1>Contact NannyMatch</h1>

          <p className="contact-intro">
            Have a question, need some help, or simply want to
            say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-grid">

          {/* CONTACT DETAILS */}

          <div className="contact-card">

            <div className="contact-card-icon">
              ✉
            </div>

            <div>
              <h2>Email</h2>

              <p>
                Our team is happy to help with questions,
                bookings, or account support.
              </p>

              <a
                href="mailto:hello@nannymatch.com"
                className="contact-link"
              >
                hello@nannymatch.com
              </a>
            </div>

          </div>


          <div className="contact-card">

            <div className="contact-card-icon">
              ☎
            </div>

            <div>
              <h2>Phone</h2>

              <p>
                Give us a call during our support hours.
              </p>

              <a
                href="tel:+31101234567"
                className="contact-link"
              >
                +31 (0)10 123 45 67
              </a>

              <span className="contact-detail">
                Monday – Friday, 09:00 – 17:00
              </span>
            </div>

          </div>


          {/* SOCIAL MEDIA */}

          <div className="contact-card contact-social-card">

            <div className="contact-card-icon">
              ♡
            </div>

            <div>
              <h2>Follow us</h2>

              <p>
                Stay connected with NannyMatch on social media.
              </p>

              <div className="social-links">

                <a
                  href="https://instagram.com/nannymatch"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="social-name">
                    Instagram
                  </span>

                  <span className="social-handle">
                    @nannymatch
                  </span>
                </a>

                <a
                  href="https://facebook.com/nannymatch"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="social-name">
                    Facebook
                  </span>

                  <span className="social-handle">
                    @nannymatch
                  </span>
                </a>

                <a
                  href="https://linkedin.com/company/nannymatch"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="social-name">
                    LinkedIn
                  </span>

                  <span className="social-handle">
                    NannyMatch
                  </span>
                </a>

              </div>
            </div>

          </div>

        </div>

        <button
          type="button"
          className="contact-back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to Nannies
        </button>

      </section>
    </main>
  );
}

export default Contact;
