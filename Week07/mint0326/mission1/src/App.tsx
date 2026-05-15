import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import FloatingActionButton from './components/common/FloatingActionButton';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import './App.css';
import HomePage from './pages/HomePage';
import LpDetailPage from './pages/LpDetailPage';
import LpCreateModal from './components/lp/LpCreateModal';

function App() {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 화면 크기에 따른 자동 토글 로직
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} isDesktop={isDesktop} />

        <main className={`flex-1 min-h-[calc(100vh-64px)] transition-all duration-300 ${isSidebarOpen && isDesktop ? 'pl-64' : 'pl-0'}`}>
          <div className="p-4 md:p-8">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />
              <Route path="/lp/:lpId" element={<LpDetailPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/my" element={<MyPage />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
      <LpCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;

