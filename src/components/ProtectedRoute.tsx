
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const checkAuth = () => {
        const authStatus = isAuthenticated();
        console.log('ProtectedRoute: Authentication status:', authStatus);
        
        if (!authStatus) {
          console.log('ProtectedRoute: Not authenticated, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        setAuthenticated(true);
        setIsLoading(false);
      };

      checkAuth();
    } catch (error) {
      console.error('ProtectedRoute: Error checking authentication:', error);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
