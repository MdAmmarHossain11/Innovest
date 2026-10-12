import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const PrivateRoute = ({ children, requiredRole }) => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    // Check if the user has the required role
    if (requiredRole && user.user_type !== requiredRole) {
        // If user is admin trying to access user dashboard, redirect to admin dashboard
        if (user.user_type === 'admin' && requiredRole === 'user') {
            return <Navigate to="/admin-dashboard" />;
        }
        // If user is regular user trying to access admin dashboard, redirect to user dashboard
        if (user.user_type === 'user' && requiredRole === 'admin') {
            return <Navigate to="/dashboard" />;
        }
    }

    return children;
};

export default PrivateRoute; 