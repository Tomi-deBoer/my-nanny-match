import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Home.css";

function Home() {
  const [nannies, setNannies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/nannies?page=${page}&limit=12`
        );

        setNannies(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to load nannies:", error);
        setError("We couldn't load the nannies right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchNannies();
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-page">
      <aside className="home-sidebar">
        <div className="sidebar-intro">
          <div className="sidebar-badge">♡</div>

          <p className="sidebar-eyebrow">NANNYMATCH</p>

          <h2>
            Find someone
            <br />
            <span>wonderful.</span>
          </h2>

          <p className="sidebar-description">
            Caring people. Happy families. Connections that feel right.
          </p>
        </div>

        <nav className="home-navigation">
          <button
            className="nav-button nav-button-active"
            onClick={() => navigate("/home")}
          >
            <span className="nav-icon">⌂</span>
            <span>Find a Nanny</span>
          </button>

          <button
            className="nav-button"
            onClick={() => navigate("/bookings")}
          >
            <span className="nav-icon">♡</span>
            <span>My Bookings</span>
          </button>

          <button
            className="nav-button"
            onClick={() => navigate("/profile")}
          >
            <span className="nav-icon">○</span>
            <span>My Profile</span>
          </button>

          <button
            className="nav-button nav-button-logout"
            onClick={handleLogout}
          >
            <span className="nav-icon">↗</span>
            <span>Log out</span>
          </button>
        </nav>

        <div className="sidebar-decoration">
          <span className="decor-circle decor-circle-one"></span>
          <span className="decor-circle decor-circle-two"></span>
          <span className="decor-heart">♡</span>
        </div>
      </aside>

      <section className="nanny-section">
        <div className="nanny-section-header">
          <div>
            <p className="section-eyebrow">YOUR COMMUNITY</p>

            <h1>Meet our nannies</h1>

            <p className="section-description">
              Browse caring, experienced people ready to help your family.
            </p>
          </div>

          {pagination && (
            <div className="nanny-count">
              <strong>{pagination.total}</strong>
              <span>nannies</span>
            </div>
          )}
        </div>

        <div className="nanny-grid-scroll">
          {loading && (
            <div className="state-message">
              <div className="loading-heart">♡</div>
              <p>Finding wonderful people...</p>
            </div>
          )}

          {!loading && error && (
            <div className="state-message state-error">
              <div className="error-icon">!</div>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && nannies.length === 0 && (
            <div className="state-message">
              <div className="loading-heart">♡</div>
              <p>No nannies found.</p>
            </div>
          )}

          {!loading && !error && nannies.length > 0 && (
            <div className="nanny-grid">
              {nannies.map((nanny, index) => (
                <article
                  className={`nanny-card nanny-card-${index % 4}`}
                  key={nanny.id}
                  onClick={() => navigate(`/nannies/${nanny.id}`)}
                >
                  <div className="nanny-image-wrapper">
                    <img
                      src={
                        nanny.profileImage ||
                        "https://placehold.co/600x600/f2e4d7/7c6d61?text=Nanny"
                      }
                      alt={nanny.name}
                      className="nanny-image"
                    />

                    {nanny.isVerified && (
                      <span
                        className="verified-badge"
                        title="Verified profile"
                        aria-label="Verified profile"
                      >
                        ✓
                      </span>
                    )}

                    <span className="favorite-button">♡</span>
                  </div>

                  <div className="nanny-card-content">
                    <div className="nanny-name-row">
                      <h2>{nanny.name}</h2>

                      {nanny.isVerified && (
                        <span
                          className="name-verified-badge"
                          title="Verified profile"
                          aria-label="Verified profile"
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="nanny-experience">
                      {nanny.experienceInYears}{" "}
                      {nanny.experienceInYears === 1
                        ? "year"
                        : "years"}{" "}
                      experience
                    </p>

                    <div className="nanny-skills">
                      {nanny.skills?.slice(0, 2).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <div className="nanny-card-footer">
                      <div className="nanny-rate">
                        <strong>€{nanny.hourlyRate}</strong>
                        <span>/ hour</span>
                      </div>

                      <button
                        className="view-profile-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/nannies/${nanny.id}`);
                        }}
                      >
                        View profile
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              ←
            </button>

            <span>
              Page <strong>{page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong>
            </span>

            <button
              className="pagination-button"
              disabled={page === pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;