import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteMe } from '../apis/auth';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './common/ConfirmModal';

interface SidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
}

/**
 * [반응형 사이드바]
 * - 모바일(isDesktop=false): 기본 숨김(-translate-x-full), 버거 버튼 클릭 시 슬라이드 인
 * - 데스크톱(isDesktop=true): 기본 노출(translate-x-0), 오버레이 없음
 *
 * [외부 영역 클릭 닫기]
 * - 모바일에서 사이드바가 열리면 배경에 반투명 오버레이를 깔고,
 *   오버레이 클릭 시 onClose를 호출해 사이드바를 닫는다.
 *
 * [인증 상태 분기]
 * - 로그인: 닉네임 표시 + 마이페이지 / 로그아웃 메뉴
 * - 비로그인: 로그인 / 회원가입 메뉴
 */
const Sidebar = ({ isOpen, isDesktop, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { accessToken, userInfo, logout, clearAuth } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const withdrawMutation = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      clearAuth();
      setShowWithdrawModal(false);
      onClose();
      navigate('/login', { replace: true });
    },
  });

  // 페이지 이동 후 모바일에서 사이드바 자동 닫기
  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    void logout();
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* 오버레이: 모바일에서 자연스럽게 fade in/out */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
          !isDesktop && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 사이드바 패널 */}
      <div
        className={`fixed top-[65px] left-0 h-[calc(100vh-65px)] w-60 bg-gray-900 z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-90'
        }`}
      >
        <div className="flex flex-col h-full p-4 gap-2">
          {/* 찾기 */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="w-full flex items-center gap-3 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            찾기
          </button>

          {/* 로그인 상태에 따른 메뉴 */}
          {accessToken && userInfo ? (
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-xs px-4">{userInfo.name}님</p>
              <button
                type="button"
                onClick={() => handleNav('/my')}
                className="w-full flex items-center gap-3 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                마이페이지
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-red-400 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                로그아웃
              </button>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="w-full flex items-center gap-3 text-gray-400 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                탈퇴하기
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => handleNav('/login')}
                className="w-full flex items-center gap-3 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => handleNav('/signup')}
                className="w-full flex items-center gap-3 text-pink-400 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-left"
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showWithdrawModal}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴 후에는 계정을 복구할 수 없습니다."
        confirmText="예"
        cancelText="아니오"
        loading={withdrawMutation.isPending}
        onCancel={() => setShowWithdrawModal(false)}
        onConfirm={() => withdrawMutation.mutate()}
      />
    </>
  );
};

export default Sidebar;
