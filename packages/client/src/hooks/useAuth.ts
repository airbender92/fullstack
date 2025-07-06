// client/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isValidToken = token !== null;

    setAuthState({
      isAuthenticated: isValidToken,
      isLoading: false,
    });
  }, []);

  return authState;
};

export default useAuth;