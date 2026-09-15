import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Bookings.css";

function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings");

        setBookings(response.data);
      } catch (error) {
        console.error("Error loading bookings:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          "Unable to load your bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(bookingId);

      await api.delete(`/bookings/${bookingId}`);

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking._id !== bookingId
        )
      );
    } catch (error) {
      console.error("Error deleting booking:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.error ||
          "Unable to delete the booking. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getStatusClass = (status) => {
    return `booking-status ${status}`;
  };

  return (
    <div className="bookings-page">
      <main className="bookings-content">
        <button
          className="bookings-back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to home
        </button>

        <div className="bookings-header">
          <div>
            <span className="bookings-eyebrow">
              NannyMatch
            </span>

            <h1>My bookings</h1>

            <p>
              View and manage your upcoming nanny bookings.
            </p>
          </div>

          <button
            className="new-booking-button"
            onClick={() => navigate("/home")}
          >
            Find a nanny
          </button>
        </div>

        {loading && (
          <div className="bookings-message">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bookings-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bookings-empty">
            <div className="empty-icon">♡</div>

            <h2>No bookings yet</h2>

            <p>
              You haven't booked a nanny yet. Find the perfect
              nanny for your family to get started.
            </p>

            <button
              className="new-booking-button"
              onClick={() => navigate("/home")}
            >
              Find a nanny
            </button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <article
                className="booking-item"
                key={booking._id}
              >
                <div className="booking-item-main">
                  <div className="booking-item-avatar">
                    {booking.nannyId?.profileImage ? (
                      <img
                        src={booking.nannyId.profileImage}
                        alt={
                          booking.nannyId.userId?.name ||
                          "Nanny"
                        }
                      />
                    ) : (
                      <span>♡</span>
                    )}
                  </div>

                  <div className="booking-item-info">
                    <div className="booking-item-title-row">
                      <h2>
                        {booking.nannyId?.userId?.name ||
                          "Nanny"}
                      </h2>

                      <span
                        className={getStatusClass(
                          booking.status
                        )}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-detail">
                      <span className="booking-detail-icon">
                        ▣
                      </span>

                      <span>
                        {formatDate(booking.date)}
                      </span>
                    </div>

                    <div className="booking-detail">
                      <span className="booking-detail-icon">
                        ◷
                      </span>

                      <span>
                        {booking.startTime} – {booking.endTime}
                      </span>
                    </div>

                    {booking.message && (
                      <p className="booking-message">
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="booking-item-actions">
                  <button
                    className="view-nanny-button"
                    onClick={() =>
                      navigate(
                        `/nannies/${booking.nannyId?._id}`
                      )
                    }
                  >
                    View nanny
                  </button>

                  {booking.status !== "cancelled" && (
                    <button
                      className="edit-booking-button"
                      onClick={() =>
                        navigate(
                          `/bookings/edit/${booking._id}`
                        )
                      }
                    >
                      Edit booking
                    </button>
                  )}

                  <button
                    className="delete-booking-button"
                    onClick={() =>
                      handleDelete(booking._id)
                    }
                    disabled={
                      deletingId === booking._id
                    }
                  >
                    {deletingId === booking._id
                      ? "Deleting..."
                      : "Delete booking"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Bookings;