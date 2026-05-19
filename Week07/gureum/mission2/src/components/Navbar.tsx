import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

/**
 * [헤더]
 * 상단 sticky 헤더로 스크롤해도 항상 노출된다.
 *
 * [버거 버튼]
 * - SVG 아이콘을 인라인으로 삽입(Vite 환경에서는 ?react import 없이 JSX 내 직접 사용 가능)
 * - 클릭 시 Layout의 onToggleSidebar 콜백 호출 → 사이드바 열기/닫기
 *
 * [인증 상태 분기]
 * - 비로그인: "로그인" → /login, "회원가입" → /signup 으로 NavLink 라우팅
 * - 로그인: "(닉네임)님 반갑습니다." 문구를 실제 userInfo.name 상태값으로 표시
 *           + 로그아웃 버튼 노출
 */
const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const { accessToken, userInfo, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      {/* 좌측: 햄버거 + 로고 */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="사이드바 열기/닫기"
          className="text-white hover:text-pink-400 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-pink-500 text-xl font-bold hover:text-pink-400 transition-colors"
        >
          돌려돌려 LP판
        </button>
      </div>

      {/* 우측: 인증 상태별 분기 */}
      <div className="flex items-center gap-3">
        {accessToken && userInfo ? (
          <>
            <span className="text-gray-300 text-sm">{userInfo.name}님 반갑습니다.</span>
            <button
              type="button"
              onClick={logout}
              className="text-sm px-3 py-1.5 border border-gray-600 rounded text-gray-200 hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-sm px-3 py-1.5 border border-gray-600 rounded text-gray-200 hover:bg-gray-800 transition-colors"
            >
              로그인
            </NavLink>
            <NavLink
              to="/signup"
              className="text-sm px-3 py-1.5 bg-pink-500 rounded text-white hover:bg-pink-600 transition-colors"
            >
              회원가입
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
