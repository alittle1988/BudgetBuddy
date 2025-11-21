// src/components/ToastAlert.jsx
function ToastAlert({ toast, onClose }) {
  if (!toast) return null;

  const { message, variant = 'success' } = toast;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1080 }}
    >
      <div
        className={`toast show align-items-center text-bg-${variant} border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default ToastAlert;
