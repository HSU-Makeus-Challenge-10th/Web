import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-900">
      <Link to="/" className="text-pink-500 font-bold text-lg tracking-tight">
        돌려돌려LP판
      </Link>
      <nav className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-white text-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="text-white text-sm px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 transition-colors font-medium"
        >
          회원가입
        </Link>
      </nav>
    </header>
  );
}
