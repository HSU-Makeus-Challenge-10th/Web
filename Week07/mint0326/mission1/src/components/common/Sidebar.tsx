import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

const Sidebar = ({ isOpen, onClose, isDesktop }: SidebarProps) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/v1/users');
    },
    onSuccess: () => {
      alert('회원 탈퇴가 완료되었습니다.');
      queryClient.clear();
      logout();
      navigate('/login');
      setIsWithdrawModalOpen(false);
    },
    onError: (e) => {
      console.error('탈퇴 에러:', e);
      alert('회원 탈퇴에 실패했습니다.');
    }
  });

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
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#222222] rounded-xl p-8 w-[350px] relative shadow-2xl text-center">
            <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 mt-4">정말 탈퇴하시겠습니까?</h3>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
                className="px-6 py-2 bg-[#d1d5db] text-black font-bold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                예
              </button>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-6 py-2 bg-[#ff007f] text-white font-bold rounded-lg hover:bg-[#e60072] transition-colors cursor-pointer"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
