import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: Props) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in → redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  const role = String(user.role || "").toLowerCase();

  // Logged in but wrong role → redirect to 403
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;