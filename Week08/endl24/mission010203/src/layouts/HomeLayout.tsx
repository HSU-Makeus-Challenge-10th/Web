import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import FloatingButton from "../components/FloatingButton";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar onMenuClick={toggleSidebar} /> 

      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <div 
          className={`flex flex-col flex-1 w-full min-w-0 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "md:pl-64" : "md:pl-0"}
          `}
        >
          <main className="flex-1">
            <Outlet />
          </main>
          
          <Footer/>
        </div>
      </div>
      
      <FloatingButton />
    </div>
  );
};

export default HomeLayout;