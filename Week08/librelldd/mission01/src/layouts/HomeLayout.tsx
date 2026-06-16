import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../hooks/useSidebar";

const HomeLayout = () => {

  const { isOpen, toggle, close } = useSidebar(true); 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* 1. 상단 네비게이션 바  */}
      <Navbar onMenuClick={toggle} />

      <div className="pt-13">

        {/* 2. 사이드바 본체 */}
        <Sidebar isOpen={isOpen} onClose={close} />

        <main
          className={`flex-1 min-w-0 w-full lg:transition-all lg:duration-300 ${isOpen ? "lg:pl-64" : "lg:pl-0"
            }`}
        >
          {/* 본문 라우터 영역 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;