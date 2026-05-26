import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

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
  // 현재 뷰포트가 데스크톱(≥768px)인지 여부 — 사이드바 오버레이 방식 분기에 사용
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  // 사이드바 열림 여부 — 데스크톱이면 초기값 true, 모바일이면 false
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    // matchMedia 리스너: 뷰포트 변경 시 데스크톱/모바일 상태를 동기화
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      // 창 크기가 달라지면 사이드바 열림 상태도 자동 재설정(레이아웃 깨짐 방지)
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
      {/* 사이드바가 열린 데스크톱 환경에서는 콘텐츠 영역을 사이드바 너비(w-60)만큼 밀어 겹침 방지 */}
      <main className={`flex-1 transition-all duration-300 ${isDesktop && isSidebarOpen ? 'md:pl-60' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
