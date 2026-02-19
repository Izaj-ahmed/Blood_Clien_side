import { Navigate } from "react-router";
import UseAuth from "../Hooks/UseAuth";
import UseRoles from "../Hooks/UseRoles";

const VolunteerRoutes = ({ children }) => {
  const { user, loading } = UseAuth();
  const { role, roleLoading } = UseRoles();

  if (loading || roleLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (user && role === 'volunteer') {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default VolunteerRoutes;
