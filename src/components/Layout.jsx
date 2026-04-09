import { NavLink } from "react-router-dom";

function Layout({ children, copy, language, onLanguageChange }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <div className="brand__logo">+</div>
            <div>
              <h1 className="brand__title">{copy.brandTitle}</h1>
              <p className="brand__subtitle">{copy.brandSubtitle}</p>
            </div>
          </div>

          <div className="topbar__actions">
            <nav className="nav" aria-label="Primary navigation">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav__link nav__link--active" : "nav__link"
                }
              >
                {copy.patientIntake}
              </NavLink>
              <NavLink
                to="/doctor-login"
                className={({ isActive }) =>
                  isActive ? "nav__link nav__link--active" : "nav__link"
                }
              >
                {copy.doctorDashboard}
              </NavLink>
            </nav>

            <label className="language-picker">
              <span>{copy.languageLabel}</span>
              <select
                className="language-select"
                value={language}
                onChange={(event) => onLanguageChange(event.target.value)}
              >
                <option value="en">{copy.english}</option>
                <option value="hi">{copy.hindi}</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <main className="page">{children}</main>
    </div>
  );
}

export default Layout;
