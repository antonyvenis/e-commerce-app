import { Navigate, useLocation } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../api";

// UX gate only. The real security check is on the server (JWT + role permission).
function ProtectedRoute({ children, admin = false }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (admin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
