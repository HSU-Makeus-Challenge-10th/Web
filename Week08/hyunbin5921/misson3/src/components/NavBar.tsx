import { Link } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useSearch as useSearchContext } from "../context/SearchContext";

import Sidebar from "./SideBar";
import { useSidebar } from "../hooks/useSidebar";

const NavBar = () => {
  const { accessToken, logout } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);
  const { search, setSearch } = useSearchContext();

  const { isOpen, open, close, toggle } = useSidebar(); // 🔥 커스텀 훅 적용
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const userName = me?.data.name;

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (!next) setSearch("");
      return next;
    });
  };

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-md fixed w-full z-20">
        <div className="flex items-center justify-between px-6 py-4 gap-4">

          {/* 🔥 좌측: 햄버거 + 로고 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-800"
            >
              <img src="/images/hamburger1.png" alt="menu" className="w-5 h-5" />
            </button>

            <Link to="/" className="text-xl font-bold text-pink-500">
              돌려돌려LP판
            </Link>
          </div>

          {/* 🔥 가운데: 확장되는 검색바 */}
          <div className="flex-1 flex justify-center transition-all">
            {isSearchOpen && (
              <div className="w-full max-w-md">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="앨범을 검색해보세요"
                  className="w-full rounded-full bg-gray-900 border border-gray-700 px-4 py-2 text-sm
                             focus:outline-none focus:border-pink-500"
                />
              </div>
            )}
          </div>

          {/* 🔥 우측: 검색 버튼 + 로그인/로그아웃 */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <Search size={18} />
            </button>

            {!accessToken && (
              <>
                <Link className="hover:text-pink-400" to="/login">
                  로그인
                </Link>
                <Link
                  className="bg-pink-500 text-white px-4 py-1 rounded-lg hover:bg-pink-600"
                  to="/signup"
                >
                  회원가입
                </Link>
              </>
            )}

            {accessToken && (
              <>
                <span className="text-gray-300 whitespace-nowrap">
                  {userName ? `${userName}님 반갑습니다.` : ""}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="hover:text-pink-400"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 🔥 Sidebar 연결 */}
      <Sidebar isOpen={isOpen} onClose={close} />
    </>
  );
};

export default NavBar;
