import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { token } = useAuth();
    
    // If no token, kick them to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}