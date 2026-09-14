import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [recommendedNannies, setRecommendedNannies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    async function loadNannies() {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/nannies?page=${page}&limit=${pageSize}`
        );

        setRecommendedNannies(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to load nannies:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError("Unable to load recommended nannies.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNannies();
  }, [page, pageSize, navigate]);

  function handlePageSizeChange(event) {
    setPageSize(Number(event.target.value));
    setPage(1);
  }

  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-logo">
          <span className="home-logo-icon">♡</span>
          <span>NannyMatch</span>
        </div>

        <nav className="nav-links">
          <button className="nav-link active">
            Dashboard
          </button>

          <button className="nav-link">
            Find a nanny
          </button>

          <button className="nav-link">
            Bookings
          </button>

          <button className="nav-link">
            Messages
            <span className="message-badge">2</span>
          </button>
        </nav>

        <div className="nav-profile">
          <div className="profile-avatar">
            JD
          </div>

          <div className="profile-info">
            <strong className="profile-name">
              Jane Doe
            </strong>

            <span className="profile-role">
              Parent
            </span>
          </div>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <div>
            <p className="welcome-eyebrow">
              Welcome back
            </p>

            <h1>
              Good morning, Jane!
            </h1>

            <p className="welcome-text">
              Find the perfect nanny for your family.
            </p>
          </div>

          <button className="primary-action">
            Find a nanny
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">
              ♡
            </div>

            <div>
              <span className="stat-label">
                Saved nannies
              </span>

              <strong className="stat-value">
                12
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon peach">
              ✓
            </div>

            <div>
              <span className="stat-label">
                Bookings
              </span>

              <strong className="stat-value">
                4
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              ✉
            </div>

            <div>
              <span className="stat-label">
                Unread messages
              </span>

              <strong className="stat-value">
                2
              </strong>
            </div>
          </div>

          <div className="stat-card">
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
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card recommended-card">
            <div className="section-header">
              <div>
                <h2>
                  Recommended Nannies
                </h2>

                <p>
                  Nannies that might be a great match for you
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

                <span>
                  per page
                </span>
              </div>
            </div>

            <div className="nanny-list">
              {isLoading && (
                <p>
                  Loading recommended nannies...
                </p>
              )}

              {error && (
                <p>
                  {error}
                </p>
              )}

              {!isLoading &&
                !error &&
                recommendedNannies.map((nanny) => (
                  <article
                    className="nanny-card"
                    key={nanny.id}
                  >
                    <div className="nanny-avatar">
                      <img
                        src={nanny.profileImage}
                        alt={nanny.name}
                      />
                    </div>

                    <div className="nanny-info">
                      <h3>
                        {nanny.name}
                      </h3>

                      <p>
                        {nanny.experienceInYears} years experience
                      </p>

                      <div className="nanny-rating">
                        {nanny.isVerified && (
                          <>
                            <span>✓</span>
                            Verified
                          </>
                        )}
                      </div>
                    </div>

                    <div className="nanny-rate">
                      <strong>
                        €{nanny.hourlyRate}
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

            {!isLoading &&
              !error &&
              pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() =>
                      setPage((currentPage) => currentPage - 1)
                    }
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>

                  <span className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    className="pagination-button"
                    onClick={() =>
                      setPage((currentPage) => currentPage + 1)
                    }
                    disabled={page === pagination.totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
          </div>

          <div className="dashboard-card">
            <div className="section-header">
              <div>
                <h2>
                  Upcoming Booking
                </h2>

                <p>
                  Your next childcare appointment
                </p>
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
                  Saturday, 14 September
                </strong>

                <p>
                  09:00 - 14:00
                </p>
              </div>
            </div>

            <div className="booking-nanny">
              <div className="small-avatar">
                SM
              </div>

              <div>
                <strong>
                  Sarah Miller
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
          </div>
        </section>

        <section className="find-section">
          <div className="find-icon">
            ♡
          </div>

          <div className="find-content">
            <h2>
              Looking for someone special?
            </h2>

            <p>
              Tell us what you're looking for and we'll help
              you find the perfect nanny for your family.
            </p>
          </div>

          <button className="find-button">
            Find your nanny
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <p>
          © 2026 NannyMatch. All rights reserved.
        </p>

        <div>
          <span>
            Privacy
          </span>

          <span>
            Terms
          </span>

          <span>
            Help
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;