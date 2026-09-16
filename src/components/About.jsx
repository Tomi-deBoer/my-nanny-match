import { useNavigate } from "react-router-dom";

import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-eyebrow">ABOUT NANNYMATCH</p>

          <h1>
            Care that feels
            <br />
            <span>like the right fit.</span>
          </h1>

          <p className="about-intro">
            NannyMatch makes it easier for families to discover caring,
            experienced childcare professionals and build connections
            they can feel good about.
          </p>
        </div>

        <div className="about-hero-decoration">
          <div className="about-heart">♡</div>
          <div className="about-circle about-circle-one"></div>
          <div className="about-circle about-circle-two"></div>
          <div className="about-circle about-circle-three"></div>
        </div>
      </section>

      <section className="about-content">
        <div className="about-card">
          <div className="about-card-icon">♡</div>

          <h2>Our mission</h2>

          <p>
            Finding the right childcare should feel reassuring, not
            overwhelming. NannyMatch brings families and nannies
            together in one simple platform.
          </p>

          <p>
            Families can browse nanny profiles, learn about their
            experience and skills, and manage their bookings from one
            convenient place.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">✓</div>

          <h2>Built around trust</h2>

          <p>
            We believe good childcare starts with good connections.
            That's why NannyMatch puts clear profiles, experience,
            availability and reviews at the heart of the experience.
          </p>

          <p>
            Our goal is to make finding and managing childcare feel
            straightforward for both families and childcare
            professionals.
          </p>
        </div>

        <div className="about-card about-card-wide">
          <div className="about-card-icon">✦</div>

          <div>
            <h2>Simple by design</h2>

            <p>
              From discovering a nanny to managing bookings, NannyMatch
              is designed to keep the important things easy to find.
              Less complexity means more time for what really matters:
              caring for children and supporting families.
            </p>
          </div>
        </div>
      </section>

      <section className="about-footer">
        <p>Ready to find the right connection?</p>

        <button
          type="button"
          onClick={() => navigate("/home")}
        >
          Find a Nanny
          <span>→</span>
        </button>
      </section>
    </div>
  );
}

export default About;
