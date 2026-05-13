import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../apis/auth';
import { useLocalStorage } from './useLocalStorage';
import type { LoginData, LoginResponse } from '../../types/auth/login';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setItem: setAccessToken } = useLocalStorage('accessToken');
  const { setItem: setRefreshToken } = useLocalStorage('refreshToken');

  return useMutation({
    mutationFn: (data: LoginData) => signIn(data),
    onSuccess: (response: LoginResponse) => {
      if (response.status) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);

        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/');
      } else {
        throw new Error(response.message);
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error.message);
      alert(error.message);
    },
  });
};
