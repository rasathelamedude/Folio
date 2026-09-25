import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import FallbackSpinner from "../common/FallbackSpinner";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = useUserStore((state) => state.user);
  const isAuthLoading = useUserStore((state) => state.isAuthLoading);
  const isAuthenticated = !!user;

  if (isAuthLoading) {
    return <FallbackSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
