import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (e) {
      console.error("Invalid token:", e);
      localStorage.clear();
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'host' ? '/host-dashboard' : '/home';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute; 