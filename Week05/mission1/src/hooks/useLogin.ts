import { useNavigate } from 'react-router-dom';
import { signIn } from '../apis/auth';
import { useLocalStorage } from './useLocalStorage';
import type { LoginData, LoginResponse } from '../types/auth/login';
import axios from 'axios';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setItem: setAccessToken, removeItem: removeAccessToken } =
    useLocalStorage('accessToken');
  const { setItem: setRefreshToken, removeItem: removeRefreshToken } =
    useLocalStorage('refreshToken');
  const { setItem: setUser, removeItem: removeUser } = useLocalStorage('user');

  const login = async (data: LoginData) => {
    try {
      console.log('로그인 시도:', data);
      const response: LoginResponse = await signIn(data);

      if (response.status) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUser({
          id: response.data.id,
          name: response.data.name,
        });

        console.log('로그인 성공:', response.message);
        navigate('/');
        return { success: true, message: response.message };
      } else {
        console.error('로그인 실패:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      let errorMessage = '로그인에 실패했습니다.';

      if (axios.isAxiosError(error)) {
        // 서버로부터 도착한 에러
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        // 네트워크 에러
        errorMessage = error.message;
      }

      console.error('로그인 실패:', errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    removeAccessToken();
    removeRefreshToken();
    removeUser();
    navigate('/login');
  };

  return { login, logout };
};
