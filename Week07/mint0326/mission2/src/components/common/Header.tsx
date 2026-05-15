import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { isLoggedIn, logout, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/v1/auth/signout');
    },
    onSuccess: () => {
      queryClient.clear(); // 모든 쿼리 캐시 초기화
      logout();
      navigate('/login');
    },
    onError: (e) => {
      console.error('Logout error:', e);
      // 에러가 나더라도 로컬 상태는 로그아웃 처리
      logout();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/?search=${encodeURIComponent(searchKeyword)}`);
      setIsSearchOpen(false);
      setSearchKeyword('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] flex items-center justify-between px-4 z-[200] border-b border-[#1a1a1a]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="text-white hover:bg-[#1a1a1a] p-1 rounded cursor-pointer flex items-center"
          aria-label="메뉴 열기"
        >
          <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
          </svg>
        </button>
        <Link to="/" className="text-[#ff007f] text-xl md:text-2xl font-bold tracking-tight">돌려돌려LP판</Link>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative flex items-center">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center absolute right-0 bg-[#1a1a1a] rounded overflow-hidden">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="LP 검색..."
                className="bg-transparent text-white px-3 py-1 outline-none w-40 md:w-64"
                autoFocus
                onBlur={() => !searchKeyword && setIsSearchOpen(false)}
              />
              <button type="submit" className="text-white p-2 hover:bg-[#2a2a2a] cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="text-white p-2 hover:bg-[#1a1a1a] rounded cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-white text-sm hidden md:block">
              {user?.name || '사용자'}님 반갑습니다.
            </span>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="px-4 py-1.5 text-sm font-medium text-white bg-[#1a1a1a] rounded hover:bg-[#2a2a2a] cursor-pointer"
            >로그아웃</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-white bg-[#1a1a1a] rounded hover:bg-[#2a2a2a]">로그인</Link>
            <Link to="/signup" className="px-4 py-1.5 text-sm font-medium text-white bg-[#ff007f] rounded hover:bg-[#ff3399] hidden sm:block">회원가입</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;