import { Navigate } from "react-router";
import UseRoles from "../Hooks/UseRoles";
import UseAuth from "../Hooks/UseAuth";
import Loading from "../Loading/Loading";

const DonorRoute = ({ children }) => {
    const { user, loading: authLoading } = UseAuth();
    const { role, loading: roleLoading } = UseRoles();
    
    // Show loading spinner while checking authentication and role
    if (authLoading || roleLoading) {
        return <Loading></Loading>;
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check if user has donor role or admin role (admin can access donor routes)
    if (role === 'donor' || role === 'admin') {
        return children;
    }

    // If user is logged in but not a donor (e.g., volunteer), redirect to dashboard home
    if (role === 'volunteer') {
        return <Navigate to="/dashboard" replace />;
    }

    // Default redirect for any other case
    return <Navigate to="/dashboard" replace />;
};

export default DonorRoute;