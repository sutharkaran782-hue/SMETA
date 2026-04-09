import { NavLink } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <div className="brand__logo">+</div>
            <div>
              <h1 className="brand__title">Emergency Triage Prioritization</h1>
              <p className="brand__subtitle">
                Multimodal intake prototype for patient urgency sorting
              </p>
            </div>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Patient Intake
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Doctor Dashboard
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="page">{children}</main>
    </div>
  );
}

export default Layout;
