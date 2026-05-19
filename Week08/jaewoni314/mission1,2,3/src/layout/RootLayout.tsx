import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/navbar/NavBar';
import Sidebar from '../components/sidebar/Sidebar';
import { useAuth } from '../hooks/auth/useAuth';
import { PlusCircle } from 'lucide-react';
import PostLpModal from '../pages/post/PostLpModal';
import { useSidebar } from '../hooks/sidebar/useSidebar';

const RootLayout = () => {
  useAuth();
  const location = useLocation();
  const { isOpen, isLargeScreen, toggle, close } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isAuthPage) {
        close();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, close, isAuthPage]);

  useEffect(() => {
    if (isOpen && !isLargeScreen && !isAuthPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isLargeScreen, isAuthPage]);

  const handleFloatingButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleMenuClick = () => {
    if (!isAuthPage) {
      toggle();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar onMenuClick={handleMenuClick} showMenuButton={!isAuthPage} />
      </div>

      {!isAuthPage && (
        <Sidebar
          isOpen={isOpen}
          onClose={close}
          isLargeScreen={isLargeScreen}
        />
      )}

      <main
        className={`pt-16 min-h-[calc(100vh-4rem)] bg-black transition-all duration-300 ${
          isOpen && isLargeScreen && !isAuthPage ? 'lg:pl-64' : ''
        }`}
      >
        <Outlet />
      </main>

      {!isAuthPage && (
        <button
          onClick={handleFloatingButtonClick}
          className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="LP 추가"
        >
          <PlusCircle className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      )}
      <PostLpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RootLayout;
