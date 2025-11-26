// src/pages/SettingsPage.jsx
import { useState } from 'react';
import { fetchUserProfile, updateUserProfile, changePassword } from '../api/user';

const ACCENT_OPTIONS = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

function SettingsPage({
  theme,
  accent,
  user,
  onThemeChange,
  onAccentChange,
  onUserUpdate,
  onShowToast,
}) {
  const isDark = theme === 'dark';
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  async function handleRefreshProfile() {
    try {
      setProfileError('');
      const data = await fetchUserProfile();
      setProfile({ name: data.name || '', email: data.email || '' });
      onUserUpdate?.(data);
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.error || 'Failed to load profile');
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileError('');
    setProfileSaving(true);
    try {
      const updated = await updateUserProfile(profile);
      onUserUpdate?.(updated);
      onShowToast?.('Profile updated', 'success');
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    setPwSaving(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      onShowToast?.('Password updated', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      setPwError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="row mt-4 mb-5">
      <div className="col-md-10 mx-auto">
        <div className={`card ${isDark ? 'bg-secondary text-light' : ''}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="card-title mb-0">User Settings</h4>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>User Profile</h6>
                <p className="text-muted small">Update your email or display name.</p>
                {profileError && (
                  <div className="alert alert-danger py-2" role="alert">
                    {profileError}
                  </div>
                )}
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className={`btn btn-${accent}`}
                      disabled={profileSaving}
                    >
                      {profileSaving ? 'Saving…' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleRefreshProfile}
                      disabled={profileSaving}
                    >
                      Refresh
                    </button>
                  </div>
                </form>

                <div className="mt-4">
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

                <div className="mt-3">
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
              </div>

              <div className="col-md-6">
                <h6 className="mt-4 mt-md-0">Change Password</h6>
                <p className="text-muted small">
                  Enter your current password to set a new one.
                </p>
                {pwError && (
                  <div className="alert alert-danger py-2" role="alert">
                    {pwError}
                  </div>
                )}
                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-${accent}`}
                    disabled={pwSaving}
                  >
                    {pwSaving ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
