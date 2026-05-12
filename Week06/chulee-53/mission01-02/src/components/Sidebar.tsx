import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideBar = ({ isOpen, onClose }: SideBarProps) => {
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
          <div className="flex items-center justify-center text-md pb-16 cursor-pointer">탈퇴하기</div>
        </div>
      </aside>
    </>
  );
};
