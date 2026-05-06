import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      setIsSidebarOpen(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        isDesktop={isDesktop}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <main className={`flex-1 transition-all duration-300 ${isDesktop && isSidebarOpen ? 'md:pl-60' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
