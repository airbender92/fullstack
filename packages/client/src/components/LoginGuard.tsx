import React, {useEffect} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react'
import  { useStore} from '@/stores/useStore'

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard: React.FC<LoginGuardProps> = observer(({ children }) => {
  const store = useStore();
  const { isLoggedIn } = store.LoginStore;
  const location = useLocation();

  if (isLoggedIn && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  } 
  
  if (!isLoggedIn && location.pathname !== '/login'){
        return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
});

export default LoginGuard;
