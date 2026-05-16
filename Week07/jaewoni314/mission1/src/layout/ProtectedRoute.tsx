import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import { useEffect } from 'react';
import LoadingSpinner from '../components/spinner/LoadingSpinner';

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isLoading, isLoggedIn, navigate, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isLoggedIn ? <Outlet /> : null;
};

export default ProtectedRoute;
