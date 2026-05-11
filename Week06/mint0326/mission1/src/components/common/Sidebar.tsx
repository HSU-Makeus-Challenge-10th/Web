import { Link } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

const Sidebar = ({ isOpen, onClose, isDesktop }: SidebarProps) => {
  return (
    <>
      {/* Backdrop for all modes */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[140] transition-opacity cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-64px)] bg-[#121212] z-[150] w-64 border-r border-[#2a2a2a]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
        ${!isOpen ? '' : 'shadow-[20px_0_30px_rgba(0,0,0,0.4)] lg:shadow-none'}
      `}>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link 
            to="/" 
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform text-[#ff007f]" />
            <span className="font-semibold">찾기</span>
          </Link>
          <Link 
            to="/my" 
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all group"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition-transform text-[#ff007f]" />
            <span className="font-semibold">마이페이지</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-[#220000] rounded-lg transition-colors group cursor-pointer">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium text-sm">탈퇴하기</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
