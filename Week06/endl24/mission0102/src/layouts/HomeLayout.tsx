import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import FloatingButton from "../components/FloatingButton";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
return (
    <div className="min-h-screen flex flex-col relative">
      {/* 💡 햄버거 버튼을 누르면 isSidebarOpen이 true로 바뀝니다. */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} /> 
      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
      </div>
      
      <Footer/>
      <FloatingButton />
    </div>
  );
};

export default HomeLayout;