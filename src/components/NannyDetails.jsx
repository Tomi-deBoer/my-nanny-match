import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "./NannyDetails.css";

function NannyDetails() {
  const { nannyId } = useParams();
  const navigate = useNavigate();

  const [nanny, setNanny] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchNanny = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/nannies/${nannyId}`);

        setNanny(response.data);
      } catch (error) {
        console.error("Failed to load nanny:", error);
        setError("We couldn't load this nanny profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchNanny();
  }, [nannyId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await api.get(
          `/reviews/nanny/${nannyId}`
        );

        setReviews(response.data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [nannyId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const myReview = reviews.find(
    (review) =>
      review.parentId &&
      currentUser &&
      String(review.parentId._id) === String(currentUser.id)
  );

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    setReviewError("");

    if (!comment.trim()) {
      setReviewError("Please write a review before submitting.");
      return;
    }

    try {
      setIsSubmittingReview(true);

      if (editingReview) {
        const response = await api.put(
          `/reviews/${editingReview._id}`,
          {
            rating,
            comment
          }
        );

        setReviews((currentReviews) =>
          currentReviews.map((review) =>
            review._id === editingReview._id
              ? response.data
              : review
          )
        );

        setEditingReview(null);
      } else {
        const response = await api.post("/reviews", {
          nannyId,
          rating,
          comment
        });

        setReviews((currentReviews) => [
          response.data,
          ...currentReviews
        ]);
      }

      setRating(5);
      setComment("");
    } catch (error) {
      console.error("Failed to save review:", error);

      if (error.response?.status === 409) {
        setReviewError(
          "You have already reviewed this nanny."
        );
      } else {
        setReviewError(
          error.response?.data?.error ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setReviewError("");

    document
      .getElementById("review-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(5);
    setComment("");
    setReviewError("");
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review._id !== reviewId
        )
      );

      if (editingReview?._id === reviewId) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to delete review:", error);

      setReviewError(
        error.response?.data?.error ||
          "We couldn't delete your review."
      );
    }
  };

  const renderStars = (value, interactive = false) => {
    return (
      <div
        className={
          interactive
            ? "review-stars review-stars-interactive"
            : "review-stars"
        }
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={
              star <= value
                ? "star star-filled"
                : "star"
            }
            onClick={
              interactive
                ? () => handleRatingClick(star)
                : undefined
            }
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="nanny-details-page">
        <div className="nanny-details-state">
          <div className="details-loading-heart">♡</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !nanny) {
    return (
      <div className="nanny-details-page">
        <div className="nanny-details-state nanny-details-error">
          <div className="details-error-icon">!</div>
          <p>{error || "Nanny not found."}</p>

          <button
            className="back-button"
            onClick={() => navigate("/home")}
          >
            ← Back to nannies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nanny-details-page">
      <div className="nanny-details-scroll">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to nannies
        </button>

        {/* =========================================
            PROFILE
           ========================================= */}

        <section className="nanny-profile-card">
          <div className="nanny-profile-image-wrapper">
            <img
              src={
                nanny.profileImage ||
                "https://placehold.co/800x800/f2e4d7/7c6d61?text=Nanny"
              }
              alt={nanny.name}
              className="nanny-profile-image"
            />

            {nanny.isVerified && (
              <span className="profile-verified-badge">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="nanny-profile-info">
            <p className="profile-eyebrow">
              NANNYMATCH PROFILE
            </p>

            <h1>{nanny.name}</h1>

            <div className="profile-rating">
              {reviews.length > 0 ? (
                <>
                  <div className="rating-stars">
                    {renderStars(
                      Math.round(Number(averageRating))
                    )}
                  </div>

                  <strong>{averageRating}</strong>

                  <span>
                    ({reviews.length}{" "}
                    {reviews.length === 1
                      ? "review"
                      : "reviews"})
                  </span>
                </>
              ) : (
                <span className="no-rating">
                  No reviews yet
                </span>
              )}
            </div>

            <p className="profile-experience">
              {nanny.experienceInYears}{" "}
              {nanny.experienceInYears === 1
                ? "year"
                : "years"}{" "}
              of childcare experience
            </p>

            <div className="profile-rate">
              <strong>€{nanny.hourlyRate}</strong>
              <span>per hour</span>
            </div>

            <div className="profile-skills">
              {nanny.skills?.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <button
              className="book-nanny-button"
              onClick={() =>
                navigate(`/bookings/new/${nanny.id}`)
              }
            >
              Book this nanny
              <span>→</span>
            </button>
          </div>
        </section>

        {/* =========================================
            AVAILABILITY
           ========================================= */}

        <section className="details-section">
          <div className="details-section-header">
            <div>
              <p className="section-eyebrow">
                WEEKLY SCHEDULE
              </p>

              <h2>Availability</h2>

              <p>
                Typical availability for this nanny.
              </p>
            </div>
          </div>

          <div className="availability-grid">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ].map((day) => {
              const availabilityForDay =
                nanny.availability?.find(
                  (item) =>
                    item.day?.toLowerCase() ===
                    day.toLowerCase()
                );

              return (
                <div
                  className="availability-day"
                  key={day}
                >
                  <span className="availability-day-name">
                    {day.substring(0, 3)}
                  </span>

                  {availabilityForDay?.available ? (
                    <>
                      <span className="availability-dot available"></span>

                      <span className="availability-time">
                        {availabilityForDay.startTime ||
                          "Available"}
                        {availabilityForDay.endTime &&
                          ` – ${availabilityForDay.endTime}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="availability-dot unavailable"></span>

                      <span className="availability-time unavailable-text">
                        Unavailable
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================
            REVIEWS
           ========================================= */}

        <section className="details-section reviews-section">
          <div className="details-section-header reviews-header">
            <div>
              <p className="section-eyebrow">
                FAMILY EXPERIENCES
              </p>

              <h2>Reviews</h2>

              <p>
                See what other families have to say.
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="reviews-summary">
                <strong>{averageRating}</strong>

                <div>
                  {renderStars(
                    Math.round(Number(averageRating))
                  )}

                  <span>
                    Based on {reviews.length}{" "}
                    {reviews.length === 1
                      ? "review"
                      : "reviews"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Review list */}

          {reviewsLoading ? (
            <div className="reviews-state">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="reviews-empty">
              <span className="empty-review-icon">♡</span>

              <h3>No reviews yet</h3>

              <p>
                Be the first family to share your
                experience.
              </p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => {
                const isMyReview =
                  currentUser &&
                  review.parentId &&
                  String(review.parentId._id) ===
                    String(currentUser.id);

                return (
                  <article
                    className={`review-card ${
                      isMyReview
                        ? "review-card-mine"
                        : ""
                    }`}
                    key={review._id}
                  >
                    <div className="review-top">
                      <div className="review-author">
                        <div className="review-avatar">
                          {review.parentId?.name
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </div>

                        <div>
                          <strong>
                            {review.parentId?.name ||
                              "Family"}
                          </strong>

                          {isMyReview && (
                            <span className="your-review-label">
                              Your review
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="review-date">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </div>

                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>

                    <p className="review-comment">
                      "{review.comment}"
                    </p>

                    {isMyReview && (
                      <div className="review-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditReview(review)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-review-button"
                          onClick={() =>
                            handleDeleteReview(
                              review._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Review form */}

          {!myReview || editingReview ? (
            <div
              className="review-form-card"
              id="review-form"
            >
              <div className="review-form-header">
                <p className="section-eyebrow">
                  {editingReview
                    ? "EDIT YOUR REVIEW"
                    : "SHARE YOUR EXPERIENCE"}
                </p>

                <h3>
                  {editingReview
                    ? "Update your review"
                    : `How was your experience with ${nanny.name}?`}
                </h3>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Your rating</label>

                  {renderStars(rating, true)}
                </div>

                <div className="comment-input">
                  <label htmlFor="review-comment">
                    Your review
                  </label>

                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    placeholder="Tell other families about your experience..."
                    maxLength={500}
                    rows={4}
                  />

                  <span className="character-count">
                    {comment.length}/500
                  </span>
                </div>

                {reviewError && (
                  <div className="review-error">
                    <span>!</span>
                    {reviewError}
                  </div>
                )}

                <div className="review-form-actions">
                  <button
                    type="submit"
                    className="submit-review-button"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview
                      ? "Saving..."
                      : editingReview
                      ? "Update review"
                      : "Post review"}
                    <span>→</span>
                  </button>

                  {editingReview && (
                    <button
                      type="button"
                      className="cancel-review-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="already-reviewed">
              <span>✓</span>
              <div>
                <strong>Thanks for your review!</strong>
                <p>
                  You can edit or delete your review
                  above at any time.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default NannyDetails;