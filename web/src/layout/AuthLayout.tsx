import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg-background text-foreground">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
