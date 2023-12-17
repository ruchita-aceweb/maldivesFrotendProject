import React, { ReactNode } from 'react';
import { useAuth } from './auth';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  // if (!auth.user) {
  //   return <Navigate to="/settings" state={{ path: location.pathname }} />;
  // }

  return <>{children}</>;
};
