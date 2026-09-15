import "./Header.css";

function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">♡</div>

        <div>
          <h1>NannyMatch</h1>
          <p>Caring connections, happy families</p>
        </div>
      </div>

      <div className="header-status">
        <span className="header-status-dot"></span>
        <span>Welcome back</span>
      </div>
    </header>
  );
}

export default Header;