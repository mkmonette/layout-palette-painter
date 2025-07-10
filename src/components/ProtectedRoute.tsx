
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('ProtectedRoute: Component initializing');
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: useEffect running');
    
    try {
      const checkAuth = () => {
        console.log('ProtectedRoute: Checking authentication');
        const authStatus = isAuthenticated();
        console.log('ProtectedRoute: Authentication status:', authStatus);
        
        if (!authStatus) {
          console.log('ProtectedRoute: Not authenticated, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        console.log('ProtectedRoute: User is authenticated, setting state');
        setAuthenticated(true);
        setIsLoading(false);
      };

      // Add a small delay to ensure the component is fully mounted
      const timeoutId = setTimeout(checkAuth, 100);
      
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('ProtectedRoute: Error checking authentication:', error);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  console.log('ProtectedRoute: Render state - isLoading:', isLoading, 'authenticated:', authenticated);

  if (isLoading) {
    console.log('ProtectedRoute: Showing loading state');
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
    console.log('ProtectedRoute: Not authenticated, showing null');
    return null;
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
