// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";

function Navbar({
  theme,
  accent,
  user,
  selectedMonth,
  onChangeMonth,
  onToggleTheme,
  onLogout,
}) {
  const isDark = theme === "dark";

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isDark ? "navbar-dark bg-dark" : "navbar-light bg-white border-bottom"
      }`}
    >
      <div className="container">
        <NavLink className="navbar-brand" to={user ? "/" : "/login"}>
          Budget Buddy
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Transactions
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/income"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Income
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/yearly"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Yearly
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          )}

          <div className="d-flex align-items-center gap-3 ms-auto">
            {user && (
              <div className="d-flex align-items-center gap-2">
                <label className="form-label small mb-0"></label>
                <input
                  type="month"
                  className="form-control form-control-sm"
                  style={{ minWidth: 140 }}
                  value={selectedMonth}
                  onChange={(e) => onChangeMonth(e.target.value)}
                />
              </div>
            )}

            <div className="d-flex align-items-center gap-2">
              {user ? (
                <>
                  <span className="small text-muted d-none d-sm-inline">
                    {user.name.toUpperCase() || user.email}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link className={`btn btn-sm btn-${accent}`} to="/login">
                  Sign In
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
