import { useNavigate } from 'react-router-dom';
import { signIn, signOut } from '../apis/auth';
import { useLocalStorage } from './useLocalStorage';
import type { LoginData, LoginResponse } from '../types/auth/login';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const navigate = useNavigate();
  const { fetchUser, setUser, setIsLoggedIn } = useAuth();
  const { setItem: setAccessToken, removeItem: removeAccessToken } =
    useLocalStorage('accessToken');
  const { setItem: setRefreshToken, removeItem: removeRefreshToken } =
    useLocalStorage('refreshToken');

  const login = async (data: LoginData) => {
    try {
      console.log('로그인 시도:', data);
      const response: LoginResponse = await signIn(data);

      if (response.status) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        await fetchUser();

        console.log('로그인 성공:', response.message);
        navigate('/');
        return { success: true, message: response.message };
      } else {
        console.error('로그인 실패:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      let errorMessage = '로그인에 실패했습니다.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('로그인 실패:', errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      removeAccessToken();
      removeRefreshToken();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return { login, logout };
};
