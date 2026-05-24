import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSidebar } from "../hooks/useSidebar";
import { SideBar } from "../components/Sidebar";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const { isOpen, toggle, close } = useSidebar();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar onToggle={toggle} />
      <div
        className={`h-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "blur-xs" : ""
        }`}
      >
        <Outlet />
      </div>
      <SideBar isOpen={isOpen} onClose={close} />
    </div>
  );
};

export default ProtectedLayout;
