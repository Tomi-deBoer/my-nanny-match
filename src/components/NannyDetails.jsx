import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./NannyDetails.css";

function NannyDetails() {
  const { nannyId } = useParams();
  const navigate = useNavigate();

  const [nanny, setNanny] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const days = [
    { name: "Monday", short: "MON" },
    { name: "Tuesday", short: "TUE" },
    { name: "Wednesday", short: "WED" },
    { name: "Thursday", short: "THU" },
    { name: "Friday", short: "FRI" },
    { name: "Saturday", short: "SAT" },
    { name: "Sunday", short: "SUN" }
  ];

  useEffect(() => {
    const fetchNanny = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/nannies/${nannyId}`);

        setNanny(response.data);
      } catch (error) {
        console.error("Error loading nanny:", error);
        setError("Unable to load nanny profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchNanny();
  }, [nannyId]);

  if (loading) {
    return (
      <div className="nanny-details-page">
        <p className="nanny-details-message">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nanny-details-page">
        <div className="nanny-details-error">
          <p>{error}</p>

          <button onClick={() => navigate("/home")}>
            Back to nannies
          </button>
        </div>
      </div>
    );
  }

  if (!nanny) {
    return null;
  }

  return (
    <div className="nanny-details-page">
      <main className="nanny-details-content">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to nannies
        </button>

        <section className="nanny-details-card">

          <div className="nanny-details-image-container">
            <img
              src={nanny.profileImage}
              alt={nanny.name}
              className="nanny-details-image"
            />

            {nanny.isVerified && (
              <span className="verified-badge">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="nanny-details-info">

            <h1>{nanny.name}</h1>

            <p className="nanny-details-intro">
              Experienced nanny ready to help your family.
            </p>

            <div className="nanny-details-stats">

              <div className="detail-stat">
                <span className="detail-stat-label">
                  Experience
                </span>

                <strong>
                  {nanny.experienceInYears} years
                </strong>
              </div>

              <div className="detail-stat">
                <span className="detail-stat-label">
                  Hourly rate
                </span>

                <strong>
                  €{nanny.hourlyRate}/hour
                </strong>
              </div>

            </div>

            <div className="nanny-details-section">
              <h2>Skills</h2>

              <div className="skills-list">
                {nanny.skills?.map((skill) => (
                  <span
                    className="skill-tag"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="nanny-details-section">

              <div className="availability-header">
                <div>
                  <h2>Availability</h2>

                  <p>
                    Weekly availability
                  </p>
                </div>

                <div className="availability-legend">
                  <span className="legend-item">
                    <span className="legend-dot available-dot"></span>
                    Available
                  </span>

                  <span className="legend-item">
                    <span className="legend-dot unavailable-dot"></span>
                    Unavailable
                  </span>
                </div>
              </div>

              <div className="availability-calendar">

                {days.map((day) => {
                  const availability =
                    nanny.availability?.find(
                      (item) => item.day === day.name
                    );

                  return (
                    <div
                      className={`availability-day ${
                        availability
                          ? "available"
                          : "unavailable"
                      }`}
                      key={day.name}
                    >

                      <div className="availability-day-header">
                        <span className="availability-day-short">
                          {day.short}
                        </span>

                        <span className="availability-day-name">
                          {day.name}
                        </span>
                      </div>

                      <div className="availability-day-body">

                        {availability ? (
                          <>
                            <div className="availability-icon">
                              ✓
                            </div>

                            <div className="availability-hours">
                              <span>
                                {availability.from}
                              </span>

                              <span className="availability-arrow">
                                ↓
                              </span>

                              <span>
                                {availability.to}
                              </span>
                            </div>

                            <span className="availability-status">
                              Available
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="availability-icon unavailable-icon">
                              —
                            </div>

                            <span className="availability-status">
                              Not available
                            </span>
                          </>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            <button
              className="booking-button"
              onClick={() =>
                navigate(`/bookings/new/${nanny.id}`)
              }
            >
              Book this nanny
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default NannyDetails;