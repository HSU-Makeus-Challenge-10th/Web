import { Link } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }:SidebarProps) {
  return (
    <>
      {/* Dim Background */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 z-50 bg-gray-900 text-white p-6 
          transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={onClose}
          className="text-white text-xl mb-6 hover:text-red-300"
        >
          ✖
        </button>

        <nav className="flex flex-col gap-4 text-lg">
          <Link to="/" onClick={onClose}>홈</Link>
          <Link to="/my" onClick={onClose}>마이페이지</Link>
          <Link to="/search" onClick={onClose}>검색</Link>
          <Link to="/login" onClick={onClose}>로그인</Link>
        </nav>
      </div>
    </>
  );
}
