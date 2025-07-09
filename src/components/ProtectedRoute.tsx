import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};