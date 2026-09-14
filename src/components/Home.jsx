import "./Home.css";

function Home() {
  const recommendedNannies = [
    {
      name: "Sophie Williams",
      experience: "6 years experience",
      rating: "5.0",
      rate: "€15",
      initials: "SW",
      color: "peach"
    },
    {
      name: "Emma Johnson",
      experience: "4 years experience",
      rating: "4.9",
      rate: "€13",
      initials: "EJ",
      color: "sage"
    },
    {
      name: "Sarah Mitchell",
      experience: "8 years experience",
      rating: "4.9",
      rate: "€14",
      initials: "SM",
      color: "lavender"
    }
  ];

  return (
    <main className="home-page">

      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-logo">
          <span className="home-logo-icon">♥</span>
          <span>NannyMatch</span>
        </div>

        <div className="nav-links">
          <a href="/home" className="nav-link active">
            Dashboard
          </a>

          <a href="#nannies" className="nav-link">
            Find a nanny
          </a>

          <a href="#bookings" className="nav-link">
            Bookings
          </a>

          <a href="#messages" className="nav-link">
            Messages
            <span className="message-badge">3</span>
          </a>
        </div>

        <div className="nav-profile">
          <div className="profile-avatar">
            JD
          </div>

          <div className="profile-info">
            <span className="profile-name">
              Jane Doe
            </span>

            <span className="profile-role">
              Parent
            </span>
          </div>

          <button className="profile-menu">
            ⋮
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="home-content">

        {/* Welcome section */}
        <section className="welcome-section">
          <div>
            <p className="welcome-eyebrow">
              YOUR DASHBOARD
            </p>

            <h1>
              Good morning, Jane <span>👋</span>
            </h1>

            <p className="welcome-text">
              Find trusted childcare and manage everything
              in one simple place.
            </p>
          </div>

          <button className="primary-action">
            <span>+</span>
            Find a nanny
          </button>
        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <article className="stat-card">
            <div className="stat-icon green">
              ♥
            </div>

            <div>
              <span className="stat-label">
                Saved nannies
              </span>

              <strong className="stat-value">
                12
              </strong>

              <span className="stat-detail">
                +2 this week
              </span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon peach">
              ✓
            </div>

            <div>
              <span className="stat-label">
                Upcoming bookings
              </span>

              <strong className="stat-value">
                3
              </strong>

              <span className="stat-detail">
                Next: Tomorrow
              </span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon purple">
              ◌
            </div>

            <div>
              <span className="stat-label">
                Unread messages
              </span>

              <strong className="stat-value">
                5
              </strong>

              <span className="stat-detail">
                From 3 nannies
              </span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon yellow">
              ★
            </div>

            <div>
              <span className="stat-label">
                Your rating
              </span>

              <strong className="stat-value">
                4.9
              </strong>

              <span className="stat-detail">
                Excellent
              </span>
            </div>
          </article>

        </section>

        {/* Dashboard columns */}
        <div className="dashboard-grid">

          {/* Recommended nannies */}
          <section
            className="dashboard-card nannies-card"
            id="nannies"
          >
            <div className="section-header">
              <div>
                <p className="section-eyebrow">
                  DISCOVER
                </p>

                <h2>
                  Recommended nannies
                </h2>

                <p>
                  Based on your preferences
                </p>
              </div>

              <a
                href="#nannies"
                className="view-all"
              >
                View all →
              </a>
            </div>

            <div className="nanny-list">

              {recommendedNannies.map((nanny) => (
                <article
                  className="nanny-card"
                  key={nanny.name}
                >
                  <div
                    className={`nanny-avatar ${nanny.color}`}
                  >
                    {nanny.initials}
                  </div>

                  <div className="nanny-info">
                    <h3>
                      {nanny.name}
                    </h3>

                    <p>
                      {nanny.experience}
                    </p>

                    <div className="nanny-rating">
                      <span>★</span>
                      {nanny.rating}
                    </div>
                  </div>

                  <div className="nanny-rate">
                    <strong>
                      {nanny.rate}
                    </strong>

                    <span>
                      / hour
                    </span>
                  </div>

                  <button className="nanny-button">
                    View
                  </button>
                </article>
              ))}

            </div>
          </section>

          {/* Upcoming booking */}
          <section
            className="dashboard-card booking-card"
            id="bookings"
          >
            <div className="section-header">
              <div>
                <p className="section-eyebrow">
                  NEXT UP
                </p>

                <h2>
                  Upcoming booking
                </h2>
              </div>

              <span className="confirmed-badge">
                Confirmed
              </span>
            </div>

            <div className="booking-date">
              <div className="calendar-icon">
                <span>
                  SEP
                </span>

                <strong>
                  14
                </strong>
              </div>

              <div>
                <strong>
                  Tomorrow
                </strong>

                <p>
                  09:00 – 14:00
                </p>
              </div>
            </div>

            <div className="booking-nanny">
              <div className="small-avatar">
                SW
              </div>

              <div>
                <strong>
                  Sophie Williams
                </strong>

                <p>
                  Nanny
                </p>
              </div>
            </div>

            <div className="booking-location">
              <span>⌖</span>

              <span>
                Your home
              </span>
            </div>

            <button className="secondary-action">
              View booking
            </button>
          </section>

        </div>

        {/* Find your match */}
        <section className="find-section">

          <div className="find-icon">
            ♥
          </div>

          <div className="find-content">
            <h2>
              Looking for someone special?
            </h2>

            <p>
              Tell us what you're looking for and we'll
              help you find the perfect nanny for your family.
            </p>
          </div>

          <button className="find-button">
            Find your match
            <span>→</span>
          </button>

        </section>

      </div>

      {/* Footer */}
      <footer className="home-footer">
        <span>
          © 2026 NannyMatch
        </span>

        <div>
          <a href="#privacy">
            Privacy
          </a>

          <a href="#help">
            Help & support
          </a>
        </div>
      </footer>

    </main>
  );
}

export default Home;