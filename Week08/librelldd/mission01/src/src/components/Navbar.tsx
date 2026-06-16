import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, Search, User, LogOut, Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken, user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (

    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 fixed top-0 left-0 w-full z-50 h-14 flex items-center transition-colors duration-300">

      <div className="flex items-center justify-between px-4 w-full">


        <div className="flex items-center space-x-3 w-56 sm:w-60">
          <button
            onClick={onMenuClick}
            className="menu-trigger p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu className="w-5 h-5 pointer-events-none" />
          </button>

          <Link
            to="/"
            className="text-lg font-black text-purple-600 dark:text-purple-400 tracking-tighter hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            돌려돌려 LP판
          </Link>
        </div>

        {/* 우측 영역 */}
        <div className="flex items-center space-x-2">
          {accessToken && user && (
            <div className="hidden md:flex items-center mr-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold">{user.name}</span>님
              </span>
            </div>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {!accessToken ? (
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-semibold bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
            >
              로그인
            </Link>
          ) : (
            <button
              onClick={logout}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;