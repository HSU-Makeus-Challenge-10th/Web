import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

// Custom Modal Component (for non-alert/confirm usage)
interface AuthModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  message,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    // 모달 배경
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          알림
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component (AuthGuard)
interface ProtectedRouteProps {
  children: React.ReactNode;
  isProtected?: boolean;
}

const AuthGuard: React.FC<ProtectedRouteProps> = ({
  children,
  isProtected = true,
}) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 보호된 라우트가 아니거나, 토큰이 존재하면 자식 컴포넌트(LpDetailScreen)를 즉시 렌더링
  if (!isProtected || accessToken) {
    return <>{children}</>;
  }

  // 2. 비로그인 상태이며, 모달이 아직 열리지 않았다면 모달을 엽니다.
  // setTimeout을 사용하여 렌더링 사이클 내에서 상태 업데이트를 피합니다.
  if (isProtected && !accessToken && !isModalOpen) {
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);
  }

  // 모달에서 '확인' 버튼 클릭 시 호출
  const handleConfirmLogin = () => {
    setIsModalOpen(false);

    // 현재 경로를 state에 담아 /login으로 리디렉션합니다.
    navigate("/login", {
      state: { from: location.pathname + location.search },
    });
  };

  // 모달이 띄워지는 동안 사용자에게 보여줄 임시 화면
  return (
    <>
      <div className="flex items-center justify-center h-[70vh] text-gray-500 dark:text-gray-400">
        <p>인증 정보를 확인 중입니다...</p>
      </div>
      <AuthModal
        isOpen={isModalOpen}
        message="로그인이 필요한 서비스입니다. 로그인 후 이용해주세요."
        onConfirm={handleConfirmLogin}
      />
    </>
  );
};

export default AuthGuard;
