// client/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate} from 'react-router-dom'

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
 
  const checkAuth = useCallback(async()=>{
    try{
      await new Promise(resolve => setTimeout(resolve, 200));
      const token = await localStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch(error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  return {
    isAuthenticated,
    isLoading,
    logout
  }
};

export default useAuth;