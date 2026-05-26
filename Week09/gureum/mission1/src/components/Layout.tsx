import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../hooks/useSidebar';

/**
 * [레이아웃]
 * 헤더(Navbar) / 사이드바(Sidebar) / 메인(Outlet)이 항상 동시에 노출되는
 * 기본 레이아웃 컴포넌트. Outlet에 하위 페이지가 렌더된다.
 *
 * [반응형 사이드바]
 * - 768px 미만(모바일): 사이드바 기본 숨김(isSidebarOpen = false)
 * - 768px 이상(데스크톱): 사이드바 기본 노출(isSidebarOpen = true)
 * - 버거 버튼 클릭 시 onToggleSidebar → isSidebarOpen 토글
 * - 뷰포트 크기가 바뀌면 mediaQuery 리스너가 isDesktop / isSidebarOpen을 재조정
 */
const Layout = () => {
  const {
    isDesktop,
    isOpen: isSidebarOpen,
    close,
    toggle,
  } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        isDesktop={isDesktop}
        onClose={close}
      />
      <Navbar onToggleSidebar={toggle} />
      {/* 사이드바가 열린 데스크톱 환경에서는 콘텐츠 영역을 사이드바 너비(w-60)만큼 밀어 겹침 방지 */}
      <main className={`flex-1 transition-all duration-300 ${isDesktop && isSidebarOpen ? 'md:pl-60' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
