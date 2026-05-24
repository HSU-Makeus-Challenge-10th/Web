import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    // const userId = searchParams.get('userId');
    // const name = searchParams.get('name');

    if (accessToken && refreshToken) {
      login({ accessToken, refreshToken });
      navigate('/', { replace: true });
    } else {
      alert('구글 로그인 처리에 실패했습니다.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">구글 로그인 처리 중...</h2>
        <p className="text-[#7a7a7a]">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
