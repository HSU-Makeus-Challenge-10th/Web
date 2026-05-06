import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, isDesktop, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { accessToken, userInfo, logout } = useAuth();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* 오버레이: 모바일에서 불투명, 데스크톱에서 투명(클릭 감지용) */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* 사이드바 패널 */}
      <div
        className={`fixed top-[65px] left-0 h-[calc(100vh-65px)] w-60 bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4 gap-2">
          {/* 찾기 */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="w-full flex items-center gap-3 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            찾기
          </button>

          {/* 로그인 상태에 따른 메뉴 */}
          {accessToken && userInfo ? (
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-xs px-4">{userInfo.name}님</p>
              <button
                type="button"
                onClick={() => handleNav('/my')}
                className="w-full flex items-center gap-3 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                마이페이지
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-red-400 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                로그아웃
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => handleNav('/login')}
                className="w-full flex items-center gap-3 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => handleNav('/signup')}
                className="w-full flex items-center gap-3 text-pink-400 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
