import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { auth } = useContext(AuthContext);
  if (!auth.token || (role && auth.role !== role)) {
    return <Navigate to="/" />;
  }
  return children;
}
