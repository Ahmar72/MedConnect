import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';

/**
 * ProtectedRoute: Enforces authentication and strict role isolation.
 * Unauthenticated users are redirected to /login with informative notice.
 * Authenticated users with mismatched roles are redirected to their own portal.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, showToast } = useDemo();
  const location = useLocation();

  // 1. Not Authenticated
  if (!currentUser) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
        state={{ message: 'Please sign in or create a verified account to access this area.' }}
      />
    );
  }

  // 2. Role Check
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the appropriate portal for the user's role
    if (currentUser.role === 'patient') {
      return <Navigate to="/patient" replace />;
    }
    if (currentUser.role === 'doctor') {
      return <Navigate to="/doctor" replace />;
    }
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
