import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../constants/key';
import { useLocalStorage } from '../hooks/useLocalStorage';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEYS.accessToken);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEYS.refreshToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/login', { replace: true });
      return;
    }

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    navigate('/', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-black opacity-95 flex items-center justify-center px-4">
      <p className="text-white">구글 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;
