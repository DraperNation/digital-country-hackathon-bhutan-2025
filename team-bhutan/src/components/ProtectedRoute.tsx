import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireKYC?: boolean;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireKYC = false, 
  adminOnly = false 
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // In a real app, you would check KYC status and admin role from your backend
  // For now, we'll allow access and handle KYC checks in the components themselves

  return <>{children}</>;
};