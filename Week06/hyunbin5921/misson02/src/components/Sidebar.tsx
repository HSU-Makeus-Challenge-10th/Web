import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    
  return (
    
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">메뉴</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
      </div>

      <nav className="flex flex-col p-4 space-y-3">
        <Link to="/" onClick={onClose} className="hover:text-pink-400">홈</Link>
        <Link to="/my" onClick={onClose} className="hover:text-pink-400">마이페이지</Link>
        <Link to="/search" onClick={onClose} className="hover:text-pink-400">검색</Link>
        <Link to="/settings" onClick={onClose} className="hover:text-pink-400">설정</Link>
      </nav>
      <div className="flex pt-100 pl-23"><button className="border px-2 py-1 rounded-md hover:text-red-500 cursor-pointer">탈퇴하기</button></div>

    </aside>
  );
}
