import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if(isLoading) {
    return <div>加载中...</div>
  }

  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  } 
  
  if (!isAuthenticated && location.pathname !== '/login'){
        return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default LoginGuard;
