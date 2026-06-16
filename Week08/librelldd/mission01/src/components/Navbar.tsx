import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, Search, User, LogOut, Sun, Moon } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { accessToken, user, logout } = useAuth();
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm fixed w-full z-40 transition-colors duration-300">
            <div className="flex items-center justify-between py-2.5 px-4 max-w-5xl mx-auto w-full">

           
                <div className="flex items-center space-x-3">
                  
                    <button
                        onClick={onMenuClick}
                        className="menu-trigger p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 transition-colors"
                        aria-label="메뉴 열기"
                    >
                        <Menu className="w-5 h-5 pointer-events-none" />
                    </button>

                    {/* 로고 영역 */}
                    <Link
                        to="/"
                        className="text-lg font-black text-purple-600 dark:text-purple-400 tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        돌려돌려 LP판
                    </Link>
                </div>

                {/* 내비게이션 및 정보 영역 */}
                <div className="flex items-center space-x-2 md:space-x-6">
                    {accessToken && user ? (
                        <div className="hidden md:flex items-center mr-4">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                <span className="text-purple-600 dark:text-purple-400 font-bold">{user.name}</span>님 반갑습니다.
                            </span>
                        </div>
                    ) : null}

                    <div className="flex items-center space-x-1 md:space-x-2">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full transition-colors"
                            title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
                        >
                            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {!accessToken ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-3 py-1.5 text-sm font-semibold bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-3 py-1.5 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                                >
                                    회원가입
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/search"
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full transition-colors"
                                    title="검색"
                                >
                                    <Search className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/my"
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full transition-colors"
                                    title="마이페이지"
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    title="로그아웃"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;