import { useNavigate } from "react-router-dom";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin = user?.role === "admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">♡</div>

        <h1>NannyMatch</h1>
      </div>

      <div className="header-actions">

        {isAdmin && (
          <button
            type="button"
            className="header-admin-button"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>
        )}

        <div className="header-status">
          <span className="header-status-dot"></span>
          <span>Safe & caring connections</span>
        </div>

        <button
          type="button"
          className="header-logout-button"
          onClick={handleLogout}
        >
          Log out
        </button>

      </div>
    </header>
  );
}

export default Header;