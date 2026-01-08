// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <h1 className="display-4 mb-3">404</h1>
      <p className="lead mb-4 text-center">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="btn btn-primary d-inline-flex align-items-center gap-1"
      >
        <span aria-hidden="true">←</span>
        <span>Dashboard</span>
      </Link>
    </div>
  );
}

export default NotFound;
