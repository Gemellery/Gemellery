import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
    allowedRole: string;
}

function ProtectedRoute({ children, allowedRole }: Props) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    if (user.role?.toLowerCase() !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
