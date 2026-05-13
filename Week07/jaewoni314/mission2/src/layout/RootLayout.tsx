import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/navbar/NavBar';
import Sidebar from '../components/sidebar/Sidebar';
import { useAuth } from '../hooks/auth/useAuth';
import { PlusCircle } from 'lucide-react';
import PostLpModal from '../pages/post/PostLpModal';

const RootLayout = () => {
  useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeScreen);
      if (largeScreen) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  const handleFloatingButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleMenuClick = () => {
    if (!isAuthPage) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleCloseSidebar = () => {
    if (!isLargeScreen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar onMenuClick={handleMenuClick} showMenuButton={!isAuthPage} />
      </div>

      {!isAuthPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          isLargeScreen={isLargeScreen}
        />
      )}

      <main
        className={`pt-16 min-h-[calc(100vh-4rem)] bg-black transition-all duration-300 ${
          isSidebarOpen && isLargeScreen && !isAuthPage ? 'lg:pl-[18vw]' : ''
        }`}
      >
        <Outlet />
      </main>

      {!isAuthPage && (
        <button
          onClick={handleFloatingButtonClick}
          className="fixed bottom-[3vw] right-[3vw] w-[4vw] h-[4vw] min-w-14 min-h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="LP 추가"
        >
          <PlusCircle className="w-[60%] h-[60%]" />
        </button>
      )}
      <PostLpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RootLayout;
