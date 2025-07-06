import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  } else if (!isAuthenticated && location.pathname !== '/login'){
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default LoginGuard;
