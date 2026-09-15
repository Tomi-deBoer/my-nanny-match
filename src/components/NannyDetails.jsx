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
        <p className="nanny-details-message">Loading profile...</p>
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
              <h2>Availability</h2>

              {nanny.availability?.length > 0 ? (
                <div className="availability-list">
                  {nanny.availability.map((item, index) => (
                    <div
                      className="availability-item"
                      key={index}
                    >
                      {typeof item === "object"
                        ? JSON.stringify(item)
                        : item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-availability">
                  No availability information provided.
                </p>
              )}
            </div>

            <button
              className="booking-button"
              onClick={() => navigate(`/bookings/new/${nanny.id}`)}
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