import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, User, LogIn, UserPlus, X, LogOut, UserMinus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../apis/auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { accessToken, logout, withdraw } = useAuth();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: handleWithdraw, isPending: isWithdrawing } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await withdraw();
      setIsModalOpen(false);
      onClose();
      alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
    },
    onError: (error: any) => {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  });

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const menuItems = [
    { name: "홈", path: "/", icon: Home },
    { name: "검색", path: "/search", icon: Search, authRequired: true },
    { name: "마이페이지", path: "/my", icon: User, authRequired: true },
  ];

  const authItems = [
    { name: "로그인", path: "/login", icon: LogIn, guestOnly: true },
    { name: "회원가입", path: "/signup", icon: UserPlus, guestOnly: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 모바일용 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" />
      )}

      {/* 사이드바 본체 */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xl font-black text-purple-600 dark:text-purple-400 tracking-tighter">
              LP PROJECT
            </span>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 메뉴 영역 */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            {menuItems
              .filter((item) => !item.authRequired || (item.authRequired && accessToken))
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.path) ? "animate-pulse" : ""}`} />
                  <span>{item.name}</span>
                </Link>
              ))}

            <div className="my-6 border-t border-gray-100 dark:border-gray-800 mx-4" />

            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Account
            </p>
            {authItems
              .filter((item) => !item.guestOnly || (item.guestOnly && !accessToken))
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

            {/* 로그아웃 & 탈퇴 버튼 */}
            {accessToken && (
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
                >
                  <UserMinus className="w-5 h-5" />
                  <span>탈퇴하기</span>
                </button>
              </div>
            )}
          </nav>

          {/* 푸터 영역 */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 text-center">
              © 2024 LP Project. All rights reserved.
            </p>
          </div>
        </div>
      </aside>

      {/* 탈퇴 확인 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="회원 탈퇴"
        onConfirm={() => handleWithdraw()}
        confirmText={isWithdrawing ? "처리 중..." : "탈퇴하기"}
        cancelText="취소"
      >
        정말로 탈퇴하시겠습니까? <br />
        탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
      </Modal>
    </>
  );
};

export default Sidebar;
