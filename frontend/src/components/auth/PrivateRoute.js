import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const [user, setUser] = React.useState(authService.getCurrentUser());
    const [loading, setLoading] = React.useState(Boolean(token && requiredRole));
    const [error, setError] = React.useState('');
    const [retry, setRetry] = React.useState(0);

    React.useEffect(() => {
        let active = true;
        if (!token || !requiredRole) {
            setLoading(false);
            return () => { active = false; };
        }

        setLoading(true);
        setError('');
        authService.getProfile()
            .then((profile) => {
                if (active) {
                    setUser((currentUser) => ({ ...currentUser, ...profile }));
                }
            })
            .catch((profileError) => {
                if (profileError.response?.status === 401) {
                    authService.logout();
                    if (active) setUser(null);
                } else if (active) {
                    setError('Unable to verify your account permissions. Please try again.');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [token, requiredRole, retry]);

    if (loading) {
        return <div role="status">Loading account...</div>;
    }

    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    if (error) {
        return (
            <div role="alert">
                {error}{' '}
                <button type="button" onClick={() => setRetry((attempt) => attempt + 1)}>
                    Retry
                </button>
            </div>
        );
    }

    const isAdmin = authService.isAdmin(user);
    if (requiredRole === 'user' && isAdmin) {
        return <Navigate to="/admin-dashboard" replace />;
    }
    if (requiredRole === 'admin' && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute; 