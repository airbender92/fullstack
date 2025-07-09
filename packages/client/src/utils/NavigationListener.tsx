// utils/NavigationListener.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { on, off } from './event-bus';

const NavigationListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = ({ path, replace = false }: { path: string; replace?: boolean }) => {
      if (replace) {
        navigate(path, { replace: true });
      } else {
        navigate(path);
      }
    };

    on('navigate', handleNavigate);
    
    return () => {
      off('navigate', handleNavigate);
    };
  }, [navigate]);
  
  return null;
};

export default NavigationListener;