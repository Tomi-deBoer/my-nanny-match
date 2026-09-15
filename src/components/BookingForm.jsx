import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./BookingForm.css";

function BookingForm() {
  const { nannyId, bookingId } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(bookingId);

  const [nannyName, setNannyName] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const [loadingBooking, setLoadingBooking] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoadingBooking(true);
        setError("");

        const response = await api.get(`/bookings/${bookingId}`);

        const booking = response.data;

        setDate(booking.date.slice(0, 10));
        setStartTime(booking.startTime);
        setEndTime(booking.endTime);
        setMessage(booking.message || "");

        setNannyName(
          booking.nannyId?.userId?.name || "Nanny"
        );
      } catch (error) {
        console.error("Error loading booking:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          error.response?.data?.error ||
            "Unable to load this booking."
        );
      } finally {
        setLoadingBooking(false);
      }
    };

    fetchBooking();
  }, [bookingId, isEditMode, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (isEditMode) {
        const response = await api.put(
          `/bookings/${bookingId}`,
          {
            date,
            startTime,
            endTime,
            message
          }
        );

        console.log("Booking updated:", response.data);

        navigate("/bookings");
        return;
      }

      const response = await api.post("/bookings", {
        nannyId,
        date,
        startTime,
        endTime,
        message
      });

      console.log("Booking created:", response.data);

      navigate("/home");
    } catch (error) {
      console.error(
        isEditMode
          ? "Error updating booking:"
          : "Error creating booking:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.error ||
          `Unable to ${
            isEditMode ? "update" : "create"
          } booking. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingBooking) {
    return (
      <div className="booking-page">
        <main className="booking-content">
          <section className="booking-card">
            <div className="booking-header">
              <span className="booking-eyebrow">
                NannyMatch
              </span>

              <h1>Loading booking...</h1>

              <p>
                Loading your booking details.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (isEditMode && error && !date) {
    return (
      <div className="booking-page">
        <main className="booking-content">
          <button
            className="booking-back-button"
            onClick={() => navigate("/bookings")}
          >
            ← Back to bookings
          </button>

          <section className="booking-card">
            <div className="booking-header">
              <span className="booking-eyebrow">
                NannyMatch
              </span>

              <h1>Unable to edit booking</h1>

              <p>{error}</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <main className="booking-content">
        <button
          className="booking-back-button"
          onClick={() =>
            navigate(
              isEditMode
                ? "/bookings"
                : `/nannies/${nannyId}`
            )
          }
        >
          ←{" "}
          {isEditMode
            ? "Back to bookings"
            : "Back to nanny profile"}
        </button>

        <section className="booking-card">
          <div className="booking-header">
            <span className="booking-eyebrow">
              NannyMatch
            </span>

            <h1>
              {isEditMode
                ? "Edit booking"
                : "Book this nanny"}
            </h1>

            <p>
              {isEditMode
                ? "Update the date, time, or message for your booking."
                : "Choose a date and time that works for your family."}
            </p>
          </div>

          {isEditMode && nannyName && (
            <div className="booking-nanny-info">
              <strong>Nanny</strong>
              <span>{nannyName}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="booking-form"
          >
            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
              />
            </div>

            <div className="time-row">
              <div className="form-group">
                <label htmlFor="startTime">
                  Start time
                </label>

                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">
                  End time
                </label>

                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message
                <span className="optional">
                  Optional
                </span>
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                maxLength="500"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Tell the nanny anything important about this booking..."
              />
            </div>

            {error && (
              <div className="booking-error">
                {error}
              </div>
            )}

            <div className="booking-actions">
              <button
                type="button"
                className="booking-cancel-button"
                onClick={() =>
                  navigate(
                    isEditMode
                      ? "/bookings"
                      : `/nannies/${nannyId}`
                  )
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="booking-submit-button"
                disabled={saving}
              >
                {saving
                  ? isEditMode
                    ? "Saving..."
                    : "Booking..."
                  : isEditMode
                  ? "Save changes"
                  : "Book nanny"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default BookingForm;