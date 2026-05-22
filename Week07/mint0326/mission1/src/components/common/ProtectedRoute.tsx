// src/components/common/ProtectedRoute.tsx 수정
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { accessToken } = useAuth(); // 전역 로그인 상태 확인
  const hasRefreshToken = localStorage.getItem('refreshToken');

  if (!accessToken && !hasRefreshToken) {
    // [체크리스트 반영] 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    // replace: 뒤로가기 시 이전의 보호된 페이지로 돌아오지 않게 함
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;