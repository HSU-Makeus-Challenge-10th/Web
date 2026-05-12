import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useState } from "react";
import useDeleteAccount from "../hooks/mutations/useDeleteAccount";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideBar = ({ isOpen, onClose }: SideBarProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteAccountMutation = useDeleteAccount();

  const handleWithdrawClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmWithdraw = () => {
    deleteAccountMutation.mutate(undefined, {
      onSettled: () => {
        setIsConfirmOpen(false);
        onClose();
      }
    });
  };

  const handleCancelWithdraw = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur transition-opacity duration-300 z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-17 left-0 h-full w-60 bg-[#141517] z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col justify-between h-full text-white">
          <nav className="flex flex-col gap-4 text-md">
            <p className="flex items-center gap-2 cursor-pointer">
              <Search />
              <span>찾기</span>
            </p>
            <Link to="/mypage" onClick={onClose} className="flex items-center gap-2">
              <User />
              <span>마이페이지</span>
            </Link>
          </nav>
          <div 
            className="flex items-center justify-center text-md pb-16 cursor-pointer"
            onClick={handleWithdrawClick}
          >
            탈퇴하기
          </div>
        </div>
      </aside>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#242428] rounded-xl p-20 text-white text-center w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-2">정말 탈퇴하시겠습니까?</h3>
            <div className="flex gap-4 justify-center">
              <button 
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors cursor-pointer"
                onClick={handleCancelWithdraw}
              >
                아니오
              </button>
              <button 
                className="bg-[#FF1E90] hover:bg-pink-600 text-white px-6 py-2 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                onClick={handleConfirmWithdraw}
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending ? "처리중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
