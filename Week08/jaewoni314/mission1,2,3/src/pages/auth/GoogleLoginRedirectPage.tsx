import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const GoogleLoginRedirectPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      console.error('구글 로그인 실패: 토큰이 없습니다.');
      navigate('/login');
      return;
    }

    // 토큰은 로깅하지 말고, 바로 저장만 수행
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

    setUser({
      id: 1,
      name: 'google-user',
      email: 'google@gmail.com',
    });

    navigate('/');
  }, [navigate, setUser]);

  return <div>구글 로그인 처리중...</div>;
};

export default GoogleLoginRedirectPage;