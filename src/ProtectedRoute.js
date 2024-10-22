import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';  // You will need to create this context (see below)

// A protected route component
const ProtectedRoute = ({ children, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
