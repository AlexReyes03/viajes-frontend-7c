import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotFound from '../components/global/NotFound';

const PrivateRouter = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    // user.roles comes as a comma-separated string from JWT claims
    const userRoles = user?.roles ? user.roles.split(',') : [];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      return <NotFound />;
    }
  }

  return children ? children : <Outlet />;
};

export default PrivateRouter;
