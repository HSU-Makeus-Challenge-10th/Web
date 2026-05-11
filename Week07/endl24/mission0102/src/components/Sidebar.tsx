import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthMutations } from "../hooks/mutations/useAuthMutations";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { withdrawMutation } = useAuthMutations();
  
  // 모달을 열고 닫을 상태(State)를 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWithdraw = () => {
    // 모달에서 '탈퇴하기'를 눌렀을 때만 뮤테이션 실행
    withdrawMutation.mutate(undefined, {
      onSettled: () => setIsModalOpen(false) // 성공하든 실패하든 모달은 닫기
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-2xl flex flex-col transition-transform duration-300 ease-in-out h-screen overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg text-gray-800">메뉴</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <Link
            to="/"
            onClick={onClose}
            className="p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            🏠 홈
          </Link>
          <Link
            to="/my"
            onClick={onClose}
            className="p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            👤 마이페이지
          </Link>
        </nav>

        // 탈퇴 버튼 영역
        <div className="mt-auto p-4 border-t border-gray-50">
          <button
            onClick={() => setIsModalOpen(true)} 
            className="w-full p-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            탈퇴하기
          </button>
        </div>
      </aside>

      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden scale-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">정말 탈퇴하시겠습니까?</h3>
              <p className="text-sm text-gray-500 mb-6">
                탈퇴 시 작성하신 모든 데이터가 삭제되며,<br/>
                이 작업은 되돌릴 수 없습니다.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={withdrawMutation.isPending}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawMutation.isPending}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex justify-center items-center disabled:bg-red-400"
                >
                  {withdrawMutation.isPending ? "처리 중..." : "탈퇴하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;