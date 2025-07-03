// src/components/RequireAuth.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token) {
    // Guarda la ruta original en state.from para, si quieres, redirigir después de login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;