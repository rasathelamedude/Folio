import Sidebar from "../components/ui/Sidebar";
import RightPanel from "../components/ui/RightPanel";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <RightPanel />
    </div>
  );
};

export default AppLayout;
