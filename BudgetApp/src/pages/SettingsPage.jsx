// src/pages/SettingsPage.jsx
const ACCENT_OPTIONS = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

function SettingsPage({ theme, accent, onThemeChange, onAccentChange }) {
  const isDark = theme === 'dark';

  return (
    <div className="row mt-4 mb-5">
      <div className="col-md-8 mx-auto">
        <div
          className={`card ${
            isDark ? 'bg-secondary text-light' : ''
          }`}
        >
          <div className="card-body">
            <h4 className="card-title mb-3">Settings</h4>
            <p className="text-muted small">
              Customize how your budget app looks.
            </p>

            {/* Theme mode */}
            <div className="mb-4">
              <h6>Theme</h6>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="themeMode"
                  id="themeLight"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => onThemeChange('light')}
                />
                <label className="form-check-label" htmlFor="themeLight">
                  Light
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="themeMode"
                  id="themeDark"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => onThemeChange('dark')}
                />
                <label className="form-check-label" htmlFor="themeDark">
                  Dark
                </label>
              </div>
            </div>

            {/* Accent color */}
            <div className="mb-4">
              <h6>Accent Color</h6>
              <p className="text-muted small mb-2">
                Controls button and highlight colors across the app.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`btn btn-sm btn-${
                      accent === opt ? opt : `outline-${opt}`
                    }`}
                    onClick={() => onAccentChange(opt)}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4">
              <h6>Preview</h6>
              <p className="small text-muted">
                This is roughly how primary actions will look.
              </p>
              <button className={`btn btn-${accent} me-2`}>Primary action</button>
              <button className={`btn btn-outline-${accent}`}>Secondary action</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
