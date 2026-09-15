import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [nannies, setNannies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    const fetchNannies = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/nannies?page=${page}&limit=${pageSize}`
        );

        setNannies(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Error loading nannies:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError("Unable to load nannies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNannies();
  }, [page, pageSize, navigate]);

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-logo">
          <div className="home-logo-icon">♡</div>
          <span>NannyMatch</span>
        </div>

        <nav className="nav-links">
          <a href="#home" className="nav-link active">
            Home
          </a>

          <a href="#nannies" className="nav-link">
            Find a Nanny
          </a>

          <Link to="/bookings" className="nav-link">
            My Bookings
          </Link>

          <a href="#messages" className="nav-link">
            Messages
          </a>
        </nav>

        <div className="nav-profile">
          <div className="profile-avatar">JD</div>

          <div className="profile-info">
            <span className="profile-name">Jane Doe</span>
            <span className="profile-role">Parent</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section" id="home">
          <div className="welcome-text">
            <span className="welcome-eyebrow">
              Welcome back, Jane
            </span>

            <h1>Find the perfect nanny for your family.</h1>

            <p>
              Trusted childcare, matched to your family's needs.
            </p>
          </div>

          <button className="primary-action">
            Find a nanny
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">♡</div>

            <div>
              <span className="stat-label">Saved nannies</span>
              <span className="stat-value">8</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon peach">✓</div>

            <div>
              <span className="stat-label">Bookings</span>
              <span className="stat-value">3</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">✉</div>

            <div>
              <span className="stat-label">Messages</span>
              <span className="stat-value">2</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">★</div>

            <div>
              <span className="stat-label">Your rating</span>
              <span className="stat-value">5.0</span>
            </div>
          </div>
        </section>

        <section className="recommended-card" id="nannies">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">
                Recommended for you
              </span>

              <h2>Meet your nanny matches</h2>

              <p>
                Nannies selected based on your family's preferences.
              </p>
            </div>

            <div className="page-size-control">
              <label htmlFor="page-size">
                Show
              </label>

              <select
                id="page-size"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>

              <span>per page</span>
            </div>
          </div>

          <div className="nanny-scroll-area">
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Finding your nanny matches...</p>
              </div>
            )}

            {!loading && error && (
              <div className="error-state">
                <p>{error}</p>

                <button
                  className="secondary-action"
                  onClick={() => setPage(page)}
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && nannies.length === 0 && (
              <div className="empty-state">
                <p>No nannies found.</p>
              </div>
            )}

            {!loading && !error && nannies.length > 0 && (
              <div className="nanny-list">
                {nannies.map((nanny) => (
                  <article
                    className="nanny-card"
                    key={nanny.id}
                  >
                    <div className="nanny-image-wrapper">
                      <img
                        src={nanny.profileImage}
                        alt={nanny.name}
                        className="nanny-avatar"
                      />

                      {nanny.isVerified && (
                        <span className="verified-badge">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <div className="nanny-info">
                      <div className="nanny-name-row">
                        <h3>{nanny.name}</h3>

                        <span className="nanny-rating">
                          ★ 4.9
                        </span>
                      </div>

                      <p className="nanny-experience">
                        {nanny.experienceInYears} years experience
                      </p>

                      <div className="skills-list">
                        {nanny.skills.slice(0, 3).map((skill) => (
                          <span
                            className="skill-tag"
                            key={skill}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="nanny-footer">
                        <span className="nanny-rate">
                          €{nanny.hourlyRate}
                          <small>/hour</small>
                        </span>

                        <button className="nanny-button"  onClick={() => navigate(`/nannies/${nanny.id}`)}>
                          View profile
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="pagination">
            <button
              className="pagination-button"
              onClick={handlePrevious}
              disabled={page === 1 || loading}
            >
              ← Previous
            </button>

            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              className="pagination-button"
              onClick={handleNext}
              disabled={
                page === pagination.totalPages || loading
              }
            >
              Next →
            </button>
          </div>
        </section>

        <section className="bottom-section">
          <div className="booking-card" id="bookings">
            <div className="booking-header">
              <div>
                <span className="section-eyebrow">
                  Upcoming
                </span>

                <h2>Your next booking</h2>
              </div>

              <span className="confirmed-badge">
                Confirmed
              </span>
            </div>

            <div className="booking-content">
              <div className="booking-date">
                <span className="calendar-icon">▣</span>

                <div>
                  <strong>Saturday, September 20</strong>
                  <span>09:00 – 15:00</span>
                </div>
              </div>

              <div className="booking-nanny">
                <div className="small-avatar">AM</div>

                <div>
                  <strong>Anna Martinez</strong>
                  <span>Professional nanny</span>
                </div>
              </div>

              <div className="booking-location">
                <span>⌖</span>
                <span>Wolvega</span>
              </div>
            </div>

            <button className="secondary-action">
              View booking
            </button>
          </div>

          <div className="find-section" id="messages">
            <div className="find-icon">♡</div>

            <div className="find-content">
              <h2>Looking for something specific?</h2>

              <p>
                Search through all available nannies and find
                someone who perfectly fits your family's needs.
              </p>
            </div>

            <button className="find-button">
              Browse all nannies
            </button>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-logo">
          <div className="home-logo-icon">♡</div>
          <span>NannyMatch</span>
        </div>

        <p>
          Safe, trusted childcare for modern families.
        </p>

        <span>© 2026 NannyMatch</span>
      </footer>
    </div>
  );
}

export default Home;