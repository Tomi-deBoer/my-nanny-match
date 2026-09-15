import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./BookingForm.css";

function BookingForm() {
  const { nannyId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
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
      console.error("Error creating booking:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.error ||
          "Unable to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <main className="booking-content">
        <button
          className="booking-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to nanny profile
        </button>

        <section className="booking-card">
          <div className="booking-header">
            <span className="booking-eyebrow">
              NannyMatch
            </span>

            <h1>Book this nanny</h1>

            <p>
              Choose a date and time that works for your family.
            </p>
          </div>

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
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="booking-submit-button"
                disabled={loading}
              >
                {loading ? "Booking..." : "Book nanny"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default BookingForm;