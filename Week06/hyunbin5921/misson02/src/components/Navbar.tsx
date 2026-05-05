import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-gray-100 w-full dark:bg-gray-900 shadow-md fixed z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer text-white"
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
            </div>
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Spinning Dolimpan
            </Link>
          </div>
          <div className="space-x-6">
            {!accessToken && (
              <div className="flex gap-3 items-center">
                <img
                  className="w-7 h-7 cursor-pointer"
                  src={"/images/look.png"}
                  alt="dotbogi Logo Img"
                />
                <Link
                  to={"/login"}
                  className="text-gray-700 dark:text-white hover:text-blue-500"
                >
                  로그인
                </Link>
                <Link
                  to={"/signup"}
                  className="boder bg-pink-400 rounded-sm px-2 py-1 text-gray-700 dark:text-white hover:text-blue-500"
                >
                  회원가입
                </Link>
              </div>
            )}
            {accessToken && (
              <div className="flex gap-3 items-center">
                <Link
                  to={"/search"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  <img
                    className="w-7 h-7 cursor-pointer"
                    src={"/images/look.png"}
                    alt="dotbogi Logo Img"
                  />
                </Link>
                <Link
                  to={"/my"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  {data.data?.name}님 환영합니다.
                </Link>
                <button
                  className="text-gray-700 dark:text-white hover:text-blue-500"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
