import { useNavigate } from "react-router-dom";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");

    navigate("/");
  }

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">♡</div>

        <h1>NannyMatch</h1>
      </div>

      <div className="header-actions">
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