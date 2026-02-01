import React, { useContext } from 'react'; 
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';

const Private = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to='/login' state={location.pathname} replace />;
    }

    return children;
};

export default Private;