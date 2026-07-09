import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Wait until AuthContext finishes loading
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role check
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;