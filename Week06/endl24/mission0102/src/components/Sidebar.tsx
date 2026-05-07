import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
          md:relative md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <span className="font-bold text-lg text-gray-800">메뉴</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
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
      </aside>
    </>
  );
};

export default Sidebar;
