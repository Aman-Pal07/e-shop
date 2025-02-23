// In routes/AdminProtectedRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const AdminProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated, user, error } = useSelector(
    (state) => state.user
  );

  console.log("AdminProtectedRoute - Current State:", {
    loading,
    isAuthenticated,
    userRole: user?.role,
    error,
  });

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    console.log("User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
