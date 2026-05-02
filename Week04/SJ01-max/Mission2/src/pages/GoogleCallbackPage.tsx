import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveTokens } from '../lib/authApi';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-gray-700 border-t-pink-500 animate-spin" />
        <p className="text-gray-400 text-sm">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
}
