import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] flex items-center justify-between px-6 z-50">
      <Link to="/" className="text-[#ff007f] text-2xl font-bold tracking-tight">돌려돌려LP판</Link>
      <div className="flex gap-3">
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#1a1a1a] rounded hover:bg-[#2a2a2a] cursor-pointer"
          >로그아웃</button>
        ) : (
          <>
            <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-white bg-[#1a1a1a] rounded">로그인</Link>
            <Link to="/signup" className="px-4 py-1.5 text-sm font-medium text-white bg-[#ff007f] rounded">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;