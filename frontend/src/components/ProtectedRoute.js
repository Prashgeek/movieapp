import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { admin } = useContext(AuthContext);

  // Not logged in
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Role-based protection (future-proof)
  if (adminOnly && admin.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
