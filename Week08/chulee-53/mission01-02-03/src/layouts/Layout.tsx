import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSidebar } from "../hooks/useSidebar";
import { SideBar } from "../components/Sidebar";

const Layout = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar onToggle={toggle} />
      <div className="relative flex-1">
        <main
          className={`h-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 transition-all duration-300 ${isOpen ? "blur-xs" : ""
            }`}
        >
          <Outlet />
        </main>
        <SideBar isOpen={isOpen} onClose={close} />
      </div>
    </div>
  );
};

export default Layout;
