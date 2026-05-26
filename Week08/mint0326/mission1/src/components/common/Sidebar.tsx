import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/user/useProfile';
import Modal from './Modal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const { state, actions } = useProfile();
  const navigate = useNavigate();

  const handleWithdrawClick = () => {
    actions.handleWithdraw();
    setIsWithdrawModalOpen(false);
    onClose(); // 사이드바도 닫기
  };

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

        {isLoggedIn && (
          <div className="p-4 border-t border-[#2a2a2a]">
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-[#220000] rounded-lg transition-colors group cursor-pointer"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium text-sm">탈퇴하기</span>
            </button>
          </div>
        )}
      </aside>

      {/* 회원 탈퇴 확인 모달 */}
      <Modal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)}
        zIndex="z-[300]"
      >
        <div className="text-center py-4">
          <h3 className="text-xl font-bold mb-8">정말 탈퇴하시겠습니까?</h3>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleWithdrawClick}
              disabled={state.isWithdrawPending}
              className="px-8 py-2.5 bg-[#d1d5db] text-black font-bold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer min-w-[100px]"
            >
              {state.isWithdrawPending ? '처리중...' : '예'}
            </button>
            <button 
              onClick={() => setIsWithdrawModalOpen(false)}
              className="px-8 py-2.5 bg-[#ff007f] text-white font-bold rounded-lg hover:bg-[#e60072] transition-colors cursor-pointer min-w-[100px]"
            >
              아니오
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
