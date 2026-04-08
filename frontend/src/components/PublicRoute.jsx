import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
    const { token } = useAuth();
    
    // If they have a token, don't let them see login/register. Send to dashboard.
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
}