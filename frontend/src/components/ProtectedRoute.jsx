import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await authService.getCurrentUser();
      setIsAuthenticated(!!result?.user);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div style={{
        backgroundColor: '#0B120A',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF2B4'
      }}>
        Loading CalcStrike...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
