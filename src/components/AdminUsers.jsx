import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access this page."
        );
      } else {
        setError("Unable to load users.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleEdit(user) {
    setEditingUser({
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNr: user.phoneNr,
      role: user.role
    });
  }

  function handleCancelEdit() {
    setEditingUser(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setEditingUser((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      const response = await api.put(
        `/users/${editingUser.id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          phoneNr: editingUser.phoneNr,
          role: editingUser.role
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === editingUser.id
            ? response.data.user
            : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update user."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/users/${user._id}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser._id !== user._id
        )
      );
    } catch (error) {
      console.error("Failed to delete user:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete user."
      );
    }
  }

  if (loading) {
    return (
      <main className="admin-users-page">
        <div className="admin-users-loading">
          Loading users...
        </div>
      </main>
    );
  }

  return (
    <main className="admin-users-page">

      <div className="admin-users-header">

        <div>
          <p className="admin-users-eyebrow">
            ADMINISTRATION
          </p>

          <h1>User management</h1>

          <p>
            Manage NannyMatch accounts and permissions.
          </p>
        </div>

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to Nannies
        </button>

      </div>

      {error && (
        <div className="admin-users-error">
          {error}
        </div>
      )}

      <section className="admin-users-card">

        <div className="admin-users-card-header">

          <div>
            <h2>Users</h2>

            <span>
              {users.length} account
              {users.length !== 1 ? "s" : ""}
            </span>
          </div>

        </div>

        {users.length === 0 ? (
          <div className="admin-users-empty">
            No users found.
          </div>
        ) : (
          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user._id}>

                    <td className="user-name">
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.phoneNr}
                    </td>

                    <td>
                      <span
                        className={`user-role user-role-${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <div className="user-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(user)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(user)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {editingUser && (
        <div className="admin-edit-overlay">

          <div className="admin-edit-card">

            <div className="admin-edit-header">

              <div>
                <p className="admin-users-eyebrow">
                  EDIT ACCOUNT
                </p>

                <h2>Edit user</h2>
              </div>

              <button
                type="button"
                className="admin-close-button"
                onClick={handleCancelEdit}
              >
                ×
              </button>

            </div>

            <div className="admin-edit-form">

              <label>
                Name

                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Email

                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone number

                <input
                  type="text"
                  name="phoneNr"
                  value={editingUser.phoneNr}
                  onChange={handleChange}
                />
              </label>

              <label>
                Role

                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleChange}
                >
                  <option value="parent">
                    Parent
                  </option>

                  <option value="nanny">
                    Nanny
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </label>

            </div>

            <div className="admin-edit-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default AdminUsers;