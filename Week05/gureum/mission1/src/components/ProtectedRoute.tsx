import { Navigate, Outlet } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../constants/key';

// 토큰이 없으면 /login으로 리다이렉트하는 보호된 라우트 컴포넌트
// 토큰이 있으면 하위 라우트(Outlet)를 그대로 렌더링합니다.
const ProtectedRoute = () => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
