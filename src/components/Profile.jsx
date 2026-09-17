import { useEffect, useState } from "react";
import "./Profile.css";
import api from "../services/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNr: "",
    profileImage: "",
    experienceInYears: "",
    hourlyRate: "",
    skills: "",
    availability: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get("/profile");

      const { user, nannyProfile } = response.data;

      setProfile({
        user,
        nannyProfile
      });

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNr: user.phoneNr || "",
        profileImage: nannyProfile?.profileImage || "",
        experienceInYears: nannyProfile?.experienceInYears ?? "",
        hourlyRate: nannyProfile?.hourlyRate ?? "",
        skills: nannyProfile?.skills?.join(", ") || "",
        availability: nannyProfile?.availability || []
      });
    } catch (error) {
      console.error("Failed to load profile:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Unable to load your profile.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function toggleDay(day) {
    setFormData((current) => {
      const exists = current.availability.some(
        (item) => item.day === day
      );

      if (exists) {
        return {
          ...current,
          availability: current.availability.filter(
            (item) => item.day !== day
          )
        };
      }

      return {
        ...current,
        availability: [
          ...current.availability,
          {
            day,
            startTime: "09:00",
            endTime: "17:00"
          }
        ]
      };
    });
  }

  function handleAvailabilityChange(day, field, value) {
    setFormData((current) => {
      const exists = current.availability.some(
        (item) => item.day === day
      );

      if (!exists) {
        return current;
      }

      return {
        ...current,
        availability: current.availability.map((item) =>
          item.day === day
            ? {
                ...item,
                [field]: value
              }
            : item
        )
      };
    });
  }

  function getAvailabilityForDay(day) {
    return (
      formData.availability.find(
        (item) => item.day === day
      ) || {
        startTime: "09:00",
        endTime: "17:00"
      }
    );
  }

  function isDayAvailable(day) {
    return formData.availability.some(
      (item) => item.day === day
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name,
        phoneNr: formData.phoneNr
      };

      if (profile.user.role === "nanny") {
        payload.profileImage = formData.profileImage;

        payload.experienceInYears = Number(
          formData.experienceInYears
        );

        payload.hourlyRate = Number(
          formData.hourlyRate
        );

        payload.skills = formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

        payload.availability = formData.availability;
      }

      const response = await api.put(
        "/profile",
        payload
      );

      setProfile({
        user: response.data.user,
        nannyProfile: response.data.nannyProfile || null
      });

      setSuccess(
        "Your profile has been updated successfully."
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Unable to update your profile.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (!profile) {
      return;
    }

    const { user, nannyProfile } = profile;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phoneNr: user.phoneNr || "",
      profileImage: nannyProfile?.profileImage || "",
      experienceInYears:
        nannyProfile?.experienceInYears ?? "",
      hourlyRate: nannyProfile?.hourlyRate ?? "",
      skills: nannyProfile?.skills?.join(", ") || "",
      availability: nannyProfile?.availability || []
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const { user, nannyProfile } = profile;
  const isNanny = user.role === "nanny";

  return (
    <div className="profile-page">
      <div className="profile-container">

        <section className="profile-heading">
          <div>
            <p className="profile-eyebrow">
              MY ACCOUNT
            </p>

            <h1>
              {isNanny
                ? "Your nanny profile"
                : "Your profile"}
            </h1>

            <p className="profile-subtitle">
              {isNanny
                ? "Keep your profile up to date so families know what to expect."
                : "Manage your personal information and account details."}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="edit-profile-button"
              onClick={() => {
                setIsEditing(true);
                setError("");
                setSuccess("");
              }}
            >
              Edit profile
            </button>
          )}
        </section>

        {error && (
          <div className="profile-message profile-message-error">
            <span className="message-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="profile-message profile-message-success">
            <span className="message-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form
          className="profile-content"
          onSubmit={handleSubmit}
        >

          {/* PERSONAL INFORMATION */}

          <section className="profile-card">
            <div className="card-heading">
              <div className="card-icon">♥</div>

              <div>
                <h2>Personal information</h2>
                <p>
                  Your basic account information
                </p>
              </div>
            </div>

            <div className="profile-grid">

              <div className="profile-field">
                <label htmlFor="name">
                  Full name
                </label>

                {isEditing ? (
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="profile-value">
                    {user.name}
                  </div>
                )}
              </div>

              <div className="profile-field">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="profile-value profile-readonly">
                  {user.email}
                </div>

                {isEditing && (
                  <small>
                    Email changes are not available yet.
                  </small>
                )}
              </div>

              <div className="profile-field">
                <label htmlFor="phoneNr">
                  Phone number
                </label>

                {isEditing ? (
                  <input
                    id="phoneNr"
                    name="phoneNr"
                    type="tel"
                    value={formData.phoneNr}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="profile-value">
                    {user.phoneNr}
                  </div>
                )}
              </div>

              <div className="profile-field">
                <label>
                  Account type
                </label>

                <div className="role-badge">
                  {isNanny ? "Nanny" : "Parent"}
                </div>
              </div>

            </div>
          </section>


          {/* NANNY INFORMATION */}

          {isNanny && nannyProfile && (
            <>
              <section className="profile-card">

                <div className="card-heading">
                  <div className="card-icon">★</div>

                  <div>
                    <h2>Nanny information</h2>
                    <p>
                      Information families see on your profile
                    </p>
                  </div>
                </div>

                <div className="profile-grid">

                  <div className="profile-field profile-field-full">
                    <label htmlFor="profileImage">
                      Profile image URL
                    </label>

                    {isEditing ? (
                      <input
                        id="profileImage"
                        name="profileImage"
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={formData.profileImage}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="profile-value">
                        {nannyProfile.profileImage ||
                          "No profile image set"}
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label htmlFor="experienceInYears">
                      Years of experience
                    </label>

                    {isEditing ? (
                      <input
                        id="experienceInYears"
                        name="experienceInYears"
                        type="number"
                        min="0"
                        value={formData.experienceInYears}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <div className="profile-value">
                        {nannyProfile.experienceInYears}{" "}
                        {nannyProfile.experienceInYears === 1
                          ? "year"
                          : "years"}
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label htmlFor="hourlyRate">
                      Hourly rate
                    </label>

                    {isEditing ? (
                      <div className="input-with-prefix">
                        <span>€</span>

                        <input
                          id="hourlyRate"
                          name="hourlyRate"
                          type="number"
                          min="0"
                          step="0.50"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ) : (
                      <div className="profile-value">
                        €{Number(
                          nannyProfile.hourlyRate
                        ).toFixed(2)}{" "}
                        <span className="value-muted">
                          / hour
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="profile-field profile-field-full">
                    <label htmlFor="skills">
                      Skills
                    </label>

                    {isEditing ? (
                      <>
                        <input
                          id="skills"
                          name="skills"
                          type="text"
                          placeholder="First aid, Cooking, Newborn care"
                          value={formData.skills}
                          onChange={handleChange}
                        />

                        <small>
                          Separate skills with commas.
                        </small>
                      </>
                    ) : (
                      <div className="skills-list">
                        {nannyProfile.skills?.length > 0 ? (
                          nannyProfile.skills.map(
                            (skill) => (
                              <span
                                className="skill-tag"
                                key={skill}
                              >
                                {skill}
                              </span>
                            )
                          )
                        ) : (
                          <span className="value-muted">
                            No skills added yet.
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </section>


              {/* WEEKLY AVAILABILITY */}

              <section className="profile-card">

                <div className="card-heading">
                  <div className="card-icon">◷</div>

                  <div>
                    <h2>Weekly availability</h2>
                    <p>
                      Let families know when you're available
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="availability-editor">

                    {DAYS.map((day) => {
                      const available =
                        isDayAvailable(day);

                      const availability =
                        getAvailabilityForDay(day);

                      return (
                        <div
                          className={`availability-card ${
                            available ? "available" : ""
                          }`}
                          key={day}
                        >

                          <div className="availability-card-header">

                            <div>
                              <div className="availability-day-name">
                                {day}
                              </div>

                              <div className="availability-status">
                                {available
                                  ? "Available"
                                  : "Not available"}
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`availability-toggle ${
                                available ? "active" : ""
                              }`}
                              onClick={() =>
                                toggleDay(day)
                              }
                              aria-pressed={available}
                            >
                              {available
                                ? "Available"
                                : "Off"}
                            </button>

                          </div>

                          {available && (
                            <div className="availability-times">

                              <div className="time-field">
                                <label
                                  htmlFor={`${day}-start`}
                                >
                                  From
                                </label>

                                <input
                                  id={`${day}-start`}
                                  type="time"
                                  value={
                                    availability.startTime
                                  }
                                  onChange={(event) =>
                                    handleAvailabilityChange(
                                      day,
                                      "startTime",
                                      event.target.value
                                    )
                                  }
                                />
                              </div>

                              <div className="time-separator">
                                to
                              </div>

                              <div className="time-field">
                                <label
                                  htmlFor={`${day}-end`}
                                >
                                  Until
                                </label>

                                <input
                                  id={`${day}-end`}
                                  type="time"
                                  value={
                                    availability.endTime
                                  }
                                  onChange={(event) =>
                                    handleAvailabilityChange(
                                      day,
                                      "endTime",
                                      event.target.value
                                    )
                                  }
                                />
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div className="availability-list">

                    {DAYS.map((day) => {
                      const availability =
                        nannyProfile.availability?.find(
                          (item) => item.day === day
                        );

                      return (
                        <div
                          className={`availability-display ${
                            availability
                              ? "available"
                              : "unavailable"
                          }`}
                          key={day}
                        >
                          <span className="availability-day">
                            {day}
                          </span>

                          {availability ? (
                            <span className="availability-time">
                              {availability.startTime} –{" "}
                              {availability.endTime}
                            </span>
                          ) : (
                            <span className="availability-off">
                              Not available
                            </span>
                          )}
                        </div>
                      );
                    })}

                  </div>
                )}

              </section>


              {/* VERIFICATION */}

              <section className="verification-card">

                <div className="verification-icon">
                  {nannyProfile.isVerified
                    ? "✓"
                    : "!"}
                </div>

                <div className="verification-content">
                  <h3>
                    {nannyProfile.isVerified
                      ? "Verified nanny"
                      : "Verification pending"}
                  </h3>

                  <p>
                    {nannyProfile.isVerified
                      ? "Your profile has been verified."
                      : "Your profile has not been verified yet. Verification status is managed by NannyMatch."}
                  </p>
                </div>

              </section>
            </>
          )}


          {/* ACTIONS */}

          {isEditing && (
            <div className="profile-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-profile-button"
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : "Save changes"}
              </button>

            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default Profile;