// src/components/Auth/RegisterPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password) {
  if (!password) {
    return { label: 'Too weak', score: 0, percent: 0, color: 'bg-danger' };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = 'Too weak';
  let color = 'bg-danger';
  let percent = (score / 5) * 100;

  if (score >= 4) {
    label = 'Strong';
    color = 'bg-success';
  } else if (score >= 2) {
    label = 'Medium';
    color = 'bg-warning';
  }

  return { label, score, percent, color };
}

function getPasswordHints(password) {
  const hints = [];
  if (!password) return hints;

  if (password.length < 8) {
    hints.push('Use at least 8 characters.');
  }
  if (!/[0-9]/.test(password)) {
    hints.push('Add at least one number.');
  }
  if (!/[A-Z]/.test(password)) {
    hints.push('Add at least one uppercase letter.');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    hints.push('Add at least one symbol (e.g. !, @, #).');
  }

  return hints;
}

function RegisterPage({ accent, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const trimmedEmail = email.trim();
  const emailValid = emailRegex.test(trimmedEmail);
  const passwordStrength = getPasswordStrength(password);
  const passwordHints = getPasswordHints(password);
  const passwordValid = password.length >= 8;
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  function validateFields() {
    if (!emailValid) return 'Please enter a valid email address';
    if (!passwordValid) return 'Password must be at least 8 characters long';
    if (!passwordsMatch) return 'Passwords do not match';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const validationMessage = validateFields();
    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }
    setFieldError('');
    setLoading(true);

    try {
      const data = await registerUser({ email, password, name });
      onAuthSuccess(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled =
    loading ||
    !email ||
    !password ||
    !confirmPassword ||
    !!validateFields();

  const emailClass =
    'form-control' +
    (email
      ? emailValid
        ? ' is-valid'
        : ' is-invalid'
      : '');

  const passwordClass =
    'form-control' +
    (password
      ? passwordValid
        ? ' is-valid'
        : ' is-invalid'
      : '');

  const confirmPasswordClass =
    'form-control' +
    (confirmPassword
      ? passwordsMatch
        ? ' is-valid'
        : ' is-invalid'
      : '');

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3 text-center">Sign Up</h4>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {fieldError && !error && (
              <div className="alert alert-warning py-2" role="alert">
                {fieldError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mb-3" noValidate>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              {/* Email with real-time validation */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={emailClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                {email && (
                  <small
                    className={
                      emailValid ? 'text-success' : 'text-danger'
                    }
                  >
                    {emailValid
                      ? 'Looks good!'
                      : 'Please enter a valid email address.'}
                  </small>
                )}
              </div>

              {/* Password with show/hide + strength meter + hints */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={passwordClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <small className="text-muted d-block mt-1">
                  At least 8 characters. Stronger passwords use numbers,
                  uppercase letters, and symbols.
                </small>

                {/* Strength meter */}
                {password && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Password strength</small>
                      <small>{passwordStrength.label}</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar ${passwordStrength.color}`}
                        role="progressbar"
                        style={{ width: `${passwordStrength.percent}%` }}
                        aria-valuenow={passwordStrength.percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>

                    {/* Hints for improving strength */}
                    {passwordHints.length > 0 && (
                      <ul className="small text-muted mt-2 mb-0">
                        {passwordHints.map((hint, idx) => (
                          <li key={idx}>{hint}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={confirmPasswordClass}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowConfirmPassword((s) => !s)
                    }
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {confirmPassword && (
                  <small
                    className={
                      passwordsMatch ? 'text-success' : 'text-danger'
                    }
                  >
                    {passwordsMatch
                      ? 'Passwords match.'
                      : 'Passwords do not match.'}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-${accent} w-100`}
                disabled={isSubmitDisabled}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <div className="text-center">
              <small>
                Already have an account? <Link to="/login">Sign in</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
