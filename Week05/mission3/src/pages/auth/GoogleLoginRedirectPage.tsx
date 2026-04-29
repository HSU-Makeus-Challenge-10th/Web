import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleLoginRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      navigate('/');
    } else {
      console.log('로그인에 실패하셨습니다.');
    }
  }, [navigate]);

  return <div>구글 리다이렉</div>;
};

export default GoogleLoginRedirectPage;
