import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken, userName, logout } = useAuth();

  return (
    // 데스크톱에서 사이드바 옆에 위치하도록 md:w-[calc(100%-16rem)] 클래스를 추가합니다.
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10 md:w-[calc(100%-16rem)]">
      <div className="flex items-center justify-between p-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            // 모바일에서만 버거 메뉴 버튼이 보이도록 md:hidden 클래스를 사용합니다.
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            스피닝 돌림판
          </Link>
        </div>

        {/* 데스크톱 메뉴 영역은 이제 항상 보입니다. (hidden 클래스 제거) */}
        <div className="flex items-center space-x-6 xl:space-x-8">
          {/* 비로그인 시 */}
          {!accessToken && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                회원가입
              </Link>
            </div>
          )}

          {/* 로그인 시: 마이 페이지, 검색, 환영 문구, 로그아웃 */}
          {accessToken && (
            <div className="flex items-center space-x-4">
              {/* 데스크톱 메뉴 링크 */}

              <Link
                to="/search"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                검색
              </Link>

              {/* 환영 문구 및 로그아웃 버튼 (AuthContext에서 연동된 상태 사용) */}
              <div className="flex items-center space-x-2">
                {userName && (
                  <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap text-sm">
                    {userName}님 반갑습니다.
                  </span>
                )}
                <button
                  onClick={logout}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500 whitespace-nowrap text-sm"
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
