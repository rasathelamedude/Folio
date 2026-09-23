import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
